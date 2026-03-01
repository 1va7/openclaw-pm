# Changelog

## [2.0.0] - 2026-03-01

### V2 重大更新

V2 在 V1 基础上增加了任务管理、Session 隔离、自动恢复等核心能力。

#### 新增功能

##### 1. 复杂任务管理（Claude Code 模式）
- 强制要求先写计划文件（`temp/任务名-plan.md`）
- 每完成一步更新计划文件
- Context 压缩时依赖文件而非记忆
- 完成后汇报 + 清理

**解决的问题**：复杂任务中途丢失状态、无法追踪任务进度、Session 重启后不知道做到哪了。

##### 2. 任务记录规则
- 收到任务立即记录到 `memory/YYYY-MM-DD.md`
- 记录状态、进度、上次汇报时间
- 完成时更新状态

**解决的问题**：Heartbeat 检查时才能发现有任务在进行中。

##### 3. Session 隔离规则
- 每次回复前检查 `inbound_meta`
- 只基于当前 session 的聊天记录
- 禁止跨 session 查找 context
- 禁止假设 context

**解决的问题**：防止把私人信息发到群聊，或把群聊信息发到 DM（严重的隐私事故）。

##### 4. GatewayRestart 强制行为
- 立即汇报重启原因
- 检查恢复文件（`temp/recovery-*.json`）
- 检查任务状态
- 检查所有 session 的最后一条消息
- 继续推进任务
- 不要静默

**解决的问题**：重启后静默，用户不知道发生了什么；未完成的任务被遗忘；未回复的消息没有 follow up。

##### 5. 任务执行前检查
- STOP：不要立刻回复
- SEARCH：搜索 workspace 中的相关文件
- RECORD：立即记录到 memory
- PLAN：复杂任务写计划文件
- THEN ACT：找到 context 后再执行

**解决的问题**：用户让你做一件事，说明你已经有这件事的 context。不要每次都问用户要 context。

##### 6. 主动 Interview
- 需求模糊时必须先 interview
- 用选择题而非开放题
- 最多 2 轮 interview
- 2 轮后必须开始执行

**解决的问题**：需求模糊时埋头苦干，做出来不是用户想要的；开放式问题让用户难以回答。

##### 7. 并行执行
- 独立任务必须并行
- 多个不相关的 tool call 同时发出
- 多个独立的 sub-agent 任务同时 spawn

**解决的问题**：串行执行独立任务 = 浪费时间。

##### 8. Checkpoint 机制
- 复杂任务每完成一个 Phase 就 git commit
- 计划文件 + git checkpoint = 完整的任务状态

**解决的问题**：Session 崩溃时能从 git 历史恢复。

#### 外挂系统（可选）

新增一套外部健康检查系统：
- `gateway-health-check.sh` — 自动检查和恢复 Gateway
- `check-unanswered.sh` — 检测未回复的消息
- `heartbeat-check.sh` — 统一执行 HEARTBEAT.md 检查
- `check-missed-crons.sh` — 检查 cron 任务执行状态
- `quick-diagnose.sh` — 一键诊断常见问题
- `morning-briefing.sh` — 晨间简报
- `daily-stats.sh` — 每日活动统计

#### 文档更新

- 新增 `config/V2-升级指南.md` — 详细的 V2 升级说明
- 更新 `README.md` — 增加 V2 vs V1 对比表
- 新增 `CHANGELOG.md` — 版本变更记录

### 破坏性变更

无。V2 是在 V1 基础上的增量更新，完全向后兼容。

---

## [1.0.0] - 2024-02-08

### V1 初始版本

提供 3 个核心能力增强：

#### 1. 主动性增强
- Heartbeat 机制优化
- 主动检查项目进度
- 智能汇报时机

#### 2. 可重入性增强
- Session 重启恢复检查
- Memory Flush Protocol
- 上下文管理优化

#### 3. Agential Thinking
- 任务执行优先级
- API > CLI > Skill > 浏览器
- 效率最大化

---

## 版本对比

| 维度 | V1 | V2 |
|------|-----|-----|
| 任务管理 | 简单记录 | 计划文件 + Checkpoint |
| Session 隔离 | 无 | 强制隔离规则 |
| 重启恢复 | 检查待办 | 强制汇报 + 检查所有 session |
| 需求澄清 | 无 | 主动 Interview |
| 执行效率 | 串行 | 并行执行 |
| 外部监控 | 无 | 完整的健康检查系统 |
| 人格 | 基础 | 称呼规范 + 不做墙头草 |

---

## 本质性思考

### 为什么需要这些调教？

**根本问题**：LLM 是无状态的，每次对话都是"新生"。

**官方设定的假设**：
- 用户会主动管理 agent
- Session 不会中断
- 任务都是简单的

**现实情况**：
- 用户希望 agent 自主运行
- Gateway 会重启、崩溃
- 任务可能很复杂，跨越多个 session

### V1 解决了什么？

**核心洞察**：Agent 需要"记忆外化"。

- Memory Flush Protocol → 把记忆写到文件
- 待办检查 → 把任务状态写到文件
- 任务优先级 → 把执行策略写到文件

**本质**：用文件系统弥补 LLM 的无状态缺陷。

### V2 解决了什么？

**核心洞察**：Agent 需要"自我监控"。

- 健康检查脚本 → 外部监控 agent 状态
- Session 隔离 → 防止跨 session 混淆
- 强制汇报 → 确保用户知道发生了什么

**本质**：用外挂系统弥补 agent 的"自我意识"缺陷。

### 下一步可能的方向

| 方向 | 描述 |
|------|------|
| 自我优化 | Agent 分析自己的行为，自动改进 AGENTS.md |
| 多 Agent 协作 | 更好的 agent 间通信和任务分配 |
| 知识积累 | 从历史 session 中提取 patterns |
| 预测性行动 | 基于历史预测用户需求 |
