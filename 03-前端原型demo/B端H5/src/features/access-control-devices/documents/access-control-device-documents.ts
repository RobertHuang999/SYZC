import type { PrototypeDocument } from "@/shared/annotations/annotation.types"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备业务规则规格.md?raw"
import demoListMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备_Demo_列表页_移动端.md?raw"
import demoLockPasswordMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备_Demo_获取门锁密码.md?raw"
import demoAccessPasswordMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备_Demo_获取门禁密码.md?raw"
import demoSubmitMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/03-业务审批/04-我的申请管理/04-开锁审批/开锁申请_Demo_发起申请页.md?raw"
import mockDataMarkdown from "@prototype/MOCK_DATA-开锁审批-V1.3.md?raw"

export const accessControlDeviceDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "门禁设备主 PRD",
    content: prdMarkdown,
    category: "PRD需求规格",
    badge: "v6.2.0",
  },
  {
    id: "fields",
    title: "门禁设备字段清单",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "门禁设备业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
  {
    id: "demo-list",
    title: "Demo · 列表页移动端",
    content: demoListMarkdown,
    category: "PRD需求规格",
    badge: "Demo · 列表",
  },
  {
    id: "demo-lock-password",
    title: "Demo · 获取门锁密码",
    content: demoLockPasswordMarkdown,
    category: "PRD需求规格",
    badge: "Demo · 挂锁",
  },
  {
    id: "demo-access-password",
    title: "Demo · 获取门禁密码",
    content: demoAccessPasswordMarkdown,
    category: "PRD需求规格",
    badge: "Demo · 人脸",
  },
  {
    id: "demo-submit",
    title: "Demo · 发起开锁申请（需审批）",
    content: demoSubmitMarkdown,
    category: "PRD需求规格",
    badge: "Demo · R07",
  },
  {
    id: "mock-data",
    title: "Mock 数据示例 V1.7",
    content: mockDataMarkdown,
    category: "PRD需求规格",
    badge: "Mock",
  },
]
