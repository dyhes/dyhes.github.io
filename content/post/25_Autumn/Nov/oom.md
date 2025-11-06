---
title: 【Java】OOM
date: 2025-11-04 00:00:00+0000
categories: [snow]
tags: [Java]
---

## OOM 排查

生成 Java 转储文件（Dump File）是诊断内存泄漏、线程死锁和性能问题的关键步骤。下面为你梳理了多种生成转储文件的方法、核心命令以及实用建议。

下表汇总了生成堆转储（Heap Dump，内存快照）和线程转储（Thread Dump，线程状态快照）的主要方式。

| 转储类型     | 生成工具 / 方法                    | 核心命令 / 操作关键点                                        |
| ------------ | ---------------------------------- | ------------------------------------------------------------ |
| **堆转储**   | `jmap`(命令行)                     | `jmap -dump:format=b,file=heapdump.hprof <pid>`              |
|              | `jcmd`(命令行，JDK 7+)             | `jcmd <pid> GC.heap_dump heapdump.hprof`                     |
|              | JVM 参数 (内存溢出时自动生成)      | `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/to/dump` |
|              | Java VisualVM (图形化界面)         | 连接进程 → 右键点击 → “堆转储”                               |
|              | 程序代码 (HotSpotDiagnosticMXBean) | `HotSpotDiagnosticMXBean.dumpHeap("heapdump.hprof", true)`   |
| **线程转储** | `jstack`(命令行)                   | `jstack -l <pid> > threaddump.txt`                           |
|              | `jcmd`(命令行，JDK 7+)             | `jcmd <pid> Thread.print > threaddump.txt`                   |
|              | Java VisualVM (图形化界面)         | 连接进程 → 右键点击 → “线程转储”                             |
|              | `kill -3`(Linux/Unix 信号)         | 向 Java 进程发送 `SIGQUIT`信号，信息会打印到标准输出或日志文件（如 catalina.out） |

### 🛠️ 核心方法与详细步骤

#### 1. 使用命令行工具

这是最常用和直接的方法，尤其适用于生产环境。

- **查找 Java 进程 ID (PID)**

  使用 `jps -l`命令可以快速列出所有 Java 进程及其 PID。

- **生成堆转储**

  - **`jmap`**：经典工具，但被标记为“实验性”。基本命令为 `jmap -dump:format=b,file=<文件名> <PID>`。添加 `live`参数（如 `-dump:live,...`）可以只转储存活的对象，但这会触发一次 Full GC，可能暂停应用。
  - **`jcmd`**（推荐）：JDK 7+ 自带的更现代的工具。命令更简洁：`jcmd <PID> GC.heap_dump <文件名>`。通常对目标进程的影响比 `jmap`更小。

- **生成线程转储**

  - **`jstack`**：直接使用 `jstack <PID> > threaddump.txt`将线程信息输出到文件。
  - **`jcmd`**：同样可以完成此任务：`jcmd <PID> Thread.print > threaddump.txt`。

#### 2. 配置 JVM 参数自动生成

对于难以手动捕获的 `OutOfMemoryError`，这是必备的设置。

在启动应用时添加以下 JVM 参数：

```
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/to/your/dump/directory
```

当 JVM 发生内存溢出错误时，它会**自动**在指定路径生成一个堆转储文件，完美保留了“案发现场”。

#### 3. 使用图形化工具

如果你是可视化操作的爱好者，**Java VisualVM**（JDK 自带）是个不错的选择。

启动 `jvisualvm`命令后，在左侧应用程序列表中找到你的目标进程，右键点击即可轻松生成堆转储或线程转储，并可以直接在界面中进行初步查看。

#### 4. 通过程序代码生成

在某些特定场景下，你可能需要在应用程序内部根据条件触发转储。

这可以通过调用 **`HotSpotDiagnosticMXBean`**的 `dumpHeap`方法来实现。需要注意的是，此方法生成的堆转储文件需要指定完整的路径，并且要求 JVM 具有写入该路径的权限。

### 💡 实用建议与注意事项

1. **时机与性能影响**
   - 生成堆转储（尤其是完整的堆转储）会触发 JVM 的安全点（Stop-The-World），**暂停所有应用线程**，直到转储完成。在高负载的生产环境中执行需谨慎，最好在业务低峰期进行。
   - 线程转储的性能影响通常很小。
2. **文件管理**
   - 堆转储文件（`.hprof`）通常**非常大**，可能达到 GB 级别。确保磁盘有足够空间，尤其是在设置 `-XX:+HeapDumpOnOutOfMemoryError`时。
   - 建议为转储文件建立清晰的命名规范，例如包含进程名、PID 和时间戳（如 `myapp_12345_20231031.hprof`），便于管理。
3. **工具选择考量**
   - 在生产环境，优先考虑使用 **`jcmd`**，因为它通常比 `jmap`更安全、更现代。
   - 如果进程对 `jmap`或 `jcmd`无响应，可以尝试使用 `-F`选项强制生成（例如 `jmap -F -dump ...`），但这可能导致 JVM 彻底崩溃。

### 🔍 后续分析工具推荐

生成转储文件只是第一步，分析才是关键。

- **堆转储分析**：推荐使用 **Eclipse Memory Analyzer (MAT)**，功能强大，能有效帮助发现内存泄漏。JDK 自带的 **Java VisualVM**和 **jhat**也可用于基础分析。
- **线程转储分析**：你可以直接打开文本文件查看，但使用 **IntelliJ IDEA IDEA**内置的栈分析功能或在线工具可以更直观地查看线程状态和死锁信息。

希望这份详细的指南能帮助你有效地生成所需的 Java 转储文件。如果你在具体操作中遇到问题，比如不知道如何分析某个特定现象，可以随时再问我。

## Java PID

获取 Java 进程的 PID (进程标识符) 是监控、管理或调试应用时的常见需求。你可以通过命令行工具快速查看，也可以在 Java 程序内部动态获取。下表总结了主要的方法，方便你快速比较和选择。

| 方法类别                | 具体方法/工具           | 关键命令/代码示例                                            | 主要特点与适用场景                                     |
| ----------------------- | ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| **命令行工具**          | **`jps`**(JDK自带)      | `jps`或 `jps -l`                                             | **最常用**，直接列出所有Java进程的PID和主类名。        |
|                         | **`ps`**命令 (系统自带) | `ps -ef \| grep java`                                        | 通用性强，可通过输出信息（如第二列）获取PID。          |
| **Java代码（Java 9+）** | **`ProcessHandle`API**  | `long pid = ProcessHandle.current().pid();`                  | **现代、推荐**，代码简洁直观，专为获取进程信息设计。   |
| **Java代码（Java 5+）** | **`ManagementFactory`** | `String name = ManagementFactory.getRuntimeMXBean().getName(); String pid = name.split("@")[0];` | **兼容性好**，适用于Java 5及以上版本，但需解析字符串。 |

### 🛠️ 使用命令行工具快速查看

在排查问题或需要快速了解系统上运行了哪些Java进程时，命令行工具是最直接的选择。

1. **使用 `jps`命令**

   这是JDK提供的标准工具，能直接输出当前用户权限下的所有Java进程信息。

   ```
   jps -l
   ```

   输出示例：

   ```
   12345 com.example.MyApplication
   67890 sun.tools.jps.Jps
   ```

   第一列就是PID，第二列是主类的完整类名。它的优点是能**快速过滤出Java进程**，无需再从大量系统进程中查找。

2. **使用 `ps`命令结合 `grep`**

   这是一个更通用的系统命令，在所有类Unix系统（包括Linux和macOS）上均可使用。

   ```
   ps -ef | grep java
   ```

   在输出结果中，**第二列通常为PID**。此命令的优点是通用性强，但结果中可能包含其他非Java进程，需要你根据命令行参数等信息进行识别。

### 💻 在Java程序中动态获取

如果你需要在程序内部获取自身的PID用于日志记录、监控或资源管理，可以通过编程方式实现。

1. **Java 9及以上版本（推荐）**

   如果您的应用基于Java 9或更高版本，强烈建议使用 `ProcessHandle`API。这是最简洁、最标准的方式。

   ```
   public class GetPid {
       public static void main(String[] args) {
           long pid = ProcessHandle.current().pid();
           System.out.println("Current PID: " + pid);
       }
   }
   ```

2. **Java 8及更低版本**

   对于Java 8及更早的项目，可以使用 `ManagementFactory`类。这是一种广泛使用的兼容方案。

   ```
   import java.lang.management.ManagementFactory;
   
   public class GetPidLegacy {
       public static void main(String[] args) {
           String name = ManagementFactory.getRuntimeMXBean().getName();
           // 名称格式通常为 "pid@hostname"，例如 "12345@localhost"
           String pid = name.split("@")[0];
           System.out.println("Current PID: " + pid);
       }
   }
   ```

   需要注意的是，这种方法依赖于JVM实现返回的特定字符串格式，虽然绝大多数情况下工作正常，但理论上并非绝对可靠。

### 💎 如何选择

- **快速查看或脚本编写**：优先使用 **`jps`**命令。
- **Java 9+ 项目**：在代码中使用 **`ProcessHandle.current().pid()`**。
- **Java 8 或更早版本项目**：在代码中使用 **`ManagementFactory.getRuntimeMXBean().getName()`**并进行字符串解析。

希望这些方法能帮助你顺利获取Java进程的PID。如果你能告知具体的使用场景（例如，是在Linux服务器上快速查看，还是需要在Java 8的老项目中编码获取），我可以提供更具体的建议。

## MAT

Eclipse Memory Analyzer (MAT) 是一款功能强大且广泛使用的 Java 堆转储文件分析工具，能高效帮助开发者定位内存泄漏、分析大对象占用等内存问题。

下面通过一个表格快速了解其核心功能界面，然后详细介绍使用流程和分析技巧。

| 功能区域 / 概念              | 主要作用                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| **Overview (概览)**          | 显示堆内存总量、类/对象数量等基本信息，并提供生成**Leak Suspects Report (泄漏嫌疑报告)**的入口。 |
| **Histogram (直方图)**       | 按**类**统计其**实例数量**及每个实例的 **Shallow Heap**和 **Retained Heap**。 |
| **Dominator Tree (支配树)**  | 按 **Retained Heap**从大到小排序，展示对象间的引用关系，快速识别占用内存最多的“大户”。 |
| **Leak Suspects (泄漏嫌疑)** | MAT 的**自动分析功能**，会以报告形式列出可能的内存泄漏点，包括可疑对象、内存占比及问题描述。 |
| **Shallow Heap**             | 对象**自身**占用的内存大小，不包含其引用的其他对象。         |
| **Retained Heap**            | 该对象被垃圾回收（GC）后，**能释放的总内存大小**（包括其本身及仅能通过它访问到的所有对象的 Shallow Heap）。这是分析内存影响的关键指标。 |

### 🛠️ 详细使用流程

#### 1. 获取堆转储文件

首先，你需要一个 Java 堆转储文件（通常是 `.hprof`格式）。获取方式主要有：

- **主动生成**：使用 `jmap`工具（**注意：此操作会触发 Full GC，建议在业务低峰期执行**）。

  ```
  jmap -dump:format=b,file=heapdump.hprof <Java进程PID>
  ```

- **自动生成**：在 JVM 启动参数中配置，当发生 `OutOfMemoryError`时自动生成，这是捕获问题“案发现场”的推荐方式。

  ```
  -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=./oom_dump.hprof
  ```

#### 2. 使用 MAT 分析堆转储

1. **打开堆转储文件**

   启动 MAT，通过 `File -> Open Heap Dump`打开你的 `.hprof`文件。首次打开时，MAT 会进行解析并索引，文件越大耗时越久。

2. **查看泄漏嫌疑报告**

   文件解析完成后，MAT 通常会**自动提示生成 Leak Suspects Report**。选择默认选项并完成，这会提供一个高级别的可疑问题概览，是很好的起点。

3. **深入分析**

   - **使用直方图定位可疑类**：在直方图视图中，按 **Retained Heap**排序，重点关注占用大的类。右键点击可疑类，选择 `List Objects -> with incoming references`，查看该类的所有实例以及是谁引用了它们。

   - **使用支配树找出大对象**：支配树视图能直观展示哪些单个对象实例 retained heap 最大。右键点击可疑对象，选择 `Path to GC Roots -> exclude weak/soft references`。**排除弱/软引用**后，剩下的就是**强引用链**，如果存在，就意味着该对象无法被 GC 回收，很可能就是内存泄漏的原因。

   - **使用 OQL 查询**：OQL 类似 SQL，可以更精确地查询特定条件的对象。例如，查找所有 Retained Heap 大于 1MB 的对象：

     ```
     SELECT * FROM java.lang.Object WHERE retainedHeapSize > 1024 * 1024
     ```

### 💡 实用技巧与注意事项

- **调整 MAT 内存以分析大文件**：如果堆转储文件很大（如超过 1GB），MAT 本身可能内存不足。你需要编辑 MAT 安装目录下的 `MemoryAnalyzer.ini`文件，修改 `-Xmx`参数（如 `-Xmx4g`），为其分配更多内存。
- **对比堆转储文件**：如果内存是缓慢增长的，可以间隔一段时间获取两个堆转储文件。使用 MAT 的 `File -> Compare Heap Dumps`功能对比，可以清晰看出哪些类的对象数量或内存占用在增长，这对定位潜在泄漏非常有帮助。
- **结合代码逻辑**：MAT 帮你定位到内存中的可疑对象和引用链，但最终解决问题还需要你**结合代码进行审查**。找到持有这些无用对象引用的代码位置（如静态集合、缓存未清理等），并进行修复。

### 💎 核心思路总结

使用 MAT 分析内存问题的核心思路可以概括为：**“自动报告先行，直方支配树深挖，引用链定位根源”**。先从 Leak Suspects Report 获得线索，然后利用 Histogram 和 Dominator Tree 聚焦于内存占用高的类或对象实例，最后通过分析到 GC Roots 的强引用路径，找到阻止垃圾回收的“罪魁祸首”。

希望这份详细的指南能帮助你开始使用 MAT 来有效地解决 Java 内存问题。如果你在分析某个具体的堆转储文件时遇到困难，欢迎分享更详细的现象，我们可以一起探讨。

## Heap Space Rrror

你在使用 Eclipse Memory Analyzer Tool (MAT) 分析堆转储文件时遇到的 "An internal error occurred during: 'Parsing heap dump...' Java heap space" 错误，是因为 MAT 工具自身分析大型堆转储文件时内存不足。解决问题的核心思路是为 MAT 分配更多的内存。

### 调整 MAT 内存配置

这是解决该问题最直接有效的方法。你需要修改 MAT 的配置文件，增加其可用的最大堆内存。

1. **找到配置文件**：

   独立版 MAT 的配置文件是其安装目录下的 `MemoryAnalyzer.ini`。如果你将 MAT 作为插件安装在 Eclipse 中，则需要修改 Eclipse 的配置文件 `eclipse.ini`。

2. **修改配置参数**：

   用文本编辑器打开对应的 `.ini`文件，找到 `-Xmx`参数（如 `-Xmx1024m`或 `-Xmx1g`），它指定了 MAT（或 Eclipse）可以使用的最大堆内存。

   建议将 `-Xmx`的值设置为**比你的堆转储文件大小高出 2-4 GB**。例如，如果你的 `heapdump.hprof`文件约为 2GB，可以将参数修改为 `-Xmx4g`（分配 4GB 内存）。

   同时，你也可以考虑添加其他优化参数：

   ```
   -vmargs
   -Xmx6g
   -XX:+UseG1GC
   ```

   - `-Xmx6g`：将最大堆内存设置为 6GB。
   - `-XX:+UseG1GC`：使用 G1 垃圾回收器，可能在处理大堆时表现更好。

3. **检查 Java 版本**：

   确保你使用的 MAT 版本与 Java 运行环境兼容。较新版本的 MAT（如 1.11.0 及以上）需要 JDK 11 或更高版本。你可以在配置文件中指定特定的 JDK 路径。

### 其他可行方案

如果增加内存后问题依旧，或者你的机器内存有限，可以考虑以下方法：

- **使用 MAT 的离线模式**：MAT 支持生成堆转储文件的索引（称为“离线模式”）。你可以先在一台内存足够大的机器上解析堆转储文件并生成索引，然后将堆转储文件和索引文件一同拷贝到你的日常机器上进行分析。这样日常机器上的 MAT 只需要加载索引，内存消耗会大大降低。
- **使用其他工具验证**：可以尝试使用 JDK 自带的 `jhat`或 `jvisualvm`工具来加载堆转储文件，以验证文件是否完整且并非损坏。
- **确保文件完整**：确认堆转储文件在生成和传输过程中没有损坏。

### 总结与建议

下表总结了不同情况下的主要解决思路：

| 情况描述                           | 首选方案                                                     | 备选方案                                     |
| ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| **有足够物理内存**                 | 调整 MAT 配置文件中的 `-Xmx`参数，使其大于堆转储文件大小。   | -                                            |
| **物理内存有限，或堆转储文件极大** | 使用 MAT 的离线模式，先在大内存机器上生成索引，再在本地分析。 | 尝试使用 `jvisualvm`等替代工具进行基础分析。 |

希望这些具体的步骤能帮助你顺利解决 MAT 的内存问题并开始分析堆转储。如果还有其他疑问，随时可以再问我。

## MAT 安装目录

寻找 Eclipse Memory Analyzer Tool (MAT) 的安装目录，其位置主要取决于您当初选择的安装方式。下面这个表格汇总了不同安装方式下寻找目录的核心思路。

| 安装方式             | 安装目录通常的特征与位置                                     |
| -------------------- | ------------------------------------------------------------ |
| **独立版安装**       | 为您解压 ZIP 压缩包时选择的目录，或直接运行安装程序后生成的目录。 |
| **Eclipse 插件安装** | 位于您的 Eclipse 安装目录下的 `dropins`或 `plugins`子文件夹内。 |

### 🖥️ 按系统类型查找

**Windows 系统**

- **独立版**：如果您下载的是类似 `MemoryAnalyzer-1.12.0.20210602-win32.win32.x86_64.zip`的文件，那么安装目录就是您解压这个 ZIP 包时选择的文件夹。例如，可能直接是 `C:\mat`或 `D:\Tools\mat`。您可以在文件资源管理器中对整个系统盘（通常是 C 盘）搜索 `MemoryAnalyzer.exe`或 `mat`文件夹来定位。
- **Eclipse 插件版**：MAT 会安装在您的 Eclipse 目录下。请找到您的 Eclipse 安装根目录（例如 `C:\eclipse`），然后检查其中的 `dropins`或 `plugins`文件夹，MAT 通常以独立文件夹的形式存在于此。

**macOS 系统**

- **独立版**：通常，您会下载一个 `.zip`文件，解压后得到一个 `mat.app`应用程序包。这个 `.app`文件就是 MAT 的安装位置。标准的路径是 `/Applications/mat.app`。您可以在 Finder 的“应用程序”文件夹中查找，或者使用 Spotlight 搜索 "mat"。
- **定位后的关键文件**：即使您将 `mat.app`移动到了其他位置，其核心内容也在 `mat.app/Contents/Eclipse`目录下，特别是 `MemoryAnalyzer.ini`配置文件就位于此。

**Linux 系统**

- **独立版**：与 Windows 类似，目录就是您执行解压命令（例如 `unzip MemoryAnalyzer-1.12.0.20210602-linux.gtk.x86_64.zip`）时所在的目录，或者您使用 `-d`参数指定的目标目录。常见的路径可能是 `/opt/mat/`或您的主目录下的某个文件夹。
- **Eclipse 插件版**：同样，需要检查您的 Eclipse 安装目录下的 `dropins`或 `plugins`子目录。

### 🔍 实用查找技巧

如果您不确定安装方式，或者通过上述方法找不到，可以尝试以下技巧：

1. **搜索关键文件**：在文件管理器或使用终端/命令提示符，搜索名为 `MemoryAnalyzer`（Windows/Linux 上是 `MemoryAnalyzer.exe`）或 `ParseHeapDump`（Linux/Mac 上的脚本 `ParseHeapDump.sh`）的文件。找到这些可执行文件的位置，就找到了安装目录。
2. **检查启动方式**：如果您是通过桌面快捷方式或菜单启动的 MAT，可以右键点击该快捷方式，查看其“属性”，通常能找到指向安装目录的目标路径。
3. **查看当前工作目录（适用于命令行启动）**：如果您是通过命令行启动的，并且当时就在 MAT 的安装目录下，那么当前的工作路径（可以用 `pwd`命令查看）就是安装目录。

### 💎 总结

简单来说，寻找 MAT 安装目录的关键在于回忆您的安装过程：是**解压到某个文件夹**（独立版），还是**集成到了现有的 Eclipse 中**（插件版）。根据这个线索，再结合操作系统的常见路径进行查找，通常就能快速定位。

希望这些方法能帮助您顺利找到 MAT 的安装目录！如果您在查找过程中遇到更具体的情况，欢迎告诉我，我们可以再一起探讨。
