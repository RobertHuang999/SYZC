export const WAREHOUSE_OPTIONS = [
  "华东一号仓",
  "华南二号仓",
  "华北三号仓",
] as const

export const STOREROOM_OPTIONS: Record<string, string[]> = {
  华东一号仓: ["A库", "B库"],
  华南二号仓: ["主库"],
  华北三号仓: ["1号库", "2号库"],
}

export const ZONE_OPTIONS: Record<string, string[]> = {
  "1号库": ["1区", "2区"],
  "2号库": ["A区"],
  A库: ["1区"],
}

export const MOCK_DEVICES = [
  { id: "dev-001", code: "LK-2024-0082", name: "A库挂锁-01", warehouse: "华东一号仓", location: "A库 / 1区" },
  { id: "dev-002", code: "LK-0085", name: "A库挂锁-02", warehouse: "华东一号仓", location: "A库 / 2区" },
  { id: "dev-003", code: "FACE-01", name: "A库人脸门禁", warehouse: "华东一号仓", location: "A库 / 入口" },
  { id: "dev-004", code: "LK-2024-0099", name: "B库挂锁-01", warehouse: "华东一号仓", location: "B库" },
  { id: "dev-005", code: "LK-HN-001", name: "华南挂锁-01", warehouse: "华南二号仓", location: "主库 / 1区" },
  { id: "dev-006", code: "LK-HN-002", name: "华南挂锁-02", warehouse: "华南二号仓", location: "主库 / 2区" },
  { id: "dev-007", code: "FACE-HN-01", name: "华南人脸门禁", warehouse: "华南二号仓", location: "主库 / 入口" },
  { id: "dev-008", code: "LK-HB-001", name: "华北挂锁-01", warehouse: "华北三号仓", location: "1号库 / 1区" },
  { id: "dev-009", code: "LK-HB-002", name: "华北挂锁-02", warehouse: "华北三号仓", location: "1号库 / 2区" },
  { id: "dev-010", code: "FACE-HB-01", name: "华北人脸门禁", warehouse: "华北三号仓", location: "1号库 / 入口" },
] as const

export const PERSON_OPTIONS = [
  "李四（监管部）",
  "王五（仓储部）",
  "张工（监管运营部）",
  "黄k（风控部）",
] as const

export const ROLE_OPTIONS = [
  "仓库主管",
  "风控经理",
  "监管经理",
] as const
