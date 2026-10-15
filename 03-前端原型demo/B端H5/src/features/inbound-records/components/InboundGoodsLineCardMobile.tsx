import { useState } from "react"
import { FileText, Plus, Trash2 } from "lucide-react"
import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import { FORM_PARTITIONS, FORM_STOREROOMS } from "../mock/inbound-form.mock"
import { applyGoodsSku, formatGoodsCardTitle, unstackedQuantity } from "../lib/inbound-form-utils"
import { formatSkuTriggerLabel, formatSpecSummary, getSkuById } from "../../../../../shared/goods/goods-sku-catalog"
import { NativeFormRow } from "./NativeFormRow"
import { MobileDownSelectSheet } from "./MobileDownSelectSheet"
import { InboundCollectFieldsMobile } from "./InboundCollectFieldsMobile"
import { InboundGoodsSkuCascadeSheet } from "./InboundGoodsSkuCascadeSheet"

type Picker =
  | "skuCascade"
  | { type: "storeroom"; stackId: string }
  | { type: "partition"; stackId: string }
  | null

type Props = {
  index: number
  line: GoodsLineForm
  form: InboundFormState
  variant?: "formal" | "staging"
  onChange: (line: GoodsLineForm) => void
  onRemove: () => void
}

export function InboundGoodsLineCardMobile({
  index,
  line,
  form,
  variant = "formal",
  onChange,
  onRemove,
}: Props) {
  const isStaging = variant === "staging"
  const [picker, setPicker] = useState<Picker>(null)

  const unstacked = unstackedQuantity(line)
  const activeSku = line.skuId ? getSkuById(line.skuId) : undefined
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

  const skuTriggerLabel = activeSku
    ? formatSkuTriggerLabel(activeSku)
    : line.spec ||
      (Object.keys(line.specValues).length > 0
        ? formatSpecSummary(line.specValues)
        : "")

  const pickerStackId =
    picker && typeof picker === "object" ? picker.stackId : undefined
  const pickerStack = pickerStackId
    ? line.stackings.find((s) => s.id === pickerStackId)
    : undefined

  return (
    <div className="rounded-xl border border-[#232D39]/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#232D39]">
            货品 {index + 1} · {formatGoodsCardTitle(line)}
          </p>
          <p
            className={
              unstacked > 0
                ? isStaging
                  ? "mt-1 text-xs font-medium text-amber-700"
                  : "mt-1 text-xs font-medium text-[#EF3E3E]"
                : "mt-1 text-xs text-[#232D39]/60"
            }
          >
            未堆放数量: {unstacked.toFixed(4)} {line.measureUnit || ""}
            {isStaging && unstacked > 0 ? "（弱提示）" : ""}
          </p>
        </div>
        <button type="button" className="shrink-0 text-[#EF3E3E]" onClick={onRemove}>
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-[#232D39]/10">
        <NativeFormRow
          label="入库货品"
          required
          showChevron
          onClick={() => setPicker("skuCascade")}
        >
          <span
            className={
              line.skuId ? "line-clamp-2 text-right text-[#232D39]" : "text-[#232D39]/40"
            }
          >
            {line.skuId
              ? [line.category, line.variety, skuTriggerLabel].filter(Boolean).join(" · ")
              : "请选择大类 / 品类 / 规格"}
          </span>
        </NativeFormRow>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs text-[#232D39]/70">
            <span className="text-[#EF3E3E]">* </span>
            {line.measureLabel || "计量数量"}
          </p>
          <input
            type="number"
            disabled={!line.skuId}
            className="w-full rounded-lg border border-[#232D39]/15 px-3 py-2 text-sm disabled:bg-[#F2F3F7]"
            placeholder="0.0000"
            value={line.measureValue}
            onChange={(e) => onChange({ ...line, measureValue: e.target.value })}
          />
        </div>
        <div className="w-24 shrink-0">
          <p className="mb-1 text-xs text-[#232D39]/70">单位</p>
          <div
            className="flex h-[40px] items-center justify-center rounded-lg border border-[#232D39]/15 bg-[#F2F3F7] px-2 text-sm text-[#232D39]"
            aria-readonly
          >
            {line.skuId && line.measureUnit ? line.measureUnit : "—"}
          </div>
        </div>
      </div>

      {line.skuId && activeSku && activeSku.inboundCollect.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-[#232D39]/80">
            其他收集信息{isStaging ? "（选填）" : ""}
          </p>
          <InboundCollectFieldsMobile
            fields={activeSku.inboundCollect}
            values={line.collectValues}
            allOptional={isStaging}
            onChange={(collectValues) => onChange({ ...line, collectValues })}
          />
        </div>
      ) : null}

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-[#232D39]">堆放位置</p>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-blue-600 disabled:opacity-40"
            onClick={addStacking}
            disabled={allowedStorerooms.length === 0}
          >
            <Plus className="size-3.5" />
            添加位置
          </button>
        </div>
        {allowedStorerooms.length === 0 ? (
          <p className="rounded-lg border border-dashed border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-800">
            请先在步骤一选择入库库房
          </p>
        ) : null}
        {line.stackings.map((stack) => {
          const room = allowedStorerooms.find((r) => r.id === stack.storeroomId)
          return (
            <div
              key={stack.id}
              className="mb-2 space-y-0 overflow-hidden rounded-lg border border-[#232D39]/10 last:mb-0"
            >
              <NativeFormRow
                label="入库库房"
                required={!isStaging}
                showChevron
                onClick={() => setPicker({ type: "storeroom", stackId: stack.id })}
              >
                <span className="truncate text-[#232D39]">
                  {room ? `${room.name}(${room.auditTag})` : "请选择"}
                </span>
              </NativeFormRow>
              <NativeFormRow
                label="入库分区"
                required={!isStaging}
                showChevron
                onClick={() =>
                  stack.storeroomId && setPicker({ type: "partition", stackId: stack.id })
                }
              >
                <span className="truncate text-[#232D39]">
                  {stack.partitionId || "请选择"}
                </span>
              </NativeFormRow>
              <div className="space-y-2 border-t border-[#232D39]/8 px-3 py-2.5">
                <input
                  className="w-full rounded-lg border border-[#232D39]/15 px-2 py-2 text-xs"
                  placeholder="具体堆放位置说明"
                  value={stack.locationText}
                  onChange={(e) =>
                    updateStacking(stack.id, { locationText: e.target.value })
                  }
                />
                <input
                  className="w-full rounded-lg border border-[#232D39]/15 px-2 py-2 text-xs"
                  placeholder={`堆放数量${line.measureUnit ? ` (${line.measureUnit})` : ""}`}
                  value={stack.quantity}
                  onChange={(e) => updateStacking(stack.id, { quantity: e.target.value })}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 border-t border-[#232D39]/10 pt-3">
        <p className="mb-3 text-xs font-semibold text-[#232D39]">附件信息</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#232D39]">
                {!isStaging ? <span className="text-[#EF3E3E]">* </span> : null}
                现场照片{isStaging ? "（选填）" : ""}
              </span>
              <span className="text-[10px] text-[#232D39]/50">
                已上传 {line.sitePhotoCount}/10
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {line.sitePhotoCount < 10 ? (
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#232D39]/25 bg-[#F8F9FB] text-sm text-[#232D39]/70 active:bg-[#232D39]/5"
                  onClick={() =>
                    onChange({
                      ...line,
                      sitePhotoCount: Math.min(10, line.sitePhotoCount + 1),
                    })
                  }
                >
                  <Plus className="size-4" />
                  点击上传现场照片
                </button>
              ) : null}
            </div>
            <p className="text-[10px] leading-relaxed text-[#232D39]/45">
              图片格式 jpg、png、jpeg，最多 10 张
            </p>
          </div>

          <div className="space-y-2 border-t border-[#232D39]/8 pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#232D39]">补充资料</span>
              <span className="text-[10px] text-[#232D39]/50">
                共计 {line.supplementCount}/10
              </span>
            </div>
            {line.supplementCount < 10 ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#232D39]/25 bg-[#F8F9FB] text-sm text-[#232D39]/70 active:bg-[#232D39]/5"
                  onClick={() =>
                    onChange({
                      ...line,
                      supplementCount: Math.min(10, line.supplementCount + 1),
                    })
                  }
                >
                  <Plus className="size-4" />
                  点击上传图片
                </button>
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#232D39]/25 bg-[#F8F9FB] text-sm text-[#232D39]/70 active:bg-[#232D39]/5"
                  onClick={() =>
                    onChange({
                      ...line,
                      supplementCount: Math.min(10, line.supplementCount + 1),
                    })
                  }
                >
                  <FileText className="size-4" />
                  上传 PDF
                </button>
              </div>
            ) : null}
            <p className="text-[10px] leading-relaxed text-[#232D39]/45">
              图片与 PDF 合计最多 10 个
            </p>
          </div>
        </div>
      </div>

      <InboundGoodsSkuCascadeSheet
        open={picker === "skuCascade"}
        selectedSkuId={line.skuId}
        onClose={() => setPicker(null)}
        onSelect={(sku) => onChange(applyGoodsSku(line, sku))}
      />
      <MobileDownSelectSheet
        open={picker !== null && typeof picker === "object" && picker.type === "storeroom"}
        title="选择入库库房"
        selectedId={pickerStack?.storeroomId}
        options={allowedStorerooms.map((r) => ({
          id: r.id,
          label: `${r.name}(${r.auditTag})`,
        }))}
        onClose={() => setPicker(null)}
        onSelect={(opt) => {
          if (!pickerStackId) return
          updateStacking(pickerStackId, {
            storeroomId: opt.id,
            partitionId: FORM_PARTITIONS[opt.id]?.[0] ?? "",
          })
        }}
      />
      <MobileDownSelectSheet
        open={picker !== null && typeof picker === "object" && picker.type === "partition"}
        title="选择入库分区"
        selectedId={pickerStack?.partitionId}
        options={(FORM_PARTITIONS[pickerStack?.storeroomId ?? ""] ?? []).map((p) => ({
          id: p,
          label: p,
        }))}
        onClose={() => setPicker(null)}
        onSelect={(opt) => {
          if (!pickerStackId) return
          updateStacking(pickerStackId, { partitionId: opt.id })
        }}
      />
    </div>
  )
}
