import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { ENABLED_SEVERITY_LEVELS } from "@/shared/mock/severity-levels"
import { DEVICE_WARNING_TYPES, type DeviceWarningType } from "../domain/types"
import type { DeviceWarningConfigFormValues, MetricThreshold } from "../domain/types"
import {
  createEmptyFormValues,
  detailToFormValues,
  getDeviceWarningConfigById,
  incrementDeviceWarningConfigVersion,
} from "../lib/detail-utils"
import { validateDeviceWarningConfig } from "../lib/validation"
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningConfigFormAnnotations } from "../annotations/device-warning-config-form.annotations"
import { deviceWarningConfigDocuments } from "../documents/device-warning-config-documents"
import { DeviceSelectDialog } from "../components/DeviceSelectDialog"
import { ConfigConfirmDialog } from "../components/ConfigConfirmDialog"
import { OrgUserSelect } from "@/shared/components/OrgUserSelect"
import { cn } from "@/lib/utils"

import {
  DEVICE_WARNING_SUB_TYPES,
  getDeviceOnlineSubTypeForWarningType,
  isDeviceOnlineSubType,
} from "../domain/constants"
import {
  canSelectAutoRecoverDisposition,
  DISPOSITION_MODES,
  DISPOSITION_MODE_HINTS,
  DISPOSITION_MODE_LABELS,
  formatRecommendedDispositionHint,
  getDispositionDeviationMessage,
  getRecommendedDisposition,
  isDispositionDeviatingFromRecommendation,
  resolveDispositionEffects,
  type DispositionMode,
} from "../domain/disposition"

const NOTIFY_CHANNEL_OPTIONS = ["短信", "邮件"] as const
const DEVICE_WARNING_CONFIG_LIST_PATH = "/物联网IOT与预警/预警配置/设备预警配置"

export function DeviceWarningConfigFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const existing = useMemo(
    () => (isEdit ? getDeviceWarningConfigById(id) : undefined),
    [id, isEdit]
  )

  const [form, setForm] = useState<DeviceWarningConfigFormValues>(() =>
    existing ? detailToFormValues(existing) : createEmptyFormValues()
  )
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [dispositionConfirmOpen, setDispositionConfirmOpen] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!dirty) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [dirty])

  if (isEdit && existing?.status === "已失效") {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警配置/设备预警配置">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          已失效规则不可编辑
        </div>
      </div>
    )
  }

  if (isEdit && !existing) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警配置/设备预警配置">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的设备预警配置
        </div>
      </div>
    )
  }

  const pageTitle = isEdit ? `编辑设备规则 — ${form.ruleName}` : "新增设备规则"
  const isGlobalNewDevice = form.newDeviceOnly
  const selectedSeverity = ENABLED_SEVERITY_LEVELS.find(
    (level) => level.severityLevelId === form.severityLevelId
  )

  const hasOnlineSubTypeOnly =
    form.warningSubTypes.length === 1 && isDeviceOnlineSubType(form.warningSubTypes[0] ?? "")
  const recommendedDisposition = getRecommendedDisposition(form.warningSubTypes)
  const dispositionEffects = resolveDispositionEffects(form.dispositionMode)
  const hideUpgradeSection = isGlobalNewDevice || dispositionEffects.hideUpgrade
  const dispositionDeviates = isDispositionDeviatingFromRecommendation(
    form.warningSubTypes,
    form.dispositionMode
  )
  const autoRecoverSelectable = canSelectAutoRecoverDisposition(form.warningSubTypes)

  const updateMetricThreshold = (
    metric: keyof DeviceWarningConfigFormValues["metricThresholds"],
    patch: Partial<MetricThreshold>
  ) => {
    setDirty(true)
    setForm((current) => ({
      ...current,
      metricThresholds: {
        ...current.metricThresholds,
        [metric]: {
          ...current.metricThresholds[metric],
          ...patch,
        },
      },
      // sync with legacy thresholdMin/thresholdMax if temperature is edited
      ...(metric === "temperature"
        ? {
            thresholdMin: patch.min ?? current.thresholdMin,
            thresholdMax: patch.max ?? current.thresholdMax,
          }
        : {}),
    }))
  }

  const hasTemp = form.warningSubTypes.includes("温度异常")
  const hasHumidity = form.warningSubTypes.includes("湿度异常")
  const hasCO2 = form.warningSubTypes.includes("二氧化碳异常")
  const hasOxygen = form.warningSubTypes.includes("氧气异常")
  const hasSmoke = form.warningSubTypes.includes("烟感异常")
  const hasAnyMetricThreshold =
    !isGlobalNewDevice &&
    form.warningType.includes("物联") &&
    (hasTemp || hasHumidity || hasCO2 || hasOxygen || hasSmoke)

  const updateForm = (patch: Partial<DeviceWarningConfigFormValues>) => {
    setDirty(true)
    setForm((current) => ({ ...current, ...patch }))
  }

  const handleWarningTypeChange = (type: DeviceWarningType) => {
    setDirty(true)
    const available = DEVICE_WARNING_SUB_TYPES[type] || []
    const defaultSubs = available.length > 0 ? [available[0]] : []
    const dispositionMode = getRecommendedDisposition(defaultSubs)

    setForm((current) => ({
      ...current,
      warningType: type,
      warningSubTypes: defaultSubs,
      dispositionMode,
      newDeviceOnly: false,
      upgradeEnabled: resolveDispositionEffects(dispositionMode).hideUpgrade
        ? false
        : current.upgradeEnabled,
    }))
  }

  const handleDispositionChange = (mode: DispositionMode) => {
    setDirty(true)
    const effects = resolveDispositionEffects(mode)
    setForm((current) => ({
      ...current,
      dispositionMode: mode,
      upgradeEnabled: effects.hideUpgrade ? false : current.upgradeEnabled,
      upgradeDays: effects.hideUpgrade ? "0" : current.upgradeDays,
    }))
  }

  const toggleSubType = (subType: string) => {
    if (isEdit) return
    setDirty(true)
    setForm((current) => {
      const exists = current.warningSubTypes.includes(subType)
      if (exists && current.warningSubTypes.length === 1) {
        return current
      }

      let next: string[]
      if (isDeviceOnlineSubType(subType)) {
        next = exists
          ? current.warningSubTypes.filter((item) => item !== subType)
          : [subType]
      } else {
        const withoutOnline = current.warningSubTypes.filter(
          (item) => !isDeviceOnlineSubType(item)
        )
        next = exists
          ? withoutOnline.filter((item) => item !== subType)
          : [...withoutOnline, subType]
      }

      if (next.length === 0) {
        return current
      }

      const onlyOnline = next.length === 1 && isDeviceOnlineSubType(next[0])
      const effects = resolveDispositionEffects(current.dispositionMode)

      return {
        ...current,
        warningSubTypes: next,
        newDeviceOnly: onlyOnline ? current.newDeviceOnly : false,
        upgradeEnabled: effects.hideUpgrade ? false : current.upgradeEnabled,
        upgradeDays: effects.hideUpgrade ? "0" : current.upgradeDays,
      }
    })
  }

  const toggleChannel = (channel: string) => {
    setDirty(true)
    setForm((current) => ({
      ...current,
      notifyChannels: current.notifyChannels.includes(channel)
        ? current.notifyChannels.filter((item) => item !== channel)
        : [...current.notifyChannels, channel],
    }))
  }

  const performSave = () => {
    const nextVersion =
      isEdit && id
        ? incrementDeviceWarningConfigVersion(id, form.version ?? existing?.version ?? 0)
        : 1
    setForm((current) => ({ ...current, version: nextVersion }))
    setDirty(false)
    setToastMessage(
      isEdit ? `保存成功，规则 Version 已更新为 v${nextVersion}` : "保存成功，规则 Version v1"
    )
    window.setTimeout(() => {
      navigate(DEVICE_WARNING_CONFIG_LIST_PATH)
    }, 800)
  }

  const handleNavigateAway = () => {
    if (dirty && !window.confirm("当前有未保存的规则修改，确认离开吗？")) {
      return
    }

    navigate(DEVICE_WARNING_CONFIG_LIST_PATH)
  }

  const handleSave = () => {
    const validationError = validateDeviceWarningConfig(form, id)
    if (validationError) {
      setToastMessage(validationError)
      window.setTimeout(() => setToastMessage(null), 3000)
      return
    }

    if (dispositionDeviates) {
      setDispositionConfirmOpen(true)
      return
    }

    performSave()
  }

  return (
    <PrototypeAnnotationProvider
      title={`${pageTitle} · 原型批注`}
      annotations={deviceWarningConfigFormAnnotations}
      documents={deviceWarningConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["device-warning-config-form-header", "device-warning-config-form-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              {pageTitle}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleNavigateAway}>
                <ArrowLeftIcon />
                取消
              </Button>
              <Button onClick={handleSave}>保存并生效</Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-form-base"]}>
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ruleName">
                  <span className="text-destructive font-bold mr-1">*</span>
                  规则名称
                </Label>
                <Input
                  id="ruleName"
                  value={form.ruleName}
                  readOnly={isEdit}
                  placeholder="请输入规则名称"
                  onChange={(event) => updateForm({ ruleName: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <span className="text-destructive font-bold mr-1">*</span>
                  预警类型
                </Label>
                <Select
                  value={form.warningType}
                  disabled={isEdit}
                  onValueChange={(value) =>
                    handleWarningTypeChange(
                      value as DeviceWarningConfigFormValues["warningType"]
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择预警类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEVICE_WARNING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>
                  <span className="text-destructive font-bold mr-1">*</span>
                  预警子类型（支持多选；设备上线须单独配置）
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(DEVICE_WARNING_SUB_TYPES[form.warningType] || []).map((subType) => {
                    const isSelected = form.warningSubTypes.includes(subType)
                    const recommendationHint = formatRecommendedDispositionHint(subType)
                    return (
                      <button
                        key={subType}
                        type="button"
                        disabled={isEdit}
                        onClick={() => toggleSubType(subType)}
                        className={cn(
                          "flex cursor-pointer flex-col items-start gap-0.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
                          isSelected
                            ? "border-primary bg-primary/10 font-medium text-primary shadow-xs"
                            : "border-input bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          isEdit && "cursor-not-allowed opacity-60"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isEdit}
                            onChange={() => toggleSubType(subType)}
                            className="size-3.5 rounded border-gray-300 text-primary"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span>{subType}</span>
                        </span>
                        <span className="pl-5 text-[10px] text-muted-foreground">
                          推荐：{recommendationHint}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  注：「设备上线」监控须单独配置为独立规则。下方处置策略支持自由配置，非系统推荐策略保存时将进行二次确认。
                </p>
              </div>
              <div className="space-y-3 md:col-span-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label>
                    <span className="text-destructive font-bold mr-1">*</span>
                    处置策略
                  </Label>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    系统推荐：{DISPOSITION_MODE_LABELS[recommendedDisposition]}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {DISPOSITION_MODES.map((mode) => {
                    const selected = form.dispositionMode === mode
                    const isRecommended = mode === recommendedDisposition
                    const disabled =
                      mode === "AUTO_RECOVER" && !autoRecoverSelectable
                    return (
                      <label
                        key={mode}
                        className={cn(
                          "flex gap-3 rounded-lg border p-3 transition-colors",
                          disabled
                            ? "cursor-not-allowed border-border/70 bg-muted/30 opacity-70"
                            : "cursor-pointer",
                          !disabled &&
                            (selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                              : "border-border bg-card hover:bg-muted/30")
                        )}
                      >
                        <input
                          type="radio"
                          name="dispositionMode"
                          className="mt-1 size-4"
                          checked={selected}
                          disabled={disabled}
                          onChange={() => {
                            if (!disabled) {
                              handleDispositionChange(mode)
                            }
                          }}
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                            <span>{DISPOSITION_MODE_LABELS[mode]}</span>
                            {isRecommended && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-normal text-primary">
                                推荐
                              </span>
                            )}
                            {disabled && (
                              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                                不可用
                              </span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {disabled
                              ? "当前所选预警子类型无设备状态恢复信号，暂不支持此策略。"
                              : DISPOSITION_MODE_HINTS[mode]}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
                {dispositionDeviates && (
                  <p className="flex items-center gap-1.5 rounded-md border border-amber-200/80 bg-amber-50/60 px-3 py-1.5 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
                    <InfoIcon className="size-3.5 shrink-0" />
                    <span>当前选择与系统推荐（{DISPOSITION_MODE_LABELS[recommendedDisposition]}）不同，保存时将进行二次确认。</span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  <span className="text-destructive font-bold mr-1">*</span>
                  预警等级
                </Label>
                <Select
                  value={form.severityLevelId}
                  onValueChange={(value) => {
                    if (value) updateForm({ severityLevelId: value })
                  }}
                >
                  <SelectTrigger className="w-full">
                    {selectedSeverity ? (
                      <SeverityLevelDisplay
                        severityCode={selectedSeverity.severityCode}
                        severityName={selectedSeverity.severityName}
                        severityColor={selectedSeverity.severityColor}
                      />
                    ) : (
                      <SelectValue placeholder="请选择预警等级" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {ENABLED_SEVERITY_LEVELS.map((level) => (
                      <SelectItem key={level.severityLevelId} value={level.severityLevelId}>
                        <SeverityLevelDisplay
                          severityCode={level.severityCode}
                          severityName={level.severityName}
                          severityColor={level.severityColor}
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isEdit && (
                <div className="space-y-2">
                  <Label>当前规则 Version</Label>
                  <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm font-semibold">
                    v{form.version ?? existing?.version ?? 1}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    本次保存成功后 Version +1，既有未处理预警流水不回写（C08）。
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-form-scope", "device-warning-config-form-threshold"]}>
          <Card>
            <CardHeader>
              <CardTitle>关联设备与触发条件</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {hasOnlineSubTypeOnly && (
                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 md:col-span-2">
                  <input
                    id="newDeviceOnly"
                    type="checkbox"
                    checked={form.newDeviceOnly}
                    onChange={(event) => {
                      const checked = event.target.checked
                      if (checked) {
                        const onlineSub = getDeviceOnlineSubTypeForWarningType(form.warningType)
                        if (!onlineSub) return
                        updateForm({
                          newDeviceOnly: true,
                          warningSubTypes: [onlineSub],
                          upgradeEnabled: false,
                          upgradeDays: "0",
                        })
                        return
                      }
                      updateForm({ newDeviceOnly: false })
                    }}
                    className="size-4 rounded border-gray-300 text-primary"
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="newDeviceOnly" className="cursor-pointer font-medium text-foreground">
                      仅针对新设备（全局监听）
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      勾选后后续所有新接入当前类型的设备将自动套用本规则，无需手动在下方绑定具体设备（R05/R14）。
                    </p>
                  </div>
                </div>
              )}
              {!isGlobalNewDevice && (
                <>
                  <div className="space-y-2">
                    <Label>所属仓库</Label>
                    <Select
                      value={form.warehouseFilter || "none"}
                      onValueChange={(value) =>
                        updateForm({
                          warehouseFilter: value && value !== "none" ? value : "",
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择所属仓库" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">全部仓库（不限）</SelectItem>
                        <SelectItem value="一号大宗钢材仓">一号大宗钢材仓</SelectItem>
                        <SelectItem value="二号冷链仓">二号冷链仓</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <span className="text-destructive font-bold mr-1">*</span>
                      选择关联设备
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.selectedDevices}
                        readOnly
                        placeholder="点击右侧按钮选择设备"
                        onClick={() => setDeviceDialogOpen(true)}
                        className="cursor-pointer"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeviceDialogOpen(true)}
                      >
                        {form.selectedDevices ? "调整设备" : "选择设备"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {hasAnyMetricThreshold && (
                <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4 md:col-span-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-medium text-sm text-foreground">
                      物联环境监控阈值设定
                    </div>
                    <span className="text-xs text-muted-foreground">
                      根据上方所选子类型，针对各监控指标独立配置安全阈值区间
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {hasTemp && (
                      <div className="space-y-2 rounded-lg border bg-card p-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium text-sm">
                            <span>🌡️</span>
                            <span className="text-destructive font-bold mr-1">*</span>
                            温度异常阈值
                          </span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                            单位: ℃
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">最低温度 (Min)</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={form.metricThresholds.temperature.min}
                                onChange={(e) =>
                                  updateMetricThreshold("temperature", { min: e.target.value })
                                }
                                placeholder="如: -5"
                              />
                              <span className="text-xs text-muted-foreground">℃</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">最高温度 (Max)</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={form.metricThresholds.temperature.max}
                                onChange={(e) =>
                                  updateMetricThreshold("temperature", { max: e.target.value })
                                }
                                placeholder="如: 35"
                              />
                              <span className="text-xs text-muted-foreground">℃</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          触发规则：实时温度 &lt; 最低值 或 &gt; 最高值时报警（支持负数）
                        </p>
                      </div>
                    )}

                    {hasHumidity && (
                      <div className="space-y-2 rounded-lg border bg-card p-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium text-sm">
                            <span>💧</span>
                            <span className="text-destructive font-bold mr-1">*</span>
                            湿度异常阈值
                          </span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                            单位: %RH
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">最低相对湿度</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={form.metricThresholds.humidity.min}
                                onChange={(e) =>
                                  updateMetricThreshold("humidity", { min: e.target.value })
                                }
                                placeholder="如: 30"
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">最高相对湿度</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={form.metricThresholds.humidity.max}
                                onChange={(e) =>
                                  updateMetricThreshold("humidity", { max: e.target.value })
                                }
                                placeholder="如: 80"
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          触发规则：相对湿度 &lt; 最低值（干燥）或 &gt; 最高值（潮湿）时报警
                        </p>
                      </div>
                    )}

                    {hasCO2 && (
                      <div className="space-y-2 rounded-lg border bg-card p-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium text-sm">
                            <span>💨</span>
                            <span className="text-destructive font-bold mr-1">*</span>
                            二氧化碳 (CO2) 阈值
                          </span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                            单位: ppm
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">最低浓度 (Min)</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                value={form.metricThresholds.co2.min}
                                onChange={(e) =>
                                  updateMetricThreshold("co2", { min: e.target.value })
                                }
                                placeholder="如: 400"
                              />
                              <span className="text-xs text-muted-foreground">ppm</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">最高浓度 (Max)</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                value={form.metricThresholds.co2.max}
                                onChange={(e) =>
                                  updateMetricThreshold("co2", { max: e.target.value })
                                }
                                placeholder="如: 1500"
                              />
                              <span className="text-xs text-muted-foreground">ppm</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          触发规则：环境 CO2 浓度 &lt; 最低值或 &gt; 最高值时触发预警
                        </p>
                      </div>
                    )}

                    {hasOxygen && (
                      <div className="space-y-2 rounded-lg border bg-card p-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium text-sm">
                            <span>🧪</span>
                            <span className="text-destructive font-bold mr-1">*</span>
                            氧气 (O2) 浓度安全区间
                          </span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                            单位: %Vol
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">缺氧警戒下限</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.1"
                                min={0}
                                max={100}
                                value={form.metricThresholds.oxygen.min}
                                onChange={(e) =>
                                  updateMetricThreshold("oxygen", { min: e.target.value })
                                }
                                placeholder="如: 18.0"
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">富氧警戒上限</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.1"
                                min={0}
                                max={100}
                                value={form.metricThresholds.oxygen.max}
                                onChange={(e) =>
                                  updateMetricThreshold("oxygen", { max: e.target.value })
                                }
                                placeholder="如: 23.5"
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          触发规则：氧气 &lt; 18.0%（缺氧窒息险）或 &gt; 23.5%（富氧助燃险）触发预警
                        </p>
                      </div>
                    )}

                    {hasSmoke && (
                      <div className="space-y-2 rounded-lg border bg-card p-3 shadow-2xs md:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium text-sm text-destructive">
                            <span>🚨</span> 烟雾感应探测
                          </span>
                          <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive">
                            火警开关量 (即时)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          烟感探测器一旦感知烟雾浓度超标，输出火警信号即刻上报并触发最高等级预警，无需手动配置数值高低范围。
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-form-notify"]}>
          <Card>
            <CardHeader>
              <CardTitle>通知与升级策略</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>通知渠道（选填）</Label>
                <p className="text-xs text-muted-foreground">
                  预警命中时系统自动更新预警对象系统小角标；短信/邮件按需勾选。
                </p>
                <div className="flex flex-wrap gap-4">
                  {NOTIFY_CHANNEL_OPTIONS.map((channel) => (
                    <label key={channel} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.notifyChannels.includes(channel)}
                        onChange={() => toggleChannel(channel)}
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  <span className="text-destructive font-bold mr-1">*</span>
                  预警通知对象（按组织架构选择）
                </Label>
                <OrgUserSelect
                  value={form.notifyTargets}
                  onChange={(targets) => updateForm({ notifyTargets: targets })}
                  placeholder="点击按部门组织架构选择预警接收人"
                />
              </div>
              {!hideUpgradeSection && (
                <>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <input
                      id="upgradeEnabled"
                      type="checkbox"
                      checked={form.upgradeEnabled}
                      onChange={(event) =>
                        updateForm({ upgradeEnabled: event.target.checked })
                      }
                      className="size-4 rounded border-gray-300 text-primary"
                    />
                    <Label htmlFor="upgradeEnabled" className="cursor-pointer font-medium">
                      启用升级预警（长时间未处置时逐级上报）
                    </Label>
                  </div>
                  {form.upgradeEnabled && (
                    <div className="grid gap-4 md:grid-cols-2 rounded-lg border bg-muted/20 p-4">
                      <div className="space-y-2">
                        <Label>
                          <span className="text-destructive font-bold mr-1">*</span>
                          持续未解除天数 (天)
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={form.upgradeDays}
                          placeholder="请输入超期天数，如 3"
                          onChange={(event) =>
                            updateForm({ upgradeDays: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          <span className="text-destructive font-bold mr-1">*</span>
                          升级预警对象（按组织架构选择）
                        </Label>
                        <OrgUserSelect
                          value={form.upgradeTargets}
                          onChange={(targets) => updateForm({ upgradeTargets: targets })}
                          placeholder="点击选择升级接收人 (如部门总监)"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <DeviceSelectDialog
          open={deviceDialogOpen}
          warehouseFilter={form.warehouseFilter}
          currentSelected={form.selectedDevices}
          onOpenChange={setDeviceDialogOpen}
          onConfirm={(summary) => {
            updateForm({ selectedDevices: summary })
          }}
        />

        <ConfigConfirmDialog
          open={dispositionConfirmOpen}
          title="确认处置策略"
          description={getDispositionDeviationMessage(
            form.warningSubTypes,
            form.dispositionMode
          )}
          confirmLabel="确认保存"
          onOpenChange={setDispositionConfirmOpen}
          onConfirm={() => {
            setDispositionConfirmOpen(false)
            performSave()
          }}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
