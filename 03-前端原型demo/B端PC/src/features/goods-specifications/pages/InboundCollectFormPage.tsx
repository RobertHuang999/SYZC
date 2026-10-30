import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  COMMON_UNIT_SUGGESTIONS,
  CREATABLE_CONTROL_TYPE_OPTIONS,
  CONTROL_TYPE_OPTIONS,
  INBOUND_COLLECT_CONFIG_PATH,
  inboundCollectDetailPath,
} from "../domain/constants"
import type {
  InboundCollectControlType,
  InboundCollectFieldConfig,
} from "../domain/types"
import {
  addInboundCollectField,
  findInboundCollectField,
  updateInboundCollectField,
} from "../lib/store"
import {
  INBOUND_COLLECT_SPEC_CONTROL_NOTE,
  INBOUND_COLLECT_SPEC_MINUS_NOTE,
  INBOUND_COLLECT_SPEC_NAME_NOTE,
  INBOUND_COLLECT_USER_CONTROL_HINT,
  INBOUND_COLLECT_USER_CONTROL_LOCKED_BY_CORE,
  INBOUND_COLLECT_USER_CONTROL_LOCKED_BY_REF,
  INBOUND_COLLECT_USER_NAME_HINT,
  INBOUND_COLLECT_USER_NAME_LOCKED_HINT,
  INBOUND_COLLECT_USER_OPTIONS_HINT,
  INBOUND_COLLECT_USER_PLACEHOLDER_HINT,
  INBOUND_COLLECT_USER_REMARK_HINT,
  INBOUND_COLLECT_USER_UNIT_HINT,
  INBOUND_COLLECT_USER_UNIT_LOCKED_HINT,
} from "../lib/inbound-collect-ui-labels"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inboundCollectFormAnnotations } from "../annotations/inbound-collect.annotations"
import { inboundCollectDocuments } from "../documents/inbound-collect-documents"
import { AlertCircle, Lock, Plus, Trash2 } from "lucide-react"
import { IterationPageTag } from "@/shared/components/IterationHighlight"

function initialState(field: InboundCollectFieldConfig | undefined) {
  return {
    name: field?.name ?? "",
    controlType: field?.controlType ?? ("数字区间框" as InboundCollectControlType),
    unitLabel: field ? field.unitLabel ?? "" : "℃",
    options:
      field?.options && field.options.length > 0
        ? [...field.options]
        : ["A级优等品", "B级合格品"],
    placeholder: field?.placeholder ?? "例如：-18 至 -15",
    remark: field?.remark ?? "",
  }
}

export function InboundCollectFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isEdit = Boolean(id)
  const field = findInboundCollectField(id)

  const isCore = Boolean(field?.isCore)
  const isRefLocked = Boolean(field?.hasDownstreamRef)
  /** 控件类型锁定：系统核心项，或已被下游引用的自定义项 */
  const isLocked = isCore || isRefLocked
  /** 度量单位标签锁定：随控件类型一并锁定，避免上下游口径错位 */
  const isUnitLocked = isLocked

  const [name, setName] = useState(() => initialState(field).name)
  const [controlType, setControlType] = useState<InboundCollectControlType>(
    () => initialState(field).controlType
  )
  const [unitLabel, setUnitLabel] = useState(() => initialState(field).unitLabel)
  const [options, setOptions] = useState<string[]>(
    () => initialState(field).options
  )
  const [placeholder, setPlaceholder] = useState(
    () => initialState(field).placeholder
  )
  const [remark, setRemark] = useState(() => initialState(field).remark)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const placeholderInputRef = useRef<HTMLInputElement>(null)
  const originRef = useRef(initialState(field))
  /** 【多人同时编辑防冲突与防重复提交规则】(C02)：打开编辑页时固化的数据版本号 */
  const loadedVersionRef = useRef(field?.version ?? 1)

  // 路由参数变化时（编辑另一条记录）重置表单
  useEffect(() => {
    const next = initialState(field)
    originRef.current = next
    loadedVersionRef.current = field?.version ?? 1
    setName(next.name)
    setControlType(next.controlType)
    setUnitLabel(next.unitLabel)
    setOptions(next.options)
    setPlaceholder(next.placeholder)
    setRemark(next.remark)
    setErrorMessage(null)
    setSubmitting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  /** 是否展示度量单位标签：数字区间框、百分比数值框才需要 */
  const showUnitField =
    controlType === "数字区间框" || controlType === "百分比数值框"

  const isDirty = (() => {
    const origin = originRef.current
    return (
      name !== origin.name ||
      controlType !== origin.controlType ||
      unitLabel !== origin.unitLabel ||
      placeholder !== origin.placeholder ||
      remark !== origin.remark ||
      options.join("\u0000") !== origin.options.join("\u0000")
    )
  })()

  const backPath = isEdit && id ? inboundCollectDetailPath(id) : INBOUND_COLLECT_CONFIG_PATH

  const handleCancel = () => {
    if (isDirty && !window.confirm("当前有未保存的修改，确认离开吗？")) return
    navigate(backPath)
  }

  // R07: 智能静默纠偏下划线与全角减号为标准半角减号
  const handlePlaceholderChange = (val: string) => {
    setPlaceholder(val.replace(/[_－—]/g, "-"))
  }

  // R07: 快捷在输入提示光标处插入减号
  const insertMinus = () => {
    const input = placeholderInputRef.current
    if (!input) {
      setPlaceholder((prev) => `${prev}-`)
      return
    }
    const start = input.selectionStart ?? placeholder.length
    const end = input.selectionEnd ?? placeholder.length
    setPlaceholder(
      placeholder.substring(0, start) + "-" + placeholder.substring(end)
    )
    setTimeout(() => {
      input.focus()
      input.setSelectionRange(start + 1, start + 1)
    }, 0)
  }

  const applyPlaceholderExample = (example: string) => {
    setPlaceholder(example)
    placeholderInputRef.current?.focus()
  }

  const addOptionRow = () => setOptions((prev) => [...prev, ""])
  const removeOptionRow = (index: number) =>
    setOptions((prev) => prev.filter((_, idx) => idx !== index))
  const updateOptionRow = (index: number, val: string) =>
    setOptions((prev) => prev.map((opt, idx) => (idx === index ? val : opt)))

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)

    const cleanName = name.trim()
    if (!cleanName) {
      setErrorMessage("请输入收集项名称")
      return
    }
    if (cleanName.length < 2 || cleanName.length > 30) {
      setErrorMessage("收集项名称长度需在 2 至 30 个字符之间")
      return
    }
    if (showUnitField && !unitLabel.trim()) {
      setErrorMessage("请填写度量单位标签")
      return
    }
    const validOptions = options.map((item) => item.trim()).filter(Boolean)
    if (controlType === "下拉单选框" && validOptions.length === 0) {
      setErrorMessage("请至少配置 1 个有效下拉选项")
      return
    }

    setSubmitting(true)

    if (isEdit && field) {
      const res = updateInboundCollectField(
        field.id,
        {
          name: cleanName,
          controlType,
          unitLabel: unitLabel.trim(),
          options: validOptions,
          placeholder: placeholder.trim(),
          remark: remark.trim(),
        },
        undefined,
        loadedVersionRef.current
      )
      if (!res.success) {
        setSubmitting(false)
        setErrorMessage(res.error || "没保存成功，请重试；仍然失败请刷新页面后再提交")
        return
      }
      navigate(`${inboundCollectDetailPath(field.id)}?toast=updated`)
      return
    }

    const res = addInboundCollectField({
      name: cleanName,
      controlType,
      unitLabel: unitLabel.trim(),
      options: validOptions,
      placeholder: placeholder.trim(),
      remark: remark.trim(),
    })
    if (!res.success) {
      setSubmitting(false)
      setErrorMessage(res.error || "没保存成功，请重试；仍然失败请刷新页面后再提交")
      return
    }
    navigate(
      res.id
        ? `${inboundCollectDetailPath(res.id)}?toast=created`
        : INBOUND_COLLECT_CONFIG_PATH
    )
  }

  if (isEdit && !field) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2 border-b pb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(INBOUND_COLLECT_CONFIG_PATH)}
          >
            返回列表
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          未查询到 ID 为「{id}」的收集项，请确认链接参数或返回列表重新选择。
        </div>
      </div>
    )
  }

  return (
    <PrototypeAnnotationProvider
      annotations={inboundCollectFormAnnotations}
      documents={inboundCollectDocuments}
      title="新增/编辑收集项 · 原型批注"
    >
      <div className="space-y-4 p-6">
        {/* 顶部操作卡片 */}
        <PrototypeAnnotationTarget annotationIds={["collect-form-header"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button
                  type="button"
                  className="hover:text-foreground hover:underline"
                  onClick={handleCancel}
                >
                  入库收集项配置
                </button>
                <span>/</span>
                <span className="font-medium text-foreground">
                  {isEdit ? "编辑收集项" : "新增收集项"}
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {isEdit ? `编辑收集项 — ${field?.name}` : "新增收集项"}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button type="button" disabled={submitting} onClick={handleSubmit}>
                {submitting ? "保存中..." : isEdit ? "保 存" : "保存并启用"}
              </Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <IterationPageTag
          title="字段元数据维护（本菜单 6.3 全新上线）"
          description="保质期单位只能从 07 的「天/月/年」白名单里选；核心项不可删除，控件类型建好后不可改。"
        />

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PrototypeAnnotationTarget annotationIds={["collect-form-fields"]}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">字段配置</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 pt-0 sm:grid-cols-2">
                {/* 收集项名称 */}
                <div className="space-y-1.5">
                  <Label htmlFor="field-name" className="text-sm font-medium">
                    <span className="text-destructive mr-1">*</span>收集项名称
                  </Label>
                  <Input
                    id="field-name"
                    placeholder="请输入收集项名称，如：存储温度要求"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                    }}
                    maxLength={30}
                    disabled={isCore}
                  />
                  <ProductFieldHint>
                    {isCore
                      ? INBOUND_COLLECT_USER_NAME_LOCKED_HINT
                      : INBOUND_COLLECT_USER_NAME_HINT}
                  </ProductFieldHint>
                </div>

                {/* 控件类型 */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    <span className="text-destructive mr-1">*</span>控件类型
                  </Label>
                  {isLocked ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        <span className="font-medium">{controlType}</span>
                        <span className="flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                          <Lock className="h-3 w-3" />
                          已锁定
                        </span>
                      </div>
                      <ProductFieldHint className="text-amber-600">
                        {isCore
                          ? INBOUND_COLLECT_USER_CONTROL_LOCKED_BY_CORE
                          : INBOUND_COLLECT_USER_CONTROL_LOCKED_BY_REF}
                      </ProductFieldHint>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Select
                        value={controlType}
                        onValueChange={(val) => {
                          const ct = val as InboundCollectControlType
                          setControlType(ct)
                          if (ct === "数字区间框" && !unitLabel) setUnitLabel("℃")
                          if (ct === "百分比数值框" && !unitLabel) setUnitLabel("%")
                          if (errorMessage) setErrorMessage(null)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择控件类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {(controlType === "周期组合项"
                            ? CONTROL_TYPE_OPTIONS
                            : CREATABLE_CONTROL_TYPE_OPTIONS
                          ).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <span className="font-medium">{opt.label}</span>
                              {opt.description && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({opt.description})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ProductFieldHint>
                        {INBOUND_COLLECT_USER_CONTROL_HINT}
                      </ProductFieldHint>
                    </div>
                  )}
                </div>

                {/* 度量单位标签 */}
                {showUnitField && (
                  <div className="space-y-1.5">
                    <Label htmlFor="unit-label" className="text-sm font-medium">
                      <span className="text-destructive mr-1">*</span>度量单位标签
                    </Label>
                    <Input
                      id="unit-label"
                      placeholder="例如：℃、%RH、kg"
                      value={unitLabel}
                      onChange={(e) => setUnitLabel(e.target.value)}
                      maxLength={10}
                      disabled={isUnitLocked}
                    />
                    {isUnitLocked ? (
                      <ProductFieldHint className="text-amber-600">
                        {INBOUND_COLLECT_USER_UNIT_LOCKED_HINT}
                      </ProductFieldHint>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-1">
                          {COMMON_UNIT_SUGGESTIONS.map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => setUnitLabel(unit)}
                              className="inline-flex cursor-pointer items-center rounded bg-muted px-1.5 py-0.5 text-xs transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                        <ProductFieldHint>{INBOUND_COLLECT_USER_UNIT_HINT}</ProductFieldHint>
                      </>
                    )}
                  </div>
                )}

                {/* 输入提示 */}
                <div
                  className={
                    showUnitField ? "space-y-1.5" : "space-y-1.5 sm:col-span-2"
                  }
                >
                  <Label htmlFor="field-placeholder" className="text-sm font-medium">
                    输入提示
                  </Label>
                  <Input
                    id="field-placeholder"
                    ref={placeholderInputRef}
                    placeholder="例如：-18 至 -15"
                    value={placeholder}
                    onChange={(e) => handlePlaceholderChange(e.target.value)}
                    maxLength={50}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">快捷符号:</span>
                      <button
                        type="button"
                        onClick={insertMinus}
                        className="inline-flex cursor-pointer items-center rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                        title="点击直接在光标处插入英文半角减号，杜绝误敲下划线"
                      >
                        - 减号
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">快捷示例:</span>
                      <button
                        type="button"
                        onClick={() => applyPlaceholderExample("例如：-18 至 -15")}
                        className="inline-flex cursor-pointer items-center rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 transition-colors hover:bg-slate-200"
                      >
                        -18 至 -15
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPlaceholderExample("例如：12.5%")}
                        className="inline-flex cursor-pointer items-center rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 transition-colors hover:bg-slate-200"
                      >
                        12.5%
                      </button>
                    </div>
                  </div>
                  <ProductFieldHint>
                    {INBOUND_COLLECT_USER_PLACEHOLDER_HINT}
                  </ProductFieldHint>
                </div>

                {/* 下拉选项集合 */}
                {controlType === "下拉单选框" && (
                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        <span className="text-destructive mr-1">*</span>下拉选项集合
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOptionRow}
                        className="h-7 gap-1 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        添加选项
                      </Button>
                    </div>

                    <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                      {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 shrink-0 text-right text-xs text-muted-foreground">
                            {idx + 1}.
                          </span>
                          <Input
                            placeholder={`选项 ${idx + 1}，如：合格品`}
                            value={opt}
                            onChange={(e) => updateOptionRow(idx, e.target.value)}
                            maxLength={20}
                            className="h-8 bg-white text-sm"
                          />
                          {options.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOptionRow(idx)}
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <ProductFieldHint>
                      {INBOUND_COLLECT_USER_OPTIONS_HINT}
                    </ProductFieldHint>
                  </div>
                )}

                {/* 说明 / 备注 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="field-remark" className="text-sm font-medium">
                      说明 / 备注
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {remark.length}/200 字
                    </span>
                  </div>
                  <Textarea
                    id="field-remark"
                    placeholder="简要记录该收集项的业务背景或行业标准要求"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="resize-none text-sm"
                  />
                  <ProductFieldHint>{INBOUND_COLLECT_USER_REMARK_HINT}</ProductFieldHint>
                </div>
              </CardContent>
            </Card>
          </PrototypeAnnotationTarget>

          {/* 规格对照（评审用，非上线文案） */}
          <PrototypeSpecCallout>
            <div className="space-y-1">
              <p>{INBOUND_COLLECT_SPEC_NAME_NOTE}</p>
              <p>{INBOUND_COLLECT_SPEC_CONTROL_NOTE}</p>
              <p>{INBOUND_COLLECT_SPEC_MINUS_NOTE}</p>
            </div>
          </PrototypeSpecCallout>
        </form>
      </div>
    </PrototypeAnnotationProvider>
  )
}
