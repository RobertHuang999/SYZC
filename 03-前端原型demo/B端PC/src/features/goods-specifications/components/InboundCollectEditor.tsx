import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  PlusCircle,
  XCircle,
  Calendar as CalendarIcon,
} from "lucide-react"
import type {
  GoodsInboundCollectConfig,
  InboundCollectControlType,
  ShelfLifeUnit,
} from "../domain/types"
import {
  getShelfLifeUnitConfig,
  resolveCollectField,
  useGoodsSpecRevision,
} from "../lib/store"
import { OtherCollectSelectDialog } from "./OtherCollectSelectDialog"

type InboundCollectEditorProps = {
  value: GoodsInboundCollectConfig[]
  onChange: (value: GoodsInboundCollectConfig[]) => void
  disabled?: boolean
}

const UNIT_LABEL: Record<ShelfLifeUnit, string> = {
  DAY: "天",
  MONTH: "个月",
  YEAR: "年",
}

const UNIT_ORDER: ShelfLifeUnit[] = ["DAY", "MONTH", "YEAR"]

/** 保质期可用的固定单位，来自 07 白名单 */
function shelfLifeUnitOptions(): ShelfLifeUnit[] {
  const config = getShelfLifeUnitConfig()
  const allowed: ShelfLifeUnit[] = []
  if (config.allowDay) allowed.push("DAY")
  if (config.allowMonth) allowed.push("MONTH")
  if (config.allowYear) allowed.push("YEAR")
  return UNIT_ORDER.filter((unit) => allowed.includes(unit))
}

function renderInputMock(controlType: InboundCollectControlType, unitLabel?: string) {
  if (controlType === "日期选择器") {
    return (
      <div className="flex items-center gap-1.5 text-slate-400">
        <CalendarIcon className="size-3.5 text-slate-400" />
        <span>请选择</span>
      </div>
    )
  }

  if (controlType === "下拉单选框") {
    return (
      <div className="flex w-full items-center justify-between text-slate-400">
        <span>请选择</span>
        <ChevronDown className="size-3.5" />
      </div>
    )
  }

  if (controlType === "数字区间框") {
    return (
      <div className="flex w-full items-center justify-between gap-1 text-slate-400">
        <span>最小值 至 最大值</span>
        <span className="text-slate-500 text-[11px]">{unitLabel || "—"}</span>
      </div>
    )
  }

  if (controlType === "百分比数值框") {
    return (
      <div className="flex w-full items-center justify-between text-slate-400">
        <span>请输入</span>
        <span className="text-slate-500 text-[11px]">{unitLabel || "%"}</span>
      </div>
    )
  }

  if (controlType === "省市区三级联动") {
    return (
      <div className="flex w-full items-center justify-between text-slate-400">
        <span>省 / 市 / 区</span>
        <ChevronDown className="size-3.5" />
      </div>
    )
  }

  return <span className="text-slate-400">请输入</span>
}

export function InboundCollectEditor({
  value,
  onChange,
  disabled = false,
}: InboundCollectEditorProps) {
  useGoodsSpecRevision()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const patchItem = (
    fieldId: string,
    patch: Partial<GoodsInboundCollectConfig>
  ) => {
    if (disabled) return
    onChange(
      value.map((item) => (item.fieldId === fieldId ? { ...item, ...patch } : item))
    )
  }

  const handleToggleRequired = (fieldId: string) => {
    const current = value.find((item) => item.fieldId === fieldId)
    if (!current) return
    patchItem(fieldId, { required: !current.required })
  }

  const handleRemoveItem = (fieldId: string) => {
    if (disabled) return
    onChange(value.filter((item) => item.fieldId !== fieldId))
  }

  // 新勾选的保质期自动带出 07 的推荐基准单位，避免空值
  const handleConfirmSelect = (next: GoodsInboundCollectConfig[]) => {
    if (disabled) return
    const recommended = getShelfLifeUnitConfig().recommendedUnit
    onChange(
      next.map((item) => {
        const field = resolveCollectField(item.fieldId)
        if (field?.isShelfLife && !item.shelfLifeUnit) {
          return { ...item, shelfLifeUnit: recommended }
        }
        return item
      })
    )
  }

  const unitOptions = shelfLifeUnitOptions()

  return (
    <div className="space-y-4">
      {/* 顶部标题行 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="size-4 text-slate-700" />
          ) : (
            <ChevronRight className="size-4 text-slate-700" />
          )}
          <span className="text-sm font-semibold text-slate-900">入库收集信息</span>
          <span className="text-xs text-slate-500 font-normal hidden sm:inline ml-2">
            从「入库收集项配置」字段池勾选，货品侧只需设置必填；保质期可指定专属固定单位与建议默认数值。
          </span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-1.5 h-7 px-3 rounded border border-[#f5dfb8] bg-[#fcf7ed] hover:bg-[#faebd0] text-[#d8832a] text-xs font-normal transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <PlusCircle className="size-3.5" />
          <span>添加</span>
        </button>
      </div>

      {/* 收集字段网格展示区 */}
      {isExpanded && (
        <>
          {value.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center text-xs text-slate-400">
              <p className="font-medium text-slate-600">暂未添加入库收集信息</p>
              <p className="mt-1">点击右上角「+ 添加」从字段池选择入库需要采集的字段。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 pt-1">
              {value.map((item) => {
                const field = resolveCollectField(item.fieldId)
                const fieldDisabled = field?.status === "DISABLED"
                const isShelfLife = Boolean(field?.isShelfLife)
                const description = field?.placeholder || field?.remark || "—"

                return (
                  <div
                    key={item.fieldId}
                    className={`space-y-1.5 min-w-0 ${
                      fieldDisabled ? "opacity-60" : ""
                    }`}
                  >
                    {/* 字段标签与必填勾选 */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span
                        className="font-normal text-slate-700 truncate pr-2 flex items-center gap-1"
                        title={field?.name ?? "已删除的收集项"}
                      >
                        {field?.name ?? "已删除的收集项"}
                        {fieldDisabled && (
                          <span className="shrink-0 rounded border border-slate-200 bg-slate-100 px-1 text-[10px] text-slate-500">
                            底座已停用
                          </span>
                        )}
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-slate-900 shrink-0">
                        <input
                          type="checkbox"
                          checked={item.required}
                          disabled={disabled}
                          onChange={() => handleToggleRequired(item.fieldId)}
                          className="size-3.5 rounded-[2px] border-slate-300 accent-[#d8832a] cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-xs">必填</span>
                      </label>
                    </div>

                    {/* 保质期：专属固定单位 + 建议默认数值 */}
                    {isShelfLife ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            max={9999}
                            disabled={disabled}
                            value={item.suggestedValue ?? ""}
                            placeholder="建议默认数值"
                            onChange={(e) =>
                              patchItem(item.fieldId, {
                                suggestedValue: e.target.value,
                              })
                            }
                            className="h-8.5 w-full min-w-0 rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:border-[#d8832a] disabled:bg-slate-50 disabled:cursor-not-allowed"
                          />
                          <select
                            disabled={disabled}
                            value={item.shelfLifeUnit ?? ""}
                            onChange={(e) =>
                              patchItem(item.fieldId, {
                                shelfLifeUnit: e.target.value as ShelfLifeUnit,
                              })
                            }
                            className="h-8.5 shrink-0 rounded border border-slate-200 bg-white px-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#d8832a] disabled:bg-slate-50 disabled:cursor-not-allowed"
                          >
                            {unitOptions.map((unit) => (
                              <option key={unit} value={unit}>
                                {UNIT_LABEL[unit]}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => handleRemoveItem(item.fieldId)}
                            title={`删除「${field?.name ?? "该收集项"}」`}
                            className="shrink-0 p-0.5 text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40"
                          >
                            <XCircle className="size-4 text-red-400/90 hover:text-red-500" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          固定单位与建议值下单只读，仅仓管员可微调数值
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-8.5 rounded border border-slate-200 bg-[#f9fafb] px-3 flex items-center text-xs text-slate-400 select-none shadow-2xs">
                          {renderInputMock(
                            field?.controlType ?? "单行文本输入框",
                            field?.unitLabel
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleRemoveItem(item.fieldId)}
                          title={`删除「${field?.name ?? "该收集项"}」`}
                          className="text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40 shrink-0 p-0.5"
                        >
                          <XCircle className="size-4 text-red-400/90 hover:text-red-500" />
                        </button>
                      </div>
                    )}

                    {/* 底部辅助说明文案 */}
                    <p
                      className="text-[11px] text-slate-400 leading-tight truncate"
                      title={description}
                    >
                      {description}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      <OtherCollectSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedItems={value}
        onConfirm={handleConfirmSelect}
      />
    </div>
  )
}
