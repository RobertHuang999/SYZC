import type { PrototypeDocument } from "@/shared/annotations/annotation.types"
import mockDataMarkdown from "@prototype/MOCK_DATA-开锁审批-V1.3.md?raw"
import h5ShellPrd from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/03-H5我的申请记录/我的申请记录主PRD.md?raw"
import h5ShellDemo from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/03-H5我的申请记录/我的申请记录_Demo_移动端.md?raw"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请业务规则规格.md?raw"
import demoCredentialMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/02-操作字段清单/02查看与下发凭证字段清单.md?raw"
import demoDetailMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请_Demo_详情页_移动端.md?raw"
import demoListMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请_Demo_列表页_PC.md?raw"
import demoSubmitMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请_Demo_发起申请页.md?raw"

export const myApplyDocuments: PrototypeDocument[] = [
  {
    id: "h5-shell-prd",
    title: "H5 我的申请记录 PRD",
    content: h5ShellPrd,
    category: "PRD需求规格",
    badge: "H5 壳层",
  },
  {
    id: "h5-shell-demo",
    title: "Demo · H5 列表",
    content: h5ShellDemo,
    category: "PRD需求规格",
    badge: "Demo · 列表",
  },
  {
    id: "prd",
    title: "开锁申请主 PRD",
    content: prdMarkdown,
    category: "PRD需求规格",
    badge: "UNLOCK_APPLY",
  },
  {
    id: "fields",
    title: "开锁申请字段清单",
    content: fieldsMarkdown,
    category: "字段字典清单",
    badge: "数据模型",
  },
  {
    id: "rules",
    title: "开锁申请业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
    badge: "状态机与规则",
  },
  {
    id: "demo-credential",
    title: "查看与下发凭证字段清单",
    content: demoCredentialMarkdown,
    category: "字段字典清单",
    badge: "凭证操作",
  },
  {
    id: "demo-detail",
    title: "Demo · 详情页移动端",
    content: demoDetailMarkdown,
    category: "PRD需求规格",
    badge: "Demo · 详情",
  },
  {
    id: "demo-list",
    title: "Demo · 列表页 PC（Mock §6 索引）",
    content: demoListMarkdown,
    category: "PRD需求规格",
    badge: "Demo · Mock",
  },
  {
    id: "demo-submit",
    title: "Demo · 发起申请（R07/R08）",
    content: demoSubmitMarkdown,
    category: "PRD需求规格",
    badge: "Demo · 提交",
  },
  {
    id: "mock-data",
    title: "Mock 数据示例 V1.7",
    content: mockDataMarkdown,
    category: "PRD需求规格",
    badge: "Mock",
  },
]
