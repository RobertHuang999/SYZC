import { Link } from "react-router-dom"
import type { WarehouseRecord } from "../domain/types"
import { warehouseDetailPath, warehouseEditPath } from "../domain/constants"

type WarehouseCardProps = {
  item: WarehouseRecord
  onDelete: () => void
  onToggleStatus: () => void
}

export function WarehouseCard({
  item,
  onDelete,
  onToggleStatus,
}: WarehouseCardProps) {
  const initial = item.managerName.slice(0, 1)
  const enabled = item.status === "ENABLED"

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            enabled
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {enabled ? "已启用" : "已停用"}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <span className="flex size-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          {initial}
        </span>
        <span>{item.managerName}</span>
      </div>
      <dl className="mt-2 space-y-1 text-xs text-gray-500">
        <div className="flex justify-between">
          <dt>中仓登准入仓标记</dt>
          <dd>{item.zhongdengAccess === "YES" ? "是" : "否"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>创建时间</dt>
          <dd>{item.createdAt}</dd>
        </div>
        <div className="flex justify-between">
          <dt>创建人</dt>
          <dd>{item.createdBy}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3 text-xs">
        <Link
          to={warehouseDetailPath(item.id)}
          className="rounded-md bg-gray-100 px-3 py-1.5 font-medium text-gray-800"
        >
          查看详情
        </Link>
        <button
          type="button"
          className="rounded-md bg-gray-100 px-3 py-1.5 font-medium text-gray-800"
          onClick={onDelete}
        >
          删除
        </button>
        <button
          type="button"
          className="rounded-md bg-gray-100 px-3 py-1.5 font-medium text-gray-800"
          onClick={onToggleStatus}
        >
          {enabled ? "停用" : "启用"}
        </button>
        <Link
          to={warehouseEditPath(item.id)}
          className="ml-auto rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white"
        >
          去编辑 ▶
        </Link>
      </div>
    </div>
  )
}
