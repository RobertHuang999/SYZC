import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  getStagingRegById,
  voidStagingReg,
} from "@prototype/shared/inbound/inbound-staging.mock"
import { StagingVoidSheet } from "../components/StagingVoidSheet"
import {
  H5_INBOUND_INITIATE_ROUTE,
  INBOUND_STAGING_LIST_ROUTE,
  inboundStagingEditQuery,
} from "../domain/constants"

function statusBadge(status: string) {
  if (status === "待补全") {
    return (
      <span className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-600">
        待补全
      </span>
    )
  }
  if (status === "已转正式") {
    return (
      <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-600">
        已转正式
      </span>
    )
  }
  return (
    <span className="rounded bg-gray-100 border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
      已作废
    </span>
  )
}

export function InboundStagingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mockTick, setMockTick] = useState(0)
  const [convertOpen, setConvertOpen] = useState(false)
  const [voidOpen, setVoidOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  useEffect(() => {
    const bump = () => setMockTick((t) => t + 1)
    window.addEventListener("staging-reg-updated", bump)
    return () => window.removeEventListener("staging-reg-updated", bump)
  }, [])

  const reg = useMemo(() => {
    void mockTick
    return id ? getStagingRegById(id) : undefined
  }, [id, mockTick])

  if (!reg) {
    return (
      <MobileShell>
        <NavBar title="入库暂存详情" backTo={INBOUND_STAGING_LIST_ROUTE} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到登记单
        </div>
      </MobileShell>
    )
  }

  const goConvert = () => {
    setConvertOpen(false)
    navigate(`${H5_INBOUND_INITIATE_ROUTE}?sourceRegId=${encodeURIComponent(reg.regNo)}`)
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["inbound-staging-h5-detail"]}>
        <NavBar title="入库暂存详情" backTo={INBOUND_STAGING_LIST_ROUTE} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-28">
        <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">登记单号</span>
              {statusBadge(reg.status)}
            </div>
            <p className="text-base font-bold text-[#232D39] leading-tight">{reg.regNo}</p>
            <p className="text-[11px] text-[#232D39]/50 pt-0.5">
              登记人： {reg.registrant} · {reg.registeredAt}
            </p>
          </div>

          <div className="pt-2 border-t border-[#232D39]/5 space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline gap-3">
              <span className="text-[#232D39]/60 shrink-0">货主/说明</span>
              <span className="font-medium text-[#232D39] text-right">
                {reg.ownerDisplay}
                {reg.ownerTag ? (
                  <span className="ml-1 font-normal text-[#232D39]/50">[{reg.ownerTag}]</span>
                ) : null}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">入库日期</span>
              <span className="text-[#232D39] text-right">{reg.inboundDate}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">入库类型</span>
              <span className="text-[#232D39] text-right">{reg.inboundType}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">入库仓库</span>
              <span className="text-[#232D39] text-right">{reg.warehouseName}</span>
            </div>
            {reg.relatedOrderNo ? (
              <div className="flex justify-between items-baseline">
                <span className="text-[#232D39]/60 shrink-0">关联单号</span>
                <span className="text-[#232D39] text-right">{reg.relatedOrderNo}</span>
              </div>
            ) : null}
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">关联正式单</span>
              <span className="text-[#232D39] text-right">{reg.relatedFormalNo ?? "—"}</span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-[#232D39]/60 shrink-0">货品摘要</span>
              <span className="max-w-[65%] text-right font-medium text-[#232D39]">
                {reg.goodsSummary}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">申报数量</span>
              <span className="font-medium text-[#232D39] text-right">
                {reg.declaredQty.toLocaleString()} {reg.unit}
              </span>
            </div>
            {reg.locationHint ? (
              <div className="flex justify-between items-baseline">
                <span className="text-[#232D39]/60 shrink-0">库位提示</span>
                <span className="text-[#232D39] text-right">{reg.locationHint}</span>
              </div>
            ) : null}
            <div className="flex justify-between items-baseline">
              <span className="text-[#232D39]/60 shrink-0">备注信息</span>
              <span className="text-[#232D39] text-right max-w-[65%]">{reg.remark || "—"}</span>
            </div>
          </div>
        </section>
      </div>

      {reg.status === "待补全" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 space-y-2 border-t border-[#232D39]/10 bg-white p-3 pb-safe">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex h-[44px] flex-1 items-center justify-center rounded-lg border border-[#232D39]/20 text-sm text-[#232D39]"
              onClick={() => navigate(inboundStagingEditQuery(reg.id))}
            >
              编辑暂存
            </button>
            <button
              type="button"
              className="flex h-[44px] flex-[1.2] items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
              onClick={() => setConvertOpen(true)}
            >
              转为正式入库
            </button>
          </div>
          <button
            type="button"
            className="w-full py-1 text-center text-xs font-medium text-red-600"
            onClick={() => setVoidOpen(true)}
          >
            作废单据
          </button>
        </div>
      ) : null}

      <StagingVoidSheet
        open={voidOpen}
        regNo={reg.regNo}
        onClose={() => setVoidOpen(false)}
        onConfirm={(reason) => {
          voidStagingReg(reg.regNo, reason)
          setVoidOpen(false)
          showToast("登记单已作废")
          window.dispatchEvent(new CustomEvent("staging-reg-updated"))
        }}
      />

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white">
          {toast}
        </div>
      ) : null}

      {convertOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div className="w-full rounded-t-2xl bg-white p-4 pb-8 text-sm">
            <p className="font-medium text-[#232D39]">转为正式入库确认</p>
            <p className="mt-2 text-xs text-[#232D39]/60">
              将预填至「入库发起」；提交成功后回写【已转正式】。正式单不展示 REG 单号。
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="h-11 flex-1 rounded-lg border border-[#232D39]/20 text-sm"
                onClick={() => setConvertOpen(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="h-11 flex-1 rounded-lg bg-blue-600 text-sm font-medium text-white"
                onClick={goConvert}
              >
                确认前往
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </MobileShell>
  )
}
