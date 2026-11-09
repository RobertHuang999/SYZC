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
  value,
}: {
  label: ReactNode
  children?: ReactNode
  /** 兼容以 value 传值的写法；与 children 二选一 */
  value?: ReactNode
}) {
  const content = value !== undefined ? value : children
  return (
    <div className="detail-field">
      <div className="detail-field-label">{label}</div>
      <div className="detail-field-value">{content}</div>
    </div>
  )
}

export function formatEmptyValue(value: string | null | undefined): string {
  if (!value) {
    return "—"
  }
  return value
}
