import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Package,
  Plus,
  Trash2,
  QrCode,
  Check,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { NativeOutboundStepBar } from "../components/NativeOutboundStepBar"
import {
  OUTBOUND_INITIATE_ROUTE,
  OUTBOUND_MGR_ROUTE,
  TASKS_ROUTE,
} from "../domain/constants"
import {
  loadOutboundInitiateForm,
  saveOutboundInitiateForm,
  clearOutboundInitiateForm,
  type OutboundFormState,
  type OutboundGoodsItem,
} from "../lib/outbound-initiate-session"
import {
  COMMON_AVAILABLE_STOCK,
} from "../mock/outbound-form.mock"

export function OutboundInitiateGoodsPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<OutboundFormState | null>(null)
  const [stockPickerOpen, setStockPickerOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [createdOrderNo, setCreatedOrderNo] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const saved = loadOutboundInitiateForm()
    if (!saved) {
      navigate(OUTBOUND_INITIATE_ROUTE, { replace: true })
      return
    }
    setForm(saved)
  }, [navigate])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const patchGoods = (goodsList: OutboundGoodsItem[]) => {
    if (!form) return
    const nextForm: OutboundFormState = { ...form, goodsList }
    setForm(nextForm)
    saveOutboundInitiateForm(nextForm)
  }

  // 计算合计
  const totals = useMemo(() => {
    if (!form?.goodsList) return { count: 0, weight: 0, selectedCount: 0 }
    const selected = form.goodsList.filter((g) => g.selected)
    const weight = selected.reduce((sum, g) => sum + (Number(g.outboundAmount) || 0), 0)
    return {
      count: form.goodsList.length,
      selectedCount: selected.length,
      weight: Math.round(weight * 100) / 100,
    }
  }, [form?.goodsList])

  if (!form) {
    return (
      <MobileShell>
        <NavBar title="出库货物明细" onBack={() => navigate(OUTBOUND_INITIATE_ROUTE)} />
        <div className="flex flex-1 items-center justify-center text-sm text-[#232D39]/60">
          加载中…
        </div>
      </MobileShell>
    )
  }

  // 切换货品选中状态
  const handleToggleSelect = (id: string) => {
    const next = form.goodsList.map((g) =>
      g.id === id ? { ...g, selected: !g.selected } : g
    )
    patchGoods(next)
  }

  // 修改出库数量
  const handleAmountChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0
    const next = form.goodsList.map((g) =>
      g.id === id ? { ...g, outboundAmount: num } : g
    )
    patchGoods(next)
  }

  // 移除货品
  const handleRemoveItem = (id: string) => {
    const next = form.goodsList.filter((g) => g.id !== id)
    patchGoods(next)
    showToast("已移除该货物")
  }

  // 添加更多货物
  const handleAddStockItem = (item: (typeof COMMON_AVAILABLE_STOCK)[0]) => {
    const exists = form.goodsList.find((g) => g.goodsName === item.goodsName && g.specName === item.specName)
    if (exists) {
      showToast("该货物已在出库列表中")
      return
    }
    const newItem: OutboundGoodsItem = {
      ...item,
      id: `ADD-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      selected: true,
      outboundAmount: Math.min(100, item.availableAmount),
    }
    patchGoods([...form.goodsList, newItem])
    setStockPickerOpen(false)
    showToast(`已添加货物：${newItem.goodsName}`)
  }

  // 提交出库申请
  const handleSubmit = () => {
    const selected = form.goodsList.filter((g) => g.selected)
    if (selected.length === 0) {
      showToast("请至少勾选一项拟出库货物")
      return
    }

    // 数量校验
    for (const g of selected) {
      if (!g.outboundAmount || g.outboundAmount <= 0) {
        showToast(`货物【${g.goodsName}】的出库数量必须大于0`)
        return
      }
      if (g.outboundAmount > g.availableAmount) {
        showToast(
          `货物【${g.goodsName}】出库量(${g.outboundAmount})超过可用在押量(${g.availableAmount})`
        )
        return
      }
    }

    // 生成出库编号
    const genNo = `CK${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${Math.floor(1000 + Math.random() * 9000)}`
    setCreatedOrderNo(genNo)
    setSuccessDialogOpen(true)
    clearOutboundInitiateForm()
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#F2F3F7]">
        <PrototypeAnnotationTarget annotationIds={["outbound-h5-initiate-goods"]}>
          <NavBar
            title="出库货物明细"
            onBack={() => navigate(OUTBOUND_INITIATE_ROUTE)}
          />
        </PrototypeAnnotationTarget>

        {/* 步骤条 */}
        <div className="bg-white px-4 border-b border-[#232D39]/5">
          <NativeOutboundStepBar current={1} />
        </div>

        {/* 吐司提示 */}
        {toast && (
          <div className="fixed top-14 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#232D39]/90 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm animate-fade-in">
            {toast}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3 space-y-3 pb-32">
          {/* 合计信息卡片（对齐入库 Step 1） */}
          <section className="rounded-xl bg-white p-3.5 shadow-sm border border-[#232D39]/5">
            <div className="flex items-center justify-between border-b border-[#232D39]/5 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#232D39]">出库货物统计</span>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-600">
                  {form.outboundType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 active:bg-orange-100"
                  onClick={() => setStockPickerOpen(true)}
                >
                  <Plus className="size-3.5" />
                  选货
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg bg-[#232D39]/5 px-2.5 py-1 text-xs font-medium text-[#232D39]/70 active:bg-[#232D39]/10"
                  onClick={() => showToast("扫码选货已启动模拟读取")}
                >
                  <QrCode className="size-3.5" />
                  扫码
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-[#232D39]/[0.02] p-2">
                <div className="text-[11px] text-[#232D39]/60">已选品类</div>
                <div className="mt-0.5 text-sm font-bold text-[#232D39]">
                  {totals.selectedCount} / {totals.count} 种
                </div>
              </div>
              <div className="rounded-lg bg-[#232D39]/[0.02] p-2">
                <div className="text-[11px] text-[#232D39]/60">监管仓库</div>
                <div className="mt-0.5 text-xs font-semibold text-[#232D39] truncate">
                  {form.warehouseName}
                </div>
              </div>
              <div className="rounded-lg bg-orange-50/50 p-2 border border-orange-100">
                <div className="text-[11px] text-orange-700/70">合计出库量</div>
                <div className="mt-0.5 text-sm font-bold text-orange-600">
                  {totals.weight.toLocaleString()} 吨
                </div>
              </div>
            </div>
          </section>

          {/* 货品卡片明细列表 */}
          {form.goodsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-8 text-center border border-[#232D39]/5">
              <Package className="size-10 text-[#232D39]/20" />
              <div className="mt-2 text-xs font-medium text-[#232D39]/60">
                暂无出库货品，请点击上方【选货】添加
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {form.goodsList.map((item) => {
                const isOver = item.outboundAmount > item.availableAmount
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl bg-white shadow-sm border transition-all overflow-hidden ${
                      item.selected
                        ? "border-orange-200"
                        : "border-[#232D39]/10 opacity-75"
                    }`}
                  >
                    {/* 卡片头部 */}
                    <div className="flex items-center justify-between bg-[#232D39]/[0.02] px-3.5 py-2.5 border-b border-[#232D39]/5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(item.id)}
                          className={`flex size-5 items-center justify-center rounded border transition-colors ${
                            item.selected
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-[#232D39]/30 bg-white"
                          }`}
                        >
                          {item.selected && <Check className="size-3.5 stroke-[3]" />}
                        </button>
                        <span className="text-xs font-bold text-[#232D39]">
                          {item.goodsName}
                        </span>
                        <span className="text-[10px] rounded bg-gray-100 px-1.5 py-0.5 text-[#232D39]/60">
                          {item.categoryName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[#232D39]/40 hover:text-red-500 active:opacity-60"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    {/* 卡片身体：灰色指标区（对齐源码 record-item） */}
                    <div className="p-3.5 space-y-2.5">
                      <div className="rounded-lg bg-[#232D39]/5 p-2.5 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[#232D39]/60">存放位置</span>
                          <span className="text-[#232D39] font-medium">
                            {item.locationPath}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#232D39]/60">规格型号</span>
                          <span className="text-[#232D39]">
                            {item.specName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#232D39]/60">在库可用库存</span>
                          <span className="text-emerald-600 font-bold">
                            {item.availableAmount.toLocaleString()} {item.unit}
                          </span>
                        </div>
                      </div>

                      {/* 出库数量录入 */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs font-medium text-[#232D39]">
                          <span className="text-red-500 mr-0.5">*</span>
                          本次出库量
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`flex items-center rounded-lg border px-2 py-1 ${
                              isOver
                                ? "border-red-400 bg-red-50/50"
                                : "border-[#232D39]/20 bg-white"
                            }`}
                          >
                            <input
                              type="number"
                              disabled={!item.selected}
                              value={item.outboundAmount || ""}
                              onChange={(e) =>
                                handleAmountChange(item.id, e.target.value)
                              }
                              className="w-24 text-right text-xs font-bold text-[#232D39] outline-none disabled:bg-transparent"
                              placeholder="0.00"
                            />
                            <span className="ml-1 text-xs text-[#232D39]/60">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isOver && (
                        <div className="flex items-center gap-1 text-[11px] text-red-600">
                          <AlertTriangle className="size-3" />
                          <span>超出可用在押量 {item.availableAmount} {item.unit}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 底部悬浮固定汇总与提交栏（对齐 InboundFormSummaryBarMobile） */}
        <div className="fixed inset-x-0 bottom-0 z-30 bg-white border-t border-[#232D39]/10 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-[#232D39]/60">
                已勾选 <span className="font-semibold text-[#232D39]">{totals.selectedCount}</span> 项
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs text-[#232D39]/80 font-medium">合计:</span>
                <span className="text-base font-bold text-orange-600">
                  {totals.weight.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-orange-600">吨</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(OUTBOUND_INITIATE_ROUTE)}
                className="h-10 px-4 rounded-xl border border-[#232D39]/20 text-xs font-medium text-[#232D39]/70 active:bg-gray-50"
              >
                上一步
              </button>
              <button
                type="button"
                disabled={totals.selectedCount === 0}
                onClick={handleSubmit}
                className="h-10 px-6 rounded-xl bg-orange-600 text-xs font-medium text-white shadow-md shadow-orange-500/20 active:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
              >
                提交出库申请
              </button>
            </div>
          </div>
        </div>

        {/* 选择货物弹窗 */}
        {stockPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-h-[75vh] rounded-t-2xl bg-white p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
                <span className="text-sm font-bold text-[#232D39]">
                  从库房选择货物
                </span>
                <button
                  type="button"
                  className="text-xs text-[#232D39]/60"
                  onClick={() => setStockPickerOpen(false)}
                >
                  关闭
                </button>
              </div>
              <div className="overflow-y-auto space-y-2 flex-1">
                {COMMON_AVAILABLE_STOCK.map((stock) => (
                  <div
                    key={stock.barcode}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#232D39]/10 active:bg-gray-50 text-xs"
                    onClick={() => handleAddStockItem(stock)}
                  >
                    <div>
                      <div className="font-bold text-[#232D39]">
                        {stock.goodsName}
                      </div>
                      <div className="text-[11px] text-[#232D39]/60 mt-0.5">
                        {stock.specName} · {stock.locationPath}
                      </div>
                      <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                        可用库存: {stock.availableAmount} {stock.unit}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600"
                    >
                      添加
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 提交成功弹窗 */}
        {successDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-2xl">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="mt-3 text-base font-bold text-[#232D39]">
                出库申请提交成功
              </h3>
              <p className="mt-1 text-xs text-[#232D39]/60">
                单据编号: <span className="font-mono font-bold text-[#232D39]">{createdOrderNo}</span>
              </p>
              <div className="my-3 rounded-xl bg-[#232D39]/5 p-2.5 text-left text-xs space-y-1 text-[#232D39]/70">
                <div>货主主体: {form.owner.name}</div>
                <div>出库类型: {form.outboundType}</div>
                <div>提货车牌: {form.pickupPlateNo || "未指定"}</div>
                <div>拟出库量: {totals.weight} 吨</div>
              </div>
              <div className="space-y-2 mt-4">
                <button
                  type="button"
                  onClick={() => navigate(OUTBOUND_MGR_ROUTE)}
                  className="w-full rounded-xl bg-orange-600 py-2.5 text-xs font-medium text-white active:bg-orange-700"
                >
                  查看出库记录列表
                </button>
                <button
                  type="button"
                  onClick={() => navigate(TASKS_ROUTE)}
                  className="w-full rounded-xl bg-gray-100 py-2.5 text-xs font-medium text-[#232D39]/70 active:bg-gray-200"
                >
                  返回业务办理工作台
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  )
}
