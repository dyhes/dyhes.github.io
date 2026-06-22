---
title: 【ByteDance】AI Coding
date: 2026-05-27 00:00:00+0000
categories:  [stone]
tags:
    - AI
---

## Codex Context Compact

- Codex 的压缩分为 Local 和 Remote 两条路，只有官方订阅才走 Remote Compact
- 实验对比：复杂长程任务上 Remote Compact 约 94 分，Local 仅约 28 分——差距是碾压级的
- Prompt injection 套出的服务端提示词和 Local 几乎一样，但效果差这么远，服务端也许在黑盒里做了远超Handoff 提示词的操作
- 💬 背后更大的趋势：模型与 Harness 深度耦合，原厂 Agent 的护城河越来越深
- ⭐ 实用建议
  - 使用中转站 -> 走 Local Compact = 残血模型，因此：尽量使用官方订阅
  - 最好直接在 Codex 登录账号而不是接入 sub2api / cliproxyapi 等自建反代


在 2025 年年初 AI Coding 有一条社区广泛流传的最佳实践：尽量避免自动压缩，当上下文窗口用尽之前，在恰当的时机手动执行压缩，或者让 Agent 出一份 handoff 文档然后新开一个会话继续工作。但是最近社区开始逐渐转向了："放心让 Codex 自动压缩，压上几十次也基本不降智不跑偏"。

很多人以为 Codex 的上下文管理就等于"快满了就 compact 一下"。但追查源码会发现，在走到全量压缩之前，有好几道关卡在默默控制上下文增长。

做了什么
| 策略 | 说明 |
|------|------|
| 工具输出截断 | 每项工具结果进入历史时即被 middle-truncation（保留头尾，切掉中间）默认 ~10KB tokens，+20% 序列化余量 |
| PTY 头尾缓冲 | exec 命令的原始 PTY 输出只保留头部和尾部各一半，总计 1 MiB |
| Hook 外置 | 超限的 hook 结果写到临时文件，模型只看到预览 + 文件路径 |
| 历史清洗 | 修复 call/output 配对、移除孤儿输出、剥离不支持的图片 |
| 上下文差分 | 只追加与上一轮的设置差异，不重复注入全部系统上下文 |

这些卡口的共同特点是：截掉就没了——不像后面会讲到的 Claude Code 的"外置到 sidecar 文件"策略，Codex 的入口截断是不可逆的。但好处是简单高效，大多数情况下这些截断足以控制上下文增长速度。
而且这些"关卡"还有一个隐藏的优势：截断发生在内容进入历史的那一刻——也就是被 prompt cache 记住之前——所以它们不会破坏已有的缓存命中。
当这些都不够时，就到上下文压缩了。

### Local Compact：让模型自己写交接摘要
Local Compact 的机制很朴素——它就是让当前模型写一份 handoff summary。
核心流程（codex-rs/core/src/compact.rs）：
1. 把一段压缩提示词（prompt.md）作为 user input 追加到历史中
2. 用普通的 ModelClientSession::stream() 发起模型请求
3. 如果超出上下文窗口，从最旧的 item 开始删，然后重试
4. 请求完成后，取最后一条 assistant message 作为 summary
5. 在 summary 前面拼上一段交接提示词（summary_prefix.md）
6. 收集历史中的真实 user messages（最多保留约 20K token）
7. 用 summary + 最近 user messages 构造新的 replacement_history，替换旧历史
8. 发送一条 warning："Heads up: Long threads and multiple compactions can cause the model to be less accurate."

### Remote Compact V1：服务端专用端点与 opaque state
Remote V1 的机制完全不同（codex-rs/core/src/compact_remote.rs）：
1. clone 当前 history
2. 如果超过上下文窗口，从尾部删除 Codex 生成的 item（注意：方向跟 Local 相反！）
3. 构造完整的 Prompt，包括 input、tools、instructions、reasoning 控制等
4. 调用 compact_conversation_history()，最终发送 POST 请求到 /v1/responses/compact 一个专用 endpoint 
5. 服务端返回 Vec<ResponseItem>
6. 客户端做后过滤：丢掉 stale developer messages、raw tool output、reasoning、web search 等，只保留真实 user messages 和 Compaction { encrypted_content } item
7. CompactedItem.message 设为空字符串——摘要在 encrypted blob 里，不再是明文
注意这里的 Compaction { encrypted_content } —— 这是一段客户端完全无法解读的加密 payload。它不是给人读的摘要，而是一段 opaque 的服务端状态，会在后续请求中继续携带。

### Codex 的三个触发时机
Codex 的自动 compact 编排在 session/turn.rs，有三个触发时机：
| 触发路径 | 时机 | 条件 | 初始上下文处理 |
|----------|------|------|----------------|
| Pre-turn | 模型采样前 | token limit reached | DoNotInject——清空 baseline，下一轮完整 reinject |
| Model-downshift | 切换到更小窗口的模型 | 当前 tokens 超出新窗口 | 同上 |
| Mid-turn | 模型输出后仍需 follow-up | token limit reached 且需要继续 | BeforeLastUserMessage——注入到 replacement history 中 |

其中 mid-turn compact 是一个值得注意的设计：模型在执行一个任务时可能需要多次工具调用（follow-up），如果中途超限了，Codex 不会终止任务，而是在 turn 内部做一次压缩然后继续。这保证了任务的连续性。

> "The harness becomes the product, not the model. The model is the engine; the harness is the car. Customers buy the car."
“工具本身成为了产品，而非模型。模型是引擎，工具是汽车。客户购买的是汽车。”
From https://www.uncoveralpha.com/p/the-harness-the-moat-for-ai-model


## Vibe Coding

- Spec Coding 在 2026 年之前确实有价值，它比 Vibe Coding 强得多。
- 但它不是银弹，完整需求很难靠一条大链路一次跑通，后面沿着一份不稳的骨架持续修补，很快就会退化成另一种 Vibe Coding
- 我现在更常用的流程，不是直接一键生成整套 Spec 一键开工，而是先和 AI 共读 PRD，做细致的任务拆解、技术方案评审，然后子需求 worktree 并发 brainstorm & plan mode，最后执行和验收。
- Plan Mode 本质非常简单。它更好用更多是因为交互更顺手，更适合终端分屏、语音 Voice Coding 以及并行多任务推进。
- 如果你觉得 Plan Mode 效果不好，要么是需求拆得不够细，要么可能是你没使用 SOTA 模型。
- 对 Agent 来说，过时文档是毒药。代码通常比历史 Spec 文档更接近真相源。

随着模型能力越来越强，有些几个月前还很流行的做法，到了今天已经该重新看一遍了。AI Coding 的最佳实践变得很快。几个月前还是主流的方法，放到今天，可能就已经开始显得笨重。

这时候，原来那些为了约束模型而设计出来的重框架，收益就开始下降了，甚至会负向。文档约束、格式约束、流程约束还在，但模型能力已经不是当时那个水平了。结果就是，很多额外成本留了下来，原来的收益却没那么大了。模型为了遵循这些条条框框，吭哧吭哧写了一大堆文档，反而分散了在原始需求上的注意力，效果变差。

而且这些额外成本不是抽象的。它会表现成更长的生成时间，更长的文档，更重的阅读负担，更多的切换，更高的 Token 消耗。你在一天里高频做这件事，体感会非常明显，你的脑子 🧠 远远跟不上 AI 产出的大量文档。

SDD (Spec-Driven Development) 不是魔法。你不能指望丢进去一个完整的产品需求，然后出一套 proposal / spec / design / tasks 等看似很厉害，实则各种车轱辘话的文档，再一路往下跑，不断反复澄清各个地方，最后把需求交付出来。

PRD 很多时候不可能写得尽善尽美，简陋的 PRD 才是常态，甚至有些需求点非常模糊不清。我们可以跟 Agent 一起去研究 PRD 并结合代码库和飞书文档知识库获取更多的上下文信息，跟 Agent 一起脑暴、让 Agent 写出一个更完善的 PRD。
在这个过程中，Agent 会针对产品层面问你非常多的问题。此时可以先一边聊着，拍脑袋下临时决策，同时让 Agent 总结整理一份需求澄清明细表，生成一个文档甚至多维表格，然后找 PM 一起把需求聊透，敲定尽可能多的边界、细节问题。

先和 AI 共读 PRD，把完整需求吃透；然后做任务拆解；拆完以后，不是立刻施工，而是进行传统的技术方案评审，跟大家一起对方案进行把关；把方案确定以后，再切成多个可以独立推进的子需求；从这里开始，才进入 brainstorm、Plan 和执行。

拆完以后，我其实不太愿意再为每个子需求跑一整套 Spec Coding。

原因很简单。如果子需求还没拆清楚，那这套 Spec Coding 流程救不了你。
如果子需求已经拆清楚了，再去给每个点都补一整套 proposal/spec/design/tasks，属实太多余了。

我现在更看重的是 brainstorm。也就是，针对每个子需求，先把它聊透。这里的“聊透”不是一句空话，而是一个多轮发散再收敛的过程。

通常是我先把当前理解、背景、限制条件、担心点说出来，Agent 再顺着这些信息继续发问、继续摸边界、继续扩展可能的方案。然后我再根据它追问出来的新问题，补更多细节。它拿到新细节后，再继续发散。

这个过程会一轮一轮往前走，直到问题开始收敛。我觉得 brainstorm 真正值钱的地方，不是它替你写文档，而是它会逼着你把很多原来没意识到的点说出来。

Plan 的信息密度明显更高，而且它天然适合在终端里读。你从上往下看一遍，通常就知道这件事怎么做、哪里有风险、哪里要改。读完以后，你可以直接在同一条交互链里反馈、重出、开工。你可以不用跳出终端就能完成大部分的工作。

而重型 Spec 的问题不只是“文档更多”。它更大的问题是，信息被切碎了。

你得在 proposal、design、spec、tasks 这些文档中间来回切。主线被拆开了，很多信息需要你自己重新拼起来。终端里读不够自然，切去 IDE 或别的窗格又会打断当前节奏。

代码一直在迭代，历史 Spec 往往不会同步更新。过了一年，你再让模型去读一年前的执行文档，这些内容更可能是噪声和误导，而不是帮助。

这也是为什么我越来越不建议把大量历史 Spec 常驻在代码仓库里。它们或许更适合被放在知识库、放在飞书文档里，给人查历史；而不是留在 repo 里，持续污染 Agent 的上下文。

很多人会天然觉得“文档越多越好”，但这套逻辑放在 Agent 身上并不成立。

Agent 不是在做组织知识管理。它是在当前任务里找最有用、最相关、最新的上下文。只要你仓库里长期堆着一堆已经失效、但又看起来很像真的文档，它迟早会被这些东西干扰。

这个判断不只适用于 Spec。.cursorrules、CLAUDE.md、AGENTS.md 这类文件也一样，不是越长越好。只要它不能持续更新，对模型来说就是干扰。

任何能从代码库里推导出来的知识、一键"自动生成"的知识，对 Agent 都是噪声。