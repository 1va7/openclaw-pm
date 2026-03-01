# @1va7/openclaw-pm

OpenClaw 项目经理配置升级工具 - 让你的 AI Agent 成为优秀的项目经理。

## 版本说明

### V2 (当前版本)

V2 在 V1 基础上增加了任务管理、Session 隔离、自动恢复等核心能力。

**V2 新增功能：**
- 🔴 复杂任务管理（计划文件 + Checkpoint）
- 🔒 Session 隔离规则（防止跨 session 混淆）
- 🔄 GatewayRestart 强制恢复行为
- 🎤 主动 Interview（需求澄清）
- ⚡ 并行执行优化
- 🔖 Checkpoint 机制

### V1

V1 提供了 3 个核心能力增强：
- 主动性增强（Heartbeat 机制）
- 可重入性增强（Memory Flush Protocol）
- Agential Thinking（任务执行优先级）

## 使用方法

```bash
# 安装 V2 配置
npx @1va7/openclaw-pm
```

运行后，工具会：
1. 如果检测到 OpenClaw workspace，自动保存配置文件
2. 如果没有检测到，输出配置内容供你复制

## V2 vs V1 核心差异

| 维度 | V1 | V2 |
|------|-----|-----|
| 任务管理 | 简单记录 | 计划文件 + Checkpoint |
| Session 隔离 | 无 | 强制隔离规则 |
| 重启恢复 | 检查待办 | 强制汇报 + 检查所有 session |
| 需求澄清 | 无 | 主动 Interview |
| 执行效率 | 串行 | 并行执行 |
| 外部监控 | 无 | 完整的健康检查系统 |

## 升级内容详解

### V1 核心能力

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

### V2 新增能力

#### 1. 复杂任务管理（Claude Code 模式）
- 强制要求先写计划文件（`temp/任务名-plan.md`）
- 每完成一步更新计划文件
- Context 压缩时依赖文件而非记忆
- 完成后汇报 + 清理

**为什么重要**：复杂任务跨越多个 session 时，计划文件是唯一可靠的状态记录。

#### 2. 任务记录规则
- 收到任务立即记录到 `memory/YYYY-MM-DD.md`
- 记录状态、进度、上次汇报时间
- 完成时更新状态

**为什么重要**：Heartbeat 检查时才能发现有任务在进行中。

#### 3. Session 隔离规则
- 每次回复前检查 `inbound_meta`
- 只基于当前 session 的聊天记录
- 禁止跨 session 查找 context
- 禁止假设 context

**为什么重要**：防止把私人信息发到群聊，或把群聊信息发到 DM。

#### 4. GatewayRestart 强制行为
- 立即汇报重启原因
- 检查恢复文件（`temp/recovery-*.json`）
- 检查任务状态
- 检查所有 session 的最后一条消息
- 继续推进任务
- 不要静默

**为什么重要**：重启后不能静默，必须恢复所有未完成的工作。

#### 5. 任务执行前检查
- STOP：不要立刻回复
- SEARCH：搜索 workspace 中的相关文件
- RECORD：立即记录到 memory
- PLAN：复杂任务写计划文件
- THEN ACT：找到 context 后再执行

**为什么重要**：用户让你做一件事，说明你已经有这件事的 context。

#### 6. 主动 Interview
- 需求模糊时必须先 interview
- 用选择题而非开放题
- 最多 2 轮 interview
- 2 轮后必须开始执行

**为什么重要**：需求模糊时埋头苦干，做出来不是用户想要的。

#### 7. 并行执行
- 独立任务必须并行
- 多个不相关的 tool call 同时发出
- 多个独立的 sub-agent 任务同时 spawn

**为什么重要**：串行执行独立任务 = 浪费时间。

#### 8. Checkpoint 机制
- 复杂任务每完成一个 Phase 就 git commit
- 计划文件 + git checkpoint = 完整的任务状态

**为什么重要**：Session 崩溃时能从 git 历史恢复。

## 外挂系统（可选）

V2 还包含一套外部健康检查系统，需要单独安装：

- `gateway-health-check.sh` — 自动检查和恢复 Gateway
- `check-unanswered.sh` — 检测未回复的消息
- `heartbeat-check.sh` — 统一执行 HEARTBEAT.md 检查
- `check-missed-crons.sh` — 检查 cron 任务执行状态
- `quick-diagnose.sh` — 一键诊断常见问题
- `morning-briefing.sh` — 晨间简报
- `daily-stats.sh` — 每日活动统计

详细安装说明请参考 `config/V2-升级指南.md`。

## 关于

来自 VA7 的 OpenClaw 调教经验分享。

**为什么需要这些调教？**

LLM 是无状态的，每次对话都是"新生"。官方设定假设：
- 用户会主动管理 agent
- Session 不会中断
- 任务都是简单的

现实情况：
- 用户希望 agent 自主运行
- Gateway 会重启、崩溃
- 任务可能很复杂，跨越多个 session

**V1 解决了什么？**

核心洞察：Agent 需要"记忆外化"。
- Memory Flush Protocol → 把记忆写到文件
- 待办检查 → 把任务状态写到文件
- 任务优先级 → 把执行策略写到文件

**V2 解决了什么？**

核心洞察：Agent 需要"自我监控"。
- 健康检查脚本 → 外部监控 agent 状态
- Session 隔离 → 防止跨 session 混淆
- 强制汇报 → 确保用户知道发生了什么

## 更多内容

- 小红书：VA7
- GitHub: https://github.com/1va7/openclaw-pm
- 详细对比报告：`config/V2-升级指南.md`
