export const WAREHOUSE_TYPE_OPTIONS = [
  "储罐",
  "筒仓",
  "通用/常温库",
  "堆场",
  "冷库",
  "危化品仓库",
  "其他",
] as const

export const WAREHOUSE_REGION_OPTIONS = [
  { province: "广东省", city: "深圳市", district: "南山区" },
  { province: "广东省", city: "深圳市", district: "前海深港合作区" },
  { province: "上海市", city: "上海市", district: "临港新片区" },
  { province: "江苏省", city: "南京市", district: "鼓楼区" },
  { province: "四川省", city: "成都市", district: "双流区" },
] as const

export const WAREHOUSE_ROLE_OPTIONS = [
  "期货交割库现场监管组",
  "特种危化品安全监管员",
  "大宗商品监库员角色",
  "华南大区片区总监角色",
  "华东大区片区经理角色",
  "北方大区风控巡查组",
  "沿江港口片区经理",
  "仓储监管员角色",
  "片区经理角色",
  "平台超级管理员",
] as const

export type AssigneeMode = "PERSON" | "ROLE"
