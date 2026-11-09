import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, ChevronDown, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { transferRecordDocuments } from "../documents/transfer-record-documents"
import { transferRecordFormAnnotations } from "../annotations/transfer-record-form.annotations"
import { FormPageHeader } from "@/shared/components/FormPageHeader"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { TransferGoodsPickerModal } from "../components/TransferGoodsPickerModal"
import { TransferOwnerVerifyDialog } from "../components/TransferOwnerVerifyDialog"
import {
  TRANSFER_RECORD_LIST_PATH,
  transferRecordDetailPath,
} from "../domain/constants"
import {
  SOURCE_OWNERS_MOCK,
  KNOWN_TARGET_OWNERS_MOCK,
} from "../mock/transfer-form.mock"
import { transferRecordsMock } from "../mock/transfer-records.mock"
import type {
  TransferFormState,
  TransferFormGoodsGroup,
} from "../domain/form-types"
import type { OwnerType, TransferRecord } from "../domain/types"

export function TransferRecordFormPage() {
  const navigate = useNavigate()

  // 默认当前时间
  const now = new Date()
  const defaultDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

  const [formState, setFormState] = useState<TransferFormState>({
    assignTime: defaultDateStr,
    sourceOwnerType: "ENTERPRISE",
    sourceOwnerName: "",
    sourceOwnerId: "",
    sourceOwnerIdentity: "",
    sourceIdCardNo: "",
    assignReason: "",
    goodsGroups: [],
    targetOwner: {
      ownerType: "ENTERPRISE",
      ownerName: "",
      ownerIdentity: "",
      idCardNo: "",
      isNewOwner: false,
    },
  })

  const [pickerOpen, setPickerOpen] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2800)
  }

  // 汇总计算（品类数与总数量，实时试算）
  const totals = useMemo(() => {
    const typeCount = formState.goodsGroups.length
    let totalQty = 0
    formState.goodsGroups.forEach((grp) => {
      grp.details.forEach((d) => {
        totalQty += d.transferAmount || 0
      })
    })
    return {
      typeCount,
      totalQty: Number(totalQty.toFixed(4)),
      unit: formState.goodsGroups[0]?.unit || "项",
    }
  }, [formState.goodsGroups])

  // 切换转让方类型
  const handleSourceTypeChange = (type: OwnerType) => {
    const matched = SOURCE_OWNERS_MOCK.find((o) => o.type === type)
    if (matched) {
      setFormState((prev) => ({
        ...prev,
        sourceOwnerType: type,
        sourceOwnerName: matched.name,
        sourceOwnerId: matched.id,
        sourceOwnerIdentity: matched.identity,
        sourceIdCardNo: matched.idCardNo || "",
      }))
    } else {
      setFormState((prev) => ({
        ...prev,
        sourceOwnerType: type,
        sourceOwnerName: "",
        sourceOwnerId: "",
        sourceOwnerIdentity: "",
        sourceIdCardNo: "",
      }))
    }
  }

  // 选择出让原货主
  const handleSourceOwnerSelect = (ownerName: string) => {
    const matched = SOURCE_OWNERS_MOCK.find((o) => o.name === ownerName)
    if (matched) {
      setFormState((prev) => ({
        ...prev,
        sourceOwnerName: matched.name,
        sourceOwnerId: matched.id,
        sourceOwnerIdentity: matched.identity,
        sourceIdCardNo: matched.idCardNo || "",
      }))
    }
  }

  // 接收方输入变更
  const handleTargetNameChange = (name: string) => {
    const matched = KNOWN_TARGET_OWNERS_MOCK.find((k) => k.name === name)
    if (matched) {
      setFormState((prev) => ({
        ...prev,
        targetOwner: {
          ownerType: matched.type,
          ownerName: matched.name,
          ownerIdentity: matched.identity,
          idCardNo: matched.idCardNo || "",
          isNewOwner: false,
        },
      }))
    } else {
      // 未匹配已有档案，标记为新受让人（提交时触发二元核验 R03）
      setFormState((prev) => ({
        ...prev,
        targetOwner: {
          ...prev.targetOwner,
          ownerName: name,
          isNewOwner: true,
        },
      }))
    }
  }

  // 货品展开收起
  const toggleGroupExpand = (groupId: string) => {
    setFormState((prev) => ({
      ...prev,
      goodsGroups: prev.goodsGroups.map((g) =>
        g.id === groupId ? { ...g, expanded: !g.expanded } : g
      ),
    }))
  }

  // 移除整组货品
  const handleRemoveGroup = (groupId: string) => {
    setFormState((prev) => ({
      ...prev,
      goodsGroups: prev.goodsGroups.filter((g) => g.id !== groupId),
    }))
  }

  // 移除具体储位明细
  const handleRemoveDetail = (groupId: string, detailId: string) => {
    setFormState((prev) => {
      const updatedGroups = prev.goodsGroups
        .map((g) => {
          if (g.id !== groupId) return g
          const newDetails = g.details.filter((d) => d.id !== detailId)
          return { ...g, details: newDetails }
        })
        .filter((g) => g.details.length > 0)

      return { ...prev, goodsGroups: updatedGroups }
    })
  }

  // 选货弹窗确认回填
  const handlePickerConfirm = (newGroups: TransferFormGoodsGroup[]) => {
    setFormState((prev) => ({
      ...prev,
      goodsGroups: newGroups,
    }))
  }

  // 提交总入口
  const handleSubmitClick = () => {
    if (!formState.sourceOwnerName) {
      showToast("请选择转让方(货主)名称！")
      return
    }
    if (!formState.assignReason.trim()) {
      showToast("请填写转让原因说明(最多500字)！")
      return
    }
    if (formState.goodsGroups.length === 0 || totals.totalQty <= 0) {
      showToast("请添加至少一项转让货物明细！")
      return
    }
    if (!formState.targetOwner.ownerName || !formState.targetOwner.ownerIdentity) {
      showToast("请填写完整的接收人姓名与标识信息！")
      return
    }

    // 若受让方为未建档新客户，强制触发二元短信核验 (R03)
    if (formState.targetOwner.isNewOwner) {
      setVerifyOpen(true)
      return
    }

    // 已建档客户直接提交生效
    executeSubmitComplete()
  }

  // 执行最终提交落库
  const executeSubmitComplete = () => {
    const newId = `2115716323${Date.now().toString().slice(-9)}`
    const newRecord: TransferRecord = {
      id: newId,
      assignTime: formState.assignTime,
      sourceOwner: {
        ownerName: formState.sourceOwnerName,
        ownerType: formState.sourceOwnerType,
        ownerIdentity: formState.sourceOwnerIdentity,
        idCardNo: formState.sourceIdCardNo,
      },
      targetOwner: {
        ownerName: formState.targetOwner.ownerName,
        ownerType: formState.targetOwner.ownerType,
        ownerIdentity: formState.targetOwner.ownerIdentity,
        idCardNo: formState.targetOwner.idCardNo,
      },
      warehouseName: formState.goodsGroups[0]?.warehouseName || "海霸王仓库",
      warehouseId: formState.goodsGroups[0]?.warehouseId,
      amount: totals.totalQty,
      unit: totals.unit,
      goodsSummaryText: `${formState.goodsGroups[0]?.goodsName}-${totals.totalQty}${totals.unit}`,
      goodsDisplayList: formState.goodsGroups.map((g) => ({
        name: g.goodsName,
        amount: g.details.reduce((acc, d) => acc + d.transferAmount, 0),
        unit: g.unit,
      })),
      goodsList: formState.goodsGroups.map((g) => ({
        id: g.id,
        goodsName: g.goodsName,
        warehouseName: g.warehouseName,
        amount: g.details.reduce((acc, d) => acc + d.transferAmount, 0),
        unit: g.unit,
        locations: g.details.map((d) => ({
          id: d.id,
          locationName: d.roomZone,
          specificLocation: d.specificLocation,
          inboundTime: d.inboundTime,
          otherInfo: d.otherInfo,
          barcode: d.barcode,
          barcodeQrUrl: d.qrCodeUrl,
          status: "存货中",
          amount: d.transferAmount,
          unit: d.unit,
        })),
      })),
      assignReason: formState.assignReason,
      createByName: "lxyl",
      createOrgName: "四川享宇科技有限公司",
      createTime: formState.assignTime,
      status: "APPROVED",
      auditLogs: [
        {
          id: `AUD-NEW-${Date.now()}`,
          flowName: "大宗商品货物在仓转让审核",
          nodeName: "转让申请提交",
          operatorName: "lxyl",
          operatorOrg: "四川享宇科技有限公司",
          action: "SUBMIT",
          actionName: "提交审核",
          time: formState.assignTime,
          comment: "系统自动完成受让新货主建档与二元短信核验。",
        },
      ],
    }

    transferRecordsMock.unshift(newRecord)
    showToast(`转让申请提交成功！单号：${newId}`)
    setTimeout(() => {
      navigate(transferRecordDetailPath(newId))
    }, 800)
  }

  return (
    <PrototypeAnnotationProvider
      title="新增转让原型批注"
      annotations={transferRecordFormAnnotations}
      documents={transferRecordDocuments}
    >
      <div className="min-h-screen p-6 space-y-5 pb-24 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-lg animate-in fade-in slide-in-from-top-3">
            {toastMessage}
          </div>
        )}

        {/* 顶部标题与返回操作条 */}
        <FormPageHeader
          title="新增转让"
          description="货权转让发起：仅无权利负担的存货可转让，需提交交易合同与货权交割依据"
          onBack={() => setCancelConfirmOpen(true)}
        />

        <PrototypeSpecCallout>
          转让必须写明交易背景与合同依据；货主标识由所选货主自动带出、不可手工修改；接收方信息提交时触发短信身份核验；同一仓库内的存货才能一并转让。
        </PrototypeSpecCallout>

        {/* Card 1: 基础信息区块（带 0/500 字必填转让原因说明 R04） */}
        <PrototypeAnnotationTarget annotationIds={["transfer-form-basic"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <CardContent className="space-y-4 pt-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="font-semibold text-sm text-slate-900">基础信息</span>
                <span className="text-[11px] text-slate-400">
                  (出让方原货主与交易合同依据，无权利负担的存货才能发起)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* 1. 转让日期 */}
                <div>
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>转让日期
                  </label>
                  <Input
                    type="text"
                    value={formState.assignTime}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, assignTime: e.target.value }))
                    }
                    className="h-9 text-xs mt-1"
                  />
                </div>

                {/* 2. 货主类型 */}
                <div>
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>货主类型
                  </label>
                  <Select
                    value={formState.sourceOwnerType}
                    onValueChange={(val: any) => handleSourceTypeChange(val)}
                  >
                    <SelectTrigger className="h-9 text-xs mt-1 w-full">
                      <SelectValue>
                        {(value) =>
                          value === "ENTERPRISE" ? "企业" : value === "PERSONAL" ? "个人" : "请选择货主类型"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTERPRISE">企业</SelectItem>
                      <SelectItem value="PERSONAL">个人</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. 货主名称 */}
                <div>
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>转让方名称
                  </label>
                  <Select
                    value={formState.sourceOwnerName}
                    onValueChange={(val) => handleSourceOwnerSelect(val ?? "")}
                  >
                    <SelectTrigger className="h-9 text-xs mt-1 w-full">
                      <SelectValue placeholder="请选择转让方" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_OWNERS_MOCK.filter(
                        (o) => o.type === formState.sourceOwnerType
                      ).map((o) => (
                        <SelectItem key={o.id} value={o.name}>
                          {o.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. 货主标识 */}
                <div>
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>货主标识
                  </label>
                  <Input
                    disabled
                    value={formState.sourceOwnerIdentity}
                    className="h-9 text-xs mt-1 bg-slate-50 text-slate-500"
                  />
                </div>

                {/* 个人展示身份证号 */}
                {formState.sourceOwnerType === "PERSONAL" && (
                  <div>
                    <label className="text-xs font-medium text-foreground">身份证号</label>
                    <Input
                      disabled
                      value={formState.sourceIdCardNo}
                      className="h-9 text-xs mt-1 bg-slate-50 text-slate-500"
                    />
                  </div>
                )}

                {/* 5. 转让原因说明（必填，带 0/500 字数统计与司法存证 R04） */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground">
                      <span className="text-rose-500 mr-1">*</span>转让原因说明 (司法交易背景)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {formState.assignReason.length}/500 字
                    </span>
                  </div>
                  <Textarea
                    maxLength={500}
                    rows={3}
                    placeholder="请输入货权转让交易背景、买卖合同编号及货款结算依据（最多500字）"
                    value={formState.assignReason}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        assignReason: e.target.value,
                      }))
                    }
                    className="mt-1 text-xs resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* Card 2: 货品明细区块（树形折叠，仅填转让数量，单仓强监管 R02） */}
        <PrototypeAnnotationTarget annotationIds={["transfer-form-goods"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <CardContent className="space-y-4 pt-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">转让货品明细（{formState.goodsGroups.length} 项）</span>
                  <span className="text-[11px] text-slate-400">
                    (单仓强监管：转让货物必须位于同一仓库，物理储位不动)
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPickerOpen(true)}
                  className="h-8 gap-1.5 text-xs text-primary hover:text-primary font-medium"
                >
                  <Plus className="h-4 w-4" />
                  添加货品
                </Button>
              </div>

              {formState.goodsGroups.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  暂未添加转让货品，请点击右上角【+ 添加货品】在同一仓库内选货
                </div>
              ) : (
                <div className="space-y-3">
                  {formState.goodsGroups.map((grp, gIdx) => {
                    const groupQty = grp.details.reduce(
                      (acc, d) => acc + (d.transferAmount || 0),
                      0
                    )

                    return (
                      <div
                        key={grp.id}
                        className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs"
                      >
                        {/* 一级规格主行 */}
                        <div className="flex items-center justify-between bg-slate-50/80 px-4 py-2.5">
                          <div
                            className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-900"
                            onClick={() => toggleGroupExpand(grp.id)}
                          >
                            {grp.expanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-500" />
                            )}
                            <span>
                              {gIdx + 1}. {grp.goodsName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              [{grp.warehouseName}]
                            </span>
                            <span className="ml-2 font-semibold text-primary">
                              小计: {groupQty} {grp.unit}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveGroup(grp.id)}
                            className="text-destructive hover:text-destructive/80 text-xs font-medium cursor-pointer"
                          >
                            移除货品
                          </button>
                        </div>

                        {/* 二级储位展开行（只读位置快照 + 填写转让数量） */}
                        {grp.expanded && (
                          <div className="overflow-x-auto border-t border-slate-100">
                            <Table className="w-full text-xs">
                              <TableHeader>
                                <TableRow className="bg-slate-50/50 text-slate-500 h-9">
                                  <TableHead className="w-12 text-center">序号</TableHead>
                                  <TableHead>位置 (当前储位)</TableHead>
                                  <TableHead className="w-24">具体位置</TableHead>
                                  <TableHead className="w-40">入库时间</TableHead>
                                  <TableHead className="w-32">其他信息</TableHead>
                                  <TableHead className="w-24">在库状态</TableHead>
                                  <TableHead className="w-28 text-right">可用量</TableHead>
                                  <TableHead className="w-32 text-right">转让数量</TableHead>
                                  <TableHead className="w-16 text-center">操作</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {grp.details.map((item, dIdx) => (
                                  <TableRow key={item.id} className="h-10">
                                    <TableCell className="text-center text-slate-400">
                                      {dIdx + 1}
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-800">
                                      {item.roomZone}
                                    </TableCell>
                                    <TableCell className="text-slate-500">
                                      {item.specificLocation}
                                    </TableCell>
                                    <TableCell className="text-slate-500">
                                      {item.inboundTime}
                                    </TableCell>
                                    <TableCell className="text-slate-500">
                                      {item.otherInfo || "—"}
                                    </TableCell>
                                    <TableCell>
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        存货中
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right text-slate-600">
                                      {item.availableAmount} {item.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className="font-semibold text-slate-900">
                                        {item.transferAmount} {item.unit}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDetail(grp.id, item.id)}
                                        className="text-destructive hover:text-destructive/80 text-xs font-medium cursor-pointer"
                                      >
                                        移除
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* Card 3: 接收方信息区块（受让新货主，二元短信核验准入 R03） */}
        <PrototypeAnnotationTarget annotationIds={["transfer-form-receiver"]}>
          <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <CardContent className="space-y-4 pt-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="font-semibold text-sm text-slate-900">接收方信息 (受让新货主)</span>
                <span className="text-[11px] text-slate-400">
                  (支持选择已有货主档案；录入新客户将在提交时触发 6 位短信验证码二元身份核验)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* 1. 接收方类型 */}
                <div>
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>接收方类型
                  </label>
                  <Select
                    value={formState.targetOwner.ownerType}
                    onValueChange={(val: any) =>
                      setFormState((prev) => ({
                        ...prev,
                        targetOwner: { ...prev.targetOwner, ownerType: val },
                      }))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs mt-1 w-full">
                      <SelectValue>
                        {(value) =>
                          value === "ENTERPRISE" ? "企业" : value === "PERSONAL" ? "个人" : "请选择接收方类型"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTERPRISE">企业</SelectItem>
                      <SelectItem value="PERSONAL">个人</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. 接收方姓名 */}
                <div>
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>接收方姓名/全称
                  </label>
                  <Input
                    placeholder="输入已有或新货主名称"
                    value={formState.targetOwner.ownerName}
                    onChange={(e) => handleTargetNameChange(e.target.value)}
                    className="h-9 text-xs mt-1"
                  />
                </div>

                {/* 3. 接收方标识 */}
                <div>
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-1">*</span>接收方手机/信用代码
                  </label>
                  <Input
                    placeholder="请输入统一社会信用代码或手机号"
                    value={formState.targetOwner.ownerIdentity}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        targetOwner: {
                          ...prev.targetOwner,
                          ownerIdentity: e.target.value,
                        },
                      }))
                    }
                    className="h-9 text-xs mt-1"
                  />
                </div>

                {/* 4. 身份证号（个人可编辑） */}
                {formState.targetOwner.ownerType === "PERSONAL" && (
                  <div>
                    <label className="text-xs font-medium text-foreground">接收方身份证号</label>
                    <Input
                      placeholder="请输入18位身份证号"
                      value={formState.targetOwner.idCardNo || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          targetOwner: {
                            ...prev.targetOwner,
                            idCardNo: e.target.value,
                          },
                        }))
                      }
                      className="h-9 text-xs mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 底部固定汇总栏（对齐出库管理标杆 OutboundFormSummaryBar） */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-card px-8 py-3.5 shadow-lg dark:border-slate-800 dark:bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div>
              转让品类数：
              <strong className="text-sm font-semibold text-slate-900 dark:text-slate-100 ml-1">
                {totals.typeCount}
              </strong>
            </div>
            <div>
              转让总数量：
              <strong className="text-sm font-semibold text-primary ml-1">
                {totals.totalQty} {totals.unit}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelConfirmOpen(true)}
              className="h-9 px-5 text-xs"
            >
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitClick}
              className="h-9 px-6 text-xs font-medium shadow-xs"
            >
              提交审核
            </Button>
          </div>
        </div>

        {/* 选货弹窗（单仓强监管阻断 R02） */}
        {pickerOpen && (
          <TransferGoodsPickerModal
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            onConfirm={handlePickerConfirm}
            initialWarehouseId={formState.goodsGroups[0]?.warehouseId}
          />
        )}

        {/* 新受让人二元短信核验弹窗 (R03) */}
        {verifyOpen && (
          <TransferOwnerVerifyDialog
            open={verifyOpen}
            ownerName={formState.targetOwner.ownerName}
            ownerIdentity={formState.targetOwner.ownerIdentity}
            onClose={() => setVerifyOpen(false)}
            onVerified={() => {
              setVerifyOpen(false)
              executeSubmitComplete()
            }}
          />
        )}

        {/* 取消未保存确认弹窗 */}
        <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
          <DialogContent className="max-w-sm text-xs p-6">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">确认放弃本次申请？</DialogTitle>
              <DialogDescription className="text-xs text-slate-500 pt-2">
                当前录入的转让方、货品明细与转让原因将丢失，未提交的单据不予保存。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelConfirmOpen(false)}
                className="h-8 text-xs"
              >
                继续编辑
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => navigate(TRANSFER_RECORD_LIST_PATH)}
                className="h-8 text-xs"
              >
                确认退出
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrototypeAnnotationProvider>
  )
}
