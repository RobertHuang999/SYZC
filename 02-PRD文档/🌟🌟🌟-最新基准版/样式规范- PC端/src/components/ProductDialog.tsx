import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { Product } from "@/components/ProductTable"

export type ProductDialogMode = "create" | "edit" | "view"

type ProductDraft = Pick<Product, "code" | "name" | "category" | "brand" | "spec" | "unit" | "barcode" | "retail" | "wholesale" | "purchase">

type ProductDialogProps = {
  mode: ProductDialogMode
  product: Product | null
  onClose: () => void
  onSave: (product: Product) => void
  onEdit: () => void
}

const blankDraft: ProductDraft = {
  code: "",
  name: "",
  category: "采集设备",
  brand: "强盛",
  spec: "",
  unit: "件",
  barcode: "",
  retail: "¥0.00",
  wholesale: "¥0.00",
  purchase: "¥0.00",
}

const categories = ["采集设备", "打印设备", "打印耗材", "仓储辅料", "门店设备"]
const units = ["件", "盒", "套", "包"]

function draftFromProduct(product: Product | null): ProductDraft {
  if (!product) return blankDraft
  return {
    code: product.code,
    name: product.name,
    category: product.category,
    brand: product.brand,
    spec: product.spec,
    unit: product.unit,
    barcode: product.barcode,
    retail: product.retail,
    wholesale: product.wholesale,
    purchase: product.purchase,
  }
}

function timestamp() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toTimeString().slice(0, 8)
  return `${date} ${time}`
}

export function ProductDialog({ mode, product, onClose, onSave, onEdit }: ProductDialogProps) {
  const [draft, setDraft] = useState<ProductDraft>(() => draftFromProduct(product))
  const [error, setError] = useState("")
  const readOnly = mode === "view"

  useEffect(() => {
    setDraft(draftFromProduct(product))
    setError("")
  }, [mode, product])

  const update = (key: keyof ProductDraft, value: string) => setDraft((current) => ({ ...current, [key]: value }))

  const handleSave = () => {
    if (!draft.code.trim() || !draft.name.trim()) {
      setError("请填写商品编码和商品名称")
      return
    }

    onSave({
      ...draft,
      code: draft.code.trim(),
      name: draft.name.trim(),
      barcodeCount: product?.barcodeCount,
      status: product?.status ?? "启用",
      updatedAt: timestamp(),
    })
  }

  const title = mode === "create" ? "新增商品" : mode === "edit" ? "编辑商品" : `商品 ${product?.code ?? ""}`

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
        <div className="dialog-header">
          <h2 id="product-dialog-title">{title}</h2>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>

        {readOnly && product ? (
          <div className="dialog-body">
            <div className="dialog-section-title">基础识别信息</div>
            <div className="detail-grid">
              <DetailItem label="商品编码" value={product.code} />
              <DetailItem label="商品名称" value={product.name} />
              <DetailItem label="商品分类" value={product.category} />
              <DetailItem label="品牌" value={product.brand} />
              <DetailItem label="规格型号" value={product.spec} />
              <DetailItem label="单位" value={product.unit} />
              <DetailItem label="商品条码" value={product.barcode} />
              <DetailItem label="使用状态" value={product.status} />
            </div>
            <div className="dialog-section-title">经营与控制信息</div>
            <div className="detail-grid">
              <DetailItem label="默认零售价" value={product.retail} />
              <DetailItem label="默认批发价" value={product.wholesale} />
              <DetailItem label="默认采购价" value={product.purchase} />
              <DetailItem label="最后修改时间" value={product.updatedAt} />
            </div>
          </div>
        ) : (
          <div className="dialog-body">
            <div className="dialog-section-title">基础识别信息</div>
            <div className="dialog-grid">
              <DialogField label="商品编码" required value={draft.code} onChange={(value) => update("code", value)} placeholder="建议格式：SKU-0001" />
              <DialogField label="商品名称" required value={draft.name} onChange={(value) => update("name", value)} placeholder="请输入商品名称" />
              <DialogSelect label="商品分类" value={draft.category} options={categories} onChange={(value) => update("category", value)} />
              <DialogField label="品牌" value={draft.brand} onChange={(value) => update("brand", value)} placeholder="请输入品牌" />
              <DialogField label="规格型号" value={draft.spec} onChange={(value) => update("spec", value)} placeholder="请输入规格型号" />
              <DialogSelect label="单位" value={draft.unit} options={units} onChange={(value) => update("unit", value)} />
              <DialogField label="商品条码" required value={draft.barcode} onChange={(value) => update("barcode", value)} placeholder="请输入商品条码" />
            </div>
            <div className="dialog-section-title">经营与控制信息</div>
            <div className="dialog-grid dialog-price-grid">
              <DialogField label="默认零售价" value={draft.retail} onChange={(value) => update("retail", value)} placeholder="¥0.00" />
              <DialogField label="默认批发价" value={draft.wholesale} onChange={(value) => update("wholesale", value)} placeholder="¥0.00" />
              <DialogField label="默认采购价" value={draft.purchase} onChange={(value) => update("purchase", value)} placeholder="¥0.00" />
            </div>
            {error && <div className="dialog-error" role="alert">{error}</div>}
          </div>
        )}

        <div className="dialog-footer">
          <button className="secondary-button" type="button" onClick={onClose}>关闭</button>
          {readOnly ? (
            <button className="search-button dialog-primary" type="button" onClick={onEdit}>编辑</button>
          ) : (
            <button className="search-button dialog-primary" type="button" onClick={handleSave}>保存</button>
          )}
        </div>
      </section>
    </div>
  )
}

function DialogField({ label, required = false, value, onChange, placeholder }: { label: string; required?: boolean; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="dialog-field">
      <span>{required && <em>*</em>}{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  )
}

function DialogSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="dialog-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  )
}
