---
title: 【Log】Baidu Intern Log
date: 2025-09-30 00:00:00+0000
categories: 
    - snow
draft: true
---
# Shopee Intern Log
| Date     | Log                                                          |
|----------|--------------------------------------------------------------|
| 7.30 W1  | 入职 & 软件                                                      |
| 7.31     | AI & 理解SM2 & m                                               |
| 8.1      | AI (springAI + Ollama) & Cursor Config & Kona                |
| 8.4 W2   | MCP & Hub & Kona                                             |
| 8.5      | Kona[commit] & Hub(docker-compose)                           |
| 8.6      | GIT[fix compose config] & Milvus & Kona                      |
| 8.7      | Kona & Milvus for IH                                         |
| 8.8      | Kona Merged & Milvus[调通] & nebula-studio                     |
| 8.11 W3  | 分工 开会【insighthub】代码生成 论文修改                                   |
| 8.12     | 代码生成 论文图 mysql迁移 分支合并                                        |
| 8.13     | 代码生成测试 论文图 论文修改提交                                            |
| 8.14     | 入职培训 & nebula 语句                                             |
| 8.15     | prompt 调优 & 并行逻辑优化                                           |
| 8.18 W4  | scheduler & endpoint & table                                 |
| 8.19     | mybatis xml + annotation                                     |
| 8.20     | BatchEdgeInsert 优化                                           |
| 8.21     | Parser 代码整合 & 测试 & Spring Cloud Stream                       |
| 8.22     | 代码重构 + 悬挂边 debug &  Kafka StreamBean                         |
| 8.25 W5  | Stream(Bean/Bridge) Parser & Unified Batch Edge Insert + Unified Batch Edge Insert + 长时间 Debug |
| 8.26     | 合并代码 + 重构 Describer & 悬挂边 Debug + Vertex Describer           |
| 8.27     | 添加 ai_short_desc + 重构 Describable 体系                         |
| 8.28     | Class/Class Field Describer & NgVertex 为空调试 + Edge Describer |
| 8.29     | (lc_sql) 切换 compass + prompt 调优 & Describer Debug            |
| 9.1 W6   | (lc_sql) 清 nebula 数据 + 尝试 upsert & 增加 update 功能              |
| 9.2      | (lc_sql) 修复转义 + 测试 & 本地全量测试 + prompt 调优                      |
| 9.3      | (lc_sql) prompt 调优 & rate limiter                            |
| 9.4      | (lc_sql) prompt 调优 & 请假                                      |
| 9.5      | (lc_sql) 多apikey & 多 apikey + 动态调节 + 例子文档                    |
| 9.8 W7   | (nk_practice) update bug 修复 & genrate bug 修复 + 类继承实现边        |
| 9.9      | (nk_practice) External Endpoint Parser + Transaction Parser & Cache Parser + Retry Parser |
| 9.10     | (nk_practice+党章) unifiedName + projectId & Debug + class-import-edge |
| 9.11     | (nk_practice+党章) class-import-edge 调试 & milvus 调试 + bug 修复   |
| 9.12     | (nk_practice) openaiinstance 并发优化 + 配置整理 & ai聚类准备            |
| 9.15 W8  | (小说 + nk_practice) ai 聚类                                     |
| 9.16     | (小说 + nk_practice)                                           |
| 9.17     | (nk_practice)                                                |
| 9.18     | (nk_practice) ai 聚类尝试                                        |
| 9.19     | fallback openai & async parser                               |
| 9.22 W9  | 请假 & async parser + nebula 查漏                                |
| 9.23     | (小说 ) 部署 & nebula 查漏 Debug                                   |
| 9.24     | (小说 ) 部署 & project from zip + permission + endpoint          |
| 9.25     | (nk_prac + source code) 部署事宜 & 运行                            |
| 9.26     | 部署Debug & 运行 + DEBUG                                         |
| 9.28 W10 | 讨论 AI 辅助提取 & lombok 尝试（失败）                                   |
| 9.29     | AI 提取 lombok 探索，提取多态探索 & unified parser                      |
| 9.30     | private_package_class_edge 悬挂 & config file parser 合并        |
| 10.9 W11 |                                                              |

## Difficulties
* spring cloud stream (kafka) 解析
* Nebula 语句
  * selectActiveTails
* Ngbatis 冷门框架
  * 文档
  * issue
  * 源码 + 逐句 Debug
  * 联系作者
* beetl 转义语句
  无法解决->换个思路
* 大模型限速
  多个 API Token
  GO AWAY received(to much concurrent stream):  单个 http connection 限制
* Prompt 调优
* nebula 数据
  * 悬挂
  * 完整性校验
* lombok
  * 借助大模型
* 多态
## Results
* 动态调节，逼近极限，提速 xx%
* 重构解析逻辑为 visitor 模式，提速约 40%
## Hint
* 快速学习掌握新事物的能力
* 代码阅读能力
## Gain
* 多线程编程能力 JUC
* 设计模式代码能力
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
* Fixed private_package_class_edge dangling error, 100%.
* refactored parsers by unified visitor pattern, 100%.
* merged configFileParser and configItemParser, 100%.
## M2
* 完善解析的内容，完整性提升
* 异步解析框架
* 多实例动态调节
* AI 业务聚合探索
## W11
* 
## M3

Wang Ke <ke.wang@shopee.com> 
Runsong Wu <runsong.wu@shopee.com>,<br>brian wang <brian.wang@shopee.com>,<br>Yunzhong Wang <yunzhong.wang@shopee.com>,<br>Yang Zoc <zoc.yang@shopee.com>,<br>Xiaoxu Wu <xiaoxu.wu@shopee.com> 


```
tail -n 100 log/daemon.log
```