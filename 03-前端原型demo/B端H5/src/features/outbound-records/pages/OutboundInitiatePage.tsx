import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  Check,
  User,
  Camera,
  FileText,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import { NativeOutboundStepBar } from "../components/NativeOutboundStepBar"
import {
  MOBILE_MANUAL_OUTBOUND_TYPES,
  OUTBOUND_INITIATE_GOODS_ROUTE,
  TASKS_ROUTE,
} from "../domain/constants"
import {
  COMMON_AVAILABLE_STOCK,
  FORM_WAREHOUSES,
  OWNER_CANDIDATES,
  RELATED_ORDER_CANDIDATES,
  type OwnerCandidate,
  type RelatedOrderItem,
} from "../mock/outbound-form.mock"
import {
  loadOutboundInitiateForm,
  saveOutboundInitiateForm,
  type OutboundFormState,
  type OutboundGoodsItem,
} from "../lib/outbound-initiate-session"

export function OutboundInitiatePage() {
  const navigate = useNavigate()

  // 1. 基础信息
  const [selectedOwner, setSelectedOwner] = useState<OwnerCandidate>(
    OWNER_CANDIDATES[0]
  )
  const [outboundType, setOutboundType] = useState<
    "普通出库" | "仓单出库" | "质押出库" | "抵押出库"
  >("质押出库")
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    FORM_WAREHOUSES[0].name
  )
  const [selectedRelatedOrder, setSelectedRelatedOrder] =
    useState<RelatedOrderItem | null>(RELATED_ORDER_CANDIDATES[0])

  // 2. 货品预载
  const [goodsList, setGoodsList] = useState<OutboundGoodsItem[]>(() => {
    return RELATED_ORDER_CANDIDATES[0].items.map((item, idx) => ({
      ...item,
      id: `G-${idx}`,
      selected: true,
      outboundAmount: idx === 0 ? 500 : 200,
    }))
  })

  // 3. 提货信息
  const [pickupPersonType, setPickupPersonType] = useState<"个人" | "企业">(
    "个人"
  )
  const [pickupName, setPickupName] = useState("张师傅")
  const [pickupPhone, setPickupPhone] = useState("13800138000")
  const [pickupIdCard, setPickupIdCard] = useState("510104198501018888")
  const [pickupPlateNo, setPickupPlateNo] = useState("川A·88888")
  const [pickupOperator, setPickupOperator] = useState("李代表")

  // 4. 现场照片（必传）
  const [sitePhotos, setSitePhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
  ])

  // 5. 备注
  const [notes, setNotes] = useState("质押监管到期，经资方审批同意正常出库")

  // 弹窗状态
  const [ownerModalOpen, setOwnerModalOpen] = useState(false)
  const [typeModalOpen, setTypeModalOpen] = useState(false)
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false)
  const [relatedOrderModalOpen, setRelatedOrderModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const saved = loadOutboundInitiateForm()
    if (saved) {
      setSelectedOwner(saved.owner)
      setOutboundType(saved.outboundType)
      setSelectedWarehouse(saved.warehouseName)
      setSelectedRelatedOrder(saved.relatedOrder)
      setPickupPersonType(saved.pickupType)
      setPickupName(saved.pickupName)
      setPickupPhone(saved.pickupPhone)
      setPickupIdCard(saved.pickupIdCard)
      setPickupPlateNo(saved.pickupPlateNo)
      setPickupOperator(saved.pickupOperator || "")
      setSitePhotos(saved.sitePhotos)
      setNotes(saved.notes)
      if (saved.goodsList && saved.goodsList.length > 0) {
        setGoodsList(saved.goodsList)
      }
    }
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  // 切换出库类型
  const handleTypeChange = (
    type: "普通出库" | "仓单出库" | "质押出库" | "抵押出库"
  ) => {
    setOutboundType(type)
    setTypeModalOpen(false)
    if (type === "普通出库") {
      setSelectedRelatedOrder(null)
      setGoodsList(
        COMMON_AVAILABLE_STOCK.slice(0, 2).map((item, idx) => ({
          ...item,
          id: `COMM-${idx}`,
          selected: true,
          outboundAmount: idx === 0 ? 100 : 50,
        }))
      )
    } else {
      const matched = RELATED_ORDER_CANDIDATES.find((r) => r.type === type)
      if (matched) {
        setSelectedRelatedOrder(matched)
        setGoodsList(
          matched.items.map((item, idx) => ({
            ...item,
            id: `REL-${idx}`,
            selected: true,
            outboundAmount: item.availableAmount,
          }))
        )
      } else {
        setSelectedRelatedOrder(null)
        setGoodsList([])
      }
    }
  }

  // 关联单号变更
  const handleSelectRelatedOrder = (order: RelatedOrderItem) => {
    setSelectedRelatedOrder(order)
    setSelectedWarehouse(order.warehouseName)
    setGoodsList(
      order.items.map((item, idx) => ({
        ...item,
        id: `REL-${idx}`,
        selected: true,
        outboundAmount: item.availableAmount,
      }))
    )
    setRelatedOrderModalOpen(false)
    showToast(`已关联单据 ${order.orderNo} 并同步带出在押货品`)
  }

  const handleAddPhoto = () => {
    if (sitePhotos.length >= 6) {
      showToast("现场核验照片最多上传6张")
      return
    }
    const samplePhotos = [
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=60",
    ]
    const nextPhoto = samplePhotos[sitePhotos.length % samplePhotos.length]
    setSitePhotos([...sitePhotos, nextPhoto])
    showToast("已成功添加现场核实照片")
  }

  const handleRemovePhoto = (index: number) => {
    setSitePhotos(sitePhotos.filter((_, i) => i !== index))
  }

  // 校验并进入下一步
  const handleGoNext = () => {
    if (!selectedOwner) {
      showToast("请选择货主")
      return
    }
    if (outboundType !== "普通出库" && !selectedRelatedOrder) {
      showToast("质押/仓单/抵押出库必须选择关联合同或单据")
      return
    }
    if (!pickupName.trim()) {
      showToast("请输入提货人姓名")
      return
    }
    if (!pickupPhone.trim() || !/^1[3-9]\d{9}$/.test(pickupPhone.trim())) {
      showToast("请输入合法的11位提货人手机号")
      return
    }
    if (!pickupIdCard.trim() || pickupIdCard.trim().length < 15) {
      showToast("请输入合法的提货人身份证号码")
      return
    }
    if (sitePhotos.length === 0) {
      showToast("出库现场照片为强管控要素，至少需拍摄1张")
      return
    }

    const stateToSave: OutboundFormState = {
      owner: selectedOwner,
      outboundType,
      warehouseName: selectedWarehouse,
      relatedOrder: selectedRelatedOrder,
      pickupType: pickupPersonType,
      pickupName: pickupName.trim(),
      pickupPhone: pickupPhone.trim(),
      pickupIdCard: pickupIdCard.trim(),
      pickupPlateNo: pickupPlateNo.trim(),
      pickupOperator: pickupOperator.trim(),
      sitePhotos,
      notes: notes.trim(),
      goodsList,
    }

    saveOutboundInitiateForm(stateToSave)
    navigate(OUTBOUND_INITIATE_GOODS_ROUTE)
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#F2F3F7]">
        <PrototypeAnnotationTarget annotationIds={["outbound-h5-initiate"]}>
          <NavBar
            title="出库申请发起"
            onBack={() => navigate(TASKS_ROUTE)}
          />
        </PrototypeAnnotationTarget>

        {/* 步骤条 */}
        <div className="bg-white px-4 border-b border-[#232D39]/5">
          <NativeOutboundStepBar current={0} />
        </div>

        {/* 吐司提示 */}
        {toast && (
          <div className="fixed top-14 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#232D39]/90 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm animate-fade-in">
            {toast}
          </div>
        )}

        {/* 主表单区域 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3 space-y-3 pb-28">
          {/* 1. 货主与基本信息 */}
          <NativeInfoCard
            title="货主与出库信息"
            icon={<Building2 className="size-4 text-orange-600" />}
          >
            <NativeFormRow label="货主类型" required>
              <div className="flex gap-4">
                {(["企业", "个人"] as const).map((t) => {
                  const active = selectedOwner.type === t
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`flex h-7 px-4 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? "bg-orange-50 text-orange-600 border border-orange-200"
                          : "bg-[#232D39]/5 text-[#232D39]/60 border border-transparent"
                      }`}
                      onClick={() => {
                        const found = OWNER_CANDIDATES.find((c) => c.type === t)
                        if (found) setSelectedOwner(found)
                      }}
                    >
                      {t}货主
                    </button>
                  )
                })}
              </div>
            </NativeFormRow>

            <NativeFormRow label="货主名称" required>
              <button
                type="button"
                className="flex items-center justify-end text-xs text-[#232D39] font-medium active:opacity-70"
                onClick={() => setOwnerModalOpen(true)}
              >
                <span>{selectedOwner.name}</span>
                <span className="ml-1 text-[#232D39]/40">›</span>
              </button>
            </NativeFormRow>

            <NativeFormRow label="货主识别码">
              <span className="text-xs text-[#232D39]/70 font-mono">
                {selectedOwner.identifier}
              </span>
            </NativeFormRow>

            <NativeFormRow label="出库类型" required>
              <button
                type="button"
                className="flex items-center justify-end text-xs text-orange-600 font-medium active:opacity-70"
                onClick={() => setTypeModalOpen(true)}
              >
                <span>{outboundType}</span>
                <span className="ml-1 text-[#232D39]/40">›</span>
              </button>
            </NativeFormRow>

            <NativeFormRow label="所属仓库" required>
              <button
                type="button"
                className="flex items-center justify-end text-xs text-[#232D39] font-medium active:opacity-70"
                onClick={() => setWarehouseModalOpen(true)}
              >
                <span>{selectedWarehouse}</span>
                <span className="ml-1 text-[#232D39]/40">›</span>
              </button>
            </NativeFormRow>

            {outboundType !== "普通出库" && (
              <NativeFormRow label="关联合同/单据" required>
                <button
                  type="button"
                  className="flex items-center justify-end text-xs text-orange-600 font-medium active:opacity-70 text-right truncate max-w-[200px]"
                  onClick={() => setRelatedOrderModalOpen(true)}
                >
                  <span className="truncate">
                    {selectedRelatedOrder
                      ? selectedRelatedOrder.orderNo
                      : "请选择关联在押单据"}
                  </span>
                  <span className="ml-1 text-[#232D39]/40">›</span>
                </button>
              </NativeFormRow>
            )}

            {selectedRelatedOrder && outboundType !== "普通出库" && (
              <div className="rounded-lg bg-orange-50/70 p-2.5 text-xs text-orange-800 space-y-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-orange-600/80">关联单据状态:</span>
                  <span className="font-medium">
                    {selectedRelatedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600/80">在押监管仓库:</span>
                  <span className="font-medium">
                    {selectedRelatedOrder.warehouseName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600/80">包含货品项数:</span>
                  <span className="font-medium">
                    {selectedRelatedOrder.items.length} 种在押货品
                  </span>
                </div>
              </div>
            )}
          </NativeInfoCard>

          {/* 2. 提货信息 */}
          <NativeInfoCard
            title="提货人信息"
            icon={<User className="size-4 text-orange-600" />}
          >
            <NativeFormRow label="提货主体" required>
              <div className="flex gap-4">
                {(["个人", "企业"] as const).map((t) => {
                  const active = pickupPersonType === t
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`flex h-7 px-4 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? "bg-orange-50 text-orange-600 border border-orange-200"
                          : "bg-[#232D39]/5 text-[#232D39]/60 border border-transparent"
                      }`}
                      onClick={() => setPickupPersonType(t)}
                    >
                      {t}提货
                    </button>
                  )
                })}
              </div>
            </NativeFormRow>

            <NativeFormRow label="提货人姓名" required>
              <input
                type="text"
                value={pickupName}
                onChange={(e) => setPickupName(e.target.value)}
                placeholder="请填写提货人姓名"
                className="w-44 text-right text-xs text-[#232D39] outline-none placeholder:text-[#232D39]/30"
              />
            </NativeFormRow>

            <NativeFormRow label="联系电话" required>
              <input
                type="tel"
                maxLength={11}
                value={pickupPhone}
                onChange={(e) => setPickupPhone(e.target.value)}
                placeholder="11位手机号码"
                className="w-44 text-right text-xs text-[#232D39] outline-none placeholder:text-[#232D39]/30"
              />
            </NativeFormRow>

            <NativeFormRow label="身份证号" required>
              <input
                type="text"
                maxLength={18}
                value={pickupIdCard}
                onChange={(e) => setPickupIdCard(e.target.value)}
                placeholder="提货人二代身份证"
                className="w-44 text-right text-xs text-[#232D39] outline-none placeholder:text-[#232D39]/30 font-mono"
              />
            </NativeFormRow>

            {pickupPersonType === "企业" && (
              <NativeFormRow label="经办代表姓名">
                <input
                  type="text"
                  value={pickupOperator}
                  onChange={(e) => setPickupOperator(e.target.value)}
                  placeholder="授权委托经办人"
                  className="w-44 text-right text-xs text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                />
              </NativeFormRow>
            )}

            <NativeFormRow label="车牌号码">
              <input
                type="text"
                value={pickupPlateNo}
                onChange={(e) => setPickupPlateNo(e.target.value)}
                placeholder="例如：川A·88888"
                className="w-44 text-right text-xs text-[#232D39] outline-none placeholder:text-[#232D39]/30 font-mono"
              />
            </NativeFormRow>
          </NativeInfoCard>

          {/* 3. 现场核实照片 */}
          <NativeInfoCard
            title="现场照片与凭证"
            icon={<Camera className="size-4 text-orange-600" />}
          >
            <div className="py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#232D39]/70">
                  出库提货核查抓拍 <span className="text-red-500">*</span>
                </span>
                <span className="text-xs text-[#232D39]/40">
                  {sitePhotos.length}/6
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sitePhotos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-lg border border-[#232D39]/10 group"
                  >
                    <img
                      src={url}
                      alt="现场照片"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white active:bg-black"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {sitePhotos.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-[#232D39]/20 bg-[#232D39]/[0.02] active:bg-[#232D39]/5"
                  >
                    <Camera className="size-5 text-[#232D39]/40" />
                    <span className="mt-1 text-[10px] text-[#232D39]/60">拍照上传</span>
                  </button>
                )}
              </div>
            </div>
          </NativeInfoCard>

          {/* 4. 备注说明 */}
          <NativeInfoCard
            title="出库申请备注"
            icon={<FileText className="size-4 text-orange-600" />}
          >
            <div className="py-2">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="请填写出库相关背景、资方解质审批文号等备注说明..."
                className="w-full rounded-lg bg-[#232D39]/5 p-2.5 text-xs text-[#232D39] outline-none placeholder:text-[#232D39]/30"
              />
            </div>
          </NativeInfoCard>
        </div>

        {/* 底部吸底主按钮 */}
        <div className="fixed inset-x-0 bottom-0 z-30 bg-white border-t border-[#232D39]/10 p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(TASKS_ROUTE)}
              className="h-11 px-5 rounded-xl border border-[#232D39]/20 text-xs font-medium text-[#232D39]/70 active:bg-gray-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleGoNext}
              className="flex-1 h-11 rounded-xl bg-orange-600 text-sm font-medium text-white shadow-md shadow-orange-500/20 active:bg-orange-700 flex items-center justify-center gap-1"
            >
              下一步：选择出库货物
              <span className="text-base leading-none">›</span>
            </button>
          </div>
        </div>

        {/* 货主选择弹窗 */}
        {ownerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-h-[70vh] rounded-t-2xl bg-white p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
                <span className="text-sm font-bold text-[#232D39]">
                  选择货主主体
                </span>
                <button
                  type="button"
                  className="text-xs text-[#232D39]/60"
                  onClick={() => setOwnerModalOpen(false)}
                >
                  关闭
                </button>
              </div>
              <div className="overflow-y-auto space-y-2 flex-1">
                {OWNER_CANDIDATES.filter((c) => c.type === selectedOwner.type).map(
                  (c) => (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                        selectedOwner.id === c.id
                          ? "border-orange-500 bg-orange-50/50 text-orange-900 font-medium"
                          : "border-[#232D39]/10 active:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedOwner(c)
                        setOwnerModalOpen(false)
                      }}
                    >
                      <div>
                        <div className="font-semibold text-[#232D39]">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-[#232D39]/60 mt-0.5">
                          {c.identifier}
                        </div>
                      </div>
                      {selectedOwner.id === c.id && (
                        <Check className="size-4 text-orange-600" />
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* 出库类型选择弹窗 */}
        {typeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full rounded-t-2xl bg-white p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
                <span className="text-sm font-bold text-[#232D39]">
                  选择出库业务类型
                </span>
                <button
                  type="button"
                  className="text-xs text-[#232D39]/60"
                  onClick={() => setTypeModalOpen(false)}
                >
                  关闭
                </button>
              </div>
              <div className="space-y-2">
                {MOBILE_MANUAL_OUTBOUND_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs ${
                      outboundType === t
                        ? "border-orange-500 bg-orange-50 text-orange-900 font-medium"
                        : "border-[#232D39]/10 active:bg-gray-50"
                    }`}
                    onClick={() => handleTypeChange(t)}
                  >
                    <span>{t}</span>
                    {outboundType === t && (
                      <Check className="size-4 text-orange-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 仓库选择弹窗 */}
        {warehouseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full rounded-t-2xl bg-white p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
                <span className="text-sm font-bold text-[#232D39]">
                  选择监管仓库
                </span>
                <button
                  type="button"
                  className="text-xs text-[#232D39]/60"
                  onClick={() => setWarehouseModalOpen(false)}
                >
                  关闭
                </button>
              </div>
              <div className="space-y-2">
                {FORM_WAREHOUSES.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs ${
                      selectedWarehouse === w.name
                        ? "border-orange-500 bg-orange-50 text-orange-900 font-medium"
                        : "border-[#232D39]/10 active:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedWarehouse(w.name)
                      setWarehouseModalOpen(false)
                    }}
                  >
                    <span>{w.name}</span>
                    {selectedWarehouse === w.name && (
                      <Check className="size-4 text-orange-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 关联合同选择弹窗 */}
        {relatedOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-h-[75vh] rounded-t-2xl bg-white p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
                <span className="text-sm font-bold text-[#232D39]">
                  选择关联业务单据（{outboundType}）
                </span>
                <button
                  type="button"
                  className="text-xs text-[#232D39]/60"
                  onClick={() => setRelatedOrderModalOpen(false)}
                >
                  关闭
                </button>
              </div>
              <div className="overflow-y-auto space-y-2 flex-1">
                {RELATED_ORDER_CANDIDATES.filter(
                  (r) => r.type === outboundType
                ).map((order) => (
                  <div
                    key={order.orderNo}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 cursor-pointer ${
                      selectedRelatedOrder?.orderNo === order.orderNo
                        ? "border-orange-500 bg-orange-50/50"
                        : "border-[#232D39]/10 active:bg-gray-50"
                    }`}
                    onClick={() => handleSelectRelatedOrder(order)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#232D39]">
                        {order.orderNo}
                      </span>
                      <span className="text-orange-600 font-medium">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#232D39]/70 flex justify-between">
                      <span>仓库: {order.warehouseName}</span>
                      <span>品类: {order.items.length} 种在押货品</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  )
}
