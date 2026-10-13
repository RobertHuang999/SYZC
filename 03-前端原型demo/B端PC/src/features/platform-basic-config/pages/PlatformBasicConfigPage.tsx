import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangleIcon,
  FileTextIcon,
  MailIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { ConfigConfirmDialog } from "@/features/device-warning-configs/components/ConfigConfirmDialog"
import { cn } from "@/lib/utils"
import { platformBasicConfigAnnotations } from "../annotations/platform-basic-config.annotations"
import { platformBasicConfigDocuments } from "../documents/platform-basic-config-documents"
import { AuditedWarehouseList } from "../components/AuditedWarehouseList"
import { CredentialCardPanel } from "../components/CredentialCardPanel"
import { DuplicateAddressDialog } from "../components/DuplicateAddressDialog"
import { PartnerAccessAuditPanel } from "../components/PartnerAccessAuditPanel"
import { PartnerSubjectPolicyCard } from "../components/PartnerSubjectPolicyCard"
import { SmtpTestMailDialog } from "../components/SmtpTestMailDialog"
import { WarehouseAuditPickerDialog } from "../components/WarehouseAuditPickerDialog"
import { YesNoRadio } from "../components/YesNoRadio"
import {
  AGREEMENT_PLACEMENT_OPTIONS,
  CONFIG_CATEGORIES,
  DATA_SOURCE_CARD_DEFS,
  IOT_HARDWARE_CARD_DEFS,
  MASKED_SECRET,
  MAX_AGREEMENTS,
} from "../domain/constants"
import type {
  AgreementItem,
  ConfigCategoryId,
  PartnerAccessAuditRecord,
  PlatformBasicConfigState,
  SmtpMailboxRow,
  WarehouseScopeMode,
} from "../domain/types"
import {
  BULK_SAVE_CATEGORIES,
  buildCategorySavedSnapshots,
  cloneAgreements,
  clonePartnerAccess,
  cloneWarehouseOps,
  isPartnerAccessRelaxed,
  type CategorySavedSnapshots,
} from "../lib/config-snapshot"
import {
  partnerAccessAuditLogMock,
  platformBasicConfigInitialState,
} from "../mock/platform-basic-config.mock"
import {
  formatAuditTimestamp,
  summarizePartnerAccessRelax,
} from "../lib/partner-access-audit"
import { resolveWarehouseRooms } from "../mock/warehouse-tree.mock"
import { writeWarehouseOpsSnapshot } from "@/shared/config/warehouse-ops-snapshot"

const MOCK_OPERATOR = "李敏（系统管理员）"
const PARTNER_AUDIT_MAX = 5

function newAgreementRow(): AgreementItem {
  return {
    id: `agr-${Date.now()}`,
    placement: "",
    name: "",
    fileName: null,
    fileSizeMb: null,
  }
}

function newSmtpRow(): SmtpMailboxRow {
  return {
    id: `smtp-${Date.now()}`,
    host: "",
    port: "465",
    encryption: "SSL/TLS",
    fromEmail: "",
    authCode: "",
    configured: false,
    editing: true,
  }
}

export function PlatformBasicConfigPage() {
  const [state, setState] = useState<PlatformBasicConfigState>(() =>
    structuredClone(platformBasicConfigInitialState)
  )
  const [savedByCategory, setSavedByCategory] = useState<CategorySavedSnapshots>(() =>
    buildCategorySavedSnapshots(platformBasicConfigInitialState)
  )
  const [category, setCategory] = useState<ConfigCategoryId>("warehouse-ops")
  const [pendingCategory, setPendingCategory] = useState<ConfigCategoryId | null>(null)
  const [dirtyCategories, setDirtyCategories] = useState<Set<ConfigCategoryId>>(
    () => new Set()
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [warehousePickerOpen, setWarehousePickerOpen] = useState(false)
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
  const [riskRelaxOpen, setRiskRelaxOpen] = useState(false)
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false)
  const [unsavedAction, setUnsavedAction] = useState<"exit" | "switch" | null>(null)

  const [smtpTestTarget, setSmtpTestTarget] = useState<SmtpMailboxRow | null>(null)
  const [partnerAccessAuditLog, setPartnerAccessAuditLog] = useState<
    PartnerAccessAuditRecord[]
  >(() => [...partnerAccessAuditLogMock])

  const currentCategoryMeta = CONFIG_CATEGORIES.find((c) => c.id === category)!
  const showBulkSave = currentCategoryMeta.bulkSave

  const auditedRooms = useMemo(
    () => resolveWarehouseRooms(state.warehouseOps.auditedRoomIds),
    [state.warehouseOps.auditedRoomIds]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const markCategoryDirty = useCallback((target: ConfigCategoryId) => {
    setDirtyCategories((current) => new Set(current).add(target))
  }, [])

  const clearCategoryDirty = useCallback((target: ConfigCategoryId) => {
    setDirtyCategories((current) => {
      if (!current.has(target)) return current
      const next = new Set(current)
      next.delete(target)
      return next
    })
  }, [])

  const hasCredentialEditing = useCallback(
    (target: ConfigCategoryId) => {
      if (target === "data-sources") {
        return Object.values(state.dataSourceCards).some((card) => card.editing)
      }
      if (target === "iot-hardware") {
        return Object.values(state.iotCards).some((card) => card.editing)
      }
      if (target === "mail-smtp") {
        return state.smtpRows.some((row) => row.editing)
      }
      return false
    },
    [state.dataSourceCards, state.iotCards, state.smtpRows]
  )

  const isCategoryBlocked = useCallback(
    (target: ConfigCategoryId) =>
      dirtyCategories.has(target) || hasCredentialEditing(target),
    [dirtyCategories, hasCredentialEditing]
  )

  const hasAnyBlockedCategory = useMemo(
    () => CONFIG_CATEGORIES.some((item) => isCategoryBlocked(item.id)),
    [isCategoryBlocked]
  )

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (hasAnyBlockedCategory) {
        event.preventDefault()
        event.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [hasAnyBlockedCategory])

  const cancelCredentialEditing = (target: ConfigCategoryId) => {
    if (target === "data-sources") {
      setState((current) => ({
        ...current,
        dataSourceCards: Object.fromEntries(
          Object.entries(current.dataSourceCards).map(([id, card]) => [
            id,
            { ...card, editing: false, draft: {} },
          ])
        ),
      }))
    } else if (target === "iot-hardware") {
      setState((current) => ({
        ...current,
        iotCards: Object.fromEntries(
          Object.entries(current.iotCards).map(([id, card]) => [
            id,
            { ...card, editing: false, draft: {} },
          ])
        ),
      }))
    } else if (target === "mail-smtp") {
      setState((current) => ({
        ...current,
        smtpRows: current.smtpRows
          .filter((row) => row.configured || row.host || row.fromEmail)
          .map((row) => ({ ...row, editing: false })),
      }))
    }
  }

  const discardCategoryChanges = (target: ConfigCategoryId) => {
    if (target === "warehouse-ops") {
      setState((current) => ({
        ...current,
        warehouseOps: cloneWarehouseOps(savedByCategory["warehouse-ops"]),
      }))
    } else if (target === "partner-access") {
      setState((current) => ({
        ...current,
        partnerAccess: clonePartnerAccess(savedByCategory["partner-access"]),
      }))
    } else if (target === "agreements") {
      setState((current) => ({
        ...current,
        agreements: cloneAgreements(savedByCategory.agreements),
      }))
    } else {
      cancelCredentialEditing(target)
    }
    clearCategoryDirty(target)
  }

  const trySwitchCategory = (next: ConfigCategoryId) => {
    if (next === category) return
    if (isCategoryBlocked(category)) {
      setPendingCategory(next)
      setUnsavedAction("switch")
      setUnsavedDialogOpen(true)
      return
    }
    setCategory(next)
  }

  const confirmUnsavedLeave = () => {
    if (unsavedAction === "switch" && pendingCategory) {
      discardCategoryChanges(category)
      setCategory(pendingCategory)
      setPendingCategory(null)
    } else if (unsavedAction === "exit") {
      discardCategoryChanges(category)
      showToast("已退出当前分类编辑，未保存修改已丢弃")
    }
    setUnsavedDialogOpen(false)
    setUnsavedAction(null)
  }

  const validateCategorySave = (target: ConfigCategoryId): string | null => {
    if (target === "warehouse-ops") {
      const { warehouseOps } = state
      if (
        warehouseOps.inOutRequiresAudit === "是" &&
        warehouseOps.auditScopeMode === "指定库房" &&
        warehouseOps.auditedRoomIds.length === 0
      ) {
        return "指定库房模式下至少选择 1 个需要审核的库房"
      }
      return null
    }
    if (target === "agreements") {
      for (const agr of state.agreements) {
        if (!agr.placement) return "请为每条协议选择展示位置"
        if (!agr.name.trim()) return "协议名称不能为空"
        if (agr.name.length > 50) return "协议名称不能超过 50 字"
        if (!agr.fileName) return "请上传协议文件"
      }
    }
    return null
  }

  const commitCategorySave = (
    target: ConfigCategoryId,
    options?: { withAuditNote?: boolean }
  ) => {
    if (BULK_SAVE_CATEGORIES.includes(target)) {
      setSavedByCategory((current) => {
        if (target === "warehouse-ops") {
          writeWarehouseOpsSnapshot(state.warehouseOps)
          return {
            ...current,
            "warehouse-ops": cloneWarehouseOps(state.warehouseOps),
          }
        }
        if (target === "partner-access") {
          return {
            ...current,
            "partner-access": clonePartnerAccess(state.partnerAccess),
          }
        }
        return {
          ...current,
          agreements: cloneAgreements(state.agreements),
        }
      })
    }
    clearCategoryDirty(target)
    const label = CONFIG_CATEGORIES.find((item) => item.id === target)?.label ?? "配置"
    if (options?.withAuditNote) {
      showToast(`${label} 已保存，变更原因已记入审计并在下方展示`)
      return
    }
    showToast(`${label} 已保存并热生效`)
  }

  const handleSaveCurrentCategory = () => {
    const error = validateCategorySave(category)
    if (error) {
      showToast(error)
      return
    }
    if (
      category === "partner-access" &&
      isPartnerAccessRelaxed(
        savedByCategory["partner-access"],
        state.partnerAccess
      )
    ) {
      setRiskRelaxOpen(true)
      return
    }
    if (showBulkSave) {
      commitCategorySave(category)
    }
  }

  const recordPartnerAccessRelax = (reason: string) => {
    const changeSummary = summarizePartnerAccessRelax(
      savedByCategory["partner-access"],
      state.partnerAccess
    )
    const entry: PartnerAccessAuditRecord = {
      id: `audit-${Date.now()}`,
      changedAt: formatAuditTimestamp(new Date()),
      operator: MOCK_OPERATOR,
      changeSummary,
      reason,
    }
    setPartnerAccessAuditLog((current) => [entry, ...current].slice(0, PARTNER_AUDIT_MAX))
  }

  const handleExitCurrentCategory = () => {
    if (isCategoryBlocked(category)) {
      setUnsavedAction("exit")
      setUnsavedDialogOpen(true)
      return
    }
    showToast("当前分类无未保存修改")
  }

  const updateWarehouseOps = (patch: Partial<typeof state.warehouseOps>) => {
    setState((c) => ({ ...c, warehouseOps: { ...c.warehouseOps, ...patch } }))
    markCategoryDirty("warehouse-ops")
  }

  const updatePartnerSubject = (
    subject: "individual" | "enterprise",
    patch: Partial<typeof state.partnerAccess.individual>
  ) => {
    setState((c) => ({
      ...c,
      partnerAccess: {
        ...c.partnerAccess,
        [subject]: { ...c.partnerAccess[subject], ...patch },
      },
    }))
    markCategoryDirty("partner-access")
  }

  const handleCredentialEdit = (kind: "data" | "iot", cardId: string) => {
    const defs = kind === "data" ? DATA_SOURCE_CARD_DEFS : IOT_HARDWARE_CARD_DEFS
    const def = defs.find((d) => d.id === cardId)
    if (!def) return
    const emptyDraft = Object.fromEntries(def.fields.map((f) => [f.key, ""]))
    setState((current) => {
      const cardsKey = kind === "data" ? "dataSourceCards" : "iotCards"
      return {
        ...current,
        [cardsKey]: {
          ...current[cardsKey],
          [cardId]: {
            ...current[cardsKey][cardId],
            editing: true,
            draft: emptyDraft,
          },
        },
      }
    })
  }

  const handleCredentialCancel = (kind: "data" | "iot", cardId: string) => {
    setState((current) => {
      const cardsKey = kind === "data" ? "dataSourceCards" : "iotCards"
      return {
        ...current,
        [cardsKey]: {
          ...current[cardsKey],
          [cardId]: {
            ...current[cardsKey][cardId],
            editing: false,
            draft: {},
          },
        },
      }
    })
  }

  const handleCredentialDraft = (
    kind: "data" | "iot",
    cardId: string,
    fieldKey: string,
    value: string
  ) => {
    setState((current) => {
      const cardsKey = kind === "data" ? "dataSourceCards" : "iotCards"
      const card = current[cardsKey][cardId]
      return {
        ...current,
        [cardsKey]: {
          ...current[cardsKey],
          [cardId]: {
            ...card,
            draft: { ...card.draft, [fieldKey]: value },
          },
        },
      }
    })
  }

  const handleCredentialSave = (kind: "data" | "iot", cardId: string) => {
    const defs = kind === "data" ? DATA_SOURCE_CARD_DEFS : IOT_HARDWARE_CARD_DEFS
    const def = defs.find((d) => d.id === cardId)
    if (!def) return
    setState((current) => {
      const cardsKey = kind === "data" ? "dataSourceCards" : "iotCards"
      const valuesKey = kind === "data" ? "dataSourceValues" : "iotValues"
      const card = current[cardsKey][cardId]
      for (const field of def.fields) {
        if (!card.draft[field.key]?.trim()) {
          showToast(`请完整填写「${def.title}」的 ${field.label}`)
          return current
        }
      }
      const nextValues = { ...current[valuesKey][cardId] }
      for (const field of def.fields) {
        nextValues[field.key] = card.draft[field.key]
      }
      return {
        ...current,
        [valuesKey]: {
          ...current[valuesKey],
          [cardId]: nextValues,
        },
        [cardsKey]: {
          ...current[cardsKey],
          [cardId]: {
            configured: true,
            editing: false,
            draft: {},
          },
        },
      }
    })
    showToast(`${def.title} 已独立保存并热更新`)
  }

  const renderWarehouseSection = () => (
    <PrototypeAnnotationTarget annotationIds={["basic-config-warehouse"]}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">移库作业审批</CardTitle>
          </CardHeader>
          <CardContent>
            <YesNoRadio
              name="move-audit"
              label="移库是否需要审核"
              required
              value={state.warehouseOps.moveRequiresAudit}
              onChange={(v) => updateWarehouseOps({ moveRequiresAudit: v })}
              hint="开启后，移库任务必须走审批流，审批通过后方可下发执行移库。"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">出入库作业审批</CardTitle>
            <p className="text-xs text-muted-foreground">
              控制普通货物出入库是否追加审批岗；可按全部库房或指定库房白名单流控。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <YesNoRadio
              name="inout-audit"
              label="出入库是否需要审核"
              required
              value={state.warehouseOps.inOutRequiresAudit}
              onChange={(v) => updateWarehouseOps({ inOutRequiresAudit: v })}
            />
            {state.warehouseOps.inOutRequiresAudit === "是" && (
              <div className="space-y-3 rounded-lg bg-muted/35 p-4 ring-1 ring-foreground/5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Label className="mb-0 shrink-0 text-sm font-medium">
                    <span className="text-destructive">* </span>
                    审核库房范围
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {(["全部库房", "指定库房"] as WarehouseScopeMode[]).map((mode) => (
                      <label key={mode} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="audit-scope"
                          checked={state.warehouseOps.auditScopeMode === mode}
                          onChange={() => updateWarehouseOps({ auditScopeMode: mode })}
                        />
                        {mode}
                      </label>
                    ))}
                  </div>
                </div>

                {state.warehouseOps.auditScopeMode === "全部库房" ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    当前租户下全部库房（含后续新建库房）在普通货物出入库时均需审批。
                  </p>
                ) : (
                  <div className="space-y-2 border-t border-foreground/5 pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setWarehousePickerOpen(true)}
                      >
                        <PlusIcon className="size-3.5" />
                        选择库房
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        已选 {auditedRooms.length} 个库房
                      </span>
                    </div>
                    <AuditedWarehouseList
                      variant="compact"
                      rooms={auditedRooms}
                      onRemove={(roomId) =>
                        updateWarehouseOps({
                          auditedRoomIds: state.warehouseOps.auditedRoomIds.filter(
                            (id) => id !== roomId
                          ),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      仅清单内库房出入库需审批，未选库房免审直通。
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrototypeAnnotationTarget>
  )

  const renderPartnerSection = () => (
    <PrototypeAnnotationTarget annotationIds={["basic-config-partner"]}>
      <div className="space-y-4">
        <PartnerSubjectPolicyCard
          title="个人货主证件地址规则"
          policy={state.partnerAccess.individual}
          onChange={(patch) => updatePartnerSubject("individual", patch)}
          onScanDuplicates={() => setDuplicateDialogOpen(true)}
          certHint="开启后，个人货主建档、出入库制单时必须录入身份证证件地址。"
          duplicateWarning="开启后，同一证件地址仅允许绑定一个个人货主。若地址已被他人使用，制单或建档时将直接拦截。"
          duplicateHint="降低风控要求（由必填改为选填、或关闭防重复）时，保存须填写变更原因。"
        />
        <PartnerSubjectPolicyCard
          title="企业货主证件地址规则"
          policy={state.partnerAccess.enterprise}
          onChange={(patch) => updatePartnerSubject("enterprise", patch)}
          onScanDuplicates={() => setDuplicateDialogOpen(true)}
          certHint="开启后，企业货主建档、业务引入时必须录入营业执照登记地址。"
          duplicateWarning="开启后，同一登记地址仅允许绑定一个企业货主主体；冲突时在建档或制单入口直接拦截。"
          duplicateHint="企业主体实名以统一社会信用代码为准；登记地址防重复与个人一人一址策略分别生效。"
          footnote="企业货主通过营业执照统一信用代码进行实名认证，与个人货主策略分轨配置、分轨校验。"
        />
        <PartnerAccessAuditPanel records={partnerAccessAuditLog} />
      </div>
    </PrototypeAnnotationTarget>
  )

  const renderAgreementSection = () => (
    <PrototypeAnnotationTarget annotationIds={["basic-config-agreement"]}>
      <Card>
        <CardHeader>
        <CardTitle className="text-base">业务协议配置</CardTitle>
        <p className="text-sm text-muted-foreground">
          配置登录、仓单开立等环节需向用户展示的法律协议文件（支持 JPG / PNG / PDF，单个 ≤
          20MB）。
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.agreements.map((agr, index) => (
          <div key={agr.id} className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                协议 {index + 1}
              </span>
              {state.agreements.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    setState((c) => ({
                      ...c,
                      agreements: c.agreements.filter((a) => a.id !== agr.id),
                    }))
                    markCategoryDirty("agreements")
                  }}
                >
                  <Trash2Icon className="size-4" />
                  删除此项
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  <span className="text-destructive">* </span>
                  展示位置
                </Label>
                <Select
                  value={agr.placement || undefined}
                  onValueChange={(v) => {
                    setState((c) => ({
                      ...c,
                      agreements: c.agreements.map((a) =>
                        a.id === agr.id
                          ? { ...a, placement: v as AgreementItem["placement"] }
                          : a
                      ),
                    }))
                    markCategoryDirty("agreements")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择协议展示位置" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGREEMENT_PLACEMENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  <span className="text-destructive">* </span>
                  协议名称
                </Label>
                <Input
                  value={agr.name}
                  maxLength={50}
                  placeholder="请输入协议名称"
                  onChange={(event) => {
                    const name = event.target.value
                    setState((c) => ({
                      ...c,
                      agreements: c.agreements.map((a) =>
                        a.id === agr.id ? { ...a, name } : a
                      ),
                    }))
                    markCategoryDirty("agreements")
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                <span className="text-destructive">* </span>
                协议文件
              </Label>
              <div className="flex flex-wrap items-center gap-2">
                {agr.fileName ? (
                  <span className="inline-flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                    <FileTextIcon className="size-4 text-primary" />
                    {agr.fileName}
                    {agr.fileSizeMb != null && (
                      <span className="text-muted-foreground">({agr.fileSizeMb}MB)</span>
                    )}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">+ 请上传协议</span>
                )}
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="max-w-xs"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    setState((c) => ({
                      ...c,
                      agreements: c.agreements.map((a) =>
                        a.id === agr.id
                          ? {
                              ...a,
                              fileName: file?.name ?? a.fileName,
                              fileSizeMb: file
                                ? Math.round((file.size / 1024 / 1024) * 10) / 10
                                : a.fileSizeMb,
                            }
                          : a
                      ),
                    }))
                    markCategoryDirty("agreements")
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={state.agreements.length >= MAX_AGREEMENTS}
          onClick={() => {
            setState((c) => ({
              ...c,
              agreements: [...c.agreements, newAgreementRow()],
            }))
            markCategoryDirty("agreements")
          }}
        >
          <PlusIcon className="size-4" />
          添加协议
        </Button>
      </CardContent>
    </Card>
    </PrototypeAnnotationTarget>
  )

  const renderDataSourceSection = () => (
    <PrototypeAnnotationTarget annotationIds={["basic-config-datasource"]}>
      <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
        <p>
          为保障接口安全，已保存的密钥统一脱敏隐藏。点击【编辑】时需重新输入新密钥后再点击【保存】。
        </p>
      </div>
      <CredentialCardPanel
        defs={DATA_SOURCE_CARD_DEFS}
        values={state.dataSourceValues}
        cards={state.dataSourceCards}
        onEdit={(id) => handleCredentialEdit("data", id)}
        onCancelEdit={(id) => handleCredentialCancel("data", id)}
        onSave={(id) => handleCredentialSave("data", id)}
        onDraftChange={(cardId, fieldKey, value) =>
          handleCredentialDraft("data", cardId, fieldKey, value)
        }
      />
    </PrototypeAnnotationTarget>
  )

  const renderIotSection = () => (
    <PrototypeAnnotationTarget annotationIds={["basic-config-hardware"]}>
      <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
        <p>
          为保障设备通信安全，已保存的密钥统一脱敏隐藏。点击【编辑】时需重新输入新密钥后再点击【保存】。
        </p>
      </div>
      <CredentialCardPanel
        defs={IOT_HARDWARE_CARD_DEFS}
        values={state.iotValues}
        cards={state.iotCards}
        onEdit={(id) => handleCredentialEdit("iot", id)}
        onCancelEdit={(id) => handleCredentialCancel("iot", id)}
        onSave={(id) => handleCredentialSave("iot", id)}
        onDraftChange={(cardId, fieldKey, value) =>
          handleCredentialDraft("iot", cardId, fieldKey, value)
        }
      />
    </PrototypeAnnotationTarget>
  )

  const renderMailSection = () => (
    <PrototypeAnnotationTarget annotationIds={["basic-config-smtp"]}>
      <p className="mb-4 text-sm text-muted-foreground">
        配置用于发送系统预警通知、审批催办提醒的发信邮箱（SMTP）。
      </p>
      <div className="space-y-4">
        {state.smtpRows.map((row, index) => (
          <Card key={row.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">邮箱 {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>SMTP服务器地址</Label>
                  <Input
                    readOnly={!row.editing}
                    value={row.host}
                    onChange={(e) =>
                      setState((c) => ({
                        ...c,
                        smtpRows: c.smtpRows.map((r) =>
                          r.id === row.id ? { ...r, host: e.target.value } : r
                        ),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SMTP端口</Label>
                  <Input
                    readOnly={!row.editing}
                    value={row.port}
                    onChange={(e) =>
                      setState((c) => ({
                        ...c,
                        smtpRows: c.smtpRows.map((r) =>
                          r.id === row.id ? { ...r, port: e.target.value } : r
                        ),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>加密</Label>
                  <Select
                    disabled={!row.editing}
                    value={row.encryption}
                    onValueChange={(v) =>
                      setState((c) => ({
                        ...c,
                        smtpRows: c.smtpRows.map((r) =>
                          r.id === row.id
                            ? { ...r, encryption: v as SmtpMailboxRow["encryption"] }
                            : r
                        ),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                      <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                      <SelectItem value="无">无</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>发件人邮箱</Label>
                  <Input
                    readOnly={!row.editing}
                    value={row.fromEmail}
                    onChange={(e) =>
                      setState((c) => ({
                        ...c,
                        smtpRows: c.smtpRows.map((r) =>
                          r.id === row.id ? { ...r, fromEmail: e.target.value } : r
                        ),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>发件人密码/授权码</Label>
                  <Input
                    readOnly={!row.editing}
                    type={row.editing ? "text" : "password"}
                    value={row.editing ? row.authCode : row.configured ? MASKED_SECRET : ""}
                    placeholder={row.editing ? "请输入授权码" : ""}
                    onChange={(e) =>
                      setState((c) => ({
                        ...c,
                        smtpRows: c.smtpRows.map((r) =>
                          r.id === row.id ? { ...r, authCode: e.target.value } : r
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!row.configured}
                  onClick={() => setSmtpTestTarget(row)}
                >
                  <MailIcon className="size-4" />
                  发送测试邮件
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setState((c) => ({
                      ...c,
                      smtpRows: c.smtpRows.map((r) =>
                        r.id === row.id
                          ? {
                              ...r,
                              editing: true,
                              authCode: r.editing ? r.authCode : "",
                            }
                          : r
                      ),
                    }))
                  }
                >
                  编辑
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (!row.host || !row.fromEmail || !row.authCode) {
                      showToast("请完整填写 SMTP 参数后再保存")
                      return
                    }
                    setState((c) => ({
                      ...c,
                      smtpRows: c.smtpRows.map((r) =>
                        r.id === row.id
                          ? { ...r, configured: true, editing: false, authCode: "configured" }
                          : r
                      ),
                    }))
                    showToast(`邮箱 ${index + 1} 已保存`)
                  }}
                >
                  保存
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  disabled={state.smtpRows.length <= 1}
                  onClick={() =>
                    setState((c) => ({
                      ...c,
                      smtpRows: c.smtpRows.filter((r) => r.id !== row.id),
                    }))
                  }
                >
                  <Trash2Icon className="size-4" />
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setState((c) => ({ ...c, smtpRows: [...c.smtpRows, newSmtpRow()] }))
          }
        >
          <PlusIcon className="size-4" />
          添加发信邮箱
        </Button>
      </div>
    </PrototypeAnnotationTarget>
  )

  const renderSection = () => {
    switch (category) {
      case "warehouse-ops":
        return renderWarehouseSection()
      case "partner-access":
        return renderPartnerSection()
      case "agreements":
        return renderAgreementSection()
      case "data-sources":
        return renderDataSourceSection()
      case "iot-hardware":
        return renderIotSection()
      case "mail-smtp":
        return renderMailSection()
      default:
        return null
    }
  }

  return (
    <PrototypeAnnotationProvider
      title="基础配置 · 原型批注"
      annotations={platformBasicConfigAnnotations}
      documents={platformBasicConfigDocuments}
    >
      <div className="flex min-h-0 flex-col gap-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["basic-config-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">基础配置</h1>
          <p className="text-sm text-muted-foreground">
            集中维护仓储作业审批、合作方准入、协议文件、数据源与物联网网关、邮件通知等平台运行参数
          </p>
        </PrototypeAnnotationTarget>

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <PrototypeAnnotationTarget annotationIds={["basic-config-nav"]}>
            <Card className="shrink-0 lg:w-56">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  配置分类
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-2">
                {CONFIG_CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => trySwitchCategory(item.id)}
                    className={cn(
                      "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                      category === item.id
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </CardContent>
            </Card>
          </PrototypeAnnotationTarget>

          <div className="min-w-0 flex-1 space-y-4">
            <PrototypeAnnotationTarget annotationIds={["basic-config-actions"]}>
              <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border bg-card px-4 py-3">
                {showBulkSave ? (
                  <Button type="button" onClick={handleSaveCurrentCategory}>
                    保存
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => showToast("已从服务端刷新最新参数（Mock）")}
                  >
                    <RefreshCwIcon className="size-4" />
                    刷新
                  </Button>
                )}
                <Button type="button" variant="secondary" onClick={handleExitCurrentCategory}>
                  退出
                </Button>
              </div>
            </PrototypeAnnotationTarget>
            {renderSection()}
          </div>
        </div>

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg border bg-card px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        <WarehouseAuditPickerDialog
          open={warehousePickerOpen}
          selectedIds={state.warehouseOps.auditedRoomIds}
          onOpenChange={setWarehousePickerOpen}
          onConfirm={(ids) => updateWarehouseOps({ auditedRoomIds: ids })}
        />

        <DuplicateAddressDialog
          open={duplicateDialogOpen}
          onOpenChange={setDuplicateDialogOpen}
        />

        <ConfigConfirmDialog
          open={riskRelaxOpen}
          title="降低风控要求确认"
          description="您正在放宽证件地址必填或关闭防重复校验，可能增加冒用地址或虚假建档风险。变更原因将写入不可变审计日志，并在本页「策略变更审计」中展示最近记录。"
          confirmLabel="确认提交"
          destructive
          reasonRequired
          reasonLabel="变更原因说明"
          reasonPlaceholder="因存量农产品散户身份证住址存在合规村集体地址重叠，经风控合规部审批特批放宽校验。"
          onOpenChange={setRiskRelaxOpen}
          onConfirm={(reason) => {
            if (!reason) return
            setRiskRelaxOpen(false)
            recordPartnerAccessRelax(reason)
            commitCategorySave("partner-access", { withAuditNote: true })
          }}
        />

        <Dialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>提示</DialogTitle>
              <DialogDescription>
                您有配置内容尚未保存，若直接退出编辑内容将会丢失，请确认是否退出？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUnsavedDialogOpen(false)
                  setPendingCategory(null)
                  setUnsavedAction(null)
                }}
              >
                取消
              </Button>
              <Button type="button" variant="destructive" onClick={confirmUnsavedLeave}>
                确认退出
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <SmtpTestMailDialog
          open={Boolean(smtpTestTarget)}
          mailbox={smtpTestTarget}
          onOpenChange={(open) => !open && setSmtpTestTarget(null)}
          onSent={showToast}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
