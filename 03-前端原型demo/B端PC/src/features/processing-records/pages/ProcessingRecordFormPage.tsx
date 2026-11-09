import { useState, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Send,
  Building2,
  FileCheck2,
} from "lucide-react"
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
import { processingRecordDocuments } from "../documents/processing-record-documents"
import { FormPageHeader } from "@/shared/components/FormPageHeader"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { processingRecordFormAnnotations } from "../annotations/processing-record-form.annotations"
import { ProcessingGoodsPickerModal } from "../components/ProcessingGoodsPickerModal"
import {
  PROCESSING_RECORD_LIST_PATH,
  PROCESSING_TYPE_MAP,
} from "../domain/constants"
import type {
  InputGoodsGroup,
  OutputGoodsItem,
  OwnerType,
  ProcessingRecord,
  ProcessingType,
} from "../domain/types"
import type { ProcessingFormState } from "../domain/form-types"
import {
  calculateExpectedOutputTotalAmount,
  calculateInputCategoryCount,
  calculateInputTotalQuantity,
  formatCurrency,
  formatQuantity,
} from "../lib/processing-calculator"
import {
  CANDIDATE_OUTPUT_PRODUCTS_MOCK,
  KNOWN_ASSOCIATED_ORDERS_MOCK,
  KNOWN_OWNERS_MOCK,
} from "../mock/processing-form.mock"
import { processingRecordsMock } from "../mock/processing-records.mock"

export function ProcessingRecordFormPage() {
  const navigate = useNavigate()

  // 格式化当前本地时间为 YYYY-MM-DD HH:mm:ss
  const defaultNowStr = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
  }, [])

  // 表单状态
  const [formState, setFormState] = useState<ProcessingFormState>({
    processingTime: defaultNowStr,
    ownerType: "ENTERPRISE",
    ownerId: "",
    ownerName: "",
    ownerIdentity: "",
    ownerIdCard: undefined,
    processingType: "INVENTORY",
    associatedOrderId: "",
    remark: "",
    inputGoodsGroups: [],
    outputGoodsItems: [],
  })

  // 折叠卡片状态
  const [basicCardOpen, setBasicCardOpen] = useState(true)
  const [inputCardOpen, setInputCardOpen] = useState(true)
  const [outputCardOpen, setOutputCardOpen] = useState(true)

  // 未保存离开拦截
  const initialFormRef = useRef(formState)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const isDirty = JSON.stringify(formState) !== JSON.stringify(initialFormRef.current)
  const handleBack = () => {
    if (isDirty) {
      setLeaveOpen(true)
      return
    }
    navigate(PROCESSING_RECORD_LIST_PATH)
  }

  // 错误信息与弹窗
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pickerModalOpen, setPickerModalOpen] = useState(false)
  const [orderSelectModalOpen, setOrderSelectModalOpen] = useState(false)

  // 主表锁定的仓库（由首条投入货物自动确定，R05）
  const lockedWarehouse = useMemo(() => {
    for (const group of formState.inputGoodsGroups) {
      if (group.details.length > 0) {
        return {
          id: group.details[0].warehouseId,
          name: group.details[0].warehouseName,
        }
      }
    }
    return null
  }, [formState.inputGoodsGroups])

  // 货主变更联动 (R02)
  const handleOwnerChange = (ownerId: string) => {
    const matched = KNOWN_OWNERS_MOCK.find((o) => o.id === ownerId)
    if (!matched) return

    setFormState((prev) => ({
      ...prev,
      ownerId: matched.id,
      ownerName: matched.name,
      ownerType: matched.type,
      ownerIdentity: matched.identity,
      ownerIdCard: matched.idCardNo,
      associatedOrderId: undefined,
      // 变更货主时清空明细，防止跨主体数据污染 (R02)
      inputGoodsGroups: [],
    }))
  }

  // 货主类型变更联动
  const handleOwnerTypeChange = (type: OwnerType) => {
    const candidates = KNOWN_OWNERS_MOCK.filter((o) => o.type === type)
    const first = candidates[0]
    if (first) {
      handleOwnerChange(first.id)
    }
  }

  // 加工类型变更
  const handleProcessingTypeChange = (type: ProcessingType) => {
    setFormState((prev) => ({
      ...prev,
      processingType: type,
      associatedOrderId: undefined,
      inputGoodsGroups: [],
    }))
  }

  // 确认添加投入货品
  const handlePickerConfirm = (newGroups: InputGoodsGroup[]) => {
    setFormState((prev) => {
      // 合并逻辑：若已有相同 goodsId 则合并 details，否则追加
      const combined = [...prev.inputGoodsGroups]
      for (const ng of newGroups) {
        const existIdx = combined.findIndex((g) => g.goodsId === ng.goodsId)
        if (existIdx >= 0) {
          combined[existIdx] = {
            ...combined[existIdx],
            details: [...combined[existIdx].details, ...ng.details],
          }
        } else {
          combined.push(ng)
        }
      }
      return {
        ...prev,
        inputGoodsGroups: combined,
      }
    })
  }

  // 编辑货位计划投入量
  const handleDetailPlanAmountChange = (
    groupId: string,
    detailId: string,
    val: string
  ) => {
    setFormState((prev) => {
      const copyGroups = prev.inputGoodsGroups.map((g) => {
        if (g.id !== groupId) return g
        return {
          ...g,
          details: g.details.map((d) => {
            if (d.id !== detailId) return d
            const num = parseFloat(val)
            return {
              ...d,
              planAmount: isNaN(num) ? 0 : num,
            }
          }),
        }
      })
      return { ...prev, inputGoodsGroups: copyGroups }
    })
  }

  // 移除整组投入货品
  const handleRemoveGroup = (groupId: string) => {
    setFormState((prev) => ({
      ...prev,
      inputGoodsGroups: prev.inputGoodsGroups.filter((g) => g.id !== groupId),
    }))
  }

  // 移除单个二级货位
  const handleRemoveDetail = (groupId: string, detailId: string) => {
    setFormState((prev) => {
      const copyGroups = prev.inputGoodsGroups
        .map((g) => {
          if (g.id !== groupId) return g
          const remainingDetails = g.details.filter((d) => d.id !== detailId)
          return {
            ...g,
            details: remainingDetails,
          }
        })
        .filter((g) => g.details.length > 0) // 若二级全删则整品类移除

      return { ...prev, inputGoodsGroups: copyGroups }
    })
  }

  // 添加一条产出货品
  const handleAddOutputItem = (candidate: (typeof CANDIDATE_OUTPUT_PRODUCTS_MOCK)[0]) => {
    const newItem: OutputGoodsItem = {
      id: `OUT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goodsId: candidate.goodsId,
      goodsName: candidate.goodsName,
      specModel: candidate.specModel,
      unit: candidate.unit,
      expectedQty: 10,
      price: candidate.price,
      expectedAmount:
        typeof candidate.price === "number" ? candidate.price * 10 : null,
      warehouseLocation: lockedWarehouse
        ? `${lockedWarehouse.name}-B库房-精加工成品区`
        : "宝山大宗金属1号仓-B库房-精加工成品区",
      specificLocation: "B-01-01",
      collectAttrs: candidate.collectAttrTemplates.map((t) => ({ ...t, value: "" })),
    }

    setFormState((prev) => ({
      ...prev,
      outputGoodsItems: [...prev.outputGoodsItems, newItem],
    }))
  }

  // 修改产出预计数量
  const handleOutputExpectedQtyChange = (itemId: string, val: string) => {
    setFormState((prev) => {
      const copy = prev.outputGoodsItems.map((item) => {
        if (item.id !== itemId) return item
        const num = parseFloat(val)
        const expectedQty = isNaN(num) ? 0 : num
        const expectedAmount =
          typeof item.price === "number"
            ? parseFloat((expectedQty * item.price).toFixed(2))
            : null
        return {
          ...item,
          expectedQty,
          expectedAmount,
        }
      })
      return { ...prev, outputGoodsItems: copy }
    })
  }

  // 移除产出货品
  const handleRemoveOutputItem = (itemId: string) => {
    setFormState((prev) => ({
      ...prev,
      outputGoodsItems: prev.outputGoodsItems.filter((i) => i.id !== itemId),
    }))
  }

  // 统计汇总
  const inputCategoryCount = calculateInputCategoryCount(formState.inputGoodsGroups)
  const inputTotalQty = calculateInputTotalQuantity(formState.inputGoodsGroups)
  const outputTotalSummary = calculateExpectedOutputTotalAmount(
    formState.outputGoodsItems
  )

  // 提交审核
  const handleSubmit = () => {
    setErrorMessage(null)

    // 1. 加工时间校验 (R01)
    if (!formState.processingTime) {
      setErrorMessage("加工日期时间为必填项。")
      return
    }

    // 2. 货主必选 (R02)
    if (!formState.ownerId || !formState.ownerName) {
      setErrorMessage("请选择加工所属货主主体。")
      return
    }

    // 3. 抵质押/监管必须有关联单号 (R04)
    if (formState.processingType !== "INVENTORY" && !formState.associatedOrderId) {
      setErrorMessage(
        `${PROCESSING_TYPE_MAP[formState.processingType]}必须选择关联的有效融资/监管单据。`
      )
      return
    }

    // 4. 投入货物至少 1 种 (R05/R06)
    if (formState.inputGoodsGroups.length === 0) {
      setErrorMessage("请添加至少一条投入货品明细。")
      return
    }

    // 校验每条计划投入量 (R06)
    for (const group of formState.inputGoodsGroups) {
      for (const d of group.details) {
        if (d.planAmount <= 0) {
          setErrorMessage(`货品「${group.goodsName}」的计划投入量必须大于 0。`)
          return
        }
        if (d.planAmount > d.availableAmount) {
          setErrorMessage(
            `货位「${d.specificLocation}」计划投入量 (${d.planAmount}) 超出可用量 (${d.availableAmount})。`
          )
          return
        }
      }
    }

    // 5. 产出明细至少 1 种 (R07)
    if (formState.outputGoodsItems.length === 0) {
      setErrorMessage("请添加至少一条预计产出货品明细。")
      return
    }

    for (const out of formState.outputGoodsItems) {
      if (out.expectedQty <= 0) {
        setErrorMessage(`产出货品「${out.goodsName}」的预计产出数量必须大于 0。`)
        return
      }
    }

    // 6. 备注字数校验 (R08)
    if (formState.remark && formState.remark.length > 140) {
      setErrorMessage("申请备注最多允许录入 140 个字符。")
      return
    }

    // 生成新单号并推入 Mock（19位纯数字）
    const newId = `209${Date.now()}${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    const newRecord: ProcessingRecord = {
      id: newId,
      processingTime: formState.processingTime,
      ownerType: formState.ownerType,
      ownerName: formState.ownerName,
      ownerIdentity: formState.ownerIdentity,
      ownerIdCard: formState.ownerIdCard,
      processingType: formState.processingType,
      warehouseId: lockedWarehouse ? lockedWarehouse.id : "WH-BS01",
      warehouseName: lockedWarehouse ? lockedWarehouse.name : "宝山大宗金属1号仓",
      associatedOrderId: formState.associatedOrderId,
      status: "PENDING_COMPLETION",
      remark: formState.remark,
      createByName: "当前经办人",
      createOrgName: "森云科技",
      createTime: defaultNowStr,
      version: 1,
      inputGoodsGroups: formState.inputGoodsGroups,
      outputGoodsItems: formState.outputGoodsItems,
      auditNodes: [
        {
          id: `AUD-NEW-1`,
          nodeName: "申请提交",
          handlerName: "当前经办人",
          handlerOrg: "森云科技",
          handleTime: defaultNowStr,
          status: "SUBMITTED",
          comment: "新增加工申请提交成功，推入系统审批中心",
        },
      ],
    }

    processingRecordsMock.unshift(newRecord)
    alert(`加工申请已成功提交至系统审批中心！生成加工单号：${newId}`)
    navigate(PROCESSING_RECORD_LIST_PATH)
  }

  return (
    <PrototypeAnnotationProvider
      title="新增加工申请"
      documents={processingRecordDocuments}
      annotations={processingRecordFormAnnotations}
    >
      <div className="space-y-4 p-6 pb-24">
        {/* 顶部操作条 */}
        <PrototypeAnnotationTarget annotationIds={["processing-form-page"]}>
          <FormPageHeader
            title="新增加工申请"
            description="在仓切割、分卷、拆分或熔炼加工；计划投入货物锁库，产出新条码继承货权"
            onBack={handleBack}
          />

          <PrototypeSpecCallout>
            计划投入数量必须大于 0，提交后对应货物锁库；实际投入不得超过计划数量；产出货物生成新条码并继承原货权；变更货主会清空已选明细，避免跨主体数据串用。
          </PrototypeSpecCallout>
        </PrototypeAnnotationTarget>

        {/* 错误提示 */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-md bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 卡片 1：基础信息 */}
        <PrototypeAnnotationTarget annotationIds={["processing-form-basic-card"]}>
          <Card className="border-border/80 shadow-sm">
            <div
              className="flex items-center justify-between border-b border-border/70 px-5 py-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              onClick={() => setBasicCardOpen(!basicCardOpen)}
            >
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                基础信息
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {basicCardOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>

            {basicCardOpen && (
              <CardContent className="p-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* 加工日期 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      <span className="text-rose-500 mr-0.5">*</span>加工日期 (精确到秒)
                    </label>
                    <Input
                      value={formState.processingTime}
                      className="h-[34px] text-xs"
                      placeholder="YYYY-MM-DD HH:mm:ss"
                      onChange={(e) =>
                        setFormState({ ...formState, processingTime: e.target.value })
                      }
                    />
                  </div>

                  {/* 货主类型 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      <span className="text-rose-500 mr-0.5">*</span>货主类型
                    </label>
                    <Select
                      value={formState.ownerType}
                      onValueChange={(val) => handleOwnerTypeChange(val as OwnerType)}
                    >
                      <SelectTrigger className="h-[34px] text-xs">
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

                  {/* 货主名称 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      <span className="text-rose-500 mr-0.5">*</span>货主名称
                    </label>
                    <Select
                      value={formState.ownerId}
                      onValueChange={(val) => val && handleOwnerChange(val)}
                    >
                      <SelectTrigger className="h-[34px] text-xs">
                        <SelectValue placeholder="请选择货主" />
                      </SelectTrigger>
                      <SelectContent>
                        {KNOWN_OWNERS_MOCK.filter(
                          (o) => o.type === formState.ownerType
                        ).map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 货主标识 (自动带出只读) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      货主标识 (信用代码/手机号)
                    </label>
                    <Input
                      disabled
                      value={formState.ownerIdentity}
                      className="h-[34px] text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  {/* 加工类型 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      <span className="text-rose-500 mr-0.5">*</span>加工类型
                    </label>
                    <Select
                      value={formState.processingType}
                      onValueChange={(val) =>
                        handleProcessingTypeChange(val as ProcessingType)
                      }
                    >
                      <SelectTrigger className="h-[34px] text-xs">
                        <SelectValue>
                          {(value) =>
                            PROCESSING_TYPE_MAP[value as ProcessingType] ?? "请选择加工类型"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INVENTORY">存货加工</SelectItem>
                        <SelectItem value="PLEDGE">质押加工</SelectItem>
                        <SelectItem value="MORTGAGE">抵押加工</SelectItem>
                        <SelectItem value="REGULATORY_SERVICE">监管服务加工</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 关联单号（若是抵质押/监管则必选） */}
                  {formState.processingType !== "INVENTORY" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">
                        <span className="text-rose-500 mr-0.5">*</span>关联在押/监管单号
                      </label>
                      <div className="flex gap-1.5">
                        <Input
                          readOnly
                          value={formState.associatedOrderId || ""}
                          placeholder="点击选择在押单据"
                          className="h-[34px] text-xs cursor-pointer bg-slate-50 dark:bg-slate-800 font-medium text-amber-600"
                          onClick={() => setOrderSelectModalOpen(true)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-[34px] text-xs px-2.5"
                          onClick={() => setOrderSelectModalOpen(true)}
                        >
                          选择
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 仓库名称（由首条投入货物自动确定并锁定，R05） */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      所属实体仓库 (首条投入自动锁定)
                    </label>
                    <Input
                      disabled
                      value={lockedWarehouse ? lockedWarehouse.name : "待添加投入货物后自动锁定"}
                      className={`h-[34px] text-xs ${
                        lockedWarehouse
                          ? "bg-blue-50/60 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "bg-slate-50 text-muted-foreground dark:bg-slate-800"
                      }`}
                    />
                  </div>
                </div>

                {/* 备注 (0/140 字，R08) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>加工备注说明</span>
                    <span>{(formState.remark || "").length}/140</span>
                  </div>
                  <Textarea
                    maxLength={140}
                    rows={2}
                    value={formState.remark || ""}
                    placeholder="请输入加工补充备注（最多 140 字符）"
                    className="text-xs"
                    onChange={(e) =>
                      setFormState({ ...formState, remark: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </PrototypeAnnotationTarget>

        {/* 卡片 2：投入货品明细（树形展开） */}
        <PrototypeAnnotationTarget annotationIds={["processing-form-input-card"]}>
          <Card className="border-border/80 shadow-sm">
            <div
              className="flex items-center justify-between border-b border-border/70 px-5 py-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              onClick={() => setInputCardOpen(!inputCardOpen)}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  投入货品明细（{formState.inputGoodsGroups.length} 项）
                </h3>
                <span className="text-xs text-muted-foreground">
                  计划投入数量必须大于 0 且不超过实时可用量。
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1 border-primary/50 text-primary hover:bg-primary/5"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPickerModalOpen(true)
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  添加投入货品
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {inputCardOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {inputCardOpen && (
              <CardContent className="p-5 space-y-3">
                {formState.inputGoodsGroups.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground space-y-2">
                    <p>尚未添加任何投入货品，请点击上方按钮从实时库存中挑选。</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setPickerModalOpen(true)}
                    >
                      + 挑选在库货物
                    </Button>
                  </div>
                ) : (
                  <div className="border border-border/80 rounded-md overflow-hidden">
                    <Table className="text-xs">
                      <TableHeader className="bg-slate-50 dark:bg-slate-800">
                        <TableRow className="h-9">
                          <TableHead className="w-12 text-center">展开</TableHead>
                          <TableHead className="w-56">投入货物规格</TableHead>
                          <TableHead className="w-48">存放位置</TableHead>
                          <TableHead className="w-32">存货条码</TableHead>
                          <TableHead className="w-24 text-right">实时可用量</TableHead>
                          <TableHead className="w-36 text-right">计划投入数量</TableHead>
                          <TableHead className="w-16 text-center">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formState.inputGoodsGroups.map((group, gIdx) => {
                          const groupTotal = group.details.reduce(
                            (s, d) => s + (Number(d.planAmount) || 0),
                            0
                          )

                          return (
                            <>
                              {/* 一级货品汇总行 */}
                              <TableRow
                                key={group.id}
                                className="bg-slate-100/70 font-medium dark:bg-slate-800/80 hover:bg-slate-100"
                              >
                                <TableCell className="text-center">
                                  <button
                                    type="button"
                                    className="p-1 hover:text-primary"
                                    onClick={() => {
                                      setFormState((prev) => ({
                                        ...prev,
                                        inputGoodsGroups: prev.inputGoodsGroups.map(
                                          (g) =>
                                            g.id === group.id
                                              ? { ...g, expanded: !g.expanded }
                                              : g
                                        ),
                                      }))
                                    }}
                                  >
                                    {group.expanded ? (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <div className="font-semibold text-foreground">
                                    {group.goodsName}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {group.specModel || "—"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  包含 {group.details.length} 处货位批次
                                </TableCell>
                                <TableCell className="text-muted-foreground">--</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  --
                                </TableCell>
                                <TableCell className="text-right font-bold text-primary">
                                  {formatQuantity(groupTotal)} {group.unit}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                    onClick={() => handleRemoveGroup(group.id)}
                                    title="移除该货品规格下全部批次"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>

                              {/* 二级货位明细行 */}
                              {group.expanded &&
                                group.details.map((detail, dIdx) => (
                                  <TableRow
                                    key={detail.id}
                                    className="h-11 bg-white hover:bg-slate-50 dark:bg-slate-900"
                                  >
                                    <TableCell className="text-center text-[11px] text-muted-foreground">
                                      {gIdx + 1}.{dIdx + 1}
                                    </TableCell>
                                    <TableCell className="pl-6 text-foreground">
                                      └ 批次入库：{detail.inboundTime}
                                    </TableCell>
                                    <TableCell>
                                      <div className="text-foreground">
                                        {detail.roomZone}
                                      </div>
                                      <div className="text-[11px] text-muted-foreground">
                                        库位：{detail.specificLocation || "—"}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                      {detail.barcode}
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-foreground">
                                      {formatQuantity(detail.availableAmount)}{" "}
                                      {detail.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <Input
                                          type="number"
                                          min={0.0001}
                                          max={detail.availableAmount}
                                          step="any"
                                          value={detail.planAmount}
                                          className="h-7 w-24 text-right text-xs"
                                          onChange={(e) =>
                                            handleDetailPlanAmountChange(
                                              group.id,
                                              detail.id,
                                              e.target.value
                                            )
                                          }
                                        />
                                        <span className="text-[11px] text-muted-foreground">
                                          {detail.unit}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600"
                                        onClick={() =>
                                          handleRemoveDetail(group.id, detail.id)
                                        }
                                        title="移除此货位"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* 底部统计栏 */}
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <div>
                    合计：投入货品品类数：
                    <strong className="text-foreground mx-1">
                      {inputCategoryCount}
                    </strong>
                    种 ｜ 投入货品总数量：
                    <strong className="text-primary font-bold text-sm mx-1">
                      {formatQuantity(inputTotalQty)}
                    </strong>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    提交审核成功后，系统即时锁定上述库存，扣减可用量。
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </PrototypeAnnotationTarget>

        {/* 卡片 3：预计产出明细 */}
        <PrototypeAnnotationTarget annotationIds={["processing-form-output-card"]}>
          <Card className="border-border/80 shadow-sm">
            <div
              className="flex items-center justify-between border-b border-border/70 px-5 py-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              onClick={() => setOutputCardOpen(!outputCardOpen)}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  预计产出明细（{formState.outputGoodsItems.length} 项）
                </h3>
                <span className="text-xs text-muted-foreground">
                  预计产出数量必须大于 0；提交审核后产出规格结构将强行冻结。
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value=""
                  onValueChange={(val) => {
                    const item = CANDIDATE_OUTPUT_PRODUCTS_MOCK.find(
                      (p) => p.goodsId === val
                    )
                    if (item) handleAddOutputItem(item)
                  }}
                >
                  <SelectTrigger className="h-8 text-xs border-primary/50 text-primary w-40">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    <span>添加产出货品</span>
                  </SelectTrigger>
                  <SelectContent>
                    {CANDIDATE_OUTPUT_PRODUCTS_MOCK.map((p) => (
                      <SelectItem key={p.goodsId} value={p.goodsId} className="text-xs">
                        {p.goodsName} ({p.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {outputCardOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {outputCardOpen && (
              <CardContent className="p-5 space-y-3">
                {formState.outputGoodsItems.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
                    尚未添加预计产出货品，请从右上角下拉选择产出货物规格。
                  </div>
                ) : (
                  <div className="border border-border/80 rounded-md overflow-hidden">
                    <Table className="text-xs">
                      <TableHeader className="bg-slate-50 dark:bg-slate-800">
                        <TableRow className="h-9">
                          <TableHead className="w-12 text-center">序号</TableHead>
                          <TableHead className="w-64">产出货物</TableHead>
                          <TableHead className="w-36">规格型号</TableHead>
                          <TableHead className="w-24">计量单位</TableHead>
                          <TableHead className="w-32 text-right">预计产出数量</TableHead>
                          <TableHead className="w-28 text-right">行业参考单价</TableHead>
                          <TableHead className="w-32 text-right">预计产出金额</TableHead>
                          <TableHead className="w-16 text-center">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formState.outputGoodsItems.map((item, idx) => (
                          <TableRow key={item.id} className="h-11 hover:bg-slate-50">
                            <TableCell className="text-center text-muted-foreground">
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-foreground">
                                {item.goodsName}
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                              {item.specModel || "—"}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {item.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min={0.0001}
                                step="any"
                                value={item.expectedQty}
                                className="h-7 w-24 text-right text-xs inline-block"
                                onChange={(e) =>
                                  handleOutputExpectedQtyChange(item.id, e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground">
                              {formatCurrency(item.expectedAmount)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600"
                                onClick={() => handleRemoveOutputItem(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* 产出底部汇总 */}
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <div>
                    合计：预计产出总金额：
                    <strong className="text-primary font-bold text-sm mx-1">
                      {formatCurrency(outputTotalSummary.totalAmount)}
                    </strong>
                    {outputTotalSummary.hasUnpriced && (
                      <span className="text-[11px] text-amber-600">
                        (存在未定价货物，未计入总额，不阻断提交)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    提交后产出规格结构将被冻结，现场完成加工时不允许修改产出规格。
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </PrototypeAnnotationTarget>

        {/* 关联融资单据挑选弹窗 */}
        <Dialog open={orderSelectModalOpen} onOpenChange={setOrderSelectModalOpen}>
          <DialogContent className="max-w-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                选择关联融资/监管单据
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                必须为货主「{formState.ownerName}」名下处于正常存续状态的单据（已过滤已开具仓单货物）。
              </DialogDescription>
            </DialogHeader>

            <div className="border border-border/80 rounded-md overflow-hidden mt-2">
              <Table className="text-xs">
                <TableHeader className="bg-slate-50">
                  <TableRow className="h-8">
                    <TableHead className="w-36">单据编号</TableHead>
                    <TableHead className="w-24">单据类型</TableHead>
                    <TableHead className="w-48">质押品物料概要</TableHead>
                    <TableHead className="w-16 text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {KNOWN_ASSOCIATED_ORDERS_MOCK.filter(
                    (o) => o.processingType === formState.processingType
                  ).map((order) => (
                    <TableRow key={order.orderId} className="h-10 hover:bg-slate-50">
                      <TableCell className="font-medium text-amber-600">
                        {order.orderId}
                      </TableCell>
                      <TableCell>{PROCESSING_TYPE_MAP[order.processingType]}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.goodsSummary}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-primary"
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              associatedOrderId: order.orderId,
                            }))
                            setOrderSelectModalOpen(false)
                          }}
                        >
                          选用
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        {/* 投入货物候选挑选器弹窗 */}
        <ProcessingGoodsPickerModal
          open={pickerModalOpen}
          onOpenChange={setPickerModalOpen}
          ownerId={formState.ownerId}
          ownerName={formState.ownerName}
          processingType={formState.processingType}
          associatedOrderId={formState.associatedOrderId}
          lockedWarehouseId={lockedWarehouse?.id}
          onConfirm={handlePickerConfirm}
        />

        {/* 未保存离开确认 */}
        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存确认</DialogTitle>
              <DialogDescription>
                当前加工申请还有未提交的内容，离开将丢失已填写的货品和数量。确定返回列表吗？
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
                  navigate(PROCESSING_RECORD_LIST_PATH)
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card px-6 py-3">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              提交后立即锁定投入库存并进入审批中心
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs"
                onClick={handleBack}
              >
                取消
              </Button>
              <Button
                size="sm"
                className="h-9 gap-1.5 px-5 text-xs"
                onClick={handleSubmit}
              >
                <Send className="h-3.5 w-3.5" />
                提交审核
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PrototypeAnnotationProvider>
  )
}
