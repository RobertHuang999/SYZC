import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CheckCircle2, Clock, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { StagingDetailBasicInfoTable } from "../components/StagingDetailBasicInfoTable"
import { ConvertToFormalDialog } from "../components/ConvertToFormalDialog"
import { StagingDetailTabsPanel } from "../components/StagingDetailTabsPanel"
import { StagingVoidDialog } from "../components/StagingVoidDialog"
import { inboundStagingDetailAnnotations } from "../annotations/inbound-staging-reg.annotations"
import { inboundStagingRegDocuments } from "../documents/inbound-staging-reg-documents"
import {
  INBOUND_STAGING_LIST_PATH,
  inboundStagingEditPath,
} from "../domain/constants"
import { resolveFormalInboundDetailPath } from "../lib/formal-record-link"
import { buildStagingDetailGoodsRows } from "../lib/staging-detail-display"
import { STAGING_ACTION_LABELS } from "@prototype/shared/inbound/staging-ui-labels"
import { getStagingRegById, voidStagingReg } from "../mock/inbound-staging.mock"

function statusStamp(status: string) {
  if (status === "待补全") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-700 shadow-2xs">
        <Clock className="size-3.5" />
        待补全
      </span>
    )
  }
  if (status === "已转正式") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
        <CheckCircle2 className="size-3.5" />
        已转正式
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3.5 py-1 text-xs font-semibold text-gray-600 shadow-2xs">
      已作废
    </span>
  )
}

function DetailActionBar({
  reg,
  onVoid,
  onEdit,
  onConvert,
  onBack,
}: {
  reg: NonNullable<ReturnType<typeof getStagingRegById>>
  onVoid: () => void
  onEdit: () => void
  onConvert: () => void
  onBack: () => void
}) {
  const formalPath = resolveFormalInboundDetailPath(reg.relatedFormalNo)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {reg.status === "待补全" ? (
        <>
          <Button variant="destructive" size="sm" onClick={onVoid}>
            {STAGING_ACTION_LABELS.void}
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            {STAGING_ACTION_LABELS.edit}
          </Button>
          <Button size="sm" onClick={onConvert}>
            {STAGING_ACTION_LABELS.convert}
          </Button>
        </>
      ) : null}
      {reg.status === "已转正式" && formalPath ? (
        <Button size="sm" nativeButton={false} render={<Link to={formalPath} />}>
          {STAGING_ACTION_LABELS.viewFormal}
        </Button>
      ) : null}
      <Button variant="outline" size="sm" onClick={onBack}>
        返回列表
      </Button>
    </div>
  )
}

export function InboundStagingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mockTick, setMockTick] = useState(0)
  const [convertOpen, setConvertOpen] = useState(false)
  const [voidOpen, setVoidOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const bump = () => setMockTick((t) => t + 1)
    window.addEventListener("staging-reg-updated", bump)
    return () => window.removeEventListener("staging-reg-updated", bump)
  }, [])

  const reg = useMemo(() => {
    void mockTick
    return id ? getStagingRegById(id) : undefined
  }, [id, mockTick])

  const goodsRows = useMemo(() => (reg ? buildStagingDetailGoodsRows(reg) : []), [reg])
  const formalPath = reg ? resolveFormalInboundDetailPath(reg.relatedFormalNo) : null

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  if (!reg) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(INBOUND_STAGING_LIST_PATH)}>
          返回列表
        </Button>
        <p className="text-sm text-muted-foreground">未找到该登记单详情数据。</p>
      </div>
    )
  }

  const goBack = () => navigate(INBOUND_STAGING_LIST_PATH)
  const goEdit = () => navigate(inboundStagingEditPath(reg.id))

  return (
    <PrototypeAnnotationProvider
      title="入库暂存登记 · 详情"
      documents={inboundStagingRegDocuments}
      annotations={inboundStagingDetailAnnotations}
    >
      <div className="min-h-full space-y-4 bg-muted/10 p-6">
          <div className="rounded-lg border bg-card p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <PrototypeAnnotationTarget annotationIds={["inbound-staging-detail-page"]}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    登记单号：
                    <span className="text-base font-bold">{reg.regNo}</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-primary"
                    title="复制登记单号"
                    onClick={() => {
                      void navigator.clipboard.writeText(reg.regNo)
                      showToast("已复制登记单号至剪贴板")
                    }}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                  <div className="ml-1">{statusStamp(reg.status)}</div>
                </div>
              </PrototypeAnnotationTarget>

              <PrototypeAnnotationTarget annotationIds={["inbound-staging-detail-actions"]}>
                <DetailActionBar
                  reg={reg}
                  onBack={goBack}
                  onEdit={goEdit}
                  onConvert={() => setConvertOpen(true)}
                  onVoid={() => setVoidOpen(true)}
                />
              </PrototypeAnnotationTarget>
            </div>

            <PrototypeAnnotationTarget annotationIds={["inbound-staging-detail-base"]}>
              <StagingDetailBasicInfoTable
                reg={reg}
                embedded
                formalDetailPath={formalPath}
              />
            </PrototypeAnnotationTarget>
          </div>

          <PrototypeAnnotationTarget annotationIds={["inbound-staging-detail-tabs"]}>
            <StagingDetailTabsPanel reg={reg} goodsRows={goodsRows} />
          </PrototypeAnnotationTarget>

        <ConvertToFormalDialog
          open={convertOpen}
          reg={reg}
          onClose={() => setConvertOpen(false)}
          onConfirmPc={(path) => {
            setConvertOpen(false)
            navigate(path)
          }}
          onCopyMobileLink={() => showToast("已复制手机端入库发起链接")}
          onMobileOnly={(h5Path) => {
            setConvertOpen(false)
            const url = `${window.location.origin}${h5Path}`
            void navigator.clipboard.writeText(url)
            showToast("已复制手机端入库发起链接；仓单转正请在手机打开该链接完成")
          }}
        />

        <StagingVoidDialog
          open={voidOpen}
          regNo={reg.regNo}
          onClose={() => setVoidOpen(false)}
          onConfirm={(reason) => {
            voidStagingReg(reg.regNo, reason)
            setVoidOpen(false)
            showToast("登记单已作废")
          }}
        />

        {toast ? (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
