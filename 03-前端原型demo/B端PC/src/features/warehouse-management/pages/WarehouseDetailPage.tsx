import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeftIcon,
  Building2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  FileTextIcon,
  CircleHelpIcon,
  ImageIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
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
import { cn } from "@/lib/utils"
import { warehouseManagementDocuments } from "../documents/warehouse-management-documents"
import {
  warehouseDetailAnnotations,
  warehouseListAnnotations,
} from "../annotations/warehouse-management.annotations"
import {
  BASIC_CONFIG_PATH,
  WAREHOUSE_LIST_PATH,
  warehouseEditPath,
} from "../domain/constants"
import type {
  FacilityRow,
  PartitionNode,
  StoreroomNode,
  WarehouseRecord,
} from "../domain/types"
import { getWarehouseById, warehousesMock } from "../mock/warehouses.mock"
import {
  resolveStoreroomInboundAuditYesNo,
  storeroomInboundAuditRequiresApproval,
} from "../lib/storeroom-inbound-audit"
import { useWarehouseOpsSnapshot } from "../hooks/use-warehouse-ops-snapshot"
import { StoreroomFormDialog } from "../components/StoreroomFormDialog"
import { PartitionFormDialog } from "../components/PartitionFormDialog"
import { FacilityFormDialog } from "../components/FacilityFormDialog"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import { VersionChangeProvider } from "../components/VersionChangeHighlight"

export function WarehouseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ops, refresh } = useWarehouseOpsSnapshot()

  const [warehouse, setWarehouse] = useState<WarehouseRecord | undefined>(() =>
    getWarehouseById(id)
  )
  const [collapsedRooms, setCollapsedRooms] = useState<Record<string, boolean>>({})
  const [storeroomDialog, setStoreroomDialog] = useState<{
    mode: "create" | "edit"
    room?: StoreroomNode
  } | null>(null)
  const [partitionDialog, setPartitionDialog] = useState<{
    mode: "create" | "edit"
    storeroomId?: string
    partition?: PartitionNode
  } | null>(null)
  const [facilityDialog, setFacilityDialog] = useState<{
    mode: "create" | "edit"
    facility?: FacilityRow
  } | null>(null)

  const [confirmDeleteRoom, setConfirmDeleteRoom] = useState<StoreroomNode | null>(null)
  const [confirmDeletePartition, setConfirmDeletePartition] = useState<{
    roomId: string
    partition: PartitionNode
  } | null>(null)
  const [confirmDeleteFacilityId, setConfirmDeleteFacilityId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    setWarehouse(getWarehouseById(id))
    refresh()
  }, [id, refresh])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const toggleRoomCollapse = (roomId: string) => {
    setCollapsedRooms((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }))
  }

  const updateWarehouse = (updater: (prev: WarehouseRecord) => WarehouseRecord) => {
    setWarehouse((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      const mockIndex = warehousesMock.findIndex((w) => w.id === next.id)
      if (mockIndex >= 0) {
        warehousesMock[mockIndex] = next
      }
      return next
    })
  }

  if (!warehouse) {
    return (
      <div className="space-y-4 p-6">
        <Link
          to={WAREHOUSE_LIST_PATH}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          返回列表
        </Link>
        <p className="text-muted-foreground">未找到该仓库，请从列表重新进入。</p>
      </div>
    )
  }

  const statusBadge = warehouse.status === "ENABLED" ? "启用中" : "已停用"

  // 停用 / 启用库房
  const handleToggleStoreroomStatus = (room: StoreroomNode) => {
    if (room.status === "ENABLED") {
      if (room.hasInventory) {
        showToast("该库房下还有货物存放，请处理后再进行停用操作！")
        return
      }
      updateWarehouse((prev) => ({
        ...prev,
        storerooms: prev.storerooms.map((r) =>
          r.id === room.id ? { ...r, status: "DISABLED" } : r
        ),
      }))
      showToast("库房已停用")
    } else {
      updateWarehouse((prev) => ({
        ...prev,
        storerooms: prev.storerooms.map((r) =>
          r.id === room.id ? { ...r, status: "ENABLED" } : r
        ),
      }))
      showToast("库房已启用")
    }
  }

  // 删除库房
  const handleDeleteStoreroom = (room: StoreroomNode) => {
    if (room.status === "ENABLED") {
      showToast("该库房处于启用状态，仅停用状态支持删除操作！")
      return
    }
    if (room.partitions.length > 0) {
      showToast("请先删除所有下级分区后再进行库房删除！")
      return
    }
    setConfirmDeleteRoom(room)
  }

  const executeDeleteRoom = () => {
    if (!confirmDeleteRoom) return
    updateWarehouse((prev) => ({
      ...prev,
      storerooms: prev.storerooms.filter((r) => r.id !== confirmDeleteRoom.id),
    }))
    setConfirmDeleteRoom(null)
    showToast("库房删除成功")
  }

  // 停用 / 启用分区
  const handleTogglePartitionStatus = (roomId: string, part: PartitionNode) => {
    if (part.status === "ENABLED") {
      if (part.hasInventory) {
        showToast("该分区下还有货物存放，请处理后再进行停用操作！")
        return
      }
      updateWarehouse((prev) => ({
        ...prev,
        storerooms: prev.storerooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                partitions: r.partitions.map((p) =>
                  p.id === part.id ? { ...p, status: "DISABLED" } : p
                ),
              }
            : r
        ),
      }))
      showToast("分区已停用")
    } else {
      updateWarehouse((prev) => ({
        ...prev,
        storerooms: prev.storerooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                partitions: r.partitions.map((p) =>
                  p.id === part.id ? { ...p, status: "ENABLED" } : p
                ),
              }
            : r
        ),
      }))
      showToast("分区已启用")
    }
  }

  // 删除分区
  const handleDeletePartition = (roomId: string, part: PartitionNode) => {
    if (part.status === "ENABLED") {
      showToast("该分区处于启用状态，仅停用状态支持删除操作！")
      return
    }
    setConfirmDeletePartition({ roomId, partition: part })
  }

  const executeDeletePartition = () => {
    if (!confirmDeletePartition) return
    updateWarehouse((prev) => ({
      ...prev,
      storerooms: prev.storerooms.map((r) =>
        r.id === confirmDeletePartition.roomId
          ? {
              ...r,
              partitions: r.partitions.filter(
                (p) => p.id !== confirmDeletePartition.partition.id
              ),
            }
          : r
      ),
    }))
    setConfirmDeletePartition(null)
    showToast("分区删除成功")
  }

  // 删除设备
  const executeDeleteFacility = () => {
    if (!confirmDeleteFacilityId) return
    updateWarehouse((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== confirmDeleteFacilityId),
    }))
    setConfirmDeleteFacilityId(null)
    showToast("设备设施删除成功")
  }

  return (
    <PrototypeAnnotationProvider
      title={`仓库详情 · ${warehouse.name}`}
      documents={warehouseManagementDocuments}
      annotations={[...warehouseListAnnotations, ...warehouseDetailAnnotations]}
    >
      <VersionChangeProvider>
        <div className="space-y-4 p-4 md:p-6">
          {/* 页头面包屑与全局操作 */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to={WAREHOUSE_LIST_PATH} className="hover:text-foreground">
                  仓库管理
                </Link>
                <span>/</span>
                <span className="font-medium text-foreground">查看仓库</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => navigate(warehouseEditPath(warehouse.id))}
              >
                <PencilIcon className="size-3.5" />
                编辑
              </Button>
              <Link to={WAREHOUSE_LIST_PATH}>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <ArrowLeftIcon className="size-3.5" />
                  返回
                </Button>
              </Link>
            </div>
          </div>

          {/* 核心双栏工作台布局 */}
          <PrototypeAnnotationTarget annotationIds={["wh-detail-layout"]}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* 左栏：仓库主档信息（约 35% 宽度，垂直三卡片） */}
              <div className="space-y-4 lg:col-span-4 xl:col-span-4">
                {/* 卡片 1：仓库基础信息 */}
                <Card className="shadow-xs">
                  <CardHeader className="space-y-2 border-b bg-muted/20 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                          <Building2Icon className="size-4" />
                        </div>
                        <h2 className="text-base font-semibold text-foreground">
                          {warehouse.name}
                        </h2>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          warehouse.status === "ENABLED"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400"
                        )}
                      >
                        {statusBadge}
                      </Badge>
                    </div>
                    <div className="flex items-start gap-1 text-xs text-muted-foreground">
                      <MapPinIcon className="mt-0.5 size-3 shrink-0 text-muted-foreground/70" />
                      <span>{warehouse.address}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-3 text-xs sm:text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-muted-foreground">仓库面积</div>
                        <div className="mt-0.5 font-semibold text-foreground">
                          {warehouse.area.toLocaleString()} ㎡
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">仓库类型</div>
                        <div className="mt-0.5 font-medium text-foreground">
                          {warehouse.warehouseTypes.join("、") || "通用/常温库"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">仓库监管员类型</div>
                        <div className="mt-0.5 font-medium text-foreground">
                          {warehouse.supervisorType || "按人"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">仓库监管员</div>
                        <div className="mt-0.5 font-medium text-foreground">
                          {warehouse.supervisors?.join("、") || "张伟、李明"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">片区经理类型</div>
                        <div className="mt-0.5 font-medium text-foreground">
                          {warehouse.regionalManagerType || "按人"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">片区经理</div>
                        <div className="mt-0.5 font-medium text-foreground">
                          {warehouse.regionalManagers?.join("、") || "陈建国、王崇"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 卡片 2：管理方信息 */}
                <Card className="shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/20 py-2.5">
                    <CardTitle className="text-sm font-semibold">管理方信息</CardTitle>
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-xs font-normal text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                    >
                      {warehouse.managerType === "ENTERPRISE" ? "企业" : "个人"} ·{" "}
                      {warehouse.ownership === "OWNED"
                        ? "自有"
                        : warehouse.ownership === "LEASED"
                          ? "租赁"
                          : "其他"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3.5 pt-3 text-xs sm:text-sm">
                    <div>
                      <div className="text-muted-foreground">管理企业名称/姓名</div>
                      <div className="mt-0.5 break-words font-medium leading-snug text-foreground">
                        {warehouse.managerName}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">
                        统一社会信用代码/身份证号
                      </div>
                      <div className="mt-0.5 break-all font-mono text-[13px] leading-snug text-foreground">
                        {warehouse.managerIdNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">管理方联系电话</div>
                      <div className="mt-0.5 font-mono text-[13px] text-foreground">
                        {warehouse.managerPhone}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 卡片 3：中仓登准入仓 */}
                <Card className="shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/20 py-2.5">
                    <CardTitle className="text-sm font-semibold">中仓登准入仓</CardTitle>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-normal",
                        warehouse.zhongdengAccess === "YES"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400"
                      )}
                    >
                      {warehouse.zhongdengAccess === "YES" ? "已准入" : "未准入"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-3 text-xs sm:text-sm">
                    {warehouse.zhongdengAccess === "NO" ? (
                      <div className="rounded-md border border-dashed bg-muted/30 py-4 text-center text-xs text-muted-foreground">
                        该仓库未纳入中仓登准入仓
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <div>
                          <div className="text-muted-foreground">中仓登仓库ID号</div>
                          <div className="mt-0.5 break-all font-mono text-[13px] font-medium text-foreground">
                            {warehouse.zhongdengId || "5202"}
                          </div>
                        </div>

                        {/* 平面图预览 */}
                        <div>
                          <div className="text-muted-foreground">
                            仓库库区/库位平面图
                          </div>
                          <div className="mt-1 flex items-start justify-between gap-2 rounded-md border bg-muted/20 p-2 text-xs">
                            <div className="flex min-w-0 flex-1 items-start gap-2">
                              <ImageIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span className="line-clamp-2 break-words leading-snug">
                                {warehouse.layoutPlanFileName || "仓库库区平面图.png"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 shrink-0 px-1.5 text-xs text-primary hover:bg-primary/5 hover:text-primary"
                              onClick={() => showToast("正在打开平面图原图预览...")}
                            >
                              <EyeIcon className="mr-1 size-3" />
                              查看
                            </Button>
                          </div>
                        </div>

                        {/* 登记表下载 */}
                        <div>
                          <div className="text-muted-foreground">仓库信息登记表</div>
                          <div className="mt-1 flex items-start justify-between gap-2 rounded-md border bg-muted/20 p-2 text-xs">
                            <div className="flex min-w-0 flex-1 items-start gap-2">
                              <FileTextIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span className="line-clamp-2 break-words leading-snug">
                                {warehouse.regFormFileName || "仓库信息登记表.pdf"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 shrink-0 px-1.5 text-xs text-primary hover:bg-primary/5 hover:text-primary"
                              onClick={() => showToast("正在下载盖章登记表附件...")}
                            >
                              <DownloadIcon className="mr-1 size-3" />
                              下载
                            </Button>
                          </div>
                        </div>

                        {/* 仓库实景图 */}
                        <div>
                          <div className="text-muted-foreground">仓库图片</div>
                          <div className="mt-1 flex items-start justify-between gap-2 rounded-md border bg-muted/20 p-2 text-xs">
                            <div className="flex min-w-0 flex-1 items-start gap-2">
                              <ImageIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span className="line-clamp-2 break-words leading-snug">
                                {warehouse.photoFileNames?.[0] || "实景抓拍.png"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 shrink-0 px-1.5 text-xs text-primary hover:bg-primary/5 hover:text-primary"
                              onClick={() => showToast("正在打开仓库实景大图...")}
                            >
                              <EyeIcon className="mr-1 size-3" />
                              查看
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 右栏：工作台（约 65% 宽度，上下两工作区） */}
              <div className="min-w-0 space-y-5 lg:col-span-8 xl:col-span-8">
                {/* 工作区 1：库房与分区配置 */}
                <Card className="shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/20 py-3">
                    <CardTitle className="text-base font-semibold">
                      库房与分区配置
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <PrototypeAnnotationTarget annotationIds={["wh-63-goto-config"]}>
                          <Link
                            to={BASIC_CONFIG_PATH}
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "h-8 gap-1 text-xs font-normal"
                            )}
                          >
                            前往配置
                            <ExternalLinkIcon className="size-3" />
                          </Link>
                        </PrototypeAnnotationTarget>
                        <Tooltip>
                          <TooltipTrigger
                            type="button"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-help"
                            aria-label="出入库审核统管说明"
                          >
                            <CircleHelpIcon className="size-3.5" />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-[17rem] space-y-2 text-xs leading-relaxed"
                          >
                            <p className="font-medium">出入库审核在哪里配？</p>
                            <p className="text-muted-foreground">
                              本页只读，不能改审核范围。
                            </p>
                            <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
                              <li>点「前往配置」或进入【配置管理 → 平台管理 → 基础配置】</li>
                              <li>打开「仓储作业参数」</li>
                              <li>设置「出入库是否需要审核」；选「是」时可指定全部或部分库房</li>
                              <li>点「保存全部」后刷新本页</li>
                            </ol>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Button
                        size="sm"
                        className="h-8 font-normal"
                        onClick={() => setStoreroomDialog({ mode: "create" })}
                      >
                        <PlusIcon className="mr-1 size-3.5" />
                        添加库房
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {/* 库房与分区层级折叠列表 */}
                    {warehouse.storerooms.length === 0 ? (
                      <div className="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
                        暂无库房，请点击右上角「添加库房」配置空间
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {warehouse.storerooms.map((room) => {
                          const isCollapsed = Boolean(collapsedRooms[room.id])
                          const auditYesNo = resolveStoreroomInboundAuditYesNo(
                            room.id,
                            ops
                          )
                          const auditRequired =
                            storeroomInboundAuditRequiresApproval(room.id, ops)

                          return (
                            <div
                              key={room.id}
                              className="overflow-hidden rounded-lg border bg-card shadow-2xs"
                            >
                              {/* 库房行 Header */}
                              <div className="flex items-start justify-between gap-2 border-b bg-muted/30 px-3 py-3">
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleRoomCollapse(room.id)}
                                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                                    title={isCollapsed ? "展开分区" : "收起分区"}
                                  >
                                    {isCollapsed ? (
                                      <ChevronRightIcon className="size-4" />
                                    ) : (
                                      <ChevronDownIcon className="size-4" />
                                    )}
                                  </button>

                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "mt-0.5 shrink-0 text-xs",
                                      room.status === "ENABLED"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                        : "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400"
                                    )}
                                  >
                                    {room.status === "ENABLED" ? "启用" : "停用"}
                                  </Badge>

                                  {/* 库房名称 + 下方元信息 */}
                                  <div className="min-w-0 flex-1 space-y-1.5">
                                    <span className="block break-words font-semibold text-sm text-foreground leading-snug">
                                      {room.name}
                                    </span>

                                    <div className="space-y-2 text-xs">
                                      <PrototypeAnnotationTarget
                                        annotationIds={["wh-63-audit-badge"]}
                                      >
                                        <Tooltip>
                                          <TooltipTrigger
                                            type="button"
                                            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-left cursor-help"
                                          >
                                            <span className="shrink-0 text-muted-foreground">
                                              出入库审核
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className={cn(
                                                "shrink-0 font-normal min-w-[1.75rem] justify-center",
                                                auditRequired
                                                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                                  : "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400"
                                              )}
                                            >
                                              {auditYesNo}
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent
                                            side="top"
                                            className="max-w-[14rem] text-xs leading-relaxed"
                                          >
                                            该库房是否需要出入库审核：{auditYesNo}。修改请点右上角「?」或「前往配置」。
                                          </TooltipContent>
                                        </Tooltip>
                                      </PrototypeAnnotationTarget>

                                      {room.remark ? (
                                        <p className="min-w-0 break-words leading-snug">
                                          <span className="text-muted-foreground">
                                            备注信息：
                                          </span>
                                          <span className="text-foreground/85">
                                            {room.remark}
                                          </span>
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                {/* 库房行右侧操作 */}
                                <div className="flex shrink-0 items-center gap-3.5">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs font-medium text-primary hover:underline"
                                    onClick={() =>
                                      setPartitionDialog({
                                        mode: "create",
                                        storeroomId: room.id,
                                      })
                                    }
                                  >
                                    新增分区
                                  </Button>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs font-medium text-primary hover:underline"
                                    onClick={() =>
                                      setStoreroomDialog({ mode: "edit", room })
                                    }
                                  >
                                    编辑
                                  </Button>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs font-medium text-primary hover:underline"
                                    onClick={() => handleToggleStoreroomStatus(room)}
                                  >
                                    {room.status === "ENABLED" ? "停用" : "启用"}
                                  </Button>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs font-medium text-destructive hover:underline"
                                    onClick={() => handleDeleteStoreroom(room)}
                                  >
                                    删除
                                  </Button>
                                </div>
                              </div>

                              {/* 展开的分区子列表 */}
                              {!isCollapsed && (
                                <div className="space-y-1.5 p-3">
                                  {room.partitions.length === 0 ? (
                                    <div className="pl-6 text-xs text-muted-foreground">
                                      暂无下属分区，请点击右上角「新增分区」
                                    </div>
                                  ) : (
                                    room.partitions.map((part) => (
                                      <div
                                        key={part.id}
                                        className="flex items-start justify-between gap-2 rounded-md border border-muted/80 bg-background/80 px-3 py-2.5 ml-6 shadow-2xs"
                                      >
                                        <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              "mt-0.5 shrink-0 text-xs",
                                              part.status === "ENABLED"
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                : "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400"
                                            )}
                                          >
                                            {part.status === "ENABLED"
                                              ? "启用"
                                              : "停用"}
                                          </Badge>

                                          <div className="min-w-0 flex-1 space-y-1.5">
                                            <span className="block break-words font-medium text-sm text-foreground leading-snug">
                                              {part.name}
                                            </span>
                                            {part.remark ? (
                                              <p className="min-w-0 break-words text-xs leading-snug">
                                                <span className="text-muted-foreground">
                                                  备注信息：
                                                </span>
                                                <span className="text-foreground/85">
                                                  {part.remark}
                                                </span>
                                              </p>
                                            ) : null}
                                          </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-3.5">
                                          <Button
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs font-medium text-primary hover:underline"
                                            onClick={() =>
                                              setPartitionDialog({
                                                mode: "edit",
                                                storeroomId: room.id,
                                                partition: part,
                                              })
                                            }
                                          >
                                            编辑
                                          </Button>
                                          <Button
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs font-medium text-primary hover:underline"
                                            onClick={() =>
                                              handleTogglePartitionStatus(
                                                room.id,
                                                part
                                              )
                                            }
                                          >
                                            {part.status === "ENABLED"
                                              ? "停用"
                                              : "启用"}
                                          </Button>
                                          <Button
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs font-medium text-destructive hover:underline"
                                            onClick={() =>
                                              handleDeletePartition(room.id, part)
                                            }
                                          >
                                            删除
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 工作区 2：设备设施情况 */}
                <Card className="shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/20 py-3">
                    <CardTitle className="text-base font-semibold">
                      设备设施情况
                    </CardTitle>
                    <Button
                      size="sm"
                      className="h-8 font-normal"
                      onClick={() => setFacilityDialog({ mode: "create" })}
                    >
                      <PlusIcon className="mr-1 size-3.5" />
                      添加设备设施
                    </Button>
                  </CardHeader>
                  <CardContent className="min-w-0 pt-3">
                    {warehouse.facilities.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        暂无设备设施数据
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-md border bg-card">
                        <table className="w-full table-fixed caption-bottom text-sm">
                          <colgroup>
                            <col className="w-11" />
                            <col className="w-[11.5rem]" />
                            <col className="w-[4.25rem]" />
                            <col className="w-[5.5rem]" />
                            <col className="w-[5.75rem]" />
                          </colgroup>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="h-9 px-2">序号</TableHead>
                              <TableHead className="h-9 px-2 whitespace-normal">
                                设备设施名称
                              </TableHead>
                              <TableHead className="h-9 px-2 whitespace-normal">
                                数量
                              </TableHead>
                              <TableHead className="h-9 px-2 whitespace-normal">
                                有效期
                              </TableHead>
                              <TableHead className="h-9 px-2 whitespace-normal">
                                操作
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {warehouse.facilities.map((fac, index) => (
                              <TableRow key={fac.id}>
                                <TableCell className="px-2 align-middle text-muted-foreground whitespace-normal">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="px-2 align-top whitespace-normal">
                                  <span className="block break-words font-medium leading-snug">
                                    {fac.name}
                                  </span>
                                </TableCell>
                                <TableCell className="px-2 align-middle text-xs leading-snug whitespace-normal">
                                  {fac.quantity} {fac.unit}
                                </TableCell>
                                <TableCell className="px-2 align-middle font-mono text-xs leading-snug whitespace-normal">
                                  {fac.validUntil}
                                </TableCell>
                                <TableCell className="px-2 align-middle whitespace-normal">
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 text-xs"
                                      onClick={() =>
                                        setFacilityDialog({
                                          mode: "edit",
                                          facility: fac,
                                        })
                                      }
                                    >
                                      编辑
                                    </Button>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 text-xs text-destructive"
                                      onClick={() =>
                                        setConfirmDeleteFacilityId(fac.id)
                                      }
                                    >
                                      删除
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </table>
                      </div>
                    )}

                    {/* 简易分页栏 */}
                    <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
                      <span>共 {warehouse.facilities.length} 条</span>
                      <div className="flex items-center gap-2">
                        <span>10条/页</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled
                            className="size-6 rounded border text-center opacity-50"
                          >
                            &lt;
                          </button>
                          <button
                            type="button"
                            className="size-6 rounded bg-primary text-center text-xs font-medium text-primary-foreground"
                          >
                            1
                          </button>
                          <button
                            type="button"
                            disabled
                            className="size-6 rounded border text-center opacity-50"
                          >
                            &gt;
                          </button>
                        </div>
                        <span>前往 1 页</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </PrototypeAnnotationTarget>
        </div>

        {/* 各种弹窗 */}
        <StoreroomFormDialog
          open={Boolean(storeroomDialog)}
          mode={storeroomDialog?.mode ?? "create"}
          initial={storeroomDialog?.room}
          onOpenChange={(open) => !open && setStoreroomDialog(null)}
          onSubmit={({ name, remark }) => {
            if (storeroomDialog?.mode === "edit" && storeroomDialog.room) {
              updateWarehouse((prev) => ({
                ...prev,
                storerooms: prev.storerooms.map((r) =>
                  r.id === storeroomDialog.room!.id
                    ? { ...r, name, remark }
                    : r
                ),
              }))
            } else {
              updateWarehouse((prev) => ({
                ...prev,
                storerooms: [
                  ...prev.storerooms,
                  {
                    id: `room-${Date.now()}`,
                    name,
                    remark,
                    status: "ENABLED",
                    partitions: [],
                    hasInventory: false,
                    hasInboundRecords: false,
                  },
                ],
              }))
            }
            refresh()
            showToast("库房已保存")
          }}
        />

        <PartitionFormDialog
          open={Boolean(partitionDialog)}
          mode={partitionDialog?.mode ?? "create"}
          storerooms={warehouse.storerooms}
          initialStoreroomId={partitionDialog?.storeroomId}
          initialName={partitionDialog?.partition?.name}
          initialRemark={partitionDialog?.partition?.remark}
          onOpenChange={(open) => !open && setPartitionDialog(null)}
          onSubmit={({ storeroomId, name, remark }) => {
            if (partitionDialog?.mode === "edit" && partitionDialog.partition) {
              updateWarehouse((prev) => ({
                ...prev,
                storerooms: prev.storerooms.map((room) => ({
                  ...room,
                  partitions: room.partitions.map((p) =>
                    p.id === partitionDialog.partition!.id
                      ? { ...p, name, remark }
                      : p
                  ),
                })),
              }))
            } else {
              updateWarehouse((prev) => ({
                ...prev,
                storerooms: prev.storerooms.map((room) =>
                  room.id === storeroomId
                    ? {
                        ...room,
                        partitions: [
                          ...room.partitions,
                          {
                            id: `part-${Date.now()}`,
                            name,
                            remark,
                            status: "ENABLED",
                            hasInventory: false,
                            hasInboundRecords: false,
                          },
                        ],
                      }
                    : room
                ),
              }))
            }
            showToast("分区已保存")
          }}
        />

        <FacilityFormDialog
          open={Boolean(facilityDialog)}
          mode={facilityDialog?.mode ?? "create"}
          initial={facilityDialog?.facility}
          onOpenChange={(open) => !open && setFacilityDialog(null)}
          onSubmit={({ name, quantity, unit, validUntil }) => {
            if (facilityDialog?.mode === "edit" && facilityDialog.facility) {
              updateWarehouse((prev) => ({
                ...prev,
                facilities: prev.facilities.map((f) =>
                  f.id === facilityDialog.facility!.id
                    ? { ...f, name, quantity, unit, validUntil }
                    : f
                ),
              }))
              showToast("设备设施已更新")
            } else {
              updateWarehouse((prev) => ({
                ...prev,
                facilities: [
                  ...prev.facilities,
                  {
                    id: `fac-${Date.now()}`,
                    name,
                    quantity,
                    unit,
                    validUntil,
                  },
                ],
              }))
              showToast("设备设施已添加")
            }
          }}
        />

        <ConfirmActionDialog
          open={Boolean(confirmDeleteRoom)}
          title="确认删除库房"
          description={`删除库房「${confirmDeleteRoom?.name}」后不可在前台恢复，是否继续？`}
          confirmLabel="删除"
          onOpenChange={(open) => !open && setConfirmDeleteRoom(null)}
          onConfirm={executeDeleteRoom}
        />

        <ConfirmActionDialog
          open={Boolean(confirmDeletePartition)}
          title="确认删除分区"
          description={`删除分区「${confirmDeletePartition?.partition.name}」后不可在前台恢复，是否继续？`}
          confirmLabel="删除"
          onOpenChange={(open) => !open && setConfirmDeletePartition(null)}
          onConfirm={executeDeletePartition}
        />

        <ConfirmActionDialog
          open={Boolean(confirmDeleteFacilityId)}
          title="确认删除设备设施"
          description="删除后不可恢复，是否继续？"
          confirmLabel="删除"
          onOpenChange={(open) => !open && setConfirmDeleteFacilityId(null)}
          onConfirm={executeDeleteFacility}
        />

        {toastMessage ? (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </VersionChangeProvider>
    </PrototypeAnnotationProvider>
  )
}
