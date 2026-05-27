---
title: 【Log】Shopee Intern Log
date: 2025-09-30 00:00:00+0000
categories: 
    - snow
draft: true
---

## Shopee Intern Log

| Date      | Log                                                          |
|-----------|--------------------------------------------------------------|
| 7.30 W1   | 入职 & 软件                                                      |
| 7.31      | AI & 理解SM2 & m                                               |
| 8.1       | AI (springAI + Ollama) & Cursor Config & Kona                |
| 8.4 W2    | MCP & Hub & Kona                                             |
| 8.5       | Kona[commit] & Hub(docker-compose)                           |
| 8.6       | GIT[fix compose config] & Milvus & Kona                      |
| 8.7       | Kona & Milvus for IH                                         |
| 8.8       | Kona Merged & Milvus[调通] & nebula-studio                     |
| 8.11 W3   | 分工 开会【insighthub】代码生成 论文修改                                   |
| 8.12      | 代码生成 论文图 mysql迁移 分支合并                                        |
| 8.13      | 代码生成测试 论文图 论文修改提交                                            |
| 8.14      | 入职培训 & nebula 语句                                             |
| 8.15      | prompt 调优 & 并行逻辑优化                                           |
| 8.18 W4   | scheduler & endpoint & table                                 |
| 8.19      | mybatis xml + annotation                                     |
| 8.20      | BatchEdgeInsert 优化                                           |
| 8.21      | Parser 代码整合 & 测试 & Spring Cloud Stream                       |
| 8.22      | 代码重构 + 悬挂边 debug &  Kafka StreamBean                         |
| 8.25 W5   | Stream(Bean/Bridge) Parser & Unified Batch Edge Insert + Unified Batch Edge Insert + 长时间 Debug |
| 8.26      | 合并代码 + 重构 Describer & 悬挂边 Debug + Vertex Describer           |
| 8.27      | 添加 ai_short_desc + 重构 Describable 体系                         |
| 8.28      | Class/Class Field Describer & NgVertex 为空调试 + Edge Describer |
| 8.29      | (lc_sql) 切换 compass + prompt 调优 & Describer Debug            |
| 9.1 W6    | (lc_sql) 清 nebula 数据 + 尝试 upsert & 增加 update 功能              |
| 9.2       | (lc_sql) 修复转义 + 测试 & 本地全量测试 + prompt 调优                      |
| 9.3       | (lc_sql) prompt 调优 & rate limiter                            |
| 9.4       | (lc_sql) prompt 调优 & 请假                                      |
| 9.5       | (lc_sql) 多apikey & 多 apikey + 动态调节 + 例子文档                    |
| 9.8 W7    | (nk_practice) update bug 修复 & genrate bug 修复 + 类继承实现边        |
| 9.9       | (nk_practice) External Endpoint Parser + Transaction Parser & Cache Parser + Retry Parser |
| 9.10      | (nk_practice+党章) unifiedName + projectId & Debug + class-import-edge |
| 9.11      | (nk_practice+党章) class-import-edge 调试 & milvus 调试 + bug 修复   |
| 9.12      | (nk_practice) openaiinstance 并发优化 + 配置整理 & ai聚类准备            |
| 9.15 W8   | (小说 + nk_practice) ai 聚类                                     |
| 9.16      | (小说 + nk_practice)                                           |
| 9.17      | (nk_practice)                                                |
| 9.18      | (nk_practice) ai 聚类尝试                                        |
| 9.19      | fallback openai & async parser                               |
| 9.22 W9   | 请假 & async parser + nebula 查漏                                |
| 9.23      | (小说 ) 部署 & nebula 查漏 Debug                                   |
| 9.24      | (小说 ) 部署 & project from zip + permission + endpoint          |
| 9.25      | (nk_prac + source code) 部署事宜 & 运行                            |
| 9.26      | 部署Debug & 运行 + DEBUG                                         |
| 9.28 W10  | 讨论 AI 辅助提取 & lombok 尝试（失败）                                   |
| 9.29      | AI 提取 lombok 探索，提取多态探索 & unified parser                      |
| 9.30      | private_package_class_edge 悬挂 & config file parser 合并        |
| 10.9 W11  | （小说）调试部署 & 排查问题                                              |
| 10.10     | ClassVisitor 重构整理 & ClassFieldVisitor、MethodVisitor 重构整理     |
| 10.11     | 修复重构出现的问题 & staging 数据缺漏排查                                   |
| 10.13 W12 | station index creation & 请假                                  |
| 10.14     | station index debug & 拆分 edge describer                      |
| 10.15     | 整理staging bug & 加 project_module_edge + 组织图                  |
| 10.16     | java-callgraph & Compile                                     |
| 10.17     | decompile by cfr & decompile by Fernflower                   |
| 10.20 W13 | decompile + class fqn & 请假                                   |
| 10.21     | class fqn & decompile + Nebula 数据重建                          |
| 10.22     | Nebula 数据 Check & Demo 汇报                                    |
| 10.23     | decompile & interview                                        |
| 10.24     | java-callgraph2                                              |
| 10.27 W14 | 多态                                                           |
| 10.28     | 多态 + parent_child_class_edge + interface_class_edge          |
| 10.29     | 多态 + go + override method                                    |
| 10.30     | MethodCallExprVisitor & field_data_type_edge                 |
| 10.31     | 整理文档 & 内存泄漏 Debug                                            |
| 11.3 W15  | 离职申请 + override_method_edge debug & 请假                       |
| 11.4      | 离职交接会议 & inheritance edge + vid 计算错误 bug                     |
| 11.5      | 内存泄漏 bug & 离职文档补充                                            |
| 11.6      |                                                              |
| 11.7      | 离职                                                           |

## Difficulties
* spring cloud stream (kafka) 解析
* **Nebula 语句**
  * selectActiveTails
* **Ngbatis 冷门框架**
  * 文档
  * issue
  * 源码 + 逐句 Debug
  * 联系作者
* **beetl 转义语句**
  无法解决->换个思路
* **大模型限速**
  多个 API Key
  GO AWAY received(to much concurrent stream):  单个 http connection 限制
* Prompt 调优
* **nebula 数据**
  * 悬挂
  * 完整性校验
* **lombok**
  * 借助大模型
* 多态
* staging 环境不一致行为：考虑网络限制
* **fernflower 解析内部类**
  * IndexOutOfBoundException
* OutofMemoryError
## Results
* 动态调节，逼近极限，提速 xx%
* 重构解析逻辑为 visitor 模式，提速约 40%
## Hint
* 快速学习掌握新事物的能力
* 代码阅读能力
* try 之后加 catch
## Gain
* 多线程编程能力 JUC
* 设计模式代码能力
* Java 语法结构的认识
## W1
* Prepared necessary development environment (Cursor, Postman, Podman, etc.).
* Summarized AI fundamentals (Token, Transformer, LLM, etc.).
* Implemented an AI summarizer demo using Spring AI, Langchain4j, and Ollama.
## W2<!-- {"fold":true} -->
* Fixed Milvus and Nebula related docker-compose configurations, 100%.
* Mastered Milvus fundamentals by official documentation, 80%.
* Upgraded Spring AI dependencies from 1.0.0-M6 to 1.0.1, 100%.
* Integrated Milvus vector store into insight hub, 100%.
* Mastered Nebula and nGQL fundamentals by official documentation, 60%.
* Integrated Nebula Studio via Docker Compose, 100%.
## W3<!-- {"fold":true} -->
* Migrated database from Mysql to Nebula, 100%.
* Implemented concurrent code generation, 100%.
## W4
* Implemented the scheduler parser, 100%.
* Implemented the endpoint parser, 100%.
* Implemented the table parser, 100%.
* Implemented the mybatis parser, 100%.
* Improved the parsing pipeline and tested on Graph Station, 100%.
* Implemented the kafka parser, 30%.
## W5
* Implemented the kafka parser, 100%.
* Implemented the scheduler describer, 100%.
* Implemented the endpoint describer, 100%.
* Implemented the class field describer, 100%.
* Implemented the class describer, 100%.
* Implemented the package describer, 100%.
* Implemented the module describer, 100%.
* Implemented the edge describer, 100%.
## M1
* 内容解析
* 内容描述生成
* Nebula、Milvus 掌握
## W6
* Adjusted description generation prompts for better performance, 90%.
* Fixed the string escape problems during nebula insertion, 100%.
* Implemented the OpenAiManager supporting multiple ChatModel instances with different api-keys and dynamic rate limit, 100%.
## W7
* Implemented class extension inheritance, implementation, and import edges, 100%.
* Implemented External Endpoint, Transaction, Cache Rule, and Retry Rule Parser, 100%.
* Added unified name and project-id for all ai-described entities, 100%.
* Fixed several parsing bugs (e.g. nebula batch update ngql error), 100%.
* Group project by business logic using LLM, 20%.
## W8
* Explore AI-powered business domain extraction, 40%.
* Accumulate expertise in Prompt Engineering and Context Engineering principles, 80%.
* Implement a fallback codecompass chatModel (32k) to handle queries exceeding the context length limit of the compass-max model (8k), 100%.
* Develop a unified asynchronous manager to orchestrate all parser operations, 60%.
## W9
* Developed a unified asynchronous manager to orchestrate all parser operations, 100%.
* Validating the completeness of existing Nebula entities, 90%.
* Fixed discovered nebula related bug, 100%.
* Implemented support for extracting project source code from uploaded ZIP files, 100%.
* Generating AI descriptions for the entire DIMAP project, 95%.
* Debugging the staging environment, 60%.
## W10
* Resolved the private_package_class_edge dangling error, 100%.
* Merged configFileParser and configItemParser for improved code consolidation, 100%.
* Refactored parser architecture implementing a unified visitor pattern for better maintainability and performance, 100%.
* Exploring LLM integration in code parsing workflows, using Cursor as a case study, 100%.
## M2
* 完善解析的内容，完整性提升
* 异步解析框架
* 多实例动态调节
* AI 业务聚合探索
## W11
* Refactored VID calculation logic across class, class field, and method tags, 100%.
* Debugging and troubleshooting staging environment issues, 80%.
## W12
* Debugging and troubleshooting staging environment issues, 100%.
* Added project_module_edge, 100%.
* Compiled parsed projects to capture annotation-generated code (e.g., Lombok getters/setters) and ensure complete Maven dependency resolution for accurate code analysis.100%.
* Decompiled .class file by Fernflower, 50%.
## W13
* Added fqn field to class_tag, 100%.
* Compiled and decompiled parsed projects to avoid method resolution error, 100%.
* Researched approaches to capture polymorphism relationships in java-callgraph2, 60%.
## W14
* Implemented JavaCacheCollector to pre-parse Java files and collect essential information about class inheritance and Spring beans, 100%.
* Refactored parent_child_class_edge, interface_class_edge, and override_method_edge using pre-collected class inheritance information, 100%.
* Enhanced field type inference by applying Spring Bean injection rules during class field parsing, 100%.
* Leveraged inferred field types to improve accuracy of call_method_edge and field_data_type_edge, 100%.
## W15
* Fixed bugs related to dynamic polymorphism, 100%
* Completed work handover, 100%
* Generated AI descriptions for new version of Nebula data, 100%
## M3
* Staging 环境调试
* 重构若干点、边类型的解析方法，提升效率
* 编译 / 反编译解决 lombok + 依赖
* Spring Bean 解决多态

## OutOfMemory
```bash
java.util.concurrent.ExecutionException: java.lang.OutOfMemoryError: Java heap space
        at java.base/java.util.concurrent.FutureTask.report(FutureTask.java:122)
        at java.base/java.util.concurrent.FutureTask.get(FutureTask.java:191)
        at org.apache.coyote.AbstractProtocol.startAsyncTimeout(AbstractProtocol.java:658)
        at java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:539)
        at java.base/java.util.concurrent.FutureTask.runAndReset(FutureTask.java:305)
        at java.base/java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:305)
        at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
        at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)
        at java.base/java.lang.Thread.run(Thread.java:840)
Caused by: java.lang.OutOfMemoryError: Java heap space
```
### 获取 pid
```bash
jps -l 
```
```bash
69794 jdk.jcmd/sun.tools.jps.Jps
29239 /Users/hongpeng.lin/.cursor/extensions/vmware.vscode-spring-boot-1.64.1-universal/language-server/spring-boot-language-server-1.64.1-SNAPSHOT-exec.jar
39913 com.shopee.dimap.insighthub.insighthub.InsighthubApplication
29161 /Users/hongpeng.lin/.cursor/extensions/redhat.java-1.47.0-darwin-arm64/server/plugins/org.eclipse.equinox.launcher_1.7.100.v20251014-1222.jar
```
### 创建 dump
```bash
jmap -dump:format=b,file=heapdump.hprof 39913
```
```bash
Dumping heap to /Users/hongpeng.lin/Project/project_map/heapdump.hprof ...
Heap dump file created [6790087677 bytes in 21.528 secs]
```
### Eclipse Memory Analyzer (MAT) 分析
MAT 本身报 Java Heap Space：调整 MemoryAnalyzer.ini
```
-startup
../Eclipse/plugins/org.eclipse.equinox.launcher_1.6.900.v20240613-2009.jar
--launcher.library
../Eclipse/plugins/org.eclipse.equinox.launcher.cocoa.macosx.aarch64_1.2.1100.v20240722-2106
-vmargs
--add-exports=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
-Xmx10g
-Dorg.eclipse.swt.internal.carbon.smallFonts
-XstartOnFirstThread
```
### 归因
ClassOrInterfaceDeclaration 过于
## 交接
### 源码解析
入口：NebulaController 的 insert 方法( /nebula/insert/project 接口)
#### Maven 构建（Optional）
获取.class 文件 + 项目依赖
关键代码：ProjectServiceImpl::buildProject
#### Fernflower 反编译（Optional）
将 .class 文件反编译为 .java 文件
关键代码：ProjectServiceImpl::decompileProject
#### 源码解析
入口：GraphServiceImpl 的 insertProject 方法
* 配置文件解析 ConfigFileParser
* Maven 模块解析 PomModuleParser
* Mybatis XML解析 MyBatisXMLFileParser
* **Java 文件解析**
  * ParsingContext
  * JavaCacheCollector
  * JavaFileParser
  解析过程：
1. JavaCacheCollector 预先收集 Spring Bean 列表，类继承关系等信息存储于 ParsingContext
2. JavaFileParser 以 Visitor 模式遍历 CompilationUnit 及其后代，借助各种 Visitor 执行解析逻辑，建立点 / 边

### 注释生成
入口：AgentTestController 的 generateDoc 方法( /api/test/generate  接口)
由一系列 Describer 执行：
从 Nebula 批量选取 Vertex / Edge → LLM 为 Vertex / Edge 生成注释 → 写回 Nebula
Describer 顺序：
Method->ClassField->Class->Package->Module->(Scheduler/Endpoint)->Edge

### 遗留问题
**待优化事项**
无法解析：
* 范型
* 链式调用（Stream API 等）
* 动态绑定（目前只考虑 Spring Bean）

