import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  Package,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { ReceiptStepBar } from "../../components/ReceiptStepBar"
import { HighFidelityFaceModal, type FaceSignatureResult } from "../../components/HighFidelityFaceModal"
import {
  RECEIPT_H5_INITIATE_GOODS_ROUTE,
} from "../../domain/constants"
import {
  buildReceiptFromDraft,
  persistCreatedReceipt,
} from "../../lib/created-receipts"
import {
  clearReceiptDraft,
  loadReceiptDraft,
} from "../../lib/receipt-initiate-session"
import {
  buildFifoGoodsLines,
  buildFifoPlan,
  fifoPlanTotal,
} from "../../lib/receipt-fifo"
import { mobileIssuanceCandidates } from "../../mock/warehouse-receipts.mock"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"

const INITIATE_STEPS = ["货主主体", "圈选货品", "协议与认证", "完成凭证"] as const

export function ReceiptInitiateConfirmPage() {
  const navigate = useNavigate()
  const [draft] = useState(loadReceiptDraft)
  const [faceModalOpen, setFaceModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  // 货品列表汇总
  const ownerCandidates = useMemo(
    () =>
      mobileIssuanceCandidates.filter((item) => item.ownerId === draft.ownerId),
    [draft.ownerId],
  )

  const activeCandidates = useMemo(
    () =>
      ownerCandidates.filter((item) => item.warehouseName === draft.warehouseName),
    [ownerCandidates, draft.warehouseName],
  )

  const fifoLine = useMemo(
    () =>
      buildFifoGoodsLines(activeCandidates).find(
        (line) => line.key === draft.fifoGoodsKey,
      ),
    [activeCandidates, draft.fifoGoodsKey],
  )

  const fifoPlan = useMemo(
    () =>
      buildFifoPlan(
        activeCandidates,
        draft.fifoGoodsKey,
        Number(draft.fifoTotal) || 0,
      ),
    [activeCandidates, draft.fifoGoodsKey, draft.fifoTotal],
  )

  const customCandidates = useMemo(
    () =>
      activeCandidates.filter((item) =>
        draft.selectedCandidateIds.includes(item.id),
      ),
    [activeCandidates, draft.selectedCandidateIds],
  )

  const totalQuantity = useMemo(() => {
    if (draft.deductMode === "FIFO") {
      return fifoPlanTotal(fifoPlan)
    }
    return customCandidates.reduce((sum, item) => {
      const q = Number(draft.allocations[item.id] ?? item.remainQuantity) || 0
      return sum + q
    }, 0)
  }, [draft.deductMode, fifoPlan, customCandidates, draft.allocations])

  const goodsUnit =
    draft.deductMode === "FIFO"
      ? fifoLine?.unit ?? "吨"
      : customCandidates[0]?.unit ?? "吨"

  // 认证成功后提交
  const handleSignatureSuccess = (result: FaceSignatureResult) => {
    setFaceModalOpen(false)
    const newReceipt = buildReceiptFromDraft(draft)
    persistCreatedReceipt(newReceipt)
    clearReceiptDraft()

    // 跳转第 4 步成功页
    navigate(`/m/receipts/initiate/success?id=${newReceipt.id}&code=${newReceipt.code}`, {
      replace: true,
    })
  }

  return (
    <MobileShell>
      {/* 统一为全站标准底色 bg-[#edf2f8] */}
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        {/* 顶部导航 */}
        <PrototypeAnnotationTarget annotationIds={["receipt-initiate-page"]}>
          <NavBar title="仓单开立" backTo={RECEIPT_H5_INITIATE_GOODS_ROUTE} />
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
          {/* 步骤条：当前第 3 步，对齐经典蓝 theme="blue" */}
          <ReceiptStepBar current={2} steps={INITIATE_STEPS} theme="blue" />

          <div className="space-y-3">
            {/* 货主主体信息卡片 */}
            <section className="rounded-2xl border border-[#232D39]/8 bg-white p-4 shadow-xs">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#232D39] border-b border-gray-100 pb-2.5">
                <Building2 className="size-4 text-blue-600" />
                货主主体信息
              </h3>
              <div className="mt-2.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">货主类型</span>
                  <span className="font-medium text-[#232D39]">
                    {draft.ownerType === "ENTERPRISE" ? "企业货主" : "个人货主"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">货主名称</span>
                  <span className="font-semibold text-[#232D39]">
                    {draft.ownerName || "--"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">货主标识</span>
                  <span className="font-mono text-gray-700">
                    {draft.ownerIdentifier || "--"}
                  </span>
                </div>

                {draft.ownerType === "ENTERPRISE" ? (
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-100 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">经办人姓名</span>
                      <span className="font-medium text-[#232D39]">
                        {draft.handledBy || "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">经办人手机</span>
                      <span className="text-gray-700">
                        {draft.handledMobile || "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">经办人身份证</span>
                      <span className="text-gray-700">
                        {draft.handledByNo || "--"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            {/* 拟开立货品明细卡片 */}
            <section className="rounded-2xl border border-[#232D39]/8 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#232D39]">
                  <Package className="size-4 text-blue-600" />
                  拟开立货品明细
                </h3>
                <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                  合计 {formatReceiptQuantity(totalQuantity)} {goodsUnit}
                </span>
              </div>

              <div className="mt-2.5 text-xs text-gray-500 flex justify-between">
                <span>开立仓库：{draft.warehouseName || "--"}</span>
                <span>模式：{draft.deductMode === "FIFO" ? "先进先出" : "自定义垛位"}</span>
              </div>

              <div className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/50">
                {draft.deductMode === "FIFO" ? (
                  fifoPlan.map((item, index) => (
                    <div
                      key={item.candidate.id}
                      className="flex items-center justify-between p-2.5 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-medium text-slate-800 truncate">
                          {index + 1}. {item.candidate.goodsName}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {item.candidate.zoneName}-{item.candidate.position || "--"}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold text-slate-800">
                        {formatReceiptQuantity(item.quantity)}{" "}
                        {item.candidate.unit}
                      </span>
                    </div>
                  ))
                ) : (
                  customCandidates.map((cand, index) => (
                    <div
                      key={cand.id}
                      className="flex items-center justify-between p-2.5 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-medium text-slate-800 truncate">
                          {index + 1}. {cand.goodsName}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {cand.zoneName}-{cand.position || "--"}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold text-slate-800">
                        {draft.allocations[cand.id] ?? cand.remainQuantity}{" "}
                        {cand.unit}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 法律防伪与二元强认证声明 */}
            <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 shadow-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="size-5 shrink-0 text-blue-600 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-blue-900">
                    法定电子签章与双因子强认证保障
                  </p>
                  <p className="leading-relaxed text-blue-700/85">
                    提交后将调用公安活体人脸比对及 6 位动态短信验证码，完成电子协议法律签署，不可撤销。
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 底部吸底操作栏：统一经典蓝 blue-600 */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(35,45,57,0.06)]">
          <button
            type="button"
            onClick={() => setFaceModalOpen(true)}
            className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-base font-semibold text-white shadow-md active:bg-blue-700"
          >
            <UserCheck className="size-5" />
            立即签署并提交开立
          </button>
        </div>

        {/* 高保真活体人脸识别 + 6位短信动态码模态弹层 */}
        <HighFidelityFaceModal
          open={faceModalOpen}
          title="数字仓单开立 · 电子签章"
          ownerPhone={
            draft.ownerType === "ENTERPRISE"
              ? draft.handledMobile || "13800138001"
              : draft.ownerIdentifier || "138****0001"
          }
          onClose={() => setFaceModalOpen(false)}
          onSuccess={handleSignatureSuccess}
        />

        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/85 px-4 py-2 text-center text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
