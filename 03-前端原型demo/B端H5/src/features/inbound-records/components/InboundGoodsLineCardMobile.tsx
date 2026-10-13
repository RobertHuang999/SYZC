import { Plus, Trash2 } from "lucide-react"
import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import {
  FORM_PARTITIONS,
  FORM_STOREROOMS,
  GOODS_SPEC_TREE,
} from "../mock/inbound-form.mock"
import {
  applySpecTemplate,
  formatGoodsCardTitle,
  unstackedQuantity,
} from "../lib/inbound-form-utils"

type Props = {
  index: number
  line: GoodsLineForm
  form: InboundFormState
  onChange: (line: GoodsLineForm) => void
  onRemove: () => void
}

export function InboundGoodsLineCardMobile({
  index,
  line,
  form,
  onChange,
  onRemove,
}: Props) {
  const unstacked = unstackedQuantity(line)
  const categories = Array.from(new Set(GOODS_SPEC_TREE.map((g) => g.category)))
  const varieties = GOODS_SPEC_TREE.filter((g) => g.category === line.category).map(
    (g) => g.variety
  )
  const specs = GOODS_SPEC_TREE.filter(
    (g) => g.category === line.category && g.variety === line.variety
  ).map((g) => g.spec)
  const template = GOODS_SPEC_TREE.find(
    (g) => g.category === line.category && g.variety === line.variety && g.spec === line.spec
  )

  const allowedStorerooms = FORM_STOREROOMS.filter(
    (room) =>
      form.storeroomIds.includes(room.id) &&
      (!form.warehouseId || room.warehouseId === form.warehouseId)
  )

  const updateStacking = (
    rowId: string,
    patch: Partial<GoodsLineForm["stackings"][number]>
  ) => {
    onChange({
      ...line,
      stackings: line.stackings.map((row) =>
        row.id === rowId ? { ...row, ...patch } : row
      ),
    })
  }

  const addStacking = () => {
    const defaultRoom = allowedStorerooms[0]?.id ?? ""
    onChange({
      ...line,
      stackings: [
        ...line.stackings,
        {
          id: `stack-${Date.now()}`,
          storeroomId: defaultRoom,
          partitionId: FORM_PARTITIONS[defaultRoom]?.[0] ?? "",
          locationText: "",
          quantity: "",
        },
      ],
    })
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-900">
            货品 {index + 1} · {formatGoodsCardTitle(line)}
          </p>
          <p
            className={
              unstacked > 0
                ? "mt-1 text-xs font-medium text-red-600"
                : "mt-1 text-xs text-gray-500"
            }
          >
            未堆放数量: {unstacked.toFixed(4)}
          </p>
        </div>
        <button type="button" className="text-red-500" onClick={onRemove}>
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        <select
          className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
          value={line.category}
          onChange={(e) =>
            onChange(
              applySpecTemplate(line, e.target.value, varieties[0] ?? "", specs[0] ?? "")
            )
          }
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              大类: {c}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
          value={line.variety}
          onChange={(e) =>
            onChange(applySpecTemplate(line, line.category, e.target.value, specs[0] ?? ""))
          }
        >
          {varieties.map((v) => (
            <option key={v} value={v}>
              品类: {v}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
          value={line.spec}
          onChange={(e) =>
            onChange(applySpecTemplate(line, line.category, line.variety, e.target.value))
          }
        >
          {specs.map((s) => (
            <option key={s} value={s}>
              规格: {s}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="计量参数"
            value={line.measureValue}
            onChange={(e) => onChange({ ...line, measureValue: e.target.value })}
          />
          <select
            className="w-24 rounded-lg border border-gray-200 px-2 py-2 text-sm"
            value={line.measureUnit}
            onChange={(e) => onChange({ ...line, measureUnit: e.target.value })}
          >
            {(template?.units ?? ["吨"]).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-700">堆放位置</p>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-primary"
            onClick={addStacking}
            disabled={allowedStorerooms.length === 0}
          >
            <Plus className="size-3.5" />
            添加位置
          </button>
        </div>
        {line.stackings.map((stack) => {
          const partitions = FORM_PARTITIONS[stack.storeroomId] ?? []
          return (
            <div key={stack.id} className="mt-2 space-y-2 rounded-lg bg-gray-50 p-2">
              <select
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
                value={stack.storeroomId}
                onChange={(e) =>
                  updateStacking(stack.id, {
                    storeroomId: e.target.value,
                    partitionId: FORM_PARTITIONS[e.target.value]?.[0] ?? "",
                  })
                }
              >
                {allowedStorerooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}({r.auditTag})
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
                value={stack.partitionId}
                onChange={(e) => updateStacking(stack.id, { partitionId: e.target.value })}
              >
                {partitions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
                placeholder="具体位置"
                value={stack.locationText}
                onChange={(e) => updateStacking(stack.id, { locationText: e.target.value })}
              />
              <input
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
                placeholder="堆放数量"
                value={stack.quantity}
                onChange={(e) => updateStacking(stack.id, { quantity: e.target.value })}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-3 space-y-2">
        <button
          type="button"
          className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-600"
          onClick={() =>
            onChange({
              ...line,
              sitePhotoCount: Math.min(10, line.sitePhotoCount + 1),
            })
          }
        >
          现场照片 *（{line.sitePhotoCount}/10）
        </button>
        <button
          type="button"
          className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-600"
          onClick={() =>
            onChange({
              ...line,
              supplementCount: Math.min(10, line.supplementCount + 1),
            })
          }
        >
          补充资料（{line.supplementCount}/10）
        </button>
      </div>
    </div>
  )
}
