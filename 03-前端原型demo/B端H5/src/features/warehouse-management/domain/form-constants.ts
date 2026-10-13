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
  "仓储监管员角色",
  "片区经理角色",
  "平台超级管理员",
] as const

export type AssigneeMode = "PERSON" | "ROLE"

export const MOCK_ORG_USERS = [
  { id: "u-004", name: "温喜华", dept: "仓储监管部" },
  { id: "u-005", name: "大树", dept: "仓储监管部" },
  { id: "u-006", name: "钱主管", dept: "仓储监管部" },
  { id: "u-009", name: "张彬彬", dept: "业务运营部" },
  { id: "u-010", name: "超人", dept: "业务运营部" },
  { id: "u-011", name: "hq1", dept: "业务运营部" },
] as const
