import { useEffect, useMemo, useState } from "react"
import { Copy } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  getStagingRegById,
  voidStagingReg,
} from "@prototype/shared/inbound/inbound-staging.mock"
import { ConvertToFormalSheet } from "../components/ConvertToFormalSheet"
import { StagingDetailGoodsMobile } from "../components/StagingDetailGoodsMobile"
import { StagingMobileDetailFooter } from "../components/StagingMobileDetailFooter"
import { StagingOperationTimelineMobile } from "../components/StagingOperationTimelineMobile"
import { StagingVoidSheet } from "../components/StagingVoidSheet"
import { H5_PAGE_BODY } from "@/shared/h5-ui-theme"
import {
  H5_INBOUND_INITIATE_ROUTE,
  INBOUND_STAGING_LIST_ROUTE,
  inboundStagingDetailPath,
  inboundStagingEditQuery,
} from "../domain/constants"
import { navigateToFormalInbound } from "../lib/formal-inbound-nav"
import {
  STAGING_DETAIL_TABS,
  STAGING_P01_BANNER,
} from "@prototype/shared/inbound/staging-ui-labels"

type StagingDetailTab = "goods" | "audit"

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
  const [tab, setTab] = useState<StagingDetailTab>("goods")

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

  const formalInboundReturnTo = id
    ? inboundStagingDetailPath(id)
    : INBOUND_STAGING_LIST_ROUTE

  const openFormalInbound = () => {
    navigateToFormalInbound(
      reg?.relatedFormalNo,
      navigate,
      showToast,
      formalInboundReturnTo,
    )
  }

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
      <div className={H5_PAGE_BODY}>
      <PrototypeAnnotationTarget annotationIds={["inbound-staging-h5-detail"]}>
        <NavBar title="入库暂存详情" backTo={INBOUND_STAGING_LIST_ROUTE} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-32 overscroll-contain">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
          {STAGING_P01_BANNER}
        </div>

        <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#232D39]/60">登记单号</span>
              {statusBadge(reg.status)}
            </div>
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 flex-1 break-all text-base font-bold text-[#232D39] leading-tight">
                {reg.regNo}
              </p>
              <button
                type="button"
                className="flex shrink-0 items-center gap-0.5 rounded-md border border-[#232D39]/10 px-2 py-1 text-[10px] text-[#232D39]/70 active:bg-[#232D39]/5"
                onClick={() => {
                  void navigator.clipboard.writeText(reg.regNo)
                  showToast("已复制登记单号")
                }}
              >
                <Copy className="size-3" />
                复制
              </button>
            </div>
            <p className="text-[11px] text-[#232D39]/50 pt-0.5">
              登记人： {reg.registrant} {reg.registeredAt}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2 text-xs">
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">货主/送货说明</span>
              <span className="min-w-0 break-all text-right font-medium text-[#232D39]">
                {reg.ownerDisplay}
                {reg.ownerTag ? (
                  <span className="ml-1 text-[10px] font-normal text-[#232D39]/50">[{reg.ownerTag}]</span>
                ) : null}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">入库日期</span>
              <span className="text-right text-[#232D39]">{reg.inboundDate}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">入库类型</span>
              <span className="text-right text-[#232D39]">{reg.inboundType}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">入库仓库</span>
              <span className="max-w-[210px] truncate text-right text-[#232D39]">
                {reg.warehouseName}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">关联单号</span>
              <span className="min-w-0 break-all text-right text-[#232D39]">{reg.relatedOrderNo ?? "—"}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">入库库房</span>
              <span className="text-right text-[#232D39]">{reg.storeroomName ?? "—"}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">关联正式单</span>
              {reg.relatedFormalNo ? (
                <button
                  type="button"
                  className="min-w-0 break-all text-right text-sm font-medium text-blue-600 active:opacity-70"
                  onClick={openFormalInbound}
                >
                  {reg.relatedFormalNo}
                </button>
              ) : (
                <span className="text-right text-[#232D39]">—</span>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">库位提示</span>
              <span className="text-right text-[#232D39]">{reg.locationHint ?? "—"}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-[#232D39]/60">备注</span>
              <span className="min-w-0 break-all text-right text-[#232D39]">{reg.remark || "—"}</span>
            </div>
            {reg.status === "已作废" ? (
              <div className="flex items-baseline justify-between gap-3">
                <span className="shrink-0 text-[#232D39]/60">作废原因</span>
                <span className="min-w-0 break-all text-right text-[#232D39]">
                  {reg.voidReason?.trim() || "—"}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
          {(
            [
              ["goods", STAGING_DETAIL_TABS.goods],
              ["audit", STAGING_DETAIL_TABS.audit],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-center text-xs font-medium cursor-pointer transition-colors ${
                tab === key
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-[#232D39]/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "goods" ? <StagingDetailGoodsMobile reg={reg} embedded /> : null}
        {tab === "audit" ? <StagingOperationTimelineMobile reg={reg} embedded /> : null}
      </div>
      </div>

      <PrototypeAnnotationTarget annotationIds={["inbound-staging-h5-detail-footer"]}>
        {reg.status === "待补全" ? (
          <StagingMobileDetailFooter
            variant="pending"
            onEdit={() => navigate(inboundStagingEditQuery(reg.id))}
            onConvert={() => setConvertOpen(true)}
            onVoid={() => setVoidOpen(true)}
          />
        ) : null}

        {reg.status === "已转正式" && reg.relatedFormalNo ? (
          <StagingMobileDetailFooter
            variant="converted"
            onViewFormal={openFormalInbound}
          />
        ) : null}
      </PrototypeAnnotationTarget>

      <ConvertToFormalSheet
        open={convertOpen}
        reg={reg}
        onClose={() => setConvertOpen(false)}
        onConfirm={goConvert}
      />

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
    </MobileShell>
  )
}
