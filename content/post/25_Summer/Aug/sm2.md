---
title: 【Cryptography】Practice
date: 2025-08-01 00:00:00+0000
categories: [snow]
tags: [Cryptography]
---

## --with-bootstrap-jdk

在配置 OpenJDK 编译时的 `--with-boot-jdk` 参数时，**必须指向 JDK 的安装根目录**，而非其下的 `bin/java` 可执行文件。根据 OpenJDK 构建规范和实际编译要求：

✅ **正确路径：**

```
--with-boot-jdk=/opt/homebrew/opt/openjdk@17
```

❌ **错误路径：**

```
--with-boot-jdk=/opt/homebrew/opt/openjdk@17/bin/java  # 无效
```

**原因解析：**

1. **构建系统的设计需求**
   Bootstrap JDK 需提供完整的开发环境，包括头文件（`include`）、库文件（`lib`）、工具链（`bin`）等。若仅指定 `java` 可执行文件，构建脚本无法访问其他必要资源，导致配置失败。

2. **官方文档与实例验证**
   在 OpenJDK 编译文档（如 中的示例）和实际编译命令中，均要求路径为 JDK 根目录：

   ```
   --with-boot-jdk=/usr/java/jdk1.8.0_181-amd64  # 根目录，非 bin/java
   ```

3. **Homebrew 的路径结构**
   Homebrew 安装的 `openjdk@17` 的完整内容位于 `/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home`，而 `/opt/homebrew/opt/openjdk@17`是其符号链接入口，直接指向此目录，因此可直接使用。

**验证方法：**

1. 检查路径是否包含 JDK 标准子目录：

   ```
   ls /opt/homebrew/opt/openjdk@17
   # 应包含 bin、lib、include、jmods 等目录
   ```

2. 若路径错误，

   ```
   configure
   ```

    脚本会报错：

   ```
   Error: Bootstrap JDK is not a valid JDK directory.
   ```

**完整配置示例：**

```
bash ./configure \
  --with-boot-jdk=/opt/homebrew/opt/openjdk@17 \
  --with-target-bits=64 \
  --with-debug-level=slowdebug
```

> 💡 **提示**：若需进一步验证 JDK 有效性，可运行：
> `/opt/homebrew/opt/openjdk@17/bin/java -version`
> 确保返回正确版本（如 `OpenJDK 17.x.x`）。

| **路径类型**          | **正确性** | **说明**                     |
| --------------------- | ---------- | ---------------------------- |
| JDK 根目录            | ✅          | 提供完整编译所需的文件资源   |
| `bin/java` 可执行文件 | ❌          | 无法访问库、头文件等关键资源 |

## 依赖

```bash
# 下载JMH依赖
mkdir -p jmh
curl -L -o jmh/jmh-core-1.37.jar https://repo1.maven.org/maven2/org/openjdk/jmh/jmh-core/1.37/jmh-core-1.37.jar
curl -L -o jmh/jmh-generator-annprocess-1.37.jar https://repo1.maven.org/maven2/org/openjdk/jmh/jmh-generator-annprocess/1.37/jmh-generator-annprocess-1.37.jar
curl -L -o jmh/jopt-simple-5.0.4.jar https://repo1.maven.org/maven2/net/sf/jopt-simple/jopt-simple/5.0.4/jopt-simple-5.0.4.jar
curl -L -o jmh/commons-math3-3.6.1.jar https://repo1.maven.org/maven2/org/apache/commons/commons-math3/3.6.1/commons-math3-3.6.1.jar

# 下载 jreg 依赖
mkdir -p jtreg
curl -L -o jtreg/jtreg-8+2.zip https://builds.shipilev.net/jtreg/jtreg-8%2B2.zip
unzip jtreg/jtreg-8+2.zip -d jtreg
rm jtreg/jtreg-8+2.zip
```

## Compile JDK

```bash
export LANG=C
export CC=clang
export CXX=clang++
export USE_CLANG=true
export COMPILER_WARNINGS_FATAL=false
export ARCH_DATA_MODEL=64
export LP64=1
export HOTSPOT_BUILD_JOBS=10

# 配置构建系统（macOS）
bash configure \
  --with-boot-jdk=/opt/homebrew/opt/openjdk@17 \
  --with-jtreg=./jtreg \
  --with-jmh=./jmh \
  --with-openssl=/opt/homebrew/opt/openssl@3 \
  --disable-warnings-as-errors
  
make clean

# 构建 JDK
make images

# 验证构建
build/macosx-aarch64-server-release/jdk/bin/java --version

# 运行 jreg:SM2CipherTest 测试
make test TEST="jtreg:test/jdk/sm/crypto/SM2/SM2CipherTest.java" \
		JTREG="VM_OPTIONS=-Djdk.openssl.cryptoLibPath=/opt/homebrew/opt/openssl@3/lib/libcrypto.3.dylib"

# 构建 JMH 测试
make build-microbenchmark

# 基于 openssl 运行 JMH 测试
make test TEST="micro:org.openjdk.bench.java.security.SM2ComparisonBenchmark" \
    MICRO="OPTIONS=-jvmArgs=-Djdk.openssl.cryptoLibPath=/opt/homebrew/opt/openssl@3/lib/libcrypto.3.dylib -prof gc"

# 基于 java 运行 JMH 测试
make test TEST="micro:org.openjdk.bench.java.security.SM2ComparisonBenchmark" \
		MICRO="OPTIONS=-prof gc"
```

### Jtreg 测试

```bash
make test TEST="jtreg:test/jdk/sm/crypto/SM2/SM2CipherTest.java" \
		JTREG="VM_OPTIONS=-Djdk.openssl.cryptoLibPath=/opt/homebrew/opt/openssl@3/lib/libcrypto.3.dylib"

Building target 'test' in configuration 'macosx-aarch64-server-release'

Running tests using JTREG control variable 'VM_OPTIONS=-Djdk.openssl.cryptoLibPath=/opt/homebrew/opt/openssl@3/lib/libcrypto.3.dylib'
Test selection 'jtreg:test/jdk/sm/crypto/SM2/SM2CipherTest.java', will run:
* jtreg:test/jdk/sm/crypto/SM2/SM2CipherTest.java

Running test 'jtreg:test/jdk/sm/crypto/SM2/SM2CipherTest.java'
Passed: sm/crypto/SM2/SM2CipherTest.java
Test results: passed: 1
Report written to /Users/hongpeng.lin/Project/TencentKona-17/build/macosx-aarch64-server-release/test-results/jtreg_test_jdk_sm_crypto_SM2_SM2CipherTest_java/html/report.html
Results written to /Users/hongpeng.lin/Project/TencentKona-17/build/macosx-aarch64-server-release/test-support/jtreg_test_jdk_sm_crypto_SM2_SM2CipherTest_java
Finished running test 'jtreg:test/jdk/sm/crypto/SM2/SM2CipherTest.java'
Test report is stored in build/macosx-aarch64-server-release/test-results/jtreg_test_jdk_sm_crypto_SM2_SM2CipherTest_java

==============================
Test summary
==============================
   TEST                                              TOTAL  PASS  FAIL ERROR   
   jtreg:test/jdk/sm/crypto/SM2/SM2CipherTest.java       1     1     0     0   
==============================
TEST SUCCESS

Finished building target 'test' in configuration 'macosx-aarch64-server-release'
```

### JMH 测试

#### JNI + OPENSSL

```bash
Benchmark                                                                       (dataSize)   Mode  Cnt      Score     Error   Units
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                               32  thrpt   10   2277.689 ?  64.486   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                 32  thrpt   10     14.045 ?   0.474  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm            32  thrpt   10   6466.003 ?  51.673    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                      32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                       32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                               64  thrpt   10   2331.531 ?  33.078   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                 64  thrpt   10     14.768 ?   0.257  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm            64  thrpt   10   6642.335 ?  50.914    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                      64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                       64  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                              128  thrpt   10   2289.050 ?  61.874   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                128  thrpt   10     15.058 ?   0.426  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm           128  thrpt   10   6898.426 ?  50.992    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                     128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                      128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                              256  thrpt   10   2179.238 ?  70.886   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                256  thrpt   10     14.401 ?   0.468  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm           256  thrpt   10   6930.550 ?   0.791    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                     256  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                      256  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                              512  thrpt   10   2243.672 ?  71.607   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                512  thrpt   10     14.894 ?   0.577  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm           512  thrpt   10   6962.508 ?  50.943    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                     512  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                      512  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                             1024  thrpt   10   2325.406 ?  28.165   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate               1024  thrpt   10     15.439 ?   0.223  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm          1024  thrpt   10   6962.398 ?  50.999    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                    1024  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                     1024  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                 32  thrpt   10   9327.355 ? 113.758   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                   32  thrpt   10     19.434 ?   0.241  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm              32  thrpt   10   2184.873 ?   1.388    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                        32  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                 64  thrpt   10   9220.344 ? 141.167   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                   64  thrpt   10     20.053 ?   0.458  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm              64  thrpt   10   2280.603 ?  25.497    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                        64  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                128  thrpt   10   9095.394 ? 149.268   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                  128  thrpt   10     21.585 ?   0.352  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm             128  thrpt   10   2488.692 ?   0.471    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                       128  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                256  thrpt   10   9007.721 ?  89.294   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                  256  thrpt   10     24.813 ?   0.305  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm             256  thrpt   10   2888.618 ?  25.500    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                       256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                512  thrpt   10   8637.314 ? 147.088   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                  512  thrpt   10     30.118 ?   0.543  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm             512  thrpt   10   3656.648 ?  25.500    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                       512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                               1024  thrpt   10   8014.757 ? 184.538   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                 1024  thrpt   10     39.565 ?   0.912  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm            1024  thrpt   10   5176.706 ?   0.175    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                      1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                    32  thrpt   10  10980.079 ? 142.611   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                      32  thrpt   10     13.573 ?   0.176  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                 32  thrpt   10   1296.269 ?   0.004    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                           32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                            32  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                    64  thrpt   10  11054.650 ? 104.496   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                      64  thrpt   10     14.508 ?   0.137  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                 64  thrpt   10   1376.267 ?   0.004    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                           64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                            64  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                   128  thrpt   10  10765.290 ? 158.543   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                     128  thrpt   10     16.264 ?   0.240  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                128  thrpt   10   1584.274 ?   0.007    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                          128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                           128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                   256  thrpt   10  10384.529 ? 269.707   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                     256  thrpt   10     19.491 ?   0.506  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                256  thrpt   10   1968.284 ?   0.009    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                          256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                   512  thrpt   10  10021.506 ?  83.034   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                     512  thrpt   10     25.996 ?   0.216  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                512  thrpt   10   2720.295 ?   0.004    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                          512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                  1024  thrpt   10   9234.903 ? 162.432   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                    1024  thrpt   10     37.624 ?   0.662  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm               1024  thrpt   10   4272.319 ?   0.008    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                         1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                    32  thrpt   10   9153.408 ? 246.471   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                      32  thrpt   10     13.343 ?   0.422  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                 32  thrpt   10   1528.603 ?  25.499    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                           32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                            32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                    64  thrpt   10   9208.859 ? 183.536   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                      64  thrpt   10     14.617 ?   0.283  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                 64  thrpt   10   1664.603 ?  12.752    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                           64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                            64  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                   128  thrpt   10   8955.387 ? 443.439   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                     128  thrpt   10     15.991 ?   0.780  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                128  thrpt   10   1872.623 ?  12.759    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                          128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                           128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                   256  thrpt   10   9003.492 ? 159.419   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                     256  thrpt   10     19.443 ?   0.345  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                256  thrpt   10   2264.620 ?   0.177    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                          256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                   512  thrpt   10   8555.518 ? 258.422   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                     512  thrpt   10     24.678 ?   0.811  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                512  thrpt   10   3024.653 ?  12.743    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                          512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                  1024  thrpt   10   7949.053 ? 108.957   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                    1024  thrpt   10     34.571 ?   0.456  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm               1024  thrpt   10   4560.715 ?  12.747    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                         1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                             32  thrpt   10   9220.542 ? 173.481   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate               32  thrpt   10     13.238 ?   0.251  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm          32  thrpt   10   1505.571 ?  13.148    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                    32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                     32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                             64  thrpt   10   9242.564 ? 314.882   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate               64  thrpt   10     14.397 ?   0.466  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm          64  thrpt   10   1633.525 ?  13.068    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                    64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                     64  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                            128  thrpt   10   9254.197 ? 158.898   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate              128  thrpt   10     16.533 ?   0.339  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm         128  thrpt   10   1873.481 ?  13.053    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                   128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                    128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                            256  thrpt   10   9069.941 ?  67.990   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate              256  thrpt   10     20.862 ?   0.196  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm         256  thrpt   10   2411.997 ?  10.872    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                   256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                            512  thrpt   10   8651.972 ? 206.534   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate              512  thrpt   10     28.405 ?   0.751  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm         512  thrpt   10   3442.774 ?  13.908    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                   512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                           1024  thrpt   10   7837.249 ? 284.440   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate             1024  thrpt   10     41.419 ?   1.585  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm        1024  thrpt   10   5541.859 ?  16.775    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                  1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                     32  thrpt   10   4870.746 ? 273.803   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                       32  thrpt   10     13.159 ?   0.761  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                  32  thrpt   10   2833.035 ?  12.735    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                            32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                             32  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                     64  thrpt   10   4896.378 ? 126.480   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                       64  thrpt   10     14.348 ?   0.372  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                  64  thrpt   10   3073.028 ?  12.755    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                            64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                             64  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                    128  thrpt   10   4783.931 ? 217.902   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                      128  thrpt   10     15.661 ?   0.714  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                 128  thrpt   10   3433.052 ?   0.283    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                           128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                            128  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                    256  thrpt   10   4723.796 ? 179.429   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                      256  thrpt   10     18.996 ?   0.721  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                 256  thrpt   10   4217.069 ?   0.237    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                           256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                    512  thrpt   10   4476.164 ? 169.028   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                      512  thrpt   10     24.591 ?   0.945  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                 512  thrpt   10   5761.115 ?  12.740    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                           512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                   1024  thrpt   10   4165.951 ? 155.013   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                     1024  thrpt   10     35.060 ?   1.305  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                1024  thrpt   10   8825.190 ?   0.221    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                          1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                        32  thrpt   10   4811.437 ? 143.082   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                          32  thrpt   10     12.925 ?   0.369  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                     32  thrpt   10   2817.047 ?  12.758    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                               32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                                32  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                        64  thrpt   10   4847.861 ?  96.012   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                          64  thrpt   10     14.058 ?   0.246  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                     64  thrpt   10   3041.046 ?  12.759    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                               64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                                64  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                       128  thrpt   10   4864.509 ? 143.861   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                         128  thrpt   10     15.888 ?   0.471  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                    128  thrpt   10   3425.038 ?  12.753    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                              128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                               128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                       256  thrpt   10   4641.459 ? 287.823   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                         256  thrpt   10     18.594 ?   1.153  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                    256  thrpt   10   4201.077 ?   0.213    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                              256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                       512  thrpt   10   4334.907 ? 380.714   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                         512  thrpt   10     23.716 ?   2.146  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                    512  thrpt   10   5737.151 ?  25.436    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                              512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                      1024  thrpt   10   4115.785 ? 178.774   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                        1024  thrpt   10     34.605 ?   1.527  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                   1024  thrpt   10   8817.224 ?  12.706    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                             1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                        32  thrpt   10   2239.143 ?  92.182   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                          32  thrpt   10     53.418 ?   2.201  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                     32  thrpt   10  25017.275 ?  26.095    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                               32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                                32  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                        64  thrpt   10   2263.604 ?  76.130   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                          64  thrpt   10     54.326 ?   1.826  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                     64  thrpt   10  25167.864 ?  13.589    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                               64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                                64  thrpt   10      5.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                       128  thrpt   10   2272.416 ?  59.580   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                         128  thrpt   10     55.023 ?   1.408  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                    128  thrpt   10  25392.123 ?  79.977    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                              128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                               128  thrpt   10      9.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                       256  thrpt   10   2199.581 ? 111.437   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                         256  thrpt   10     53.962 ?   2.734  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                    256  thrpt   10  25726.865 ?   2.559    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                              256  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                               256  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                       512  thrpt   10   2218.814 ? 137.428   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                         512  thrpt   10     56.175 ?   3.469  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                    512  thrpt   10  26549.531 ?  50.670    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                              512  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                               512  thrpt   10      5.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                      1024  thrpt   10   2167.404 ?  64.160   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                        1024  thrpt   10     57.933 ?   1.719  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                   1024  thrpt   10  28030.657 ?   2.393    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                             1024  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                              1024  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                         32  thrpt   10   1846.194 ?  90.545   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                           32  thrpt   10     46.574 ?   2.289  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                      32  thrpt   10  26455.049 ?   3.332    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                                32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                 32  thrpt   10      6.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                         64  thrpt   10   1857.123 ?  46.743   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                           64  thrpt   10     47.304 ?   1.203  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                      64  thrpt   10  26710.728 ?  25.108    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                                64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                 64  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                        128  thrpt   10   1862.452 ?  49.515   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                          128  thrpt   10     48.149 ?   1.304  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                     128  thrpt   10  27110.338 ?  50.221    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                               128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                128  thrpt   10      5.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                        256  thrpt   10   1819.753 ?  59.179   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                          256  thrpt   10     48.434 ?   1.574  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                     256  thrpt   10  27910.523 ?   2.052    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                               256  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                256  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                        512  thrpt   10   1800.439 ?  84.762   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                          512  thrpt   10     50.551 ?   2.418  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                     512  thrpt   10  29442.793 ?  44.897    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                               512  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                512  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                       1024  thrpt   10   1759.650 ?  50.198   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                         1024  thrpt   10     54.536 ?   1.546  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                    1024  thrpt   10  32501.048 ?  77.456    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                              1024  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                               1024  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                              32  thrpt   10   2185.310 ? 104.244   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate                32  thrpt   10     13.508 ?   0.721  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm           32  thrpt   10   6481.349 ?  63.711    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                     32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                      32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                              64  thrpt   10   2130.761 ? 120.425   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate                64  thrpt   10     14.063 ?   0.795  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm           64  thrpt   10   6921.384 ?   0.077    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                     64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                      64  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                             128  thrpt   10   1920.741 ? 204.300   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate               128  thrpt   10     14.511 ?   1.597  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm          128  thrpt   10   7921.540 ?  63.689    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                    128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                     128  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                             256  thrpt   10   2082.415 ?  97.963   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate               256  thrpt   10     19.543 ?   0.942  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm          256  thrpt   10   9841.416 ?  63.735    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                    256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                             512  thrpt   10   1843.785 ? 181.428   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate               512  thrpt   10     23.984 ?   2.360  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm          512  thrpt   10  13641.602 ?   0.160    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                    512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                            1024  thrpt   10   1863.634 ?  25.522   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate              1024  thrpt   10     38.034 ?   0.521  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm         1024  thrpt   10  21401.574 ?   0.025    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                   1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                              32  thrpt   10   1877.269 ?  12.591   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate                32  thrpt   10     13.754 ?   0.093  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm           32  thrpt   10   7682.957 ?   0.771    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                     32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                      32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                              64  thrpt   10   1811.387 ?  79.142   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate                64  thrpt   10     14.445 ?   0.590  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm           64  thrpt   10   8363.041 ?  63.814    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                     64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                      64  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                             128  thrpt   10   1823.002 ?  36.609   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate               128  thrpt   10     16.277 ?   0.326  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm          128  thrpt   10   9363.051 ?   0.888    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                    128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                     128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                             256  thrpt   10   1801.394 ?  40.507   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate               256  thrpt   10     19.313 ?   0.470  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm          256  thrpt   10  11243.088 ?  63.737    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                    256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                             512  thrpt   10   1684.321 ?  86.642   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate               512  thrpt   10     24.291 ?   1.249  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm          512  thrpt   10  15123.347 ?   0.723    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                    512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                            1024  thrpt   10   1589.228 ?  52.647   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate              1024  thrpt   10     34.619 ?   1.131  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm         1024  thrpt   10  22843.552 ?  63.794    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                   1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2KeyGeneration                                                 32  thrpt   10   3051.269 ?  66.908   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                   32  thrpt   10     68.464 ?   1.427  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                              32  thrpt   10  23529.947 ?  71.543    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                        32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                         32  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                 64  thrpt   10   3070.712 ? 109.484   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                   64  thrpt   10     69.077 ?   2.464  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                              64  thrpt   10  23590.100 ?   1.557    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                        64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                         64  thrpt   10      8.000                ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                128  thrpt   10   3012.223 ?  89.020   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                  128  thrpt   10     67.715 ?   1.963  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                             128  thrpt   10  23574.640 ?  62.410    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                       128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                        128  thrpt   10      8.000                ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                256  thrpt   10   2891.321 ? 151.727   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                  256  thrpt   10     64.867 ?   3.502  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                             256  thrpt   10  23529.884 ?  68.495    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                       256  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                        256  thrpt   10      8.000                ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                512  thrpt   10   2965.293 ? 141.615   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                  512  thrpt   10     66.528 ?   3.115  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                             512  thrpt   10  23529.943 ?  68.989    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                       512  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                        512  thrpt   10     11.000                ms
SM2ComparisonBenchmark.sm2KeyGeneration                                               1024  thrpt   10   3056.267 ? 128.830   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                 1024  thrpt   10     68.797 ?   2.872  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                            1024  thrpt   10  23605.536 ?  25.578    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                      1024  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                       1024  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                         32  thrpt   10   9200.167 ? 291.255   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                           32  thrpt   10     13.341 ?   0.476  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                      32  thrpt   10   1520.601 ?  12.745    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                                32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                 32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                         64  thrpt   10   9090.842 ? 308.868   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                           64  thrpt   10     14.431 ?   0.526  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                      64  thrpt   10   1664.610 ?  12.747    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                                64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                 64  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                        128  thrpt   10   9052.519 ? 185.204   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                          128  thrpt   10     16.027 ?   0.329  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                     128  thrpt   10   1856.619 ?  12.752    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                               128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                        256  thrpt   10   8771.386 ? 228.538   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                          256  thrpt   10     18.808 ?   0.490  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                     256  thrpt   10   2248.642 ?   0.206    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                               256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                        512  thrpt   10   8571.819 ? 205.613   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                          512  thrpt   10     24.789 ?   0.595  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                     512  thrpt   10   3032.658 ?   0.178    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                               512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                       1024  thrpt   10   7857.343 ? 156.181   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                         1024  thrpt   10     34.112 ?   0.679  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                    1024  thrpt   10   4552.720 ?   0.180    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                              1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                     32  thrpt   10   3041.861 ?  99.272   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                       32  thrpt   10      9.079 ?   0.398  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                  32  thrpt   10   3129.828 ?  76.496    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                            32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                             32  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                     64  thrpt   10   3033.357 ?  60.136   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                       64  thrpt   10      9.909 ?   0.206  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                  64  thrpt   10   3425.839 ?  38.251    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                            64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                             64  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                    128  thrpt   10   3028.683 ?  73.157   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                      128  thrpt   10     11.119 ?   0.269  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                 128  thrpt   10   3849.853 ?   0.539    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                           128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                            128  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                    256  thrpt   10   2900.614 ? 103.514   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                      256  thrpt   10     13.195 ?   0.551  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                 256  thrpt   10   4769.922 ?  38.233    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                           256  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                            256  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                    512  thrpt   10   2733.556 ? 154.336   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                      512  thrpt   10     16.981 ?   1.030  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                 512  thrpt   10   6513.752 ?  38.637    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                           512  thrpt   10      1.000            counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                            512  thrpt   10      1.000                ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                   1024  thrpt   10   2559.348 ? 193.798   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                     1024  thrpt   10     24.646 ?   1.956  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                1024  thrpt   10  10098.220 ?  38.116    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                          1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                                32  thrpt   10   3044.797 ?  66.936   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                  32  thrpt   10     13.571 ?   0.376  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm             32  thrpt   10   4673.817 ?  38.234    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                       32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                        32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                                64  thrpt   10   2986.789 ? 177.811   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                  64  thrpt   10     14.468 ?   0.785  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm             64  thrpt   10   5081.858 ?  76.554    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                       64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                        64  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                               128  thrpt   10   2881.565 ? 112.716   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                 128  thrpt   10     15.613 ?   0.605  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm            128  thrpt   10   5681.912 ?  38.264    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                      128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                       128  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                               256  thrpt   10   2841.131 ? 211.118   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                 256  thrpt   10     18.450 ?   1.371  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm            256  thrpt   10   6809.984 ?   0.578    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                      256  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                               512  thrpt   10   2766.085 ? 162.588   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                 512  thrpt   10     24.103 ?   1.371  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm            512  thrpt   10   9138.040 ?  38.319    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                      512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                              1024  thrpt   10   2483.332 ? 236.771   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                1024  thrpt   10     32.494 ?   3.098  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm           1024  thrpt   10  13722.185 ?   0.604    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                     1024  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                         32  thrpt   10   9177.760 ? 225.258   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                           32  thrpt   10     13.152 ?   0.356  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                      32  thrpt   10   1502.771 ?  13.573    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                                32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                 32  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                         64  thrpt   10   9251.314 ? 168.930   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                           64  thrpt   10     13.186 ?   0.246  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                      64  thrpt   10   1494.696 ?   5.139    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                                64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                 64  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                        128  thrpt   10   9216.408 ? 233.330   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                          128  thrpt   10     13.067 ?   0.335  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                     128  thrpt   10   1486.811 ?  13.798    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                               128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                128  thrpt   10      4.000                ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                        256  thrpt   10   9248.310 ? 209.910   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                          256  thrpt   10     13.183 ?   0.275  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                     256  thrpt   10   1494.814 ?   4.667    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                               256  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                256  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                        512  thrpt   10   9249.576 ? 281.071   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                          512  thrpt   10     13.184 ?   0.424  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                     512  thrpt   10   1494.730 ?   4.922    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                               512  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                512  thrpt   10      6.000                ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                       1024  thrpt   10   9081.784 ? 463.402   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                         1024  thrpt   10     12.901 ?   0.653  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                    1024  thrpt   10   1489.729 ?  14.485    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                              1024  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                               1024  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                      32  thrpt   10   4866.841 ? 140.900   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                        32  thrpt   10      9.584 ?   0.300  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                   32  thrpt   10   2065.037 ?  25.495    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                             32  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                              32  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                      64  thrpt   10   4840.136 ? 164.784   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                        64  thrpt   10     10.676 ?   0.354  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                   64  thrpt   10   2313.045 ?  12.763    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                             64  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                              64  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                     128  thrpt   10   4757.698 ? 266.790   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                       128  thrpt   10     12.236 ?   0.660  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                  128  thrpt   10   2697.009 ?  12.705    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                            128  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                             128  thrpt   10      3.000                ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                     256  thrpt   10   4645.809 ? 191.650   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                       256  thrpt   10     15.988 ?   0.657  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                  256  thrpt   10   3609.077 ?  12.759    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                            256  thrpt   10      2.000            counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                             256  thrpt   10      2.000                ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                     512  thrpt   10   4494.550 ? 143.655   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                       512  thrpt   10     23.150 ?   0.796  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                  512  thrpt   10   5401.108 ?  38.241    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                            512  thrpt   10        ? 0            counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                    1024  thrpt   10   4114.499 ? 222.771   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                      1024  thrpt   10     35.253 ?   1.913  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                 1024  thrpt   10   8985.205 ?  12.758    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                           1024  thrpt   10        ? 0            counts
```

#### Java

```bash
Benchmark                                                                       (dataSize)   Mode  Cnt       Score      Error   Units
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                               32  thrpt   10     387.169 ?    6.321   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                 32  thrpt   10      70.021 ?    1.164  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm            32  thrpt   10  189654.069 ?  115.681    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                      32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                       32  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                               64  thrpt   10     377.727 ?   15.219   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                 64  thrpt   10      68.477 ?    2.765  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm            64  thrpt   10  190109.945 ?   80.942    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                      64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                       64  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                              128  thrpt   10     382.118 ?    6.518   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                128  thrpt   10      69.440 ?    1.181  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm           128  thrpt   10  190566.541 ?   16.923    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                     128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                      128  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                              256  thrpt   10     382.082 ?   10.713   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                256  thrpt   10      69.505 ?    1.962  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm           256  thrpt   10  190762.775 ?  101.785    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                     256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                      256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                              512  thrpt   10     373.560 ?   19.316   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate                512  thrpt   10      67.897 ?    3.514  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm           512  thrpt   10  190608.987 ?   21.935    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                     512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                      512  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes                             1024  thrpt   10     379.437 ?   11.489   ops/s
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate               1024  thrpt   10      68.955 ?    2.080  MB/sec
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.alloc.rate.norm          1024  thrpt   10  190573.000 ?  202.019    B/op
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.count                    1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2BatchProcessingVariousDataSizes:gc.time                     1024  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                 32  thrpt   10    1518.361 ?   35.212   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                   32  thrpt   10      70.852 ?    1.647  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm              32  thrpt   10   48934.290 ?   19.311    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                        32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.time                         32  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                 64  thrpt   10    1509.035 ?   36.037   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                   64  thrpt   10      70.902 ?    1.701  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm              64  thrpt   10   49271.637 ?   30.164    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                        64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.time                         64  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                128  thrpt   10    1519.621 ?   37.177   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                  128  thrpt   10      72.215 ?    1.773  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm             128  thrpt   10   49835.116 ?   38.075    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                       128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.time                        128  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                256  thrpt   10    1507.166 ?   31.141   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                  256  thrpt   10      73.332 ?    1.529  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm             256  thrpt   10   51023.931 ?   18.649    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                       256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.time                        256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                                512  thrpt   10    1486.835 ?   34.934   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                  512  thrpt   10      75.804 ?    1.781  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm             512  thrpt   10   53465.343 ?    3.961    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                       512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.time                        512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CipherReinitializationPattern                               1024  thrpt   10    1458.546 ?   39.480   ops/s
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate                 1024  thrpt   10      81.151 ?    2.178  MB/sec
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.alloc.rate.norm            1024  thrpt   10   58346.401 ?   25.567    B/op
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.count                      1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CipherReinitializationPattern:gc.time                       1024  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                    32  thrpt   10    1449.281 ?   36.350   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                      32  thrpt   10      85.648 ?    2.108  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                 32  thrpt   10   61974.037 ?   95.632    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                           32  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                            32  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                    64  thrpt   10    1445.482 ?   22.918   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                      64  thrpt   10      86.109 ?    1.304  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                 64  thrpt   10   62470.040 ?  108.379    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                           64  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                            64  thrpt   10      11.000                 ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                   128  thrpt   10    1434.616 ?   31.140   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                     128  thrpt   10      85.915 ?    1.881  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                128  thrpt   10   62802.057 ?  382.478    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                          128  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                           128  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                   256  thrpt   10    1421.141 ?   25.734   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                     256  thrpt   10      85.841 ?    1.538  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                256  thrpt   10   63342.072 ?  210.367    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                          256  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                           256  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                   512  thrpt   10    1418.384 ?   33.546   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                     512  thrpt   10      88.083 ?    2.196  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm                512  thrpt   10   65122.078 ?  127.454    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                          512  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                           512  thrpt   10       9.000                 ms
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow                                  1024  thrpt   10    1394.849 ?   23.761   ops/s
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate                    1024  thrpt   10      91.526 ?    1.699  MB/sec
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.alloc.rate.norm               1024  thrpt   10   68810.114 ?  216.728    B/op
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.count                         1024  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2CompleteDecryptionWorkflow:gc.time                          1024  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                    32  thrpt   10    1527.456 ?   35.277   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                      32  thrpt   10      69.003 ?    1.587  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                 32  thrpt   10   47373.556 ?    8.658    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                           32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                            32  thrpt   10       3.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                    64  thrpt   10    1527.011 ?   31.279   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                      64  thrpt   10      69.435 ?    1.410  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                 64  thrpt   10   47683.983 ?   38.927    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                           64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                            64  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                   128  thrpt   10    1500.308 ?   54.724   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                     128  thrpt   10      69.020 ?    2.544  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                128  thrpt   10   48242.936 ?   39.647    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                          128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                           128  thrpt   10       9.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                   256  thrpt   10    1506.391 ?   36.396   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                     256  thrpt   10      71.035 ?    1.715  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                256  thrpt   10   49450.539 ?   12.691    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                          256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                           256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                   512  thrpt   10    1481.161 ?   81.562   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                     512  thrpt   10      73.271 ?    4.034  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm                512  thrpt   10   51875.734 ?    4.102    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                          512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                           512  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow                                  1024  thrpt   10    1443.446 ?   72.733   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate                    1024  thrpt   10      78.089 ?    3.946  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.alloc.rate.norm               1024  thrpt   10   56734.592 ?    8.453    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.count                         1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflow:gc.time                          1024  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                             32  thrpt   10    1534.707 ?   62.005   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate               32  thrpt   10      69.126 ?    2.816  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm          32  thrpt   10   47233.794 ?   32.006    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                    32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                     32  thrpt   10       3.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                             64  thrpt   10    1504.553 ?   85.339   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate               64  thrpt   10      68.316 ?    3.877  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm          64  thrpt   10   47617.805 ?   39.340    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                    64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                     64  thrpt   10      10.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                            128  thrpt   10    1516.265 ?   41.381   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate              128  thrpt   10      69.568 ?    1.907  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm         128  thrpt   10   48114.090 ?   41.227    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                   128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                    128  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                            256  thrpt   10    1514.214 ?   48.627   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate              256  thrpt   10      71.399 ?    2.302  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm         256  thrpt   10   49447.186 ?   46.038    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                   256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                    256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                            512  thrpt   10    1501.698 ?   39.891   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate              512  thrpt   10      74.556 ?    1.978  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm         512  thrpt   10   52063.420 ?    5.165    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                   512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                    512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked                           1024  thrpt   10    1430.442 ?   40.864   ops/s
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate             1024  thrpt   10      78.402 ?    2.234  MB/sec
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.alloc.rate.norm        1024  thrpt   10   57476.754 ?   36.439    B/op
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.count                  1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteEncryptionWorkflowChunked:gc.time                   1024  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                     32  thrpt   10     732.368 ?   40.024   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                       32  thrpt   10      76.526 ?    4.195  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                  32  thrpt   10  109574.865 ?   66.308    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                            32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                             32  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                     64  thrpt   10     734.405 ?   15.889   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                       64  thrpt   10      77.101 ?    1.673  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                  64  thrpt   10  110093.065 ?   52.864    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                            64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                             64  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                    128  thrpt   10     742.110 ?    9.504   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                      128  thrpt   10      78.618 ?    1.019  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                 128  thrpt   10  111094.457 ?   42.152    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                           128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                            128  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                    256  thrpt   10     739.749 ?   14.031   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                      256  thrpt   10      79.833 ?    1.593  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                 256  thrpt   10  113169.954 ?  132.090    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                           256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                            256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                    512  thrpt   10     702.668 ?   79.636   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                      512  thrpt   10      78.527 ?    8.896  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                 512  thrpt   10  117211.280 ?   78.128    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                           512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                            512  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow                                   1024  thrpt   10     669.659 ?   98.376   ops/s
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate                     1024  thrpt   10      80.064 ?   11.774  MB/sec
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.alloc.rate.norm                1024  thrpt   10  125381.873 ?   58.704    B/op
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.count                          1024  thrpt   10       3.000             counts
SM2ComparisonBenchmark.sm2CompleteRoundTripWorkflow:gc.time                           1024  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                        32  thrpt   10     729.573 ?   35.660   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                          32  thrpt   10      76.253 ?    3.739  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                     32  thrpt   10  109606.067 ?   64.650    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                               32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                                32  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                        64  thrpt   10     737.327 ?   15.690   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                          64  thrpt   10      77.412 ?    1.636  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                     64  thrpt   10  110099.572 ?   62.393    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                               64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                                64  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                       128  thrpt   10     730.625 ?   38.515   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                         128  thrpt   10      77.365 ?    4.089  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                    128  thrpt   10  111041.254 ?   73.947    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                              128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                               128  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                       256  thrpt   10     740.362 ?   11.358   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                         256  thrpt   10      79.840 ?    1.242  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                    256  thrpt   10  113086.054 ?   53.118    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                              256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                               256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                       512  thrpt   10     727.359 ?   25.243   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                         512  thrpt   10      81.290 ?    2.839  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                    512  thrpt   10  117198.245 ?   47.707    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                              512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                               512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2DataValidationWorkflow                                      1024  thrpt   10     722.074 ?   17.197   ops/s
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate                        1024  thrpt   10      86.326 ?    2.048  MB/sec
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.alloc.rate.norm                   1024  thrpt   10  125369.872 ?   58.012    B/op
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.count                             1024  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2DataValidationWorkflow:gc.time                              1024  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                        32  thrpt   10    1016.516 ?   31.965   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                          32  thrpt   10      68.756 ?    2.111  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                     32  thrpt   10   70932.012 ?  130.087    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                               32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                                32  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                        64  thrpt   10    1016.185 ?   18.601   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                          64  thrpt   10      69.088 ?    1.254  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                     64  thrpt   10   71296.769 ?   79.860    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                               64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                                64  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                       128  thrpt   10    1008.371 ?   41.519   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                         128  thrpt   10      69.069 ?    2.814  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                    128  thrpt   10   71830.381 ?   78.014    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                              128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                               128  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                       256  thrpt   10     994.113 ?   37.118   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                         256  thrpt   10      69.244 ?    2.657  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                    256  thrpt   10   73041.524 ?  163.329    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                              256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                               256  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                       512  thrpt   10     994.716 ?   27.394   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                         512  thrpt   10      71.584 ?    1.977  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                    512  thrpt   10   75465.998 ?   56.591    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                              512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                               512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption                                      1024  thrpt   10     980.733 ?   19.205   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate                        1024  thrpt   10      75.068 ?    1.497  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.alloc.rate.norm                   1024  thrpt   10   80267.857 ?  113.193    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.count                             1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairEncryption:gc.time                              1024  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                         32  thrpt   10     599.597 ?   14.284   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                           32  thrpt   10      76.235 ?    1.744  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                      32  thrpt   10  133331.176 ?  156.843    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                                32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                 32  thrpt   10       3.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                         64  thrpt   10     590.861 ?   20.468   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                           64  thrpt   10      75.429 ?    2.609  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                      64  thrpt   10  133870.832 ?  164.067    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                                64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                 64  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                        128  thrpt   10     572.504 ?   34.601   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                          128  thrpt   10      73.589 ?    4.568  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                     128  thrpt   10  134841.133 ?  144.800    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                               128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                128  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                        256  thrpt   10     579.188 ?   24.207   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                          256  thrpt   10      75.586 ?    3.141  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                     256  thrpt   10  136855.224 ?  178.798    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                               256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                        512  thrpt   10     580.461 ?   25.349   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                          512  thrpt   10      78.020 ?    3.450  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                     512  thrpt   10  140948.797 ?  171.264    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                               512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                                512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip                                       1024  thrpt   10     583.881 ?   14.853   ops/s
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate                         1024  thrpt   10      83.030 ?    2.165  MB/sec
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.alloc.rate.norm                    1024  thrpt   10  149123.392 ?  181.243    B/op
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.count                              1024  thrpt   10       3.000             counts
SM2ComparisonBenchmark.sm2FreshKeyPairRoundTrip:gc.time                               1024  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                              32  thrpt   10     286.642 ?    8.674   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate                32  thrpt   10      84.879 ?    2.472  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm           32  thrpt   10  310530.412 ? 2741.177    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                     32  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                      32  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                              64  thrpt   10     289.612 ?    4.650   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate                64  thrpt   10      86.306 ?    1.483  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm           64  thrpt   10  312505.657 ?  594.276    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                     64  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                      64  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                             128  thrpt   10     288.115 ?    8.915   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate               128  thrpt   10      86.329 ?    2.992  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm          128  thrpt   10  314210.368 ? 2358.448    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                    128  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                     128  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                             256  thrpt   10     286.358 ?    5.782   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate               256  thrpt   10      86.723 ?    1.970  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm          256  thrpt   10  317581.184 ? 1165.484    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                    256  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                     256  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                             512  thrpt   10     281.091 ?   12.138   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate               512  thrpt   10      87.603 ?    3.849  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm          512  thrpt   10  326810.656 ?  701.022    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                    512  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                     512  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions                            1024  thrpt   10     272.962 ?   16.888   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate              1024  thrpt   10      89.294 ?    5.326  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.alloc.rate.norm         1024  thrpt   10  343070.937 ? 1880.816    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.count                   1024  thrpt   10       4.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleDecryptions:gc.time                    1024  thrpt   10       9.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                              32  thrpt   10     305.224 ?    3.343   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate                32  thrpt   10      68.934 ?    0.753  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm           32  thrpt   10  236837.356 ?   38.039    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                     32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                      32  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                              64  thrpt   10     303.255 ?    7.675   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate                64  thrpt   10      68.944 ?    1.739  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm           64  thrpt   10  238413.655 ?  127.683    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                     64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                      64  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                             128  thrpt   10     299.814 ?   11.103   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate               128  thrpt   10      68.962 ?    2.556  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm          128  thrpt   10  241207.539 ?   13.854    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                    128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                     128  thrpt   10      10.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                             256  thrpt   10     302.312 ?    6.801   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate               256  thrpt   10      71.273 ?    1.606  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm          256  thrpt   10  247234.052 ?   39.474    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                    256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                     256  thrpt   10       3.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                             512  thrpt   10     298.847 ?    5.589   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate               512  thrpt   10      73.895 ?    1.387  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm          512  thrpt   10  259301.049 ?  128.513    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                    512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                     512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions                            1024  thrpt   10     290.056 ?   15.397   ops/s
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate              1024  thrpt   10      78.442 ?    4.178  MB/sec
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.alloc.rate.norm         1024  thrpt   10  283597.533 ?  165.171    B/op
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.count                   1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2HighFrequencyMultipleEncryptions:gc.time                    1024  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                 32  thrpt   10    2937.123 ?  169.699   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                   32  thrpt   10      66.070 ?    3.817  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                              32  thrpt   10   23589.390 ?    2.716    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                        32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                         32  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                 64  thrpt   10    3029.312 ?   90.155   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                   64  thrpt   10      68.121 ?    2.043  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                              64  thrpt   10   23581.624 ?   13.445    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                        64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                         64  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                128  thrpt   10    3026.110 ?   89.989   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                  128  thrpt   10      68.059 ?    2.057  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                             128  thrpt   10   23584.919 ?   20.361    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                       128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                        128  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                256  thrpt   10    3029.797 ?   42.844   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                  256  thrpt   10      68.202 ?    0.988  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                             256  thrpt   10   23605.925 ?   26.027    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                       256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                        256  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2KeyGeneration                                                512  thrpt   10    3060.793 ?   40.147   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                  512  thrpt   10      68.847 ?    0.898  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                             512  thrpt   10   23589.641 ?    2.571    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                       512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                        512  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2KeyGeneration                                               1024  thrpt   10    3058.340 ?   69.578   ops/s
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate                                 1024  thrpt   10      68.775 ?    1.572  MB/sec
SM2ComparisonBenchmark.sm2KeyGeneration:gc.alloc.rate.norm                            1024  thrpt   10   23581.997 ?   12.176    B/op
SM2ComparisonBenchmark.sm2KeyGeneration:gc.count                                      1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2KeyGeneration:gc.time                                       1024  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                         32  thrpt   10    1513.370 ?   97.998   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                           32  thrpt   10      68.338 ?    4.413  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                      32  thrpt   10   47354.260 ?   24.716    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                                32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                 32  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                         64  thrpt   10    1497.307 ?   40.447   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                           64  thrpt   10      68.062 ?    1.833  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                      64  thrpt   10   47671.720 ?   20.230    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                                64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                 64  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                        128  thrpt   10    1492.317 ?   35.658   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                          128  thrpt   10      68.635 ?    1.656  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                     128  thrpt   10   48235.068 ?   12.401    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                               128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                128  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                        256  thrpt   10    1496.361 ?   36.165   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                          256  thrpt   10      70.528 ?    1.707  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                     256  thrpt   10   49426.746 ?   14.649    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                               256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                        512  thrpt   10    1442.849 ?  102.687   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                          512  thrpt   10      71.344 ?    5.072  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                     512  thrpt   10   51853.853 ?   19.971    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                               512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                                512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MaximumDataEncryption                                       1024  thrpt   10    1413.396 ?  107.183   ops/s
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate                         1024  thrpt   10      76.472 ?    5.798  MB/sec
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.alloc.rate.norm                    1024  thrpt   10   56738.462 ?    3.301    B/op
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.count                              1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MaximumDataEncryption:gc.time                               1024  thrpt   10       9.000                 ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                     32  thrpt   10     499.849 ?   19.148   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                       32  thrpt   10      67.043 ?    2.566  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                  32  thrpt   10  140656.386 ?   86.640    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                            32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                             32  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                     64  thrpt   10     495.723 ?   12.083   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                       64  thrpt   10      66.881 ?    1.658  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                  64  thrpt   10  141480.278 ?   99.000    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                            64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                             64  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                    128  thrpt   10     499.141 ?   12.523   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                      128  thrpt   10      68.056 ?    1.735  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                 128  thrpt   10  142982.508 ?   92.509    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                           128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                            128  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                    256  thrpt   10     497.335 ?    4.939   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                      256  thrpt   10      69.410 ?    0.706  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                 256  thrpt   10  146356.056 ?   86.513    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                           256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                            256  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                    512  thrpt   10     487.962 ?   21.815   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                      512  thrpt   10      71.292 ?    3.233  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                 512  thrpt   10  153211.555 ?  161.923    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                           512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                            512  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse                                   1024  thrpt   10     478.336 ?    8.568   ops/s
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate                     1024  thrpt   10      76.024 ?    1.402  MB/sec
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.alloc.rate.norm                1024  thrpt   10  166669.535 ?  112.891    B/op
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.count                          1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryFriendlyCipherReuse:gc.time                           1024  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                                32  thrpt   10     487.800 ?   29.169   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                  32  thrpt   10      66.081 ?    3.958  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm             32  thrpt   10  142062.522 ?   37.673    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                       32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                        32  thrpt   10      15.000                 ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                                64  thrpt   10     485.113 ?   24.798   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                  64  thrpt   10      66.211 ?    3.415  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm             64  thrpt   10  143130.882 ?  224.581    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                       64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                        64  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                               128  thrpt   10     487.848 ?   15.029   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                 128  thrpt   10      67.374 ?    2.111  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm            128  thrpt   10  144830.029 ?  176.459    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                      128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                       128  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                               256  thrpt   10     491.104 ?   16.162   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                 256  thrpt   10      69.439 ?    2.307  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm            256  thrpt   10  148273.038 ?   74.293    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                      256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                       256  thrpt   10       3.000                 ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                               512  thrpt   10     484.212 ?   12.734   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                 512  thrpt   10      71.828 ?    1.897  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm            512  thrpt   10  155557.832 ?   57.631    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                      512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                       512  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers                              1024  thrpt   10     475.580 ?   12.757   ops/s
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate                1024  thrpt   10      77.186 ?    2.087  MB/sec
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.alloc.rate.norm           1024  thrpt   10  170197.118 ?   92.230    B/op
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.count                     1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MemoryIntensiveMultipleCiphers:gc.time                      1024  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                         32  thrpt   10    1487.441 ?   33.412   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                           32  thrpt   10      66.842 ?    1.510  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                      32  thrpt   10   47124.091 ?   62.129    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                                32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                 32  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                         64  thrpt   10    1502.712 ?   28.401   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                           64  thrpt   10      67.561 ?    1.247  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                      64  thrpt   10   47148.402 ?   76.031    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                                64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                 64  thrpt   10       8.000                 ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                        128  thrpt   10    1421.203 ?   83.577   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                          128  thrpt   10      63.866 ?    3.753  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                     128  thrpt   10   47130.508 ?   59.547    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                               128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                128  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                        256  thrpt   10    1514.272 ?   71.599   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                          256  thrpt   10      68.093 ?    3.202  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                     256  thrpt   10   47161.429 ?   85.198    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                               256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                256  thrpt   10       7.000                 ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                        512  thrpt   10    1508.213 ?   23.315   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                          512  thrpt   10      67.782 ?    1.051  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                     512  thrpt   10   47129.175 ?   52.443    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                               512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                                512  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2MinimumDataEncryption                                       1024  thrpt   10    1492.023 ?   52.247   ops/s
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate                         1024  thrpt   10      67.068 ?    2.379  MB/sec
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.alloc.rate.norm                    1024  thrpt   10   47139.768 ?   91.297    B/op
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.count                              1024  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2MinimumDataEncryption:gc.time                               1024  thrpt   10       4.000                 ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                      32  thrpt   10     724.884 ?   35.139   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                        32  thrpt   10      75.220 ?    3.700  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                   32  thrpt   10  108829.928 ?  112.740    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                             32  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                              32  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                      64  thrpt   10     717.555 ?   47.050   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                        64  thrpt   10      74.844 ?    4.935  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                   64  thrpt   10  109382.445 ?  117.353    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                             64  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                              64  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                     128  thrpt   10     730.054 ?   43.509   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                       128  thrpt   10      76.823 ?    4.601  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                  128  thrpt   10  110348.644 ?  115.133    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                            128  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                             128  thrpt   10       5.000                 ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                     256  thrpt   10     728.356 ?   30.941   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                       256  thrpt   10      78.147 ?    3.356  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                  256  thrpt   10  112512.901 ?  113.692    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                            256  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                             256  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                     512  thrpt   10     716.297 ?   31.008   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                       512  thrpt   10      79.824 ?    3.488  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                  512  thrpt   10  116861.792 ?  112.940    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                            512  thrpt   10       2.000             counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                             512  thrpt   10       6.000                 ms
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse                                    1024  thrpt   10     684.728 ?   47.622   ops/s
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate                      1024  thrpt   10      81.971 ?    5.750  MB/sec
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.alloc.rate.norm                 1024  thrpt   10  125599.525 ?  105.058    B/op
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.count                           1024  thrpt   10       3.000             counts
SM2ComparisonBenchmark.sm2RoundTripWithCipherReuse:gc.time                            1024  thrpt   10       7.000                 ms

```
