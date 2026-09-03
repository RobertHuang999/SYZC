import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { severityLevelFormAnnotations } from "../annotations/severity-level-form.annotations"
import { severityLevelDocuments } from "../documents/severity-level-documents"
import { SyncToOrderWarningLabel } from "../components/SyncToOrderWarningLabel"
import { DEFAULT_LABEL_COLOR } from "../domain/constants"
import type { SeverityLevelRecord } from "../domain/types"
import { getSeverityLevelById } from "../lib/detail-utils"

const listPath = "/物联网IOT与预警/预警配置/预警等级"

type FormValues = {
  severityCode: string
  displayName: string
  labelColor: string
  syncToOrderWarning: boolean
  enabled: boolean
  description: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyFormValues: FormValues = {
  severityCode: "",
  displayName: "",
  labelColor: DEFAULT_LABEL_COLOR,
  syncToOrderWarning: false,
  enabled: true,
  description: "",
}

function recordToFormValues(record: SeverityLevelRecord): FormValues {
  return {
    severityCode: record.severityCode,
    displayName: record.displayName,
    labelColor: record.labelColor,
    syncToOrderWarning: record.syncToOrderWarning,
    enabled: record.enabled,
    description: record.description ?? "",
  }
}

function isValidHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  const code = values.severityCode.trim()
  if (!code) {
    errors.severityCode = "请输入等级编码"
  } else if (code.length < 2 || code.length > 16) {
    errors.severityCode = "等级编码须为 2~16 字符"
  }

  const name = values.displayName.trim()
  if (!name) {
    errors.displayName = "请输入显示名称"
  } else if (name.length < 2 || name.length > 20) {
    errors.displayName = "显示名称须为 2~20 字符"
  }

  if (!isValidHexColor(values.labelColor)) {
    errors.labelColor = "请输入合法的颜色值"
  }

  if (values.description.length > 100) {
    errors.description = "等级说明不能超过 100 字"
  }

  return errors
}

function formsEqual(a: FormValues, b: FormValues): boolean {
  return (
    a.severityCode === b.severityCode &&
    a.displayName === b.displayName &&
    a.labelColor.toUpperCase() === b.labelColor.toUpperCase() &&
    a.syncToOrderWarning === b.syncToOrderWarning &&
    a.enabled === b.enabled &&
    a.description === b.description
  )
}

export function SeverityLevelFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isCreate = id === undefined

  const record = useMemo(() => (id ? getSeverityLevelById(id) : null), [id])
  const initialValues = useMemo(
    () => (record ? recordToFormValues(record) : emptyFormValues),
    [record]
  )

  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [discardOpen, setDiscardOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  const isDirty = useMemo(
    () => !formsEqual(values, initialValues),
    [values, initialValues]
  )

  const pageTitle = isCreate ? "新增预警等级" : "编辑预警等级"

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const navigateBack = () => {
    if (isCreate) {
      navigate(listPath)
    } else if (record) {
      navigate(`${listPath}/详情/${record.levelId}`)
    } else {
      navigate(listPath)
    }
  }

  const handleLeave = () => {
    if (isDirty) {
      setDiscardOpen(true)
      return
    }
    navigateBack()
  }

  const handleSave = () => {
    const nextErrors = validateForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    showToast("保存成功")
    window.setTimeout(() => navigate(listPath), 400)
  }

  if (!isCreate && !record) {
    return (
      <div className="space-y-4 p-6">
        <Link to={listPath}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到该预警等级
        </div>
      </div>
    )
  }

  return (
    <PrototypeAnnotationProvider
      title={`${pageTitle} · 原型批注`}
      annotations={severityLevelFormAnnotations}
      documents={severityLevelDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["severity-level-form-header", "severity-level-form-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleLeave}>
                <ArrowLeftIcon />
                返回
              </Button>
              <Button variant="outline" onClick={handleLeave}>
                取消
              </Button>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["severity-level-form-fields", "severity-level-form-sync"]}>
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="severity-code">
                  <span className="text-destructive">*</span> 等级编码
                </Label>
                <Input
                  id="severity-code"
                  value={values.severityCode}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      severityCode: event.target.value,
                    }))
                  }
                  placeholder="请输入等级编码"
                  aria-invalid={Boolean(errors.severityCode)}
                />
                <p className="text-xs text-muted-foreground">
                  2~16 字符，租户内唯一
                </p>
                {errors.severityCode && (
                  <p className="text-sm text-destructive">{errors.severityCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name">
                  <span className="text-destructive">*</span> 显示名称
                </Label>
                <Input
                  id="display-name"
                  value={values.displayName}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      displayName: event.target.value,
                    }))
                  }
                  placeholder="请输入显示名称"
                  aria-invalid={Boolean(errors.displayName)}
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive">{errors.displayName}</p>
                )}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="label-color">
                  <span className="text-destructive">*</span> 标签颜色
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="inline-block size-4 rounded-full border"
                    style={{ backgroundColor: values.labelColor }}
                  />
                  <Input
                    id="label-color"
                    value={values.labelColor}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        labelColor: event.target.value,
                      }))
                    }
                    className="max-w-[140px] font-mono"
                    placeholder="#409EFF"
                    aria-invalid={Boolean(errors.labelColor)}
                  />
                  <Input
                    type="color"
                    value={
                      isValidHexColor(values.labelColor)
                        ? values.labelColor
                        : DEFAULT_LABEL_COLOR
                    }
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        labelColor: event.target.value.toUpperCase(),
                      }))
                    }
                    className="h-9 w-14 cursor-pointer p-1"
                    aria-label="选择标签颜色"
                  />
                </div>
                {errors.labelColor && (
                  <p className="text-sm text-destructive">{errors.labelColor}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  <span className="text-destructive">*</span>{" "}
                  <SyncToOrderWarningLabel />
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="sync-to-order-warning"
                      checked={!values.syncToOrderWarning}
                      onChange={() =>
                        setValues((current) => ({
                          ...current,
                          syncToOrderWarning: false,
                        }))
                      }
                    />
                    否
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="sync-to-order-warning"
                      checked={values.syncToOrderWarning}
                      onChange={() =>
                        setValues((current) => ({
                          ...current,
                          syncToOrderWarning: true,
                        }))
                      }
                    />
                    是
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  <span className="text-destructive">*</span> 是否启用
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="enabled"
                      checked={!values.enabled}
                      onChange={() =>
                        setValues((current) => ({
                          ...current,
                          enabled: false,
                        }))
                      }
                    />
                    停用
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="enabled"
                      checked={values.enabled}
                      onChange={() =>
                        setValues((current) => ({
                          ...current,
                          enabled: true,
                        }))
                      }
                    />
                    启用
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  停用后，预警规则配置中不可选本档
                </p>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="description">等级说明</Label>
                <Textarea
                  id="description"
                  value={values.description}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="等级说明（选填）"
                  maxLength={100}
                  aria-invalid={Boolean(errors.description)}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  {values.description.length}/100
                </div>
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>放弃修改</DialogTitle>
              <DialogDescription>放弃未保存的修改？</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDiscardOpen(false)}>
                继续编辑
              </Button>
              <Button
                onClick={() => {
                  setDiscardOpen(false)
                  navigateBack()
                }}
              >
                放弃
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
