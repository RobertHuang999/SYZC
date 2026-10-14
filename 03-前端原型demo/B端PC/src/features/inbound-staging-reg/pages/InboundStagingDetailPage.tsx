import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Clock, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { ConvertToFormalDialog } from "../components/ConvertToFormalDialog"
import { StagingVoidDialog } from "../components/StagingVoidDialog"
import { inboundStagingDetailAnnotations } from "../annotations/inbound-staging-reg.annotations"
import { inboundStagingRegDocuments } from "../documents/inbound-staging-reg-documents"
import {
  INBOUND_STAGING_LIST_PATH,
  inboundStagingEditPath,
} from "../domain/constants"
import { resolveStagingGoodsNames } from "@prototype/shared/inbound/staging-goods-display"
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

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const goodsNames = reg ? resolveStagingGoodsNames(reg) : []

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

  return (
    <PrototypeAnnotationProvider
      title="入库暂存登记 · 详情"
      documents={inboundStagingRegDocuments}
      annotations={inboundStagingDetailAnnotations}
    >
      <div className="min-h-full space-y-4 bg-muted/10 p-6 pb-24">
        <PrototypeAnnotationTarget annotationIds={["inbound-staging-detail-page"]}>
          <div className="rounded-lg border bg-card p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  登记单号：<span className="text-base font-bold">{reg.regNo}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-primary"
                  title="复制单号"
                  onClick={() => {
                    void navigator.clipboard.writeText(reg.regNo)
                    showToast("已复制登记单号")
                  }}
                >
                  <Copy className="size-4" />
                </Button>
                <div className="ml-2">{statusStamp(reg.status)}</div>
              </div>
              <PrototypeAnnotationTarget annotationIds={["inbound-staging-detail-actions"]}>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(INBOUND_STAGING_LIST_PATH)}>
                    返回列表
                  </Button>
                  {reg.status === "待补全" ? (
                    <>
                      <Button variant="destructive" size="sm" onClick={() => setVoidOpen(true)}>
                        作废单据
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(inboundStagingEditPath(reg.id))}
                      >
                        编辑暂存
                      </Button>
                      <Button size="sm" onClick={() => setConvertOpen(true)}>
                        转为正式入库
                      </Button>
                    </>
                  ) : null}
                  {reg.status === "已转正式" ? (
                    <Button size="sm" onClick={() => navigate("/仓储/入库管理/入库记录")}>
                      查看正式入库单
                    </Button>
                  ) : null}
                </div>
              </PrototypeAnnotationTarget>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <DetailSection title="基础信息">
              <DetailField label="入库日期">{reg.inboundDate}</DetailField>
              <DetailField label="入库仓库">{reg.warehouseName}</DetailField>
              <DetailField label="入库类型">{reg.inboundType}</DetailField>
              <DetailField label="关联单号">{formatEmptyValue(reg.relatedOrderNo)}</DetailField>
              <DetailField label="关联正式入库单号">
                {formatEmptyValue(reg.relatedFormalNo)}
              </DetailField>
              <DetailField label="货主/送货说明">
                {reg.ownerDisplay}
                {reg.ownerTag ? (
                  <span className="ml-2 text-xs text-muted-foreground">[{reg.ownerTag}]</span>
                ) : null}
              </DetailField>
              <DetailField label="入库库房">{formatEmptyValue(reg.storeroomName)}</DetailField>
              <DetailField label="登记人">{reg.registrant}</DetailField>
              <DetailField label="登记时间">{reg.registeredAt}</DetailField>
              <DetailField label="备注">{formatEmptyValue(reg.remark)}</DetailField>
            </DetailSection>

            <DetailSection title="货品与堆放明细">
              <DetailField label="货品摘要">
                <div className="space-y-1.5 leading-snug">
                  <span className="break-words">{reg.goodsSummary}</span>
                  {goodsNames.length > 1 ? (
                    <ul className="list-inside list-disc text-sm text-muted-foreground">
                      {goodsNames.map((name) => (
                        <li key={name} className="break-words">
                          {name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </DetailField>
              <DetailField label="申报数量">
                {reg.declaredQty.toLocaleString()} {reg.unit}
              </DetailField>
              <DetailField label="库位提示">{formatEmptyValue(reg.locationHint)}</DetailField>
            </DetailSection>

            <DetailSection title="生命周期与操作审计">
              <DetailField label="版本号">v{reg.version}</DetailField>
              {reg.voidReason ? (
                <DetailField label="作废原因">{reg.voidReason}</DetailField>
              ) : null}
            </DetailSection>
          </div>
        </PrototypeAnnotationTarget>

        <ConvertToFormalDialog
          open={convertOpen}
          reg={reg}
          onClose={() => setConvertOpen(false)}
          onConfirmPc={(path) => {
            setConvertOpen(false)
            navigate(path)
          }}
          onMobileOnly={() => {
            setConvertOpen(false)
            showToast("仓单转正请在手机端「入库发起」完成")
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
