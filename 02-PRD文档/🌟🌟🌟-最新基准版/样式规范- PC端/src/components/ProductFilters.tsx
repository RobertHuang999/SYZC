import { ChevronDown, ListFilter, Search } from "lucide-react"

export type FilterState = {
  code: string
  name: string
  category: string
  brand: string
  barcode: string
  status: string
}

type ProductFiltersProps = {
  value: FilterState
  onChange: (value: FilterState) => void
  onReset: () => void
  onSearch: () => void
}

const categories = ["全部", "采集设备", "打印设备", "打印耗材", "仓储辅料", "门店设备"]
const brands = ["全部", "强盛", "智帆", "海拓", "元禾", "云栈"]

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="filter-field">
      <span className="filter-label">{label}</span>
      <span className="select-control">
        <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <ChevronDown className="select-chevron" size={15} strokeWidth={1.7} aria-hidden="true" />
      </span>
    </label>
  )
}

function ExactMatchField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="filter-field">
      <span className="filter-label">{label}</span>
      <span className="text-control exact-control">
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="可批量，精确匹配" aria-label={label} />
        <ListFilter size={14} strokeWidth={1.7} aria-hidden="true" />
      </span>
    </label>
  )
}

export function ProductFilters({ value, onChange, onReset, onSearch }: ProductFiltersProps) {
  const update = (key: keyof FilterState, nextValue: string) => onChange({ ...value, [key]: nextValue })

  return (
    <div className="filters-panel">
      <ExactMatchField label="商品编码" value={value.code} onChange={(nextValue) => update("code", nextValue)} />
      <label className="filter-field">
        <span className="filter-label">商品名称</span>
        <span className="text-control">
          <Search size={14} strokeWidth={1.7} aria-hidden="true" />
          <input value={value.name} onChange={(event) => update("name", event.target.value)} placeholder="请输入商品名称" aria-label="商品名称" />
        </span>
      </label>
      <SelectField label="商品分类" value={value.category} options={categories} onChange={(nextValue) => update("category", nextValue)} />
      <SelectField label="品牌" value={value.brand} options={brands} onChange={(nextValue) => update("brand", nextValue)} />
      <ExactMatchField label="商品条码" value={value.barcode} onChange={(nextValue) => update("barcode", nextValue)} />
      <SelectField label="使用状态" value={value.status} options={["全部", "启用", "禁用"]} onChange={(nextValue) => update("status", nextValue)} />

      <div className="filter-actions">
        <button className="secondary-button" type="button" onClick={onReset}>重置</button>
        <button className="search-button" type="button" onClick={onSearch}>搜索</button>
      </div>
    </div>
  )
}
