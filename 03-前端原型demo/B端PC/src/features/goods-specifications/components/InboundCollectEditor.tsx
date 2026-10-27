import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  PlusCircle,
  XCircle,
  Calendar as CalendarIcon,
} from "lucide-react"
import { INBOUND_COLLECT_ITEMS } from "../domain/constants"
import type { GoodsInboundCollectConfig, InboundCollectItemDef } from "../domain/types"
import { OtherCollectSelectDialog } from "./OtherCollectSelectDialog"

type InboundCollectEditorProps = {
  value: GoodsInboundCollectConfig[]
  onChange: (value: GoodsInboundCollectConfig[]) => void
  disabled?: boolean
}

const DEF_MAP = new Map<string, InboundCollectItemDef>(
  INBOUND_COLLECT_ITEMS.map((item) => [item.key, item])
)

function findDef(key: string, label?: string): InboundCollectItemDef | undefined {
  return (
    DEF_MAP.get(key) ||
    INBOUND_COLLECT_ITEMS.find((d) => d.key === key || d.label === label)
  )
}

function getFieldDescription(key: string, def?: InboundCollectItemDef): string {
  if (key === "packaging" || key === "packaging_type") return "箱装/盒装、袋装、散装、桶装、集装箱、托盘"
  if (key === "origin") return "支持省市县三级联动"
  if (key === "batchNo" || key === "batch_no") return "核心追溯字段"
  if (key === "producer") return "生产厂家全称"
  if (key === "hazardLevel") return "根据国家标准展示"
  if (key === "qualityGrade") return "特级、一级、二级、三级、国标、优等品、合格品"
  if (key === "productionDate") return "用于计算储存周期和临期预警"
  if (key === "expiryDate") return "关键风控字段"
  if (key === "shelfLife" || key === "shelf_life") return "与生产日期共同计算实际过期时间"
  if (key === "inspectDate") return "检验日期"
  if (key === "inspectOrg") return "第三方检测机构全称"
  if (key === "inspectReportNo") return "检测报告溯源唯一索引"
  if (key === "storageMode") return "常温、冷藏、冷冻"
  if (key === "temperature") return "温度控制标准 (℃)"
  if (key === "humidity") return "湿度控制标准 (%RH)"
  if (key === "moisture") return "水分含量指标 (0~100%)"
  if (key === "impurity") return "质检纯度与杂质率扣减指标"
  return def?.description || "入库必填业务参数"
}

function renderInputMock(key: string, def?: InboundCollectItemDef) {
  if (key === "shelfLife" || key === "shelf_life" || def?.control === "period") {
    return (
      <div className="flex w-full items-center justify-between">
        <span className="text-slate-400">请输入</span>
        <span className="flex items-center gap-0.5 border-l border-slate-200 pl-2 text-slate-500">
          天 <ChevronDown className="size-3 text-slate-400" />
        </span>
      </div>
    )
  }

  if (def?.control === "date" || key.toLowerCase().includes("date")) {
    return (
      <div className="flex items-center gap-1.5 text-slate-400">
        <CalendarIcon className="size-3.5 text-slate-400" />
        <span>请选择</span>
      </div>
    )
  }

  if (def?.control === "select" || def?.control === "region") {
    return (
      <div className="flex w-full items-center justify-between text-slate-400">
        <span>请选择</span>
        <ChevronDown className="size-3.5 text-slate-400" />
      </div>
    )
  }

  if (key === "temperature") {
    return (
      <div className="flex w-full items-center justify-between text-slate-400">
        <span>请输入</span>
        <span className="text-slate-500 text-[11px]">℃</span>
      </div>
    )
  }

  if (key === "humidity" || key === "moisture" || key === "impurity") {
    return (
      <div className="flex w-full items-center justify-between text-slate-400">
        <span>请输入</span>
        <span className="text-slate-500 text-[11px]">{key === "humidity" ? "%RH" : "%"}</span>
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggleRequired = (key: string) => {
    if (disabled) return
    onChange(
      value.map((item) =>
        item.key === key ? { ...item, required: !item.required } : item
      )
    )
  }

  const handleRemoveItem = (key: string) => {
    if (disabled) return
    onChange(value.filter((item) => item.key !== key))
  }

  return (
    <div className="space-y-4">
      {/* 顶部标题行 - 1:1 对齐用户系统截图 */}
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
            货品入库时需要填写，您可以根据业务需求自定义添加、编辑或删除字段。
          </span>
        </div>

        {/* 右上角 添加 按钮 - 1:1 对齐黄色浅底加号按钮 */}
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

      {/* 收集字段网格展示区 (4列排版) - 1:1 对齐用户系统截图 */}
      {isExpanded && (
        <>
          {value.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center text-xs text-slate-400">
              <p className="font-medium text-slate-600">暂未添加入库收集信息</p>
              <p className="mt-1">点击右上角「+ 添加」选择入库需要采集的字段。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 pt-1">
              {value.map((item) => {
                const def = findDef(item.key, item.label)
                const description = getFieldDescription(item.key, def)
                return (
                  <div key={item.key} className="space-y-1.5 min-w-0">
                    {/* 字段标签与必填勾选 */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-normal text-slate-700 truncate pr-2" title={item.label}>
                        {item.label}:
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-slate-900 shrink-0">
                        <input
                          type="checkbox"
                          checked={item.required}
                          disabled={disabled}
                          onChange={() => handleToggleRequired(item.key)}
                          className="size-3.5 rounded-[2px] border-slate-300 accent-[#d8832a] cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-xs">必填</span>
                      </label>
                    </div>

                    {/* 输入控件仿真与红色 ⊗ 移除按钮 */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-8.5 rounded border border-slate-200 bg-[#f9fafb] px-3 flex items-center text-xs text-slate-400 select-none shadow-2xs">
                        {renderInputMock(item.key, def)}
                      </div>

                      {/* 红色圆圈 ⊗ 删除按钮 */}
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleRemoveItem(item.key)}
                        title={`删除「${item.label}」`}
                        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40 shrink-0 p-0.5"
                      >
                        <XCircle className="size-4 text-red-400/90 hover:text-red-500" />
                      </button>
                    </div>

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

      {/* 选择其他收集信息弹窗 (对齐前面提供的弹窗样式) */}
      <OtherCollectSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedItems={value}
        onConfirm={onChange}
      />
    </div>
  )
}
