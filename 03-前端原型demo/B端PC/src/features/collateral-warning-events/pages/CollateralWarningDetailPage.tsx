import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDetailHeaderActions } from "../domain/actions"
import { CollateralWarningDetailContent } from "../components/CollateralWarningDetailContent"
import { CollateralWarningStatusBadge } from "../components/CollateralWarningStatusBadge"
import { ReleasePromptDialog } from "../components/ReleasePromptDialog"
import { resolvePublishNavigation } from "../lib/publish-navigation"
import { getCollateralWarningById } from "../lib/detail-utils"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { collateralWarningDetailAnnotations } from "../annotations/collateral-warning-detail.annotations"
import { collateralWarningDocuments } from "../documents/collateral-warning-documents"
import { SnapshotImageModal, type SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
import {
  PhotoGalleryModal,
  type PhotoGalleryPreviewData,
} from "@/shared/components/PhotoGalleryModal"

export function CollateralWarningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<SnapshotPreviewData | null>(null)
  const [previewVendorPhotos, setPreviewVendorPhotos] =
    useState<PhotoGalleryPreviewData | null>(null)

  const event = useMemo(() => getCollateralWarningById(id), [id])
  const headerActions = useMemo(
    () => (event ? getDetailHeaderActions(event) : ["back"]),
    [event]
  )

  if (!event) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警信息/押品预警信息">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的押品预警信息
        </div>
      </div>
    )
  }

  const isHistoricalReadOnly = event.warningSource === "历史"
  const deviceEventId =
    event.penetrationInfo?.relatedEventId ?? event.deviceEventId ?? "evt-017"
  const returnRoute = `/物联网IOT与预警/预警信息/押品预警信息/详情/${event.eventId}`
  const deviceDetailRoute =
    `/物联网IOT与预警/预警信息/设备预警信息/详情/${deviceEventId}?device_event_id=${encodeURIComponent(deviceEventId)}&warn_id=${encodeURIComponent(event.eventId)}&return_route=${encodeURIComponent(returnRoute)}`
  const orderProcessRoute =
    `/融资/监管/抵质押业务/抵质押业务办理?order_id=${encodeURIComponent(event.orderNo)}&warn_id=${encodeURIComponent(event.eventId)}&return_route=${encodeURIComponent(returnRoute)}`

  return (
    <PrototypeAnnotationProvider
      title="押品预警详情 · 原型批注"
      annotations={collateralWarningDetailAnnotations}
      documents={collateralWarningDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-header", "collateral-warning-detail-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {event.warningType} · {event.orderNo}
              </h1>
              <CollateralWarningStatusBadge event={event} />
            </div>

            <div className="flex flex-wrap gap-2">
              {headerActions.includes("back") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.history.length > 1) {
                      navigate(-1)
                    } else {
                      navigate("/物联网IOT与预警/预警信息/押品预警信息")
                    }
                  }}
                >
                  <ArrowLeftIcon />
                  返回
                </Button>
              )}
              {headerActions.includes("release") && (
                <Button onClick={() => setReleaseDialogOpen(true)}>
                  解除预警
                </Button>
              )}
              {headerActions.includes("viewDevice") && (
                <Button
                  variant="secondary"
                  onClick={() => navigate(deviceDetailRoute)}
                >
                  查看设备事件
                </Button>
              )}
              {headerActions.includes("publish") && (
                <Button
                  onClick={() => {
                    navigate(resolvePublishNavigation(event).path)
                  }}
                >
                  公示风险
                </Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {isHistoricalReadOnly && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            本记录为历史归档，仅支持详情、审计和资料查看，不提供业务写操作。
          </div>
        )}

        <CollateralWarningDetailContent
          event={event}
          onPreviewImage={setPreviewImage}
          onPreviewVendorPhotos={(photos, initialIndex) =>
            setPreviewVendorPhotos({
              title: `现场照片 — 订单 ${event.orderNo}`,
              desc: `厂商自动回传 · 触发时间：${event.warningTime}`,
              photos,
              initialIndex,
            })
          }
        />

        <ReleasePromptDialog
          open={releaseDialogOpen}
          orderNo={event.orderNo}
          orderType={event.orderType}
          ltvHitSnapshot={event.ltvHitSnapshot}
          onOpenChange={setReleaseDialogOpen}
          onConfirm={() => {
            setReleaseDialogOpen(false)
            navigate(orderProcessRoute)
          }}
        />

        <PhotoGalleryModal
          data={previewVendorPhotos}
          onClose={() => setPreviewVendorPhotos(null)}
        />

        <SnapshotImageModal
          data={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
