import type { PrototypeDocument } from "@/shared/annotations/annotation.types"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备业务规则规格.md?raw"
import demoListMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备_Demo_列表页_移动端.md?raw"
import demoLockPasswordMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备_Demo_获取门锁密码.md?raw"
import demoAccessPasswordMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/01-物联网IOT管理/02门禁设备/门禁设备_Demo_获取门禁密码.md?raw"

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
]
