import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FileText, ImageIcon, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DetailSection, DetailField } from "@/shared/components/DetailSection"
import {
  SnapshotImageModal,
  type SnapshotPreviewData,
} from "@/shared/components/SnapshotImageModal"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryDetailsDocuments } from "../documents/inventory-details-documents"
import { inventoryDetailsDetailAnnotations } from "../annotations/inventory-details-detail.annotations"
import { InventoryBarcodeQrDialog } from "../components/InventoryBarcodeQrDialog"
import { SHARED_INVENTORY_DETAILS } from "@/features/shared/mock/inventory-shared-seed"

const CREATOR_ORG = "四川享宇科技有限公司"
const STICKY_ACTION_CLASS =
  "sticky right-0 z-10 border-l border-border/60 bg-card px-2 py-2 text-center"

function StatusBadge({ status, label }: { status: string; label: string }) {
  if (status === "NORMAL") {
    return (
      <span className="inline-flex rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[13px] text-emerald-700">
        {label}
      </span>
    )
  }
  if (status === "FROZEN") {
    return (
      <span className="inline-flex rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[13px] text-amber-700">
        {label}
      </span>
    )
  }
  return (
    <span className="inline-flex rounded border border-border bg-muted px-2 py-0.5 text-[13px] text-muted-foreground">
      {label}
    </span>
  )
}

function AttachmentBlock({
  label,
  emptyText,
  children,
}: {
  label: string
  emptyText: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <div className="detail-field-label mb-2">{label}</div>
      {children ?? <span className="text-sm text-muted-foreground">{emptyText}</span>}
    </div>
  )
}

function PhotoCard({
  name,
  caption,
  onClick,
}: {
  name: string
  caption?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[104px] w-[150px] cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border border-border bg-muted/40 px-2 transition-colors hover:border-primary/40 hover:bg-muted"
      title={name}
    >
      <ImageIcon className="size-6 text-muted-foreground" />
      <span className="w-full truncate text-center text-[13px] text-muted-foreground">{name}</span>
      {caption && (
        <span className="w-full truncate text-center text-[12px] text-muted-foreground/80">
          {caption}
        </span>
      )}
    </button>
  )
}

export const InventoryDetailsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [qrOpen, setQrOpen] = useState(false)
  const [preview, setPreview] = useState<SnapshotPreviewData | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const record = SHARED_INVENTORY_DETAILS.find((item) => item.id === id) || SHARED_INVENTORY_DETAILS[0]

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const locationText = `${record.warehouseName} ${record.houseName} ${record.partitionName}`

  return (
    <PrototypeAnnotationProvider
      documents={inventoryDetailsDocuments}
      annotations={inventoryDetailsDetailAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 顶部标题与返回 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-detail-page"]}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {record.specification} — {record.totalQuantity}
                {record.unit}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                入库批次 {record.inboundOrderNo} · {locationText}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              返回
            </Button>
          </div>
        </PrototypeAnnotationTarget>

        {/* 基础信息 */}
        <DetailSection title="基础信息">
          <DetailField label="货主">
            <div className="text-foreground">{record.ownerName}</div>
            <div className="text-[13px] text-muted-foreground">{record.ownerIdentifierMasked}</div>
          </DetailField>
          <DetailField label="制单人">
            {record.creator}（{CREATOR_ORG}）
          </DetailField>
          <DetailField label="制单时间">{record.createTime}</DetailField>
          <DetailField label="入库类型">{record.inboundType}</DetailField>
          <DetailField label="货物信息">
            {record.specification} — {record.totalQuantity}
            {record.unit}
          </DetailField>
          <DetailField label="入库日期">{record.inboundDate}</DetailField>
          <DetailField label="入库单号">
            <PrototypeAnnotationTarget annotationIds={["inv-details-detail-order-link"]}>
              <span className="inline-flex items-center gap-2">
                <span className="text-foreground">{record.inboundOrderNo}</span>
                <Link
                  to={`/仓储/入库管理/入库记录/详情/${record.inboundOrderNo}`}
                  className="text-primary hover:underline"
                >
                  查看
                </Link>
              </span>
            </PrototypeAnnotationTarget>
          </DetailField>
          <DetailField label="备注信息">{record.remark || "——"}</DetailField>
          <DetailField label="仓库">{record.warehouseName}</DetailField>
          <DetailField label="库房">
            {record.houseName}
            <span className="ml-1 text-[13px] text-muted-foreground">
              {record.houseAuditStatus === "auditing" ? "（需审核）" : "（不审核）"}
            </span>
          </DetailField>
          <DetailField label="分区">{record.partitionName}</DetailField>
          <DetailField label="其他信息">{record.collectInfo || "——"}</DetailField>
        </DetailSection>

        {/* 附件信息 */}
        <DetailSection title="附件信息">
          <div className="space-y-5">
            <AttachmentBlock
              label="现场照片"
              emptyText="无现场照片"
            >
              {record.scenePhotos?.length ? (
                <div className="flex flex-wrap gap-3">
                  {record.scenePhotos.map((name) => (
                    <PhotoCard
                      key={name}
                      name={name}
                      onClick={() =>
                        setPreview({
                          title: `现场照片 — ${name}`,
                          desc: "货物入库时的现场实物照片",
                          time: record.inboundDate,
                          location: locationText,
                        })
                      }
                    />
                  ))}
                </div>
              ) : undefined}
            </AttachmentBlock>

            <AttachmentBlock label="补充资料" emptyText="无补充资料">
              {record.supplementaryDocs?.length ? (
                <div className="flex flex-wrap gap-3">
                  {record.supplementaryDocs.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => showToast(`正在在线预览补充资料：${name}`)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
                    >
                      <FileText className="size-4 text-primary" />
                      {name}
                    </button>
                  ))}
                </div>
              ) : undefined}
            </AttachmentBlock>

            <AttachmentBlock label="设备抓拍图" emptyText="无设备抓拍图">
              {record.capturePhotos?.length ? (
                <div className="flex flex-wrap gap-3">
                  {record.capturePhotos.map((photo) => (
                    <PhotoCard
                      key={`${photo.deviceName}-${photo.time}`}
                      name={photo.deviceName}
                      caption={photo.time}
                      onClick={() =>
                        setPreview({
                          title: `设备抓拍图 — ${photo.deviceName}`,
                          desc: "物联网摄像头自动抓拍存证",
                          time: photo.time,
                          location: locationText,
                        })
                      }
                    />
                  ))}
                </div>
              ) : undefined}
            </AttachmentBlock>
          </div>
        </DetailSection>

        {/* 存货信息 */}
        <DetailSection title="存货信息">
          <div className="w-full">
            <Table className="min-w-[1020px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16 min-w-16 text-center">序号</TableHead>
                  <TableHead className="w-[160px] min-w-[160px]">库房</TableHead>
                  <TableHead className="w-[120px] min-w-[120px]">分区</TableHead>
                  <TableHead className="w-[130px] min-w-[130px]">具体位置</TableHead>
                  <TableHead className="w-[120px] min-w-[120px] text-right">期初堆放数量</TableHead>
                  <TableHead className="w-[110px] min-w-[110px] text-right">可用数量</TableHead>
                  <TableHead className="w-[110px] min-w-[110px] text-right">冻结数量</TableHead>
                  <TableHead className="w-[100px] min-w-[100px] text-center">存货条码</TableHead>
                  <TableHead className="w-[110px] min-w-[110px] text-center">状态</TableHead>
                  <TableHead className={STICKY_ACTION_CLASS} style={{ width: 72, minWidth: 72 }}>
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">1</TableCell>
                  <TableCell className="text-foreground">{record.houseName}</TableCell>
                  <TableCell className="text-foreground">{record.partitionName}</TableCell>
                  <TableCell className="text-foreground">
                    {record.isVirtual ? "——" : record.locationCode}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-foreground">
                    {record.initialQuantity.toFixed(3)} {record.unit}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-foreground">
                    {record.availableQuantity.toFixed(3)} {record.unit}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-amber-600">
                    {record.frozenQuantity.toFixed(3)} {record.unit}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-primary"
                      title="查看存货条码二维码"
                      onClick={() => setQrOpen(true)}
                    >
                      <QrCode className="size-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={record.status} label={record.goodsStatus} />
                  </TableCell>
                  <TableCell className={STICKY_ACTION_CLASS} style={{ width: 72, minWidth: 72 }}>
                    <span className="text-muted-foreground">——</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DetailSection>

        {/* 图片预览 */}
        <SnapshotImageModal data={preview} onClose={() => setPreview(null)} />

        {/* 存货条码弹窗 */}
        <InventoryBarcodeQrDialog
          open={qrOpen}
          onOpenChange={setQrOpen}
          item={record}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
