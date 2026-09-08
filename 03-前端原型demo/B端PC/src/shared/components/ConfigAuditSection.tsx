import type { ReactNode } from "react"
import { DetailField, DetailSection, formatEmptyValue } from "./DetailSection"
import { PersonTimeText } from "./TableCells"

type ConfigAuditSectionProps = {
  version: number | null | undefined
  status: ReactNode
  createdBy?: string | null
  createdAt?: string | null
  updatedBy?: string | null
  updatedAt?: string | null
  invalidReason?: string | null
}

export function ConfigAuditSection({
  version,
  status,
  createdBy,
  createdAt,
  updatedBy,
  updatedAt,
  invalidReason,
}: ConfigAuditSectionProps) {
  return (
    <DetailSection title="系统审计">
      <DetailField label="规则 Version">
        <span className="font-mono tabular-nums">{formatEmptyValue(version?.toString())}</span>
      </DetailField>
      <DetailField label="状态">{status}</DetailField>
      <DetailField label="创建人 / 创建时间">
        <AuditPersonTime person={createdBy} time={createdAt} />
      </DetailField>
      <DetailField label="更新人 / 更新时间">
        <AuditPersonTime person={updatedBy} time={updatedAt} />
      </DetailField>
      {invalidReason && (
        <DetailField label="失效原因">
          <span className="font-medium text-destructive">{invalidReason}</span>
        </DetailField>
      )}
    </DetailSection>
  )
}

function AuditPersonTime({
  person,
  time,
}: {
  person?: string | null
  time?: string | null
}) {
  return <PersonTimeText person={person} time={time} fallbackPerson="—" />
}
