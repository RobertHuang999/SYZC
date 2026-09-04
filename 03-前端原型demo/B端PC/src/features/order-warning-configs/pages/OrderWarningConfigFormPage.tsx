import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
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
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { ENABLED_SEVERITY_LEVELS } from "@/shared/mock/severity-levels"
import { orderWarningConfigFormAnnotations } from "../annotations/order-warning-config-form.annotations"
import { orderWarningConfigDocuments } from "../documents/order-warning-config-documents"
import { TimeoutConfigTable } from "../components/TimeoutConfigTable"
import { OrgUserSelect } from "@/shared/components/OrgUserSelect"
import type { OrderStrategyFormState, OrderWarningStrategyKey } from "../domain/types"
import {
  buildTimeoutRowsForOrder,
  createEmptyFormValues,
  detailToFormValues,
  getMockOrderByNo,
  getOrderWarningConfigById,
  MOCK_ORDERS,
  ORDER_STRATEGY_DEFINITIONS,
} from "../lib/detail-utils"
import { validateStrategySave } from "../lib/validation"
import { NOTIFY_CHANNEL_OPTIONS } from "../domain/constants"

export function OrderWarningConfigFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const existing = useMemo(
    () => (isEdit ? getOrderWarningConfigById(id) : undefined),
    [id, isEdit]
  )

  const [form, setForm] = useState(() =>
    existing ? detailToFormValues(existing) : createEmptyFormValues()
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [savedStrategies, setSavedStrategies] = useState<
    Partial<Record<OrderWarningStrategyKey, boolean>>
  >(() => {
    if (!existing) return {}
    return Object.fromEntries(
      existing.activeStrategies.map((strategy) => [strategy.key, true])
    ) as Partial<Record<OrderWarningStrategyKey, boolean>>
  })
  const [dirtyStrategies, setDirtyStrategies] = useState<
    Partial<Record<OrderWarningStrategyKey, boolean>>
  >({})

  if (isEdit && !existing) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警配置/订单预警配置">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的订单预警配置
        </div>
      </div>
    )
  }

  const pageTitle = isEdit ? `编辑订单规则 — ${form.ruleName}` : "新增订单规则"
  const isSupervision = form.orderType === "监管"

  const updateStrategy = (
    key: OrderWarningStrategyKey,
    patch: Partial<OrderStrategyFormState>
  ) => {
    setForm((current) => ({
      ...current,
      strategies: {
        ...current.strategies,
        [key]: { ...current.strategies[key], ...patch },
      },
    }))
    setDirtyStrategies((current) => ({ ...current, [key]: true }))
  }

  const handleOrderChange = (orderNo: string) => {
    const order = getMockOrderByNo(orderNo)
    if (!order) {
      return
    }
    const timeoutRows = buildTimeoutRowsForOrder(orderNo)
    setForm((current) => ({
      ...current,
      orderNo: order.orderNo,
      orderType: order.orderType,
      ownerName: order.ownerName,
      ownerPhone: order.ownerPhone,
      goodsDetail: order.goodsDetail,
      strategies: {
        ...current.strategies,
        timeout: {
          ...current.strategies.timeout,
          timeoutRows,
        },
      },
    }))
  }

  const toggleStrategyChannel = (key: OrderWarningStrategyKey, channel: string) => {
    const strategy = form.strategies[key]
    updateStrategy(key, {
      notifyChannels: strategy.notifyChannels.includes(channel)
        ? strategy.notifyChannels.filter((item) => item !== channel)
        : [...strategy.notifyChannels, channel],
    })
  }

  const handleSaveStrategy = (key: OrderWarningStrategyKey, strategyName: string) => {
    const persistedEnabledKeys = ORDER_STRATEGY_DEFINITIONS.filter(
      (def) => savedStrategies[def.key]
    ).map((def) => def.key)

    const validationError = validateStrategySave(
      key,
      form,
      id,
      isEdit ? persistedEnabledKeys : undefined
    )
    if (validationError) {
      setToastMessage(validationError)
      window.setTimeout(() => setToastMessage(null), 3000)
      return
    }

    setSavedStrategies((current) => ({
      ...current,
      [key]: form.strategies[key].enabled,
    }))
    setDirtyStrategies((current) => ({ ...current, [key]: false }))
    if (form.version !== null) {
      setForm((current) => ({
        ...current,
        version: (current.version ?? 0) + 1,
      }))
    } else {
      setForm((current) => ({ ...current, version: 1 }))
    }
    setToastMessage(`${strategyName}保存成功`)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleLeave = () => {
    const hasDirty = Object.values(dirtyStrategies).some(Boolean)
    if (hasDirty && !window.confirm("当前有未保存的策略修改，确定离开吗？")) {
      return
    }
    navigate("/物联网IOT与预警/预警配置/订单预警配置")
  }

  return (
    <PrototypeAnnotationProvider
      title={`${pageTitle} · 原型批注`}
      annotations={orderWarningConfigFormAnnotations}
      documents={orderWarningConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["order-warning-config-form-header", "order-warning-config-form-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              {pageTitle}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleLeave}>
                <ArrowLeftIcon />
                取消
              </Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["order-warning-config-form-order"]}>
          <Card>
            <CardHeader>
              <CardTitle>基础识别</CardTitle>
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
                  onChange={(event) =>
                    setForm((current) => ({ ...current, ruleName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>
                  <span className="text-destructive font-bold mr-1">*</span>
                  关联订单
                </Label>
                {isEdit ? (
                  <Input value={form.orderNo} readOnly className="h-9 font-mono" />
                ) : (
                  <Select
                    value={form.orderNo || "none"}
                    onValueChange={(value) => {
                      if (value && value !== "none") handleOrderChange(value)
                    }}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="请选择关联订单" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[360px] max-h-72">
                      <SelectItem value="none" disabled>
                        请选择关联订单
                      </SelectItem>
                      {MOCK_ORDERS.map((order) => (
                        <SelectItem key={order.orderNo} value={order.orderNo}>
                          <span className="font-mono font-medium text-foreground">{order.orderNo}</span>
                          <span className="text-muted-foreground ml-1.5 text-xs">
                            （{order.customer} · {order.orderType}）
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>订单类型</Label>
                <Input value={form.orderType || "—"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>货主</Label>
                <Input
                  value={
                    form.ownerName
                      ? `${form.ownerName} ${form.ownerPhone}`
                      : "—"
                  }
                  readOnly
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>货物</Label>
                {form.orderNo && getMockOrderByNo(form.orderNo)?.goodsBatches.length ? (
                  <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                    {getMockOrderByNo(form.orderNo)?.goodsBatches.map((batch) => (
                      <div key={batch.batchId} className="flex flex-wrap gap-x-4 gap-y-1">
                        <span>{batch.goodsLabel}</span>
                        <span className="text-muted-foreground">{batch.qrCode}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Input value={form.goodsDetail || "—"} readOnly />
                )}
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

        <PrototypeAnnotationTarget annotationIds={["order-warning-config-form-cards"]}>
          <Card>
            <CardHeader>
              <CardTitle>预警策略配置（逐条独立保存 · 至少启用 1 项）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ORDER_STRATEGY_DEFINITIONS.map((def, index) => {
                const strategy = form.strategies[def.key]
                const disabled = Boolean(def.disabledForSupervision && isSupervision)

                return (
                  <div key={def.key} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="checkbox"
                          checked={strategy.enabled}
                          disabled={disabled}
                          onChange={(event) => {
                            const enabled = event.target.checked
                            updateStrategy(def.key, {
                              enabled,
                              expanded: enabled,
                              severityLevelId:
                                strategy.severityLevelId ||
                                ENABLED_SEVERITY_LEVELS[0]?.severityLevelId ||
                                "sl-l3",
                              notifyTargets:
                                strategy.notifyTargets.length > 0
                                  ? strategy.notifyTargets
                                  : ["张主管(风控部)"],
                              notifyChannels:
                                strategy.notifyChannels.length > 0
                                  ? strategy.notifyChannels
                                  : [],
                              ...(def.key === "timeout" && enabled && form.orderNo
                                ? {
                                    timeoutRows: buildTimeoutRowsForOrder(
                                      form.orderNo,
                                      strategy.timeoutRows
                                    ),
                                  }
                                : {}),
                            })
                          }}
                        />
                        <span className="font-medium">
                          策略 {index + 1}：{def.name}
                        </span>
                        {disabled && (
                          <span className="text-sm text-muted-foreground">
                            监管订单不可用
                          </span>
                        )}
                      </div>
                      {strategy.enabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateStrategy(def.key, { expanded: !strategy.expanded })
                          }
                        >
                          {strategy.expanded ? (
                            <>
                              收起 <ChevronUpIcon className="size-4" />
                            </>
                          ) : (
                            <>
                              展开 <ChevronDownIcon className="size-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {strategy.enabled && strategy.expanded && (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {def.key === "priceDrop" && (
                          <div className="space-y-2">
                            <Label>
                              <span className="text-destructive font-bold mr-1">*</span>
                              下跌比例阈值 (%)
                            </Label>
                            <Input
                              value={strategy.params.dropThreshold ?? ""}
                              placeholder="如: 15"
                              onChange={(event) =>
                                updateStrategy(def.key, {
                                  params: {
                                    ...strategy.params,
                                    dropThreshold: event.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        )}
                        {def.key === "ltvDual" && (
                          <>
                            <div className="space-y-2">
                              <Label>
                                <span className="text-destructive font-bold mr-1">*</span>
                                补仓线 LTV (%)
                              </Label>
                              <Input
                                value={strategy.params.marginCallLtv ?? ""}
                                placeholder="如: 70"
                                onChange={(event) =>
                                  updateStrategy(def.key, {
                                    params: {
                                      ...strategy.params,
                                      marginCallLtv: event.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                <span className="text-destructive font-bold mr-1">*</span>
                                平仓线 LTV (%)
                              </Label>
                              <Input
                                value={strategy.params.closeOutLtv ?? ""}
                                placeholder="如: 85"
                                onChange={(event) =>
                                  updateStrategy(def.key, {
                                    params: {
                                      ...strategy.params,
                                      closeOutLtv: event.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>解除方式</Label>
                              <Input
                                value={strategy.params.releaseMethod ?? ""}
                                placeholder="如: 货值回升或补缴保证金"
                                onChange={(event) =>
                                  updateStrategy(def.key, {
                                    params: {
                                      ...strategy.params,
                                      releaseMethod: event.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </>
                        )}
                        {def.key === "inspection" && (
                          <>
                            <div className="space-y-2">
                              <Label>
                                <span className="text-destructive font-bold mr-1">*</span>
                                巡检人
                              </Label>
                              <Input
                                value={strategy.params.inspector ?? ""}
                                placeholder="如: 孙巡检"
                                onChange={(event) =>
                                  updateStrategy(def.key, {
                                    params: {
                                      ...strategy.params,
                                      inspector: event.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                <span className="text-destructive font-bold mr-1">*</span>
                                巡检周期（天）
                              </Label>
                              <Input
                                value={strategy.params.cycleDays ?? ""}
                                placeholder="如: 7"
                                onChange={(event) =>
                                  updateStrategy(def.key, {
                                    params: {
                                      ...strategy.params,
                                      cycleDays: event.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </>
                        )}
                        {def.key === "timeout" && (
                          <TimeoutConfigTable
                            rows={strategy.timeoutRows}
                            orderType={form.orderType}
                            onChange={(rows) =>
                              updateStrategy(def.key, { timeoutRows: rows })
                            }
                          />
                        )}
                        {def.key === "inventoryDiff" && (
                          <div className="space-y-2 md:col-span-2">
                            <Label>监听模式</Label>
                            <Input value={strategy.params.mode ?? "启用即监听"} readOnly />
                          </div>
                        )}
                        {def.key === "midLoan" && (
                          <div className="space-y-2 md:col-span-2">
                            <Label>模型参数</Label>
                            <Input
                              value={strategy.params.modelVersion ?? ""}
                              placeholder="如: 风控模型 v2.4"
                              onChange={(event) =>
                                updateStrategy(def.key, {
                                  params: {
                                    ...strategy.params,
                                    modelVersion: event.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>
                            <span className="text-destructive font-bold mr-1">*</span>
                            预警等级
                          </Label>
                          {(() => {
                            const selectedStrategySeverity = ENABLED_SEVERITY_LEVELS.find(
                              (level) => level.severityLevelId === strategy.severityLevelId
                            )
                            return (
                              <Select
                                value={strategy.severityLevelId}
                                onValueChange={(value) => {
                                  if (value !== null) {
                                    updateStrategy(def.key, { severityLevelId: value })
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  {selectedStrategySeverity ? (
                                    <SeverityLevelDisplay
                                      severityCode={selectedStrategySeverity.severityCode}
                                      severityName={selectedStrategySeverity.severityName}
                                      severityColor={selectedStrategySeverity.severityColor}
                                    />
                                  ) : (
                                    <SelectValue placeholder="请选择预警等级" />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  {ENABLED_SEVERITY_LEVELS.map((level) => (
                                    <SelectItem
                                      key={level.severityLevelId}
                                      value={level.severityLevelId}
                                    >
                                      <SeverityLevelDisplay
                                        severityCode={level.severityCode}
                                        severityName={level.severityName}
                                        severityColor={level.severityColor}
                                      />
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )
                          })()}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>通知渠道（选填）</Label>
                          <p className="text-xs text-muted-foreground">
                            预警命中时系统自动更新预警对象系统小角标；短信/邮件按需勾选。
                          </p>
                          <div className="flex flex-wrap gap-4">
                            {NOTIFY_CHANNEL_OPTIONS.map((channel) => (
                              <label key={channel} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={strategy.notifyChannels.includes(channel)}
                                  onChange={() => toggleStrategyChannel(def.key, channel)}
                                />
                                {channel}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>
                            <span className="text-destructive font-bold mr-1">*</span>
                            预警通知对象（按组织架构选择）
                          </Label>
                          <OrgUserSelect
                            value={strategy.notifyTargets}
                            onChange={(targets) =>
                              updateStrategy(def.key, { notifyTargets: targets })
                            }
                            placeholder="点击按部门组织架构选择预警接收人"
                          />
                        </div>

                        <div className="flex items-center gap-2 md:col-span-2 pt-2 border-t">
                          <input
                            id={`upgrade-${def.key}`}
                            type="checkbox"
                            checked={strategy.upgradeEnabled}
                            onChange={(event) =>
                              updateStrategy(def.key, {
                                upgradeEnabled: event.target.checked,
                              })
                            }
                            className="size-4 rounded border-gray-300 text-primary"
                          />
                          <Label htmlFor={`upgrade-${def.key}`} className="cursor-pointer font-medium">
                            启用升级预警（未及时处理时逐级上报）
                          </Label>
                        </div>

                        {strategy.upgradeEnabled && (
                          <div className="grid gap-4 md:grid-cols-2 md:col-span-2 rounded-lg border bg-muted/20 p-4">
                            <div className="space-y-2">
                              <Label>
                                <span className="text-destructive font-bold mr-1">*</span>
                                持续未解除天数 (天)
                              </Label>
                              <Input
                                type="number"
                                min={1}
                                value={strategy.upgradeDays}
                                placeholder="如: 3"
                                onChange={(event) =>
                                  updateStrategy(def.key, {
                                    upgradeDays: event.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                <span className="text-destructive font-bold mr-1">*</span>
                                升级预警对象（按组织架构选择）
                              </Label>
                              <OrgUserSelect
                                value={strategy.upgradeTargets}
                                onChange={(targets) =>
                                  updateStrategy(def.key, { upgradeTargets: targets })
                                }
                                placeholder="点击选择升级接收人 (如部门总监)"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 md:col-span-2">
                          <span className="text-sm text-muted-foreground">
                            {dirtyStrategies[def.key]
                              ? "● 未保存"
                              : savedStrategies[def.key] !== undefined
                                ? "✓ 已保存"
                                : ""}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleSaveStrategy(def.key, def.name)}
                          >
                            保存该策略
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
