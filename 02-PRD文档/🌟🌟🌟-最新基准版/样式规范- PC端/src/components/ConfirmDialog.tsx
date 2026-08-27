import { AlertTriangle, X } from "lucide-react"

type ConfirmDialogProps = {
  title: string
  description: string
  confirmText: string
  destructive?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ title, description, confirmText, destructive = false, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div className="confirm-icon"><AlertTriangle size={20} /></div>
        <button className="dialog-close confirm-close" type="button" onClick={onCancel} aria-label="关闭">
          <X size={18} />
        </button>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{description}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>取消</button>
          <button className={destructive ? "danger-button" : "search-button"} type="button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </section>
    </div>
  )
}
