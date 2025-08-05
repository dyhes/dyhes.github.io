---
title: 【AI】Cursor Practice
date: 2025-08-01 00:00:00+0000
categories: [snow]
tags: [AI]
---

## Extension

* Java Extension Pack
* Spring Boot Extension Pack
* One Dark Pro + Material Icon Theme 
* setting.json(cmd + ,)

```java
{
    "window.commandCenter": true,
    "workbench.colorTheme": "One Dark Pro Night Flat",
    "workbench.iconTheme": "material-icon-theme",
    "editor.fontSize": 15,
    "editor.fontFamily": "JetBrains Mono, monospace",
    "editor.fontLigatures": true,
    "editor.fontWeight": "400",
    "java.debug.settings.onBuildFailureProceed": true,
    "java.configuration.updateBuildConfiguration": "automatic",
    "java.compile.nullAnalysis.mode": "automatic",
    "java.saveActions.organizeImports": true,
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "editor.formatOnSave": true,
    "java.autobuild.enabled": true,
    "java.import.gradle.enabled": true,
    "java.import.maven.enabled": true,
    "[java]": {
        "editor.quickSuggestions": {
            "comments": "on",
            "strings": "on",
            "other": "on"
        },
    },
}
```

## gradle compileJava

`gradle compileJava` 是 Gradle Java 插件中的核心任务，负责将 Java 源代码编译为字节码文件（`.class`）。以下是其详细执行流程和作用：

------

### 🔧 **1. 任务定义与依赖关系**

- **所属插件**：`java` 或 `java-library`（通过 `apply plugin: 'java'` 启用）。

- 

  任务依赖链

  ：

  - `compileJava` 依赖于 `processResources`（处理资源文件）。
  - 执行前会先完成依赖项解析和资源处理。

- 

  输入/输出

  ：

  - **输入**：`src/main/java` 目录下的 `.java` 文件、依赖库（`classpath`）。
  - **输出**：编译后的 `.class` 文件存放于 `build/classes/java/main` 目录。

------

### ⚙️ **2. 核心执行步骤**

1. **检查源码变更**

   - 使用增量编译机制，仅重新编译修改过的文件（需配置 `options.incremental = true`）。
   - 未修改的文件跳过编译（标记为 `UP-TO-DATE`）。

2. **解析依赖与类路径**

   - 从 `build.gradle` 中的 `dependencies` 块获取依赖库（如 `implementation 'com.google.guava:guava:31.1-jre'`）。
   - 生成完整的类路径（`classpath`）供编译器使用。

3. **调用 Java 编译器（javac）**

   - 使用 JDK 中的 `javac` 工具编译源码。

   - 编译参数通过

      

     ```
     javaCompile.options
     ```

      

     配置（如源码/目标版本、编码格式）：

     ```
     compileJava {
         sourceCompatibility = '1.8'
         targetCompatibility = '1.8'
         options.encoding = 'UTF-8'
     }
     ```

4. **生成字节码文件**

   - 将 `.java` 文件编译为 `.class` 文件，按包结构输出到 `build/classes/java/main`。

------

### 📂 **3. 输出结果**

| 输出内容                   | 路径示例                     | 作用                  |
| -------------------------- | ---------------------------- | --------------------- |
| 编译后的字节码（`.class`） | `build/classes/java/main/`   | 供 JVM 执行或打包 JAR |
| 编译日志                   | 控制台输出或 `build/reports` | 查看错误和警告        |

------

### ⚡️ **4. 增量编译与性能优化**

- **增量编译**：
  仅重编译修改的源文件（通过文件哈希对比），大幅提升构建速度。
- **守护进程（Daemon）**：
  启用守护进程避免重复启动 JVM（配置 `options.fork = true`）。
- **缓存机制**：
  利用 Gradle 缓存跳过未变更的任务（如依赖未更新时）。

------

### ⚠️ **5. 常见问题与配置**

#### **问题：编译失败**

- **原因**：语法错误、依赖缺失或版本冲突。

- 

  解决

  ：

  - 查看控制台错误日志定位问题。
  - 运行 `gradle compileJava --info` 获取详细编译信息。

#### **配置：统一编译规则**

若需为所有 Java 编译任务（如多模块项目）统一配置，使用 `tasks.withType(JavaCompile)`：

```
tasks.withType(JavaCompile).configureEach {
    options.incremental = true
    sourceCompatibility = '11'
    targetCompatibility = '11'
}
```

#### **对比：`compileJava` vs `build`**

| 任务          | 作用                       | 输出结果                   |
| ------------- | -------------------------- | -------------------------- |
| `compileJava` | 仅编译 Java 源码           | `.class` 文件              |
| `build`       | 完整构建（编译+测试+打包） | JAR 包、测试报告、依赖库等 |

------

### 💎 **总结**

`gradle compileJava` 的核心流程如下：

1. **准备阶段**：解析依赖、检查源码变更。
2. **编译阶段**：调用 `javac` 生成字节码。
3. **输出阶段**：保存 `.class` 文件至 `build/classes`。
4. **优化机制**：增量编译、守护进程提升效率。

> 通过合理配置编译选项（如版本兼容性、编码格式）和利用增量编译，可显著提升开发效率。
