import { useState, useMemo } from "react"
import { ShieldAlert } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { resolvePublishNavigation } from "../lib/publish-navigation"
import { Toast } from "@/components/ui/Toast"
import { getDetailHeaderActions, getPublishActionLabel } from "../domain/actions"
import { ReleasePromptSheet } from "../components/ReleasePromptSheet"
import { CollateralWarningDetailContent } from "../components/CollateralWarningDetailContent"
import { getCollateralWarningById } from "../lib/detail-utils"
import { formatDateTime } from "@/shared/lib/date-utils"

export function CollateralWarningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [allExpanded, setAllExpanded] = useState(true)
  const [releaseSheetOpen, setReleaseSheetOpen] = useState(false)

  const event = useMemo(() => getCollateralWarningById(id), [id])
  const headerActions = useMemo(
    () => (event ? getDetailHeaderActions(event) : ["back"]),
    [event]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!event) {
    return (
      <MobileShell>
        <NavBar title="押品预警详情" />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
          <ShieldAlert className="size-12 text-gray-300 mb-2" />
          <p>未找到对应的押品预警记录</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            返回上一页
          </button>
        </div>
      </MobileShell>
    )
  }

  const isHistoricalReadOnly = event.warningSource === "历史"
  const isPenetration =
    event.warningSource === "物联穿透" || Boolean(event.deviceEventId)
  const isClosed = event.warningStatus === "CLOSED_VALID"

  return (
    <MobileShell>
      <NavBar
        title={`${event.orderNo} 预警详情`}
        backTo="/m/supervision/order-warnings"
        right={
          <button
            type="button"
            onClick={() => setAllExpanded((prev) => !prev)}
            className="text-xs font-medium text-blue-600 active:opacity-70 cursor-pointer"
          >
            {allExpanded ? "全部收起" : "全部展开"}
          </button>
        }
      />

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-[#f4f6f8]">
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-6 overscroll-contain">
          {isHistoricalReadOnly && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              本记录为历史归档，仅支持详情、审计和资料查看，不提供业务写操作。
            </div>
          )}

          <CollateralWarningDetailContent
            event={event}
            allExpanded={allExpanded}
            onCopyOrderNo={(orderNo) => {
              navigator.clipboard?.writeText(orderNo)
              showToast(`已复制: ${orderNo}`)
            }}
            onPreviewImage={() => setImagePreviewOpen(true)}
            onViewDevice={() =>
              navigate(
                `/m/iot/device-warning-events/${event.deviceEventId ?? "dev-evt-2026082001"}?warn_id=${event.eventId}`
              )
            }
          />
        </div>

        <div className="border-t border-gray-200/90 bg-white px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/m/supervision/order-warnings")}
              className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200 cursor-pointer"
            >
              返回列表
            </button>

            {headerActions.includes("publish") && (
              <button
                type="button"
                onClick={() => navigate(resolvePublishNavigation(event).path)}
                className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-orange-700 cursor-pointer"
              >
                {getPublishActionLabel(event)} ▸
              </button>
            )}

            {headerActions.includes("viewDevice") && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/m/iot/device-warning-events/${event.deviceEventId ?? "dev-evt-2026082001"}?warn_id=${event.eventId}`
                  )
                }
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-indigo-700 cursor-pointer"
              >
                看设备事件 ▸
              </button>
            )}

            {headerActions.includes("release") && (
              <button
                type="button"
                onClick={() => {
                  if (event.orderNo === "PO202608-88") {
                    showToast("您暂无该订单对应项目的管理权限，无法跳转办理")
                    return
                  }
                  setReleaseSheetOpen(true)
                }}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-blue-700 cursor-pointer"
              >
                解除预警 ▸
              </button>
            )}
          </div>

          {isPenetration && !isClosed && (
            <div className="mt-2 text-center text-[10px] text-gray-400">
              💡 须在设备预警信息现场核销后自动联动解除；本页无解除预警入口
            </div>
          )}
        </div>
      </div>

      <ImagePreviewModal
        open={imagePreviewOpen}
        title={`${event.orderNo} · 现场抓拍图`}
        subTitle={formatDateTime(event.warningTime)}
        imageUrl={`mock-snapshot-${event.eventId}`}
        onClose={() => setImagePreviewOpen(false)}
      />

      <ReleasePromptSheet
        open={releaseSheetOpen}
        orderNo={event.orderNo}
        orderType={event.orderType}
        ltvHitSnapshot={event.ltvHitSnapshot}
        onClose={() => setReleaseSheetOpen(false)}
        onConfirm={() => {
          setReleaseSheetOpen(false)
          navigate(
            `/m/finance/pledge-orders?order=${event.orderNo}&warn_id=${event.eventId}`
          )
        }}
      />

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
