export type ReadonlyRiskModule =
  | "mid-loan"
  | "risk-disclosure"

export type ReadonlyStatusTone = "success" | "warning" | "danger" | "info" | "neutral"

export type ReadonlyField = {
  label: string
  value: string
  tone?: ReadonlyStatusTone
}

export type ReadonlySection = {
  title: string
  fields: ReadonlyField[]
}

export type ReadonlyRiskRecord = {
  id: string
  title: string
  subtitle: string
  status: string
  statusTone: ReadonlyStatusTone
  summary: ReadonlyField[]
  sections: ReadonlySection[]
  searchText: string
}

export type ReadonlyRiskModuleMeta = {
  title: string
  subtitle: string
  listPath: string
  detailPath: string
  emptyText: string
}
