import { useMemo, useState } from "react"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { HeaderBar } from "@/components/HeaderBar"
import { ProductFilters, type FilterState } from "@/components/ProductFilters"
import { ProductDialog, type ProductDialogMode } from "@/components/ProductDialog"
import { ProductTable, type Product } from "@/components/ProductTable"
import { Sidebar } from "@/components/Sidebar"

const products: Product[] = [
  { code: "SKU-0001", name: "便携扫码枪", category: "采集设备", brand: "强盛", spec: "无线版", unit: "件", barcode: "SCAN0001", barcodeCount: 3, retail: "¥399.00", wholesale: "¥299.00", purchase: "¥238.00", status: "启用", updatedAt: "2026-04-19 10:22:16" },
  { code: "SKU-0002", name: "热敏标签机", category: "打印设备", brand: "智帆", spec: "桌面款", unit: "件", barcode: "PRINT0002", retail: "¥999.00", wholesale: "¥899.00", purchase: "¥735.00", status: "启用", updatedAt: "2026-04-19 09:45:20" },
  { code: "SKU-0003", name: "标签打印纸", category: "打印耗材", brand: "海拓", spec: "100mm*50mm", unit: "盒", barcode: "PAPER0003", barcodeCount: 2, retail: "¥0.00", wholesale: "¥18.00", purchase: "¥12.50", status: "启用", updatedAt: "2026-04-19 08:18:33" },
  { code: "SKU-0004", name: "仓储周转箱", category: "仓储辅料", brand: "-", spec: "600*400 蓝色", unit: "件", barcode: "BOX0004", retail: "-", wholesale: "¥62.00", purchase: "¥48.00", status: "启用", updatedAt: "2026-04-18 17:36:10" },
  { code: "SKU-0005", name: "蓝牙打印机", category: "门店设备", brand: "元禾", spec: "移动版", unit: "件", barcode: "STORE0005", barcodeCount: 4, retail: "¥799.00", wholesale: "¥699.00", purchase: "¥560.00", status: "启用", updatedAt: "2026-04-19 11:12:48" },
  { code: "SKU-0006", name: "色带模块", category: "打印耗材", brand: "云栈", spec: "标准款", unit: "套", barcode: "RIBBON0006", retail: "¥59.00", wholesale: "¥45.00", purchase: "¥32.00", status: "启用", updatedAt: "2026-04-17 16:20:00" },
  { code: "SKU-0007", name: "手持终端PDA", category: "采集设备", brand: "强盛", spec: "安卓版 4寸", unit: "件", barcode: "PDA0007", barcodeCount: 2, retail: "¥2,680.00", wholesale: "¥2,380.00", purchase: "¥1,950.00", status: "启用", updatedAt: "2026-04-18 14:10:33" },
  { code: "SKU-0008", name: "电子秤模块", category: "门店设备", brand: "-", spec: "30kg", unit: "件", barcode: "SCALE0008", retail: "¥320.00", wholesale: "¥260.00", purchase: "¥210.00", status: "启用", updatedAt: "2026-04-16 09:30:18" },
  { code: "SKU-0009", name: "条码标签贴纸", category: "打印耗材", brand: "海拓", spec: "40mm*30mm", unit: "包", barcode: "LABEL0009", barcodeCount: 2, retail: "¥12.00", wholesale: "¥8.50", purchase: "¥5.00", status: "禁用", updatedAt: "2026-04-15 17:00:00" },
  { code: "SKU-0010", name: "充电宝组合装", category: "门店设备", brand: "智帆", spec: "10000mAh", unit: "套", barcode: "POWER0010", barcodeCount: 3, retail: "¥129.00", wholesale: "¥98.00", purchase: "¥76.00", status: "禁用", updatedAt: "2026-04-14 11:30:00" },
]

const defaultFilters: FilterState = {
  code: "",
  name: "",
  category: "全部",
  brand: "全部",
  barcode: "",
  status: "全部",
}

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [productList, setProductList] = useState(products)
  const [filters, setFilters] = useState(defaultFilters)
  const [submittedFilters, setSubmittedFilters] = useState(defaultFilters)
  const [dialogMode, setDialogMode] = useState<ProductDialogMode | null>(null)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [pendingAction, setPendingAction] = useState<{ type: "toggle" | "delete"; product: Product } | null>(null)

  const filteredProducts = useMemo(() => {
    const normalized = (value: string) => value.trim().toLowerCase()
    return productList.filter((product) => {
      const codeMatch = product.code.toLowerCase().includes(normalized(submittedFilters.code))
      const nameMatch = product.name.includes(submittedFilters.name.trim())
      const categoryMatch = submittedFilters.category === "全部" || product.category === submittedFilters.category
      const brandMatch = submittedFilters.brand === "全部" || product.brand === submittedFilters.brand
      const barcodeMatch = product.barcode.toLowerCase().includes(normalized(submittedFilters.barcode))
      const statusMatch = submittedFilters.status === "全部" || product.status === submittedFilters.status
      return codeMatch && nameMatch && categoryMatch && brandMatch && barcodeMatch && statusMatch
    })
  }, [productList, submittedFilters])

  const handleReset = () => {
    setFilters(defaultFilters)
    setSubmittedFilters(defaultFilters)
  }

  const openProductDialog = (mode: ProductDialogMode, product: Product | null = null) => {
    setActiveProduct(product)
    setDialogMode(mode)
  }

  const handleSave = (nextProduct: Product) => {
    setProductList((current) => {
      if (activeProduct) return current.map((product) => product.code === activeProduct.code ? nextProduct : product)
      return [nextProduct, ...current]
    })
    setDialogMode(null)
    setActiveProduct(null)
  }

  const handleConfirmAction = () => {
    if (!pendingAction) return
    setProductList((current) => {
      if (pendingAction.type === "delete") return current.filter((product) => product.code !== pendingAction.product.code)
      return current.map((product) => product.code === pendingAction.product.code ? { ...product, status: product.status === "启用" ? "禁用" : "启用" } : product)
    })
    setPendingAction(null)
  }

  return (
    <div className="app-shell">
      <HeaderBar />
      <div className="app-body">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <main className="main-area">
          <div className="content-column">
            <div className="breadcrumb" aria-label="当前位置">
              <span>基础资料</span>
              <span className="breadcrumb-separator">/</span>
              <strong>商品管理</strong>
            </div>
            <section className="content-card" aria-label="商品管理内容">
              <ProductFilters
                value={filters}
                onChange={setFilters}
                onReset={handleReset}
                onSearch={() => setSubmittedFilters(filters)}
              />
              <div className="table-toolbar">
                <button className="primary-button" type="button" onClick={() => openProductDialog("create")}>
                  新增商品
                </button>
              </div>
              <ProductTable
                products={filteredProducts}
                onView={(product) => openProductDialog("view", product)}
                onEdit={(product) => openProductDialog("edit", product)}
                onToggleStatus={(product) => setPendingAction({ type: "toggle", product })}
                onDelete={(product) => setPendingAction({ type: "delete", product })}
              />
            </section>
          </div>
        </main>
      </div>
      {dialogMode && (
        <ProductDialog
          mode={dialogMode}
          product={activeProduct}
          onClose={() => { setDialogMode(null); setActiveProduct(null) }}
          onSave={handleSave}
          onEdit={() => setDialogMode("edit")}
        />
      )}
      {pendingAction && (
        <ConfirmDialog
          title={pendingAction.type === "delete" ? `确认删除：${pendingAction.product.name}` : `${pendingAction.product.status === "启用" ? "确认禁用" : "确认启用"}：${pendingAction.product.name}`}
          description={pendingAction.type === "delete" ? "删除后商品记录将从当前列表移除，确认删除？" : pendingAction.product.status === "启用" ? "禁用后该商品不可被新业务选择，历史引用仍保留，确认禁用？" : "启用后该商品可重新被新业务选择，确认启用？"}
          confirmText={pendingAction.type === "delete" ? "确认删除" : pendingAction.product.status === "启用" ? "确认禁用" : "确认启用"}
          destructive={pendingAction.type === "delete"}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  )
}

export default App
