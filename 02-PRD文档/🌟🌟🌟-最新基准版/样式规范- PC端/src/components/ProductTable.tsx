import { ChevronLeft, ChevronRight } from "lucide-react"

export type Product = {
  code: string
  name: string
  category: string
  brand: string
  spec: string
  unit: string
  barcode: string
  barcodeCount?: number
  retail: string
  wholesale: string
  purchase: string
  status: "启用" | "禁用"
  updatedAt: string
}

type ProductTableProps = {
  products: Product[]
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onToggleStatus: (product: Product) => void
  onDelete: (product: Product) => void
}

const columns = [
  ["商品编码", "col-code"],
  ["商品名称", "col-name"],
  ["商品分类", "col-category"],
  ["品牌", "col-brand"],
  ["规格型号", "col-spec"],
  ["单位", "col-unit"],
  ["商品条码", "col-barcode"],
  ["默认零售价", "col-price"],
  ["默认批发价", "col-price"],
  ["默认采购价", "col-price"],
  ["使用状态", "col-status"],
  ["最后修改时间", "col-time"],
  ["操作", "col-actions"],
] as const

function BarcodeCell({ product }: { product: Product }) {
  return (
    <span className="barcode-cell">
      <span>{product.barcode}</span>
      {product.barcodeCount && <button type="button" className="count-badge">{product.barcodeCount}个</button>}
    </span>
  )
}

export function ProductTable({ products, onView, onEdit, onToggleStatus, onDelete }: ProductTableProps) {
  return (
    <div className="table-wrap">
      <table className="product-table">
        <thead>
          <tr>
            {columns.map(([label, className]) => <th className={className} key={label}>{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.code}>
              <td><button className="link-button" type="button">{product.code}</button></td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>{product.spec}</td>
              <td>{product.unit}</td>
              <td><BarcodeCell product={product} /></td>
              <td className="price-cell">{product.retail}</td>
              <td className="price-cell">{product.wholesale}</td>
              <td className="price-cell">{product.purchase}</td>
              <td><span className={`status-badge ${product.status === "启用" ? "is-enabled" : "is-disabled"}`}>{product.status}</span></td>
              <td className="time-cell">{product.updatedAt}</td>
              <td>
                <div className="row-actions">
                  <button type="button" onClick={() => onView(product)}>查看</button>
                  <button type="button" onClick={() => onEdit(product)}>编辑</button>
                  <button type="button" onClick={() => onToggleStatus(product)}>{product.status === "启用" ? "禁用" : "启用"}</button>
                  <button className="danger-action" type="button" onClick={() => onDelete(product)}>删除</button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="empty-cell">暂无匹配商品</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="table-footer">
        <span>共计 {products.length} 条记录</span>
        <div className="pagination">
          <button type="button" aria-label="上一页" disabled><ChevronLeft size={14} /></button>
          <button type="button" className="is-current">1</button>
          <button type="button" aria-label="下一页" disabled><ChevronRight size={14} /></button>
          <span>20条/页</span>
          <span>前往</span>
          <input aria-label="页码" defaultValue="1" />
          <span>页</span>
        </div>
      </div>
    </div>
  )
}
