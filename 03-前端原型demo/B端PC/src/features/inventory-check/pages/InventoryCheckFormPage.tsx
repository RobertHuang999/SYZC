import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, QrCode, Upload, AlertCircle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryCheckDocuments } from "../documents/inventory-check-documents"
import { FormPageHeader } from "@/shared/components/FormPageHeader"
import { FormPageStickyFooter } from "@/shared/components/FormPageStickyFooter"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { inventoryCheckFormAnnotations } from "../annotations/inventory-check-form.annotations"
import { AddGoodsSummaryDialog } from "../components/AddGoodsSummaryDialog"
import { AddGoodsDetailDialog } from "../components/AddGoodsDetailDialog"
import { CheckSuccessModal } from "../components/CheckSuccessModal"
import {
  CHECK_MODE_OPTIONS,
  CHECK_TYPE_OPTIONS,
  MOCK_WAREHOUSES,
  MOCK_SYSTEM_USERS,
} from "../domain/constants"
import type { CheckMode, CheckType } from "../domain/types"
import type { CheckTaskFormData } from "../domain/form-types"

const CURRENT_USER_ID = "usr-01" // 当前登录人：lxy

export function InventoryCheckFormPage() {
  const navigate = useNavigate()

  // 默认任务名称生成
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10)
  const defaultTaskName = `${dateStr} 盘点单`

  const [formData, setFormData] = useState<CheckTaskFormData>({
    taskName: defaultTaskName,
    startDate: dateStr,
    endDate: dateStr,
    checkMode: "SINGLE_PERSON",
    plannedUserIds: [CURRENT_USER_ID],
    attachments: [],
    remarks: "",
    checkType: "BOOK_SUMMARY",
    warehouseId: "",
    warehouseName: "",
    selectedSummaryGoods: [],
    selectedDetailGoods: [],
  })

  // 错误提示
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 未保存离开拦截
  const initialFormRef = useRef(formData)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormRef.current)
  const handleBack = () => {
    if (isDirty) {
      setLeaveOpen(true)
      return
    }
    navigate("/仓储/货物盘点")
  }

  // 弹窗状态
  const [warehouseChangeTarget, setWarehouseChangeTarget] = useState<{ id: string; name: string } | null>(null)
  const [addSummaryOpen, setAddSummaryOpen] = useState(false)
  const [addDetailOpen, setAddDetailOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [createdCheckId, setCreatedCheckId] = useState<string>("chk-02")

  // 处理仓库切换
  const handleWarehouseSelect = (whId: string) => {
    const targetWh = MOCK_WAREHOUSES.find((w) => w.id === whId)
    if (!targetWh) return

    const hasGoods =
      formData.selectedSummaryGoods.length > 0 || formData.selectedDetailGoods.length > 0

    if (hasGoods && whId !== formData.warehouseId) {
      setWarehouseChangeTarget(targetWh)
    } else {
      setFormData((prev) => ({
        ...prev,
        warehouseId: targetWh.id,
        warehouseName: targetWh.name,
      }))
    }
  }

  const confirmWarehouseChange = () => {
    if (!warehouseChangeTarget) return
    setFormData((prev) => ({
      ...prev,
      warehouseId: warehouseChangeTarget.id,
      warehouseName: warehouseChangeTarget.name,
      selectedSummaryGoods: [],
      selectedDetailGoods: [],
    }))
    setWarehouseChangeTarget(null)
  }

  // 处理人员选择 (单人限1，多人可多选)
  const handleUserToggle = (userId: string) => {
    if (formData.checkMode === "SINGLE_PERSON") {
      setFormData((prev) => ({
        ...prev,
        plannedUserIds: [userId],
      }))
    } else {
      setFormData((prev) => {
        const exists = prev.plannedUserIds.includes(userId)
        const updated = exists
          ? prev.plannedUserIds.filter((id) => id !== userId)
          : [...prev.plannedUserIds, userId]
        return {
          ...prev,
          plannedUserIds: updated.length === 0 ? [userId] : updated,
        }
      })
    }
  }

  // 模式切换
  const handleModeChange = (mode: CheckMode) => {
    setFormData((prev) => ({
      ...prev,
      checkMode: mode,
      plannedUserIds: mode === "SINGLE_PERSON" ? [prev.plannedUserIds[0] || CURRENT_USER_ID] : prev.plannedUserIds,
    }))
  }

  // 盘点类型切换 (清空明细)
  const handleTypeChange = (type: CheckType) => {
    setFormData((prev) => ({
      ...prev,
      checkType: type,
      selectedSummaryGoods: [],
      selectedDetailGoods: [],
    }))
  }

  // 表单校验与提交
  const handleSubmit = () => {
    setErrorMessage(null)

    if (!formData.taskName.trim()) {
      setErrorMessage("请填写盘点任务名称")
      return
    }
    if (formData.taskName.length > 40) {
      setErrorMessage("盘点任务名称不能超过40个字符")
      return
    }
    if (!formData.startDate || !formData.endDate) {
      setErrorMessage("请选择完整的盘点时间范围")
      return
    }
    if (formData.startDate > formData.endDate) {
      setErrorMessage("盘点开始时间不得晚于盘点结束时间")
      return
    }
    if (formData.plannedUserIds.length === 0) {
      setErrorMessage("请至少选择一名计划盘点人员")
      return
    }

    const goodsCount =
      formData.checkType === "BOOK_SUMMARY"
        ? formData.selectedSummaryGoods.length
        : formData.selectedDetailGoods.length

    if (goodsCount === 0) {
      setErrorMessage("货品明细至少需包含一条数据，请点击右上方添加货品")
      return
    }

    // 成功创建，弹出弹窗
    setCreatedCheckId("chk-02")
    setSuccessModalOpen(true)
  }

  // 计算合计
  const summaryTotalQty = formData.selectedSummaryGoods.reduce((sum, i) => sum + i.snapshotQty, 0)
  const detailTotalQty = formData.selectedDetailGoods.reduce((sum, i) => sum + i.snapshotQty, 0)
  const canCurrentUserCheck = formData.plannedUserIds.includes(CURRENT_USER_ID)

  return (
    <PrototypeAnnotationProvider
      title="新增盘点任务"
      documents={inventoryCheckDocuments}
      annotations={inventoryCheckFormAnnotations}
    >
      <div className="flex min-h-full flex-col font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="flex-1 space-y-4 p-6 pb-6">
        {/* 顶部面包屑与操作栏 */}
        <FormPageHeader
          title="新增盘点任务"
          description="按账面汇总或库存明细发起盘点，指派盘点人员并设定盘点时间范围"
          onBack={handleBack}
        />

        <PrototypeSpecCallout>
          盘点任务名称最多 40 字；盘点开始时间不得晚于结束时间；单人独立盘点只能指派 1 名盘点人；盘点仓库必选。
        </PrototypeSpecCallout>

        {/* 校验错误提示条 */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Card 1: 基础信息打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-form-base-card"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                基础信息
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* 任务名称 */}
                <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>盘点任务名称
                  </label>
                  <Input
                    value={formData.taskName}
                    maxLength={40}
                    onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                    className="h-9 text-xs"
                    placeholder="请输入盘点任务名称"
                  />
                  <div className="text-right text-[11px] text-slate-400">
                    {formData.taskName.length}/40
                  </div>
                </div>

                {/* 盘点开始时间 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-0.5">*</span>盘点开始时间
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                {/* 盘点结束时间 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-0.5">*</span>盘点结束时间
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                {/* 盘点模式 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-0.5">*</span>盘点模式
                  </label>
                  <Select
                    value={formData.checkMode}
                    onValueChange={(val) => handleModeChange(val as CheckMode)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue>
                        {(value) =>
                          CHECK_MODE_OPTIONS.find((opt) => opt.value === value)?.label ?? "请选择盘点模式"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CHECK_MODE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 计划盘点人员 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1">
                    <span className="text-rose-500 mr-0.5">*</span>计划盘点人员
                    <span className="text-[11px] text-slate-400 font-normal">
                      ({formData.checkMode === "SINGLE_PERSON" ? "单人模式限选 1 人" : "多人模式可多选协同"})
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {MOCK_SYSTEM_USERS.map((user) => {
                      const isSelected = formData.plannedUserIds.includes(user.id)
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleUserToggle(user.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {user.name} ({user.company.split("公司")[0]})
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 备注信息 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    备注信息
                  </label>
                  <span className="text-[11px] text-slate-400">{formData.remarks.length}/500</span>
                </div>
                <Textarea
                  placeholder="请输入本次盘点任务的注意事项或说明（最多500字）"
                  value={formData.remarks}
                  maxLength={500}
                  rows={2}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="text-xs resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* Card 2: 盘点类型与仓库打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-form-warehouse-card"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                盘点类型与监管仓库
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* 盘点类型 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-0.5">*</span>盘点类型
                  </label>
                  <Select
                    value={formData.checkType}
                    onValueChange={(val) => handleTypeChange(val as CheckType)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue>
                        {(value) =>
                          CHECK_TYPE_OPTIONS.find((opt) => opt.value === value)?.label ?? "请选择盘点类型"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CHECK_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label} ({opt.desc})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 盘点仓库 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-0.5">*</span>盘点仓库
                  </label>
                  <Select
                    value={formData.warehouseId}
                    onValueChange={(val) => handleWarehouseSelect(val ?? "")}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue>
                        {(value) =>
                          MOCK_WAREHOUSES.find((wh) => wh.id === value)?.name ?? "请选择盘点仓库"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_WAREHOUSES.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id}>
                          {wh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* Card 3: 货品明细打点 */}
        <PrototypeAnnotationTarget annotationIds={["check-form-goods-card"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                货品明细（{formData.checkType === "BOOK_SUMMARY" ? formData.selectedSummaryGoods.length : formData.selectedDetailGoods.length} 项）
              </CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (formData.checkType === "BOOK_SUMMARY") {
                    setAddSummaryOpen(true)
                  } else {
                    setAddDetailOpen(true)
                  }
                }}
                className="h-8 gap-1 px-3 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                添加货品
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {/* 账面汇总表格 */}
              {formData.checkType === "BOOK_SUMMARY" ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                        <tr>
                          <th className="w-14 px-4 py-2.5 text-center">序号</th>
                          <th className="px-4 py-2.5">货物名称</th>
                          <th className="w-24 px-4 py-2.5">单位</th>
                          <th className="w-36 px-4 py-2.5 text-right">本次数量 (账面快照)</th>
                          <th className="w-20 px-4 py-2.5 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {formData.selectedSummaryGoods.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400">
                              请点击右上方添加按钮选择盘点货品
                            </td>
                          </tr>
                        ) : (
                          formData.selectedSummaryGoods.map((item, idx) => (
                            <tr key={item.id} className="h-12 hover:bg-slate-50/50">
                              <td className="px-4 py-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">
                                {item.goodsName}
                              </td>
                              <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{item.unit}</td>
                              <td className="px-4 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                                {item.snapshotQty.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      selectedSummaryGoods: prev.selectedSummaryGoods.filter(
                                        (g) => g.id !== item.id
                                      ),
                                    }))
                                  }
                                  className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                                  title="移除"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {formData.selectedSummaryGoods.length > 0 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40">
                      <span>已选货品类型: <strong className="text-slate-900 dark:text-slate-100">{formData.selectedSummaryGoods.length}</strong> 种</span>
                      <span>库存总数量合计: <strong className="text-amber-700 dark:text-amber-400 font-semibold">{summaryTotalQty.toLocaleString()}</strong> 吨</span>
                    </div>
                  )}
                </div>
              ) : (
                /* 库存明细表格 */
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                        <tr>
                          <th className="w-12 px-3 py-2 text-center">序号</th>
                          <th className="px-3 py-2">货主</th>
                          <th className="px-3 py-2">货物名称</th>
                          <th className="w-24 px-3 py-2 text-right">本次数量</th>
                          <th className="w-32 px-3 py-2">仓库/库房/分区</th>
                          <th className="w-20 px-3 py-2">状态</th>
                          <th className="w-20 px-3 py-2 text-center">存货条码</th>
                          <th className="w-16 px-3 py-2 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {formData.selectedDetailGoods.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-slate-400">
                              请点击右上方添加按钮选择盘点货品
                            </td>
                          </tr>
                        ) : (
                          formData.selectedDetailGoods.map((item, idx) => (
                            <tr key={item.id} className="h-12 hover:bg-slate-50/50">
                              <td className="px-3 py-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2">
                                <div className="font-medium text-slate-800 dark:text-slate-200">{item.ownerName}</div>
                                <div className="text-[11px] text-slate-400">{item.ownerCode}</div>
                              </td>
                              <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                                {item.goodsName}
                              </td>
                              <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                                {item.snapshotQty} {item.unit}
                              </td>
                              <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                                <div>{item.roomName}</div>
                                <div className="text-[11px] text-slate-400">{item.partitionName}</div>
                              </td>
                              <td className="px-3 py-2">
                                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                  {item.goodsStatus}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                  <QrCode className="h-3.5 w-3.5" />
                                  二维码
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      selectedDetailGoods: prev.selectedDetailGoods.filter(
                                        (g) => g.id !== item.id
                                      ),
                                    }))
                                  }
                                  className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                                  title="移除"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {formData.selectedDetailGoods.length > 0 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40">
                      <span>已选存货条码数: <strong className="text-slate-900 dark:text-slate-100">{formData.selectedDetailGoods.length}</strong> 条</span>
                      <span>库存总数量合计: <strong className="text-amber-700 dark:text-amber-400 font-semibold">{detailTotalQty}</strong> 吨</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 仓库修改二次确认弹窗 */}
        {warehouseChangeTarget && (
          <Dialog
            open={!!warehouseChangeTarget}
            onOpenChange={(open) => !open && setWarehouseChangeTarget(null)}
          >
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-slate-900">
                  确认修改盘点仓库？
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 pt-2 leading-relaxed">
                  更改仓库将清空下方已选货品明细，是否确认修改为
                  <strong className="text-slate-800 font-semibold">【{warehouseChangeTarget.name}】</strong>？
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setWarehouseChangeTarget(null)}
                  className="h-8 text-xs"
                >
                  取消
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={confirmWarehouseChange}
                  className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white"
                >
                  确认清空并修改
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* 添加货品弹窗 (账面汇总) */}
        <AddGoodsSummaryDialog
          open={addSummaryOpen}
          warehouseName={formData.warehouseName}
          alreadySelectedIds={formData.selectedSummaryGoods.map((i) => i.id)}
          onOpenChange={setAddSummaryOpen}
          onConfirm={(selected) =>
            setFormData((prev) => ({
              ...prev,
              selectedSummaryGoods: [...prev.selectedSummaryGoods, ...selected],
            }))
          }
        />

        {/* 添加货品弹窗 (库存明细) */}
        <AddGoodsDetailDialog
          open={addDetailOpen}
          warehouseName={formData.warehouseName}
          alreadySelectedIds={formData.selectedDetailGoods.map((i) => i.id)}
          onOpenChange={setAddDetailOpen}
          onConfirm={(selected) =>
            setFormData((prev) => ({
              ...prev,
              selectedDetailGoods: [...prev.selectedDetailGoods, ...selected],
            }))
          }
        />

        {/* 提交成功弹窗 */}
        <CheckSuccessModal
          open={successModalOpen}
          taskName={formData.taskName}
          modeLabel={formData.checkMode === "SINGLE_PERSON" ? "单人独立盘点" : "多人协作盘点"}
          canExecuteCheck={canCurrentUserCheck}
          onOpenChange={setSuccessModalOpen}
          onGoToList={() => navigate("/仓储/货物盘点")}
          onGoToCheck={() => navigate(`/仓储/货物盘点/待盘点/${createdCheckId}`)}
        />

        {/* 未保存离开确认 */}
        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存确认</DialogTitle>
              <DialogDescription>
                当前盘点任务还有未提交的内容，离开将丢失已填写的任务信息和货品明细。确定返回列表吗？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeaveOpen(false)}>
                继续编辑
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setLeaveOpen(false)
                  navigate("/仓储/货物盘点")
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>

        <FormPageStickyFooter left="提交后生成盘点任务，可在待盘点页录入实盘结果">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-4 text-xs"
            onClick={handleBack}
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 px-5 text-xs"
            onClick={handleSubmit}
          >
            提交
          </Button>
        </FormPageStickyFooter>
      </div>
    </PrototypeAnnotationProvider>
  )
}

