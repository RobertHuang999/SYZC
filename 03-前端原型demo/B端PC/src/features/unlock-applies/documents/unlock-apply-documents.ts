import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import mockDataMarkdown from "@prototype/MOCK_DATA-开锁审批-V1.3.md?raw"
import myApplyShellPrd from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/02-完整页/我的申请管理主PRD.md?raw"
import myApplyShellDemo from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/02-完整页/我的申请管理_Demo_PC.md?raw"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请业务规则规格.md?raw"
import demoListMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请_Demo_列表页_PC.md?raw"
import demoDetailMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请_Demo_详情页_PC.md?raw"
import demoCredentialMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/02-操作字段清单/02查看与下发凭证字段清单.md?raw"
import demoSubmitMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请_Demo_发起申请页.md?raw"

export const unlockApplyDocuments: PrototypeDocument[] = [
  {
    id: "shell-prd",
    title: "我的申请管理 · 完整页 PRD",
    content: myApplyShellPrd,
    category: "产品需求规格",
  },
  {
    id: "shell-demo",
    title: "Demo · 完整页壳层",
    content: myApplyShellDemo,
    category: "原型交互规范",
  },
  {
    id: "prd",
    title: "开锁申请主 PRD",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "开锁申请字段清单",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "开锁申请业务规则规格",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
  {
    id: "demo-list",
    title: "Demo · 列表页 PC",
    content: demoListMarkdown,
    category: "原型交互规范",
  },
  {
    id: "demo-detail",
    title: "Demo · 详情页 PC",
    content: demoDetailMarkdown,
    category: "原型交互规范",
  },
  {
    id: "demo-credential",
    title: "查看与下发凭证字段清单",
    content: demoCredentialMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "demo-submit",
    title: "Demo · 发起申请页",
    content: demoSubmitMarkdown,
    category: "原型交互规范",
  },
  {
    id: "mock-data",
    title: "Mock 数据示例 V1.3",
    content: mockDataMarkdown,
    category: "原型数据",
  },
]
