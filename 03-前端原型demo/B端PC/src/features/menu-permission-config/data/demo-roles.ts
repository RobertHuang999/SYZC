export type DemoRole = {
  id: string
  name: string
  description: string
  /** 默认授权按权限编码前缀生成，见 lib/permission-tree.ts 的 buildPresetGrants */
  presetPrefixes: string[]
}

export const demoRoles: DemoRole[] = [
  {
    id: "risk-approver",
    name: "资方风控审批岗",
    description: "负责融资审批、监管业务办理与风险看板",
    presetPrefixes: ["sy:spzx", "rzjg:rzgl", "xmgl:dzydd", "fk", "tjkb", "home", "ywgl", "xmjg:rwzx", "xmjg:xmsq"],
  },
  {
    id: "warehouse-admin",
    name: "仓库管理员",
    description: "负责仓储作业、设备与物联网预警",
    presetPrefixes: ["cc", "cdgl", "iot", "sbgl", "work", "ch", "hwgl", "hqgl", "ywfq"],
  },
  {
    id: "platform-ops",
    name: "平台运营管理员",
    description: "负责平台配置、机构与账号体系维护",
    presetPrefixes: ["pzgl", "xtpz", "zzjg", "js", "tjkb"],
  },
  {
    id: "org-staff",
    name: "机构业务专员",
    description: "负责客户、合作方与日常业务单据",
    presetPrefixes: ["userCenter", "hzfda", "jy", "khgl", "rzjg:rzgl", "home", "work", "ywfq"],
  },
]

export const defaultRoleId = demoRoles[0].id
