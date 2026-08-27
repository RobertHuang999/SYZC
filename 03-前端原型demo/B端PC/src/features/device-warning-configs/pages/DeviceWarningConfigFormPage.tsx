import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, HelpCircleIcon } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { ENABLED_SEVERITY_LEVELS } from "@/shared/mock/severity-levels"
import { DEVICE_WARNING_TYPES, type DeviceWarningType } from "../domain/types"
import type { DeviceWarningConfigFormValues, MetricThreshold } from "../domain/types"
import {
  createEmptyFormValues,
  detailToFormValues,
  getDeviceWarningConfigById,
} from "../lib/detail-utils"
import { validateDeviceWarningConfig } from "../lib/validation"
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningConfigFormAnnotations } from "../annotations/device-warning-config-form.annotations"
import { deviceWarningConfigDocuments } from "../documents/device-warning-config-documents"
import { DeviceSelectDialog } from "../components/DeviceSelectDialog"
import { OrgUserSelect } from "@/shared/components/OrgUserSelect"
import { cn } from "@/lib/utils"

import { DEVICE_WARNING_SUB_TYPES } from "../domain/constants"

const NOTIFY_CHANNEL_OPTIONS = ["站内信", "短信", "邮件"] as const

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

  if (isEdit && existing?.status === "已失效") {
    return (
      <div className="space-y-4 p-6">
        <Link to="/预警配置/设备预警配置">
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
        <Link to="/预警配置/设备预警配置">
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

  const hasOnlineSubType = form.warningSubTypes.some((s) => s.includes("上线"))
  const isInstantTrigger = form.warningSubTypes.some(
    (s) =>
      [
        "剪杆破坏",
        "拆壳破坏",
        "监控设备上线",
        "物联设备上线",
        "门锁设备上线",
        "门禁设备上线",
        "GPS设备上线",
        "正常开关锁事务",
        "正常刷脸通行记录",
      ].includes(s) || s.includes("上线")
  )

  const updateMetricThreshold = (
    metric: keyof DeviceWarningConfigFormValues["metricThresholds"],
    patch: Partial<MetricThreshold>
  ) => {
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
  const hasCO2 = form.warningSubTypes.includes("CO2异常")
  const hasOxygen = form.warningSubTypes.includes("氧气异常")
  const hasSmoke = form.warningSubTypes.includes("烟感异常")
  const hasAnyMetricThreshold =
    !isGlobalNewDevice &&
    form.warningType.includes("物联") &&
    (hasTemp || hasHumidity || hasCO2 || hasOxygen || hasSmoke)

  const updateForm = (patch: Partial<DeviceWarningConfigFormValues>) => {
    setForm((current) => ({ ...current, ...patch }))
  }

  const handleWarningTypeChange = (type: DeviceWarningType) => {
    const available = DEVICE_WARNING_SUB_TYPES[type] || []
    const defaultSubs = available.length > 0 ? [available[0]] : []
    const isInstant = defaultSubs.some(
      (s) =>
        [
          "剪杆破坏",
          "拆壳破坏",
          "监控设备上线",
          "物联设备上线",
          "门锁设备上线",
          "门禁设备上线",
          "GPS设备上线",
          "正常开关锁事务",
          "正常刷脸通行记录",
        ].includes(s) || s.includes("上线")
    )

    setForm((current) => ({
      ...current,
      warningType: type,
      warningSubTypes: defaultSubs,
      debounceMode: isInstant ? "立即触发" : current.debounceMode,
    }))
  }

  const toggleSubType = (subType: string) => {
    if (isEdit) return
    setForm((current) => {
      const exists = current.warningSubTypes.includes(subType)
      if (exists && current.warningSubTypes.length === 1) {
        return current
      }
      const next = exists
        ? current.warningSubTypes.filter((item) => item !== subType)
        : [...current.warningSubTypes, subType]
      const isInstant = next.some(
        (s) =>
          [
            "剪杆破坏",
            "拆壳破坏",
            "监控设备上线",
            "物联设备上线",
            "门锁设备上线",
            "门禁设备上线",
            "GPS设备上线",
            "正常开关锁事务",
            "正常刷脸通行记录",
          ].includes(s) || s.includes("上线")
      )
      return {
        ...current,
        warningSubTypes: next,
        debounceMode: isInstant ? "立即触发" : current.debounceMode,
      }
    })
  }

  const toggleChannel = (channel: string) => {
    setForm((current) => ({
      ...current,
      notifyChannels: current.notifyChannels.includes(channel)
        ? current.notifyChannels.filter((item) => item !== channel)
        : [...current.notifyChannels, channel],
    }))
  }

  const handleSave = () => {
    const validationError = validateDeviceWarningConfig(form, id)
    if (validationError) {
      setToastMessage(validationError)
      window.setTimeout(() => setToastMessage(null), 3000)
      return
    }

    setToastMessage("保存成功")
    window.setTimeout(() => {
      navigate("/预警配置/设备预警配置")
    }, 800)
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
              <Link to="/预警配置/设备预警配置">
                <Button variant="outline">
                  <ArrowLeftIcon />
                  取消
                </Button>
              </Link>
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
                  预警子类型（支持多选）
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(DEVICE_WARNING_SUB_TYPES[form.warningType] || []).map((subType) => {
                    const isSelected = form.warningSubTypes.includes(subType)
                    return (
                      <button
                        key={subType}
                        type="button"
                        disabled={isEdit}
                        onClick={() => toggleSubType(subType)}
                        className={cn(
                          "flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
                          isSelected
                            ? "border-primary bg-primary/10 font-medium text-primary shadow-xs"
                            : "border-input bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          isEdit && "cursor-not-allowed opacity-60"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isEdit}
                          onChange={() => toggleSubType(subType)}
                          className="size-3.5 rounded border-gray-300 text-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span>{subType}</span>
                      </button>
                    )
                  })}
                </div>
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
              {isEdit && form.version !== null && (
                <div className="space-y-2">
                  <Label>版本号</Label>
                  <Input value={String(form.version)} readOnly />
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
              {hasOnlineSubType && (
                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 md:col-span-2">
                  <input
                    id="newDeviceOnly"
                    type="checkbox"
                    checked={form.newDeviceOnly}
                    onChange={(event) => updateForm({ newDeviceOnly: event.target.checked })}
                    className="size-4 rounded border-gray-300 text-primary"
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="newDeviceOnly" className="cursor-pointer font-medium text-foreground">
                      仅针对新设备（全局监听）
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      勾选后后续所有新接入当前类型的设备将自动套用本规则，无需手动在下方绑定具体设备。
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
                        <div className="space-y-1 pt-1">
                          <span className="text-xs text-muted-foreground">浓度告警上限</span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              value={form.metricThresholds.co2.max}
                              onChange={(e) =>
                                updateMetricThreshold("co2", { max: e.target.value })
                              }
                              placeholder="如: 1500"
                              className="max-w-[200px]"
                            />
                            <span className="text-xs text-muted-foreground">ppm</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          触发规则：环境 CO2 浓度超出设定上限（如 1500 ppm）时触发预警
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
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-1.5">
                  <Label>
                    <span className="text-destructive font-bold mr-1">*</span>
                    防抖判定模式
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        className="inline-flex cursor-help items-center text-muted-foreground hover:text-foreground"
                      >
                        <HelpCircleIcon className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="w-80 space-y-2.5 p-3.5 shadow-xl border border-border/80 bg-popover/98 rounded-xl text-left">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground pb-2 border-b border-border/60">
                          <HelpCircleIcon className="size-4 text-primary" />
                          <span>防抖判定机制说明</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          防抖机制用于过滤环境瞬时毛刺与设备通信偶然波动，避免产生无意义误报：
                        </p>
                        <div className="space-y-1.5 text-xs">
                          <div className="rounded-lg bg-muted/60 p-2">
                            <div className="font-medium text-foreground">1. 按持续时长判定</div>
                            <div className="text-muted-foreground text-[11px] mt-0.5">异常指标需连续维持达到设定分钟数才正式生成预警。</div>
                          </div>
                          <div className="rounded-lg bg-muted/60 p-2">
                            <div className="font-medium text-foreground">2. 按连续超标次数判定</div>
                            <div className="text-muted-foreground text-[11px] mt-0.5">传感器需连续多次采集超标才正式生成预警。</div>
                          </div>
                          <div className="rounded-lg bg-muted/60 p-2">
                            <div className="font-medium text-foreground">3. 立即触发</div>
                            <div className="text-muted-foreground text-[11px] mt-0.5">物理破坏、设备上线等瞬态事件发生即刻报警，无防抖延迟。</div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-wrap gap-4 pt-1">
                  {(["按持续时长判定", "按连续超标次数判定", "立即触发"] as const).map(
                    (mode) => (
                      <label key={mode} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="debounceMode"
                          checked={form.debounceMode === mode}
                          disabled={isInstantTrigger && mode !== "立即触发"}
                          onChange={() => updateForm({ debounceMode: mode })}
                        />
                        <span>{mode}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
              {form.debounceMode !== "立即触发" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>
                    <span className="text-destructive font-bold mr-1">*</span>
                    {form.debounceMode === "按持续时长判定"
                      ? "防抖持续时长阈值"
                      : "防抖连续超标次数阈值"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={form.debounceValue}
                      onChange={(event) => updateForm({ debounceValue: event.target.value })}
                      placeholder={form.debounceMode === "按持续时长判定" ? "请输入持续时长" : "请输入连续次数"}
                      className="w-40"
                    />
                    {form.debounceMode === "按持续时长判定" ? (
                      <Select
                        value={form.debounceUnit || "分钟"}
                        onValueChange={(val) =>
                          updateForm({ debounceUnit: val as "分钟" | "秒" })
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="分钟">分钟 (min)</SelectItem>
                          <SelectItem value="秒">秒 (s)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        次 (times)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {form.debounceMode === "按持续时长判定"
                      ? `提示：指标异常必须连续维持达到设定 ${form.debounceValue || "0"} ${form.debounceUnit || "分钟"} 才生成预警流水。`
                      : `提示：采集数据必须连续达到设定 ${form.debounceValue || "0"} 次超标才生成预警流水。`}
                  </p>
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
                <Label>
                  <span className="text-destructive font-bold mr-1">*</span>
                  通知渠道（至少选一项）
                </Label>
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
              {!isGlobalNewDevice && (
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

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
