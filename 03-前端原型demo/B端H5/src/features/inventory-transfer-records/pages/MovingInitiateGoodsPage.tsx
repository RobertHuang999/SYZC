import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, ChevronUp, MapPin, Plus, QrCode, Scan } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { MobileDownSelectSheet } from "@/features/inbound-records/components/MobileDownSelectSheet"
import { MovingStepBar } from "../components/MovingStepBar"
import {
  MOCK_INITIATE_GOODS_LIST,
  TARGET_LOCATION_OPTIONS,
} from "../mock/moving-form.mock"
import {
  clearMovingSession,
  loadMovingSession,
  saveMovingSession,
  type MovingFormState,
} from "../lib/moving-initiate-session"

export function MovingInitiateGoodsPage() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<MovingFormState>(() => loadMovingSession())
  const [toast, setToast] = useState<string | null>(null)

  // 移入位置选择
  const [locationTarget, setLocationTarget] = useState<{
    cardIdx: number
    zoneIdx: number
    qrIdx: number
  } | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const updateForm = (next: MovingFormState) => {
    setFormState(next)
    saveMovingSession(next)
  }

  const toggleCardDetail = (cardIdx: number) => {
    const next = structuredClone(formState)
    next.goodsCards[cardIdx].showDetail = !next.goodsCards[cardIdx].showDetail
    updateForm(next)
  }

  const toggleZoneContent = (cardIdx: number, houseIdx: number, zoneIdx: number) => {
    const next = structuredClone(formState)
    const zone =
      next.goodsCards[cardIdx].respHouseDistributionInfoList[houseIdx]
        .respZoneDistributionInfoList[zoneIdx]
    zone.showContent = !zone.showContent
    updateForm(next)
  }

  const handleConfirmLocation = (locationName: string) => {
    if (!locationTarget) return
    const next = structuredClone(formState)
    const qrItem =
      next.goodsCards[locationTarget.cardIdx].respHouseDistributionInfoList[0]
        .respZoneDistributionInfoList[locationTarget.zoneIdx]
        .respStockInboundQrcodeVoList[locationTarget.qrIdx]
    qrItem.moveInLocation = locationName
    updateForm(next)
    setLocationTarget(null)
  }

  const handleAddGoods = () => {
    if (formState.goodsCards.length >= 8) {
      showToast("单次移库最多添加 8 类货品")
      return
    }
    const next = structuredClone(formState)
    next.goodsCards.push(structuredClone(MOCK_INITIATE_GOODS_LIST[0]))
    updateForm(next)
  }

  const handleRemoveGoods = (cardIdx: number) => {
    if (formState.goodsCards.length <= 1) {
      showToast("至少保留 1 类移库货品")
      return
    }
    const next = structuredClone(formState)
    next.goodsCards.splice(cardIdx, 1)
    updateForm(next)
  }

  const handleSubmit = () => {
    const missing = formState.goodsCards
      .flatMap((card) =>
        card.respHouseDistributionInfoList.flatMap((house) =>
          house.respZoneDistributionInfoList.flatMap((zone) =>
            zone.respStockInboundQrcodeVoList
          )
        )
      )
      .some((qrItem) => !qrItem.moveInLocation)
    if (missing) {
      showToast("请为每条存货明细选择移入位置后再提交")
      return
    }

    const newId = `YK${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}${Math.floor(1000 + Math.random() * 9000)}`
    clearMovingSession()
    showToast(`移库申请已提交，移库单号 ${newId}，可在移库管理查看审批进度`)
    window.setTimeout(() => navigate("/m/workspace/moving-records"), 1200)
  }

  const totalGoodsCount = formState.goodsCards.length
  const totalAmount = formState.goodsCards.reduce(
    (sum, card) => sum + (Number(card.totalSelectNumber) || 0),
    0
  )

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["moving-h5-initiate-goods"]}>
        <NavBar title="移库单填写" onBack={() => navigate("/m/transfer/initiate")} />
      </PrototypeAnnotationTarget>

      <MovingStepBar currentStep={1} />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#edf2f8] px-4 pb-36 pt-1">
        {/* 合计信息 */}
        <section className="rounded-lg bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#232D39]">合计信息</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-blue-600"
              onClick={handleAddGoods}
            >
              <Plus className="size-4" />
              添加货物
            </button>
          </div>
          <div className="mt-3 space-y-1 text-xs text-[#232D39]/80">
            <p>货品品类数：{totalGoodsCount}</p>
            <p>移库总数量：{totalAmount}</p>
          </div>
        </section>

        {formState.goodsCards.map((card, cardIdx) => (
          <section key={cardIdx} className="space-y-3 rounded-lg bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#232D39]">{card.goodsName}</h3>
                <p className="mt-0.5 text-xs text-[#232D39]/60">
                  {card.cateName}-{card.typeName}-{card.concatAttrValue}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveGoods(cardIdx)}
                className="shrink-0 text-xs text-[#232D39]/50 active:text-red-500"
              >
                删除
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#232D39]/60">移库数量</span>
              <span className="font-medium text-[#232D39]">
                {card.totalSelectNumber}
                {card.unit}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-[#232D39]/60">
                <MapPin className="size-3.5" />
                {card.repoName}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => showToast("批量移库将所选货品全部移入相同位置")}
                  className="font-medium text-blue-600 active:opacity-75"
                >
                  批量移库
                </button>
                <button
                  type="button"
                  onClick={() => toggleCardDetail(cardIdx)}
                  className="flex items-center gap-0.5 font-medium text-blue-600 active:opacity-75"
                >
                  <span>明细</span>
                  {card.showDetail ? (
                    <ChevronUp className="size-3.5" />
                  ) : (
                    <ChevronDown className="size-3.5" />
                  )}
                </button>
              </div>
            </div>

            {card.showDetail ? (
              <div className="space-y-3 border-t border-[#232D39]/10 pt-3">
                {card.respHouseDistributionInfoList.map((house, houseIdx) => (
                  <div key={houseIdx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#232D39]">{house.houseName}</span>
                      <span className="text-[#232D39]/50">
                        已选 {house.selectAmount}
                        {house.unit}
                      </span>
                    </div>

                    {house.respZoneDistributionInfoList.map((zone, zoneIdx) => (
                      <div
                        key={zoneIdx}
                        className="space-y-2 rounded-lg bg-[#232D39]/[0.03] p-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#232D39]/80">
                            {zone.zoneName} · 已选 {zone.selectAmount}
                            {zone.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleZoneContent(cardIdx, houseIdx, zoneIdx)}
                            className="flex items-center gap-0.5 text-blue-600"
                          >
                            <span>{zone.respStockInboundQrcodeVoList.length} 个位置</span>
                            {zone.showContent ? (
                              <ChevronUp className="size-3.5" />
                            ) : (
                              <ChevronDown className="size-3.5" />
                            )}
                          </button>
                        </div>

                        {zone.showContent
                          ? zone.respStockInboundQrcodeVoList.map((qrItem, qrIdx) => (
                              <div
                                key={qrIdx}
                                className="space-y-2 rounded-lg border border-[#232D39]/10 bg-white p-3 text-xs"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#232D39]">
                                      {qrItem.inboundTime}
                                    </span>
                                    <span className="rounded border border-[#232D39]/10 bg-[#232D39]/[0.03] px-1.5 py-0.5 text-[10px] text-[#232D39]/70">
                                      {qrItem.statusText}
                                    </span>
                                  </div>
                                  <QrCode className="size-4 text-[#232D39]/40" />
                                </div>

                                <div className="flex items-start justify-between gap-3">
                                  <span className="shrink-0 text-[#232D39]/50">位置信息</span>
                                  <span className="text-right text-[#232D39]">
                                    {qrItem.repoName}-{qrItem.houseName}-{qrItem.zoneName}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[#232D39]/50">入库收集信息</span>
                                  <span className="text-[#232D39]">
                                    {qrItem.attrOtherValueText || "—"}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[#232D39]/50">移库数量</span>
                                  <span className="font-medium text-[#232D39]">
                                    {qrItem.selectAmount}
                                    {qrItem.unit}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setLocationTarget({ cardIdx, zoneIdx, qrIdx })
                                  }
                                  className="flex w-full items-center justify-between rounded-lg bg-[#232D39]/[0.03] px-2.5 py-2"
                                >
                                  <span className="text-[#232D39]">
                                    <span className="mr-0.5 text-[#EF3E3E]">*</span>移入位置
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span
                                      className={
                                        qrItem.moveInLocation
                                          ? "font-medium text-blue-600"
                                          : "text-[#232D39]/40"
                                      }
                                    >
                                      {qrItem.moveInLocation || "请选择"}
                                    </span>
                                    <ChevronDown className="size-3.5 text-[#232D39]/40" />
                                  </span>
                                </button>

                                <div className="flex items-center justify-between gap-3 rounded-lg bg-[#232D39]/[0.03] px-2.5 py-2">
                                  <span className="shrink-0 text-[#232D39]">具体位置</span>
                                  <input
                                    type="text"
                                    value={qrItem.moveInDetail || ""}
                                    onChange={(event) => {
                                      const next = structuredClone(formState)
                                      next.goodsCards[cardIdx].respHouseDistributionInfoList[
                                        houseIdx
                                      ].respZoneDistributionInfoList[zoneIdx]
                                        .respStockInboundQrcodeVoList[qrIdx].moveInDetail =
                                        event.target.value
                                      updateForm(next)
                                    }}
                                    placeholder="请输入具体位置"
                                    className="w-full bg-transparent text-right text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                                  />
                                </div>
                              </div>
                            ))
                          : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-[#232D39]/10 bg-white p-3 pb-safe">
        <button
          type="button"
          className="flex h-[44px] flex-1 items-center justify-center rounded-lg border border-[#232D39]/20 text-sm text-[#232D39] active:bg-gray-50"
          onClick={() => navigate("/m/transfer/initiate")}
        >
          上一步
        </button>
        <button
          type="button"
          className="flex h-[44px] flex-[1.2] items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
          onClick={handleSubmit}
        >
          提交审核
        </button>
      </div>

      <MobileDownSelectSheet
        open={locationTarget !== null}
        title="选择移入目标库位"
        options={TARGET_LOCATION_OPTIONS.map((location) => ({
          id: location.id,
          label: location.name,
        }))}
        onClose={() => setLocationTarget(null)}
        onSelect={(option) => handleConfirmLocation(option.label)}
      />

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}
