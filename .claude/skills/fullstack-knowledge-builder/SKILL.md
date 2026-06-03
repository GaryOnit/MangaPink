---
name: fullstack-knowledge-builder
version: "1.0.0"
description: "为全栈项目建设并持续运营 AI 可用的结构化知识库（docs/ + AGENTS.md）。支持前端、后端、全栈多种技术栈自动识别，学城/ONES 信息可选（从零新项目可跳过）。触发词：建知识库、建库、生成仓库文档、梳理仓库、从零建文档、建 docs 目录、生成 AGENTS.md、建设知识库、项目知识库、代码仓库文档化、仓库文档体系、rule-init、规则初始化、规则体系对齐、rule-check、规则检查、doc-check、知识库文档质量检查、struct-check、代码目录结构检查、踩坑沉淀、知识沉淀、知识库召回率、更新知识库、知识库运营。不用于：单个功能文档编写、代码注释生成、API 文档自动生成（Swagger/JavaDoc）。"

metadata:
  skillhub.creator: "megumi"
  skillhub.updater: "megumi"
  skillhub.version: "V1"
  skillhub.source: "local"
  skillhub.skill_id: "local-002"
  skillhub.high_sensitive: "false"
---

IRON LAW: MUST 先完整扫描代码目录结构再动笔，NEVER 凭记忆臆测文件清单——遗漏会导致知识库出现盲区，影响所有后续 AI 编码质量。

## 意图路由

收到请求后，先判断意图再执行对应阶段：

| 用户说... | 执行 |
|----------|------|
| 建库/从零建文档/首次建库 | → 阶段 0～5（建库全流程） |
| rule-init / 规则初始化 / 规则对齐 | → 阶段 6A |
| 踩坑沉淀 / 知识沉淀 / 用户纠偏信号 | → 阶段 6B（自动触发） |
| 知识库召回率 / 哪些文档没被用到 | → 阶段 6C |
| 增量更新知识库 / 新增模块 | → 阶段 6D |
| rule-check / 规则检查 | → 阶段 6E |
| doc-check / 知识库文档质量 | → 阶段 6F |
| struct-check / 代码目录结构检查 | → 阶段 6G |

---

## 建库全流程（阶段 0～5）

### 阶段 0：依赖工具检查

**入口条件**：收到建库请求

⚠️ REQUIRED — 确认以下工具可用：
- `nvm use 18` — citadel/ONES CLI 依赖 Node ≥18（Node 14 会报 `fetch is not defined`）
- `oa-skills citadel getMarkdown` — 读取学城文档
- `ones filter-issues` — 读取 ONES 工作项

**出口条件**：Node 版本确认为 18+，或记录"无学城/ONES文档"后继续

---

### 阶段 0.5：收集并解析信息范围定义文档

**入口条件**：阶段 0 通过

> 💡 **从零新项目 vs 已有项目**：
> - 已有项目：强烈建议提供学城/ONES 信息，知识库质量更高
> - 从零新项目（代码刚生成，无历史文档）：可跳过学城/ONES，直接基于代码建库

**Step 0.5.1** 向用户询问信息范围（非强制阻塞）：

```
请问本项目是否有以下信息来源？（有则提供，没有可跳过）

  ① 学城文档目录（需求/设计文档）
    → 有：请提供学城链接
    → 没有 / 从零新项目：跳过，标注 [未收录]

  ② ONES 工作项（spaceId）
    → 有：请提供 spaceId
    → 没有：跳过，标注 [未收录]

  ③ 代码仓库路径（必填）
    → 请提供本地路径，例如 /Users/me/projects/my-app

  ④ 其他补充信息（可选）
    → 技术规范文档、API 文档、README 等
```

⛔ BLOCKING（仅对已有信息）— 用户提供了链接但无法访问时，MUST 暂停，列清单询问处理方式（A 替代链接 / B 文本内容 / C 跳过标注"[未收录]"）

**Step 0.5.2** 解析并构建「检索清单」，逐条验证可访问性（仅验证用户提供的条目）

**Step 0.5.3** 将验证后的检索清单写入 `docs/README.md` 的「可检索信息范围」章节（每行标注 ✅/❌/[未收录]）

**出口条件**：已确认用户能提供哪些信息源，检索清单已构建，无悬空未处理项（用户明确跳过的视为已处理）

---

### 阶段 1：仓库结构探索

**入口条件**：阶段 0.5 通过

⚠️ REQUIRED — 按顺序执行：

**Step 1.1** `list_dir` 扫描顶层目录 + 每个子模块的 src/ 目录树（至少2层深）

**Step 1.2** 自动识别技术栈类型，并执行对应统计命令：

> 🔍 识别规则：先检查根目录文件（`package.json` / `build.gradle` / `pom.xml` / `requirements.txt` / `go.mod` / `Cargo.toml`），再检查 src/ 下主要文件后缀，综合判断。

```
IF 存在 package.json 且 src/ 含 .ts/.tsx/.jsx → 前端（TypeScript/React/Vue）
  统计命令：
    find <repo>/src -name "*.ts" -o -name "*.tsx" | grep -v __tests__ | wc -l
    find <repo>/src -name "*.vue" | wc -l
    find <repo>/src/pages -name "*.tsx" 2>/dev/null | sort  # Next.js 路由层
    find <repo>/src/components -maxdepth 2 2>/dev/null | sort  # 组件层

ELIF 存在 package.json 且 src/ 主要含 .js → Node.js 后端
  统计命令：
    find <repo>/src -name "*.js" -o -name "*.ts" | grep -v node_modules | wc -l
    find <repo>/src -name "*Controller*" -o -name "*Router*" -o -name "*Route*" | sort
    find <repo>/src -name "*Service*" | sort

ELIF 存在 build.gradle 或 pom.xml → Java 后端（Spring/Maven）
  统计命令：
    find <repo>/src/main/java -name "*.java" | wc -l
    find <repo>/src/main/java -name "*Service.java" | sort
    find <repo>/src/main/java -name "*Controller.java" | sort

ELIF 存在 requirements.txt 或 setup.py 或 pyproject.toml → Python 后端
  统计命令：
    find <repo> -name "*.py" | grep -v __pycache__ | grep -v venv | wc -l
    find <repo> -name "*view*.py" -o -name "*route*.py" -o -name "*api*.py" | sort
    find <repo> -name "*service*.py" -o -name "*model*.py" | sort

ELIF 存在 go.mod → Go 后端
  统计命令：
    find <repo> -name "*.go" | grep -v vendor | wc -l
    find <repo> -name "*handler*.go" -o -name "*controller*.go" | sort

ELIF 同时含多种技术栈特征 → 全栈项目
  → 分别对 frontend/ 和 backend/ 子目录执行对应命令
  → 若无明确子目录分隔，按文件后缀分组统计
```

**Step 1.3** 读取依赖/配置文件，确认模块关系：
- 前端：`package.json`（dependencies / scripts）、`tsconfig.json`（paths alias）、框架配置文件（`next.config.js` / `vite.config.ts` 等）
- 后端 Java：`build.gradle` / `settings.gradle` / `pom.xml`
- 后端 Node：`package.json`（scripts/dependencies）
- 后端 Python：`requirements.txt` / `pyproject.toml`

**Step 1.4** 确定知识树层级（顶层/中层/底层，用于阶段 3 文档组织）

**出口条件**：得到完整目录树 + 核心逻辑文件列表（100% 覆盖，类型由技术栈决定）+ 技术栈识别结论 + 知识树层级草图

---

### 阶段 2：信息多源收集（可并行）

**入口条件**：已知完整文件清单

⚠️ REQUIRED — 并行执行以下 3 条线（线路 B/C 根据阶段 0.5 检索清单决定是否执行）：

**线路 A — 代码精读**（按模块分批，每批 3-5 个文件）✅ 必须执行

根据阶段 1 识别的技术栈，精读对应的核心文件：
- **前端**：读 `pages/`（路由层）、`components/`（组件层）、`hooks/`（逻辑层）、`store/`（状态层）；提取组件 props/slots 接口、页面路由、状态管理结构
- **后端 Java**：读 Service / Controller / Repository 文件；提取方法签名、API 端点 URL、回调类型、特殊参数
- **后端 Node**：读 router / controller / service / model 文件；提取 API 路由定义、中间件链、DB schema
- **后端 Python**：读 views / routes / models / serializers；提取接口定义、ORM 模型、业务逻辑
- **后端 Go**：读 handler / model / repository；提取 HTTP handler 签名、struct 定义
- **全栈**：按前端 + 后端分批，分别读取
- 标记可信度：代码内容 → L1

**线路 B — 学城文档**（仅当检索清单有 ✅ 学城文档时执行，否则静默跳过）
```bash
nvm use 18
oa-skills citadel getMarkdown --contentId <document_id> 2>&1 | head -200
```
- 仅访问检索清单中 ✅ 状态的文档；标记可信度 → L2
- 检索清单无学城条目 → 跳过，在 `docs/README.md` 标注「学城文档：[未收录]」

**线路 C — ONES 工作项**（仅当检索清单有 ✅ ONES spaceId 时执行，否则静默跳过）
```bash
ones filter-issues --project <spaceId> --sprint current --fields "title,status,description" --limit 20
```
- 仅查询检索清单中 ✅ 状态的 ONES spaceId；标记可信度 → L2
- 检索清单无 ONES 条目 → 跳过，在 `docs/README.md` 标注「ONES 工作项：[未收录]」

**冲突处理**：代码(L1) > 学城文档(L2)，冲突处标注 `[⚠️ 可能过时，以代码为准]`；不确定内容标注 `[待确认]`，绝不编造

**出口条件**：完成全部核心代码文件精读 + 可用的学城/ONES 信息（无则记录未收录）+ 冲突已标注

---

### 阶段 3：知识库文档生成

**入口条件**：阶段 2 收集完毕

按树结构层级生成（见 [references/doc-templates.md](references/doc-templates.md) 获取模板）：

| 优先级 | 文件 | 核心内容 |
|--------|------|---------|
| P0 | `docs/README.md` | 目录 + 可检索范围 + AI 搜索优先级 |
| P0 | `docs/service-api-index.md` | Service↔API 端点全量映射表 |
| P0 | `docs/quick-lookup.md` | 业务场景→文件路径速查 + 术语表 |
| P1 | `docs/architecture.md` | 类层级、请求流程 |
| P1 | `docs/implicit-knowledge.md` | 已知坑、特殊设计、反直觉行为 |
| P1 | `docs/file-index.md` | 全量文件路径索引 |
| P2 | `docs/api-protocol.md` | 网络协议、请求头约定 |
| P2 | `docs/terminology.md` | 项目专有名词释义 |
| P2 | `docs/ones-requirements-<year>.md` | 需求背景/迭代历史 |
| P3 | `docs/module-details/<module>.md` | 每个核心模块深度文档 |

⚠️ REQUIRED — 每个生成的文档**头部必须包含 YAML frontmatter**：
```yaml
---
topic: <主题，一句话>
keywords: [同义词, 别名, 缩写, 英文名]
triggers: [适用场景描述1, 触发词2]
confidence: L1  # L1=代码/接口定义 | L2=需求/设计文档 | L3=变更历史/非正式
source: <来源 URL 或文件路径，多个用逗号分隔>
updated: <YYYY-MM-DD>
---
```

⚠️ REQUIRED — 单一原子化：每个 `module-details/` 文件只描述**一个**概念/模块；文件名语义化英文小写+连字符

**出口条件**：P0 文档全部完成，每个文档有 frontmatter；P1 文档至少完成 3 个；P2/P3 按仓库规模按需

---

### 阶段 4：AGENTS.md 生成

**入口条件**：`docs/` 目录至少有 5 个文档

⚠️ REQUIRED — `AGENTS.md` 必须包含：
1. **可检索范围声明**：列出三类信息源及其可信度（L1/L2/L3）
2. **知识库路径声明**：列出所有 docs/ 文件（使用相对路径）
3. **AI 加载优先级**：P0 必读 → P1 按需 → P2/P3 参考
4. **已知坑速查表**（从 `implicit-knowledge.md` 摘取最高频 5-8 条）
5. **编码约束**（从仓库规范/README 提取）
6. **信息可信度分级说明**（L1/L2/L3 对应来源类型）

**出口条件**：AGENTS.md 文件存在，内含 `docs/` 所有文件路径和可信度分级

---

### 阶段 5：一致性校验

**入口条件**：所有文档生成完毕

⚠️ REQUIRED — 执行以下校验：

- **Step 5.1** `docs/README.md` 目录列表与实际文件一一对应（无遗漏/无幽灵条目）
- **Step 5.2** `docs/service-api-index.md` 中的 Service 数量 == `find -name "*Service.java" | wc -l`
- **Step 5.3** `docs/file-index.md` 文件数 ≥ 实际 .java 文件数的 90%
- **Step 5.4** `AGENTS.md` 中 P0 文档路径全部可 `read_file` 验证存在
- **Step 5.5** 抽查 3 个 docs/ 文件，确认 frontmatter 字段（topic/keywords/confidence/source）均存在
- **Step 5.6** 检查是否有 `[待确认]` 标注 → 若有，向用户列出清单等待确认

⛔ BLOCKING — 以下情况不得交付：
- `service-api-index.md` Service 数量比实际少 ≥3 个
- `quick-lookup.md` 无业务场景→文件路径的映射表
- `AGENTS.md` 不存在
- 任何 docs/ 文件缺少 frontmatter 的 `confidence` 字段
- 有无法访问的资源尚未处理（阶段 0.5 的清单未关闭）

**出口条件**：全部校验通过 ✅，`[待确认]` 清单已向用户汇报

---

## 知识库运营（阶段 6）

### 6A：规则体系初始化（rule-init）

**入口条件**：用户输入 `rule-init`、`规则初始化`、`规则对齐` 或"多仓库规范统一"

**步骤**：
1. 读取 AGENTS.md 现有内容（若存在）
2. 读取标准规则模板（见 [references/operations-guide.md](references/operations-guide.md) §1）
3. 智能合并：已有相同章节跳过，内容不同则以标准为准，仓库独有内容保留
4. 生成/更新标准子文档（coding/skill/knowledge/review/task 各类规则文件）
5. 检查仓库已有但标准未覆盖的独有规则，输出质量检查报告

⚠️ REQUIRED — 合并前必须向用户展示 diff 摘要，确认后再写入

**出口条件**：AGENTS.md 章节完整，独有规则质量报告已输出，等待用户确认修复

---

### 6B：踩坑自动沉淀（持续运行）

**触发信号**（MUST 自动识别，无需用户明确说）：
- 用户纠偏（"不对"/"你搞错了"/"应该是"）
- 用户补充 AI 不知道的信息
- AI 靠猜测执行且结果有偏差
- 用户隐式纠偏（连续追问、重述需求）
- 用户说"帮我复盘一下"

**步骤**：
1. 识别到信号后，**在当前主任务完成后**静默执行（不打断用户）
2. 将问题分类：知识缺失 / 知识过时或错误 / AI 执行规则缺失 / 其他
3. 写入 `docs/experience/<分类>/YYYY-MM-DD-<简短标题>.md`（frontmatter + 根因 + 正确做法）
4. 若知识缺失影响 implicit-knowledge.md，同步追加条目
5. 更新 `docs/README.md` 目录（若新增了文件）

⚠️ REQUIRED — 沉淀文件必须有 frontmatter（topic/confidence: L3/source: 对话沉淀/updated）

**出口条件**：踩坑文件已写入，implicit-knowledge.md 已同步（如适用），静默完成不打扰主任务

---

### 6C：知识库召回率统计

**入口条件**：用户输入"知识库召回率"、"哪些文档没被用到"、"知识库效果"

**步骤**：
1. 读取 `agent_log/doc_log/<用户名>.json`（若存在），统计各文档被引用次数
2. 识别"零引用"文档（写了但从未被 AI 加载过）
3. 对零引用文档分析原因：keywords 不匹配 / triggers 不准确 / frontmatter 缺失
4. 输出召回率报告：高频文档 TOP5 + 零引用文档清单 + 改进建议

详细操作见 [references/operations-guide.md](references/operations-guide.md) §3

**出口条件**：召回率报告已输出，零引用文档已列清单并附改进建议

---

### 6D：增量更新知识库

**入口条件**：用户说"新增了 XX 模块"、"更新知识库"、"同步最新代码"

**步骤**：
1. 先判断技术栈（读 `docs/README.md` 中「技术栈」记录，或重新识别），再扫描新文件：

```bash
# 前端（TypeScript/React/Vue）
find src/ -newer docs/README.md \( -name "*.ts" -o -name "*.tsx" -o -name "*.vue" -o -name "*.jsx" \) \
  | grep -v node_modules | grep -v __tests__ | grep -v ".test."

# 后端 Java
find src/ -newer docs/README.md -name "*.java"

# 后端 Node.js
find src/ -newer docs/README.md \( -name "*.js" -o -name "*.ts" \) | grep -v node_modules

# 后端 Python
find . -newer docs/README.md -name "*.py" | grep -v __pycache__ | grep -v venv

# 后端 Go
find . -newer docs/README.md -name "*.go" | grep -v vendor

# 全栈：分别对 frontend/ 和 backend/ 目录执行上述对应命令
```

2. 读取新增/变更文件，提取信息，标注 `confidence: L1`
3. 依次更新（按技术栈对应的索引文件名）：
   - 前端：`component-index.md`（组件目录）→ `file-index.md` → `quick-lookup.md`
   - 后端：`service-api-index.md`（接口目录）→ `file-index.md` → `quick-lookup.md`
4. ⚠️ 必须同步更新 `docs/README.md` 目录（最常遗漏！）
5. 如有新已知坑，追加到 `implicit-knowledge.md`
6. 更新 `docs/README.md` 的「可检索信息范围」表格（文件数量变化）

**出口条件**：全部索引文件已更新，README.md 目录已同步

---

### 6E：规则质量检查（rule-check）

**入口条件**：用户输入 `rule-check`、"检查规则"、"规则有没有问题"

**步骤**：按 R1~R16 检查项逐条扫描 AGENTS.md（及指定子文档），输出带优先级的报告

| 检查项 | 类型 | 说明 |
|--------|------|------|
| R1 | 🔴高 | 原则类规则（AI 无法执行的空泛指令）|
| R2 | 🔴高 | 触发条件不合格（无具体词/短语）|
| R3 | 🟡中 | 强制标签滥用（主文件阈值 60%/子文档 30%）|
| R4 | 🟡中 | 语义重复（同一约束多处表述）|
| R8 | 🔴高 | 执行项含模糊词（"合理"/"适当"/"注意"）|
| R10 | 🔴高 | 按需指针失效（引用文件不存在）|

用户可选 `apply all` 一键应用所有修复，或 `apply R1,R3` 指定编号。

详细 R1~R16 全量定义见 [references/operations-guide.md](references/operations-guide.md) §5

**出口条件**：检查报告已输出，用户确认修复方案后执行

---

### 6F：知识库文档质量检查（doc-check）

**入口条件**：用户输入 `doc-check`、"检查知识库文档质量"、"docs 目录有没有问题"

**步骤**：扫描 `docs/` 目录（或指定文件），按 D1~D16 检查项逐文件检查，输出问题报告

| 检查项 | 类型 | 说明 |
|--------|------|------|
| D1~D3 | 🔴高 | 元信息完整性（frontmatter 缺失/字段不完整）|
| D4 | 🟡中 | keywords 写法不合格（少于 3 个/无同义词）|
| D5 | 🟡中 | 结论未前置（背景叙述过长，AI 被无关内容干扰）|
| D7 | 🟡中 | 多主题检测（一个文件描述了多个不相关概念）|
| D8 | 🔴高 | 代码一致性（文档中的方法签名与代码不符）|
| D10 | 🟠低 | 代码细节内联（超过 5 行实现代码，建议改为路径索引）|

详细 D1~D16 全量定义见 [references/operations-guide.md](references/operations-guide.md) §6

**出口条件**：检查报告已输出，用户确认修复方案后执行

---

### 6G：代码目录结构检查（struct-check）

**入口条件**：用户输入 `struct-check`、"检查代码目录结构"、"目录结构是否对 AI 友好"

**步骤**：扫描仓库代码目录（非 docs/），按 S1~S9 检查项检测影响 AI 检索的结构问题

| 检查项 | 类型 | 说明 |
|--------|------|------|
| S1 | 🔴高 | AGENTS.md 缺失 |
| S2 | 🟡中 | 根目录散落文件过多（>5 个 .md/.json/.yaml）|
| S3 | 🟡中 | 目录名使用纯动词（如 handle/、process/）|
| S8 | 🔴高 | 文件名与主体定义名不一致（RouteManager.java 内是 RouteManagerImpl）|

详细 S1~S9 全量定义见 [references/operations-guide.md](references/operations-guide.md) §7

**出口条件**：检查报告已输出，用户确认修复方案后执行

---

## Pre-Delivery Checklist

### 建库场景

交付前必须确认：
- [ ] `docs/README.md` 目录与实际文件匹配，且包含「可检索范围」章节和「技术栈」记录
- [ ] 核心索引文件覆盖 100% 关键模块（前端→ `component-index.md`，后端→ `service-api-index.md`，全栈→两者均需）
- [ ] `implicit-knowledge.md` 记录了所有特殊/反直觉设计（≥5 条；从零新项目≥3 条）
- [ ] `AGENTS.md` 存在且引用了正确路径，且含可信度分级说明
- [ ] 每个 docs/ 文件头部有完整 frontmatter（topic/keywords/triggers/confidence/source）
- [ ] 所有 `[待确认]` 标注已向用户汇报并等待处理
- [ ] 代码 vs 文档冲突处已标注 `[⚠️ 可能过时，以代码为准]`（从零新项目无文档，此项 N/A）
- [ ] 无空占位文件（内容 <100 字的文档）

### 运营场景（6A~6G）

- [ ] 修改前已向用户展示 diff 摘要（6A）
- [ ] 踩坑文件有 frontmatter（6B）
- [ ] 零引用文档清单已输出（6C）
- [ ] README.md 目录已同步（6D）
- [ ] 修复提案已获用户确认后执行（6E/6F/6G）

---

## 反模式（Anti-Patterns）

| # | 错误做法 | 后果 | 正确做法 |
|---|---------|------|---------|
| KB-1 | 一次性读所有 Java 文件填满 context | context 溢出，后续文档质量下降 | 分批读取，每批 3-5 个文件 |
| KB-2 | 仅生成高层概述，跳过 P0 文档 | AI 仍无法快速定位代码 | 优先完成 P0（索引表） |
| KB-3 | implicit-knowledge 留空或只写2条 | 已知坑无法传递给 AI | 至少记录 5 条特殊设计 |
| KB-4 | docs/README.md 目录列表不更新 | AI 以为文档不存在而重复生成 | 每新增文档立即更新 README |
| KB-5 | citadel/ONES 命令用 Node 14 跑 | `fetch is not defined` 报错 | 先 `nvm use 18` |
| KB-6 | 学城大文档全量读取 | token 超限 | 用 `head -200` 截断，聚焦架构段落 |
| KB-7 | AGENTS.md 写成 README 风格（给人看）| AI 无法解析加载优先级 | 以 AI 视角写，明确 P0/P1/P2 |
| KB-8 | 遇到无法访问资源时静默跳过 | 知识库有盲区，AI 无法识别 | 暂停并列清单询问用户 |
| KB-9 | 文档与代码冲突时取文档内容 | AI 编码依赖过时信息 | 代码为准，文档标注可能过时 |
| KB-10 | 生成文档不加 frontmatter | AI 无法按可信度筛选 | 每文件头部必须有 YAML frontmatter |
| KB-11 | module-details 一个文件写多个模块 | 违反单一原子化，AI 召回不精准 | 每文件只写一个概念/模块 |
| KB-12 | 踩坑信号识别后打断主任务 | 用户体验差 | 静默沉淀，主任务完成后再写入 |
| KB-13 | rule-init 直接覆盖仓库独有内容 | 丢失定制化规则 | 智能合并，展示 diff 后用户确认 |
| KB-14 | doc-check/rule-check 发现问题直接修改 | 可能改坏正确内容 | 输出修复提案，用户确认后执行 |

---

## 参考文档

- [references/doc-templates.md](references/doc-templates.md) — 每种文档的标准模板（含 frontmatter）
- [references/workflow-detail.md](references/workflow-detail.md) — 阶段 2/3 详细操作手册（含信息范围定义、冲突处理）
- [references/operations-guide.md](references/operations-guide.md) — 运营阶段 6A~6G 详细操作手册（rule-init/踩坑沉淀/召回率/rule-check/doc-check/struct-check）
