import type { ReactNode } from "react"

export function DetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="detail-section">
      <div className="detail-section-header">
        <h2 className="detail-section-title">{title}</h2>
      </div>
      <div className="detail-section-content">{children}</div>
    </section>
  )
}

export function DetailField({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) {
  return (
    <div className="detail-field">
      <div className="detail-field-label">{label}</div>
      <div className="detail-field-value">{children}</div>
    </div>
  )
}

export function formatEmptyValue(value: string | null | undefined): string {
  if (!value) {
    return "—"
  }
  return value
}
