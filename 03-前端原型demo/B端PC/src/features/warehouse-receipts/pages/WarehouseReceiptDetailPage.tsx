import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  QrCodeIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import type {
  ReceiptGoodsGroup,
  ReceiptGoodsLot,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  RECEIPT_STATUS_SEAL_COLOR,
  formatReceiptQuantity,
  receiptLotCount,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { warehouseReceiptDetailAnnotations } from "../annotations/warehouse-receipt-detail.annotations"
import { QrPlaceholder } from "../components/ReceiptDialogs"
import { ReceiptStatusBadge } from "../components/ReceiptStatusBadge"
import { warehouseReceiptDocuments } from "../documents/warehouse-receipt-documents"
import { RECEIPT_LIST_PATH } from "../domain/constants"
import { getWarehouseReceiptById } from "../mock/warehouse-receipts.mock"

type TabKey = "goods" | "changes"

type BarcodeTarget = {
  lot: ReceiptGoodsLot
  group: ReceiptGoodsGroup
}

export function WarehouseReceiptDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const receipt = useMemo(() => getWarehouseReceiptById(id), [id])

  const [tab, setTab] = useState<TabKey>("goods")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [barcodeTarget, setBarcodeTarget] = useState<BarcodeTarget | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2400)
  }

  const copyText = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(successMessage)
    } catch {
      showToast(`复制失败，请手动选中复制：${text}`)
    }
  }

  if (!receipt) {
    return (
      <div className="space-y-4 p-6">
        <Link to={RECEIPT_LIST_PATH}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          未找到该仓单，可能已被删除或不在当前账号权限范围内。
        </div>
      </div>
    )
  }

  const seal = RECEIPT_STATUS_SEAL_COLOR[receipt.status]
  const lotCount = receiptLotCount(receipt)

  return (
    <PrototypeAnnotationProvider
      title="仓单详情 · 原型批注"
      documents={warehouseReceiptDocuments}
      annotations={warehouseReceiptDetailAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["receipt-detail-page"]}>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>仓单编号</span>
                  <span className="whitespace-nowrap text-lg font-semibold text-foreground">
                    {receipt.code}
                  </span>
                  <button
                    type="button"
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="复制仓单编号"
                    onClick={() =>
                      copyText(receipt.code, "仓单编号已复制到剪贴板！")
                    }
                  >
                    <CopyIcon className="size-4" />
                  </button>
                  <ReceiptStatusBadge status={receipt.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  共 {receipt.goodsGroups.length} 种货品 · {lotCount} 个批次 ·
                  制单人 {receipt.creatorDisplay}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <PrototypeAnnotationTarget annotationIds={["receipt-detail-seal"]}>
                  <div
                    className="flex size-24 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-md ring-4 ring-white"
                    style={{ backgroundColor: seal.background }}
                  >
                    <span className="text-xs opacity-80">仓单状态</span>
                    <span className="mt-1 text-lg font-semibold tracking-[0.2em]">
                      {seal.label}
                    </span>
                  </div>
                </PrototypeAnnotationTarget>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(RECEIPT_LIST_PATH)}
                >
                  <ArrowLeftIcon />
                  返回
                </Button>
              </div>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["receipt-detail-basic"]}>
          <DetailSection title="基础信息">
            <DetailField label="制单人">{receipt.creatorDisplay}</DetailField>
            <DetailField label="制单时间">
              <TableDateTimeCell value={receipt.createdAt} plain />
            </DetailField>
            <DetailField label="存货人（货主）">{receipt.owner.name}</DetailField>
            <DetailField label="存货人标识">{receipt.owner.identifier}</DetailField>
            <DetailField label="开立时间">
              <TableDateTimeCell value={receipt.establishedAt} plain />
            </DetailField>
            <DetailField label="持有人">{receipt.holder.name}</DetailField>
            <DetailField label="持有人标识">{receipt.holder.identifier}</DetailField>
            <DetailField label="仓库名称">{receipt.warehouseName}</DetailField>
            <DetailField label="三方登记">
              <Badge
                variant="outline"
                className={
                  receipt.thirdPartyRegistered
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }
              >
                {receipt.thirdPartyRegistered ? "是（中仓登已准入）" : "否"}
              </Badge>
            </DetailField>
            <DetailField label="注销时间">
              {receipt.cancelledAt ? (
                <TableDateTimeCell value={receipt.cancelledAt} plain />
              ) : (
                <span className="text-muted-foreground">--</span>
              )}
            </DetailField>
            <DetailField label="在途流程">
              {receipt.currentFlow ? (
                <span className="text-amber-700">{receipt.currentFlow}（审批中）</span>
              ) : (
                <span className="text-muted-foreground">无</span>
              )}
            </DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <div className="flex items-center gap-1 border-b">
          {(
            [
              ["goods", "货物明细"],
              ["changes", "变更记录"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={
                tab === key
                  ? "-mb-px border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary"
                  : "-mb-px px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              }
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "goods" ? (
          <PrototypeAnnotationTarget
            annotationIds={["receipt-detail-goods", "receipt-detail-barcode"]}
          >
            <div className="overflow-hidden rounded-md border bg-card">
              <Table className="w-full table-fixed">
                <colgroup>
                  <col className="w-16" />
                  <col className="w-16" />
                  <col />
                  <col className="w-[180px]" />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-center text-xs text-muted-foreground">
                      展开
                    </TableHead>
                    <TableHead className="text-center text-xs text-muted-foreground">
                      序号
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      货物名称
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      开立数量
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.goodsGroups.map((group, index) => {
                    const stored = expanded[group.id]
                    const isOpen = stored === undefined ? index === 0 : stored
                    return (
                      <GroupRows
                        key={group.id}
                        group={group}
                        index={index}
                        open={isOpen}
                        onToggle={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [group.id]: !isOpen,
                          }))
                        }
                        onOpenBarcode={(lot) =>
                          setBarcodeTarget({ lot, group })
                        }
                      />
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </PrototypeAnnotationTarget>
        ) : (
          <PrototypeAnnotationTarget annotationIds={["receipt-detail-changes"]}>
            <div className="overflow-x-auto rounded-md border bg-card">
              <Table className="w-full min-w-[1080px]">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-16 text-xs text-muted-foreground">
                      序号
                    </TableHead>
                    <TableHead className="w-[170px] text-xs text-muted-foreground">
                      变更时间
                    </TableHead>
                    <TableHead className="w-[110px] text-xs text-muted-foreground">
                      变更类型
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      变更内容摘要
                    </TableHead>
                    <TableHead className="w-[190px] text-xs text-muted-foreground">
                      操作人
                    </TableHead>
                    <TableHead className="w-[160px] text-xs text-muted-foreground">
                      关联单号
                    </TableHead>
                    <TableHead className="w-[80px] text-xs text-muted-foreground">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.changes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-28 text-center text-sm text-muted-foreground"
                      >
                        暂无变更记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    receipt.changes.map((record, index) => (
                      <TableRow key={record.id} className="align-top">
                        <TableCell className="text-center text-xs text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <TableDateTimeCell value={record.changedAt} plain />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-normal">
                            {record.changeType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm leading-relaxed text-foreground">
                          {record.summary}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {record.operator}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.relatedNo ? (
                            <button
                              type="button"
                              className="text-primary hover:underline"
                              onClick={() =>
                                showToast(`演示：穿透查看关联单据 ${record.relatedNo}`)
                              }
                            >
                              {record.relatedNo}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() =>
                              showToast(
                                `已生成 ${receipt.code}-${record.changeType} 变更确认单 PDF`,
                              )
                            }
                          >
                            下载
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </PrototypeAnnotationTarget>
        )}
      </div>

      {barcodeTarget ? (
        <BarcodeDialog
          target={barcodeTarget}
          onClose={() => setBarcodeTarget(null)}
          onCopy={(text) => copyText(text, "条码编号已复制到剪贴板！")}
        />
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </PrototypeAnnotationProvider>
  )
}

function GroupRows({
  group,
  index,
  open,
  onToggle,
  onOpenBarcode,
}: {
  group: ReceiptGoodsGroup
  index: number
  open: boolean
  onToggle: () => void
  onOpenBarcode: (lot: ReceiptGoodsLot) => void
}) {
  return (
    <>
      <TableRow
        className="cursor-pointer bg-white transition-colors hover:bg-muted/40"
        onClick={onToggle}
      >
        <TableCell className="text-center">
          <button
            type="button"
            className="inline-flex size-6 items-center justify-center rounded hover:bg-muted"
            aria-label={open ? "收起批次明细" : "展开批次明细"}
            aria-expanded={open}
            onClick={(event) => {
              event.stopPropagation()
              onToggle()
            }}
          >
            {open ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </button>
        </TableCell>
        <TableCell className="text-center text-sm text-muted-foreground">
          {index + 1}
        </TableCell>
        <TableCell className="text-sm font-medium text-foreground">
          {group.name}
        </TableCell>
        <TableCell className="text-sm text-foreground">
          {formatReceiptQuantity(group.quantity)} {group.unit}
        </TableCell>
      </TableRow>

      {open ? (
        <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
          <TableCell colSpan={4} className="p-0">
            <div className="px-10 py-3">
              <div className="overflow-x-auto rounded-md border bg-white">
                <Table className="w-full min-w-[1080px] table-fixed">
                  <colgroup>
                    <col className="w-14" />
                    <col className="w-[240px]" />
                    <col className="w-[120px]" />
                    <col className="w-[150px]" />
                    <col className="w-[200px]" />
                    <col className="w-[90px]" />
                    <col className="w-[90px]" />
                    <col className="w-[130px]" />
                  </colgroup>
                  <TableHeader>
                    <TableRow className="bg-slate-100/80">
                      {[
                        "序号",
                        "位置",
                        "具体位置",
                        "入库时间",
                        "其他信息",
                        "存货条码",
                        "状态",
                        "开立数量",
                      ].map((label) => (
                        <TableHead
                          key={label}
                          className="text-xs font-medium text-muted-foreground"
                        >
                          {label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.lots.map((lot, lotIndex) => (
                      <TableRow key={lot.id} className="align-top">
                        <TableCell className="text-center text-xs text-muted-foreground">
                          {lotIndex + 1}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {lot.warehouseName}-{lot.houseName}({lot.houseAudit})-
                          {lot.zoneName}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {lot.position || "--"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <TableDateTimeCell value={lot.inboundAt} plain />
                        </TableCell>
                        <TableCell className="text-xs leading-relaxed text-muted-foreground">
                          {lot.otherInfo.length > 0
                            ? lot.otherInfo.join(" / ")
                            : "无: --"}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            type="button"
                            className="inline-flex size-8 items-center justify-center rounded border bg-white text-primary hover:bg-primary/5"
                            title="查看存货条码"
                            onClick={() => onOpenBarcode(lot)}
                          >
                            <QrCodeIcon className="size-4" />
                          </button>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          <Badge
                            variant="outline"
                            className="border-blue-200 bg-blue-50 text-xs font-normal text-blue-700"
                          >
                            {lot.statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {formatReceiptQuantity(lot.quantity)} {lot.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  )
}

function BarcodeDialog({
  target,
  onClose,
  onCopy,
}: {
  target: BarcodeTarget | null
  onClose: () => void
  onCopy: (text: string) => void
}) {
  if (!target) return null
  const { lot, group } = target

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>存货条码与货位标识</DialogTitle>
          <DialogDescription>
            批次条码由入库时固化生成，仓单生命周期内只读引用，不可手工篡改。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <QrPlaceholder value={lot.barcode} size={168} />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{lot.barcode}</p>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="mt-1 h-auto p-0 text-xs"
              onClick={() => onCopy(lot.barcode)}
            >
              复制条码编号
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 rounded-lg bg-muted/50 px-3 py-2.5 text-xs">
          <p>
            <span className="text-muted-foreground">货品规格：</span>
            {group.name}
          </p>
          <p>
            <span className="text-muted-foreground">存放位置：</span>
            {lot.warehouseName}-{lot.houseName}({lot.houseAudit})-{lot.zoneName}-
            {lot.position || "--"}
          </p>
          <p>
            <span className="text-muted-foreground">入库时间：</span>
            {lot.inboundAt}
          </p>
          <p>
            <span className="text-muted-foreground">当前状态：</span>
            {lot.statusLabel}
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
