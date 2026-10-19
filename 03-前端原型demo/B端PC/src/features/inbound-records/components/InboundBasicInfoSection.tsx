import { useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { CameraIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { INBOUND_OWNER_FORM_PLACEHOLDERS } from "@prototype/shared/inbound/owner-ui-labels"
import {
  INBOUND_TYPE_OPTIONS,
  OWNER_TYPES,
  RELATED_ORDER_PLACEHOLDER,
} from "../domain/form-constants"
import { InboundTypeSelect } from "./InboundTypeSelect"
import { OwnerNameSearchSelect } from "./OwnerNameSearchSelect"
import { StoreroomMultiSelect } from "./StoreroomMultiSelect"
import type { InboundFormState, OwnerType } from "../domain/form-types"
import {
  canToggleStoreroomSelection,
  resolvePersonalOwnerIdCardMasked,
  STOREROOM_AUDIT_CONFLICT_MESSAGE,
} from "../lib/inbound-form-utils"
import {
  findOwnerSearchRecord,
  FORM_STOREROOMS,
  FORM_WAREHOUSES,
  resolveOwnerSearchRecord,
} from "../mock/inbound-form.mock"
import { STAGING_P01_FORM_HINT } from "@prototype/shared/inbound/staging-ui-labels"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
} from "@/features/partner-archives/lib/contact-phone-verify"
import { isFinancialInboundType } from "../lib/inbound-owner-verify"

function ownerTagStaging(
  ownerTrimmed: string,
  matchedArchive: ReturnType<typeof resolveOwnerSearchRecord> | undefined,
) {
  if (!ownerTrimmed) return null
  return matchedArchive ? "标签：档案货主" : "标签：临时待核"
}

function maskPhoneNumber(phone?: string): string {
  if (!phone) return ""
  if (phone.length === 11) {
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`
  }
  return phone
}


type InboundBasicInfoSectionProps = {
  form: InboundFormState
  expanded: boolean
  onToggle: () => void
  onChange: (patch: Partial<InboundFormState>) => void
  onPickRelatedOrder: () => void
  onOcrHint?: () => void
  onFormHint?: (message: string) => void
  /** 6.3 R03：唤起 PartnerQuickCreateSheet */
  onQuickAddOwner?: () => void
  /** 暂存登记：P03 货主一体化、弱校验、关联单号选填 */
  variant?: "formal" | "staging"
}

export function InboundBasicInfoSection({
  form,
  expanded,
  onToggle,
  onChange,
  onPickRelatedOrder,
  onOcrHint,
  onFormHint,
  onQuickAddOwner,
  variant = "formal",
}: InboundBasicInfoSectionProps) {
  const isStaging = variant === "staging"
  const isEnterprise = form.ownerType === "企业货主"
  const isPersonal = form.ownerType === "个人货主"
  const needsRelated =
    form.inboundType === "质押入库" ||
    form.inboundType === "抵押入库" ||
    form.inboundType === "监管服务入库"

  const storeroomOptions = FORM_STOREROOMS.filter(
    (room) => !form.warehouseId || room.warehouseId === form.warehouseId
  )

  const ownerNameTrimmed = form.ownerName.trim()
  const matchedArchive = resolveOwnerSearchRecord({
    ownerType: form.ownerType,
    ownerName: ownerNameTrimmed,
    ownerIdentifier: form.ownerIdentifier,
  })
  const isArchivedOwner = Boolean(form.partnerId && matchedArchive)
  const ownerFieldsLocked = Boolean(form.partnerId && ownerNameTrimmed)
  const idCardMaskedDisplay =
    resolvePersonalOwnerIdCardMasked(form, matchedArchive) ||
    matchedArchive?.idCardMasked ||
    ""
  const ownerIdentifierPlain =
    form.ownerIdentifier || matchedArchive?.ownerIdentifier || ""
  const showPersonalIdCardEcho =
    isPersonal &&
    ownerFieldsLocked &&
    Boolean(ownerNameTrimmed || ownerIdentifierPlain || matchedArchive)

  // 选中存量货主：档案身份证号写入 form（提交/货主确认弹窗依赖明文 idCardNo）
  useEffect(() => {
    if (!matchedArchive || form.ownerType !== "个人货主") return

    const patch: Partial<InboundFormState> = {}
    if (matchedArchive.idCardNo && form.idCardNo !== matchedArchive.idCardNo) {
      patch.idCardNo = matchedArchive.idCardNo
    }
    if (matchedArchive.ownerIdentifier && !form.ownerIdentifier) {
      patch.ownerIdentifier = matchedArchive.ownerIdentifier
    }
    if (form.isNewOwner) {
      patch.isNewOwner = false
    }
    if (matchedArchive?.partnerId && form.partnerId !== matchedArchive.partnerId) {
      patch.partnerId = matchedArchive.partnerId
    }
    if (Object.keys(patch).length > 0) {
      onChange(patch)
    }
    // onChange 为父级 setState 包装，刻意不纳入依赖避免重复触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    matchedArchive?.id,
    form.ownerType,
    ownerNameTrimmed,
    form.idCardNo,
    form.ownerIdentifier,
    form.isNewOwner,
  ])

  const toggleStoreroom = (roomId: string) => {
    const exists = form.storeroomIds.includes(roomId)
    if (
      !isStaging &&
      !exists &&
      !canToggleStoreroomSelection(form.storeroomIds, roomId, storeroomOptions)
    ) {
      onFormHint?.(STOREROOM_AUDIT_CONFLICT_MESSAGE)
      return
    }
    onChange({
      storeroomIds: exists
        ? form.storeroomIds.filter((id) => id !== roomId)
        : [...form.storeroomIds, roomId],
    })
  }

  return (
    <Card className="shadow-xs">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          onClick={onToggle}
        >
          {expanded ? (
            <ChevronUpIcon className="size-4 text-primary" />
          ) : (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          )}
          基础信息
        </button>
      </div>

      {expanded ? (
        <CardContent className="space-y-4 pt-5 pb-6">
          {isStaging ? (
            <p className="rounded-md border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs text-amber-900">
              {STAGING_P01_FORM_HINT}
              主表入库库房选填，暂存阶段可混选需审核与免审库房；转正提交时再执行 R06。
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isStaging ? (
              <>
                <Field label="入库日期" required>
                  <Input
                    type="datetime-local"
                    max={new Date().toISOString().slice(0, 16)}
                    value={form.inboundDate ? form.inboundDate.replace(" ", "T").slice(0, 16) : ""}
                    onChange={(event) => {
                      const val = event.target.value.replace("T", " ")
                      onChange({ inboundDate: val ? `${val}:00` : "" })
                    }}
                  />
                </Field>
                <Field label="入库仓库" required>
                  <WarehouseSelect
                    value={form.warehouseId}
                    onChange={(warehouseId) => onChange({ warehouseId, storeroomIds: [] })}
                  />
                </Field>
                <Field label="入库类型" required>
                  <Select
                    value={form.inboundType || undefined}
                    onValueChange={(value) => {
                      if (!value) return
                      onChange({
                        inboundType: value as InboundFormState["inboundType"],
                        relatedOrderNo: "",
                        relatedOrderLabel: "",
                      })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="请选择入库类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {INBOUND_TYPE_OPTIONS.filter((o) => o.value !== "退货入库").map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="入库库房">
                  <StoreroomMultiSelect
                    options={storeroomOptions}
                    selected={form.storeroomIds}
                    onToggle={toggleStoreroom}
                    disabled={!form.warehouseId}
                    allowMixedAuditTags
                    onAuditConflict={() => onFormHint?.(STOREROOM_AUDIT_CONFLICT_MESSAGE)}
                  />
                </Field>
                {form.inboundType && form.inboundType !== "普通入库" ? (
                  <Field label="关联单号">
                    <div className="flex gap-1.5">
                      <Input
                        placeholder="可手填纸质单号或选择系统单"
                        maxLength={50}
                        value={form.relatedOrderNo}
                        onChange={(e) => onChange({ relatedOrderNo: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 text-xs"
                        onClick={onPickRelatedOrder}
                      >
                        选系统单
                      </Button>
                    </div>
                  </Field>
                ) : null}
                <Field label="货主/送货说明" className="sm:col-span-2 lg:col-span-2">
                  <Input
                    placeholder="档案联想或手填临时说明（最多 100 字）"
                    maxLength={100}
                    value={form.ownerName}
                    onChange={(e) =>
                      onChange({ ownerName: e.target.value, isNewOwner: true })
                    }
                  />
                  {ownerTagStaging(ownerNameTrimmed, matchedArchive) ? (
                    <span className="text-[11px] text-muted-foreground">
                      {ownerTagStaging(ownerNameTrimmed, matchedArchive)}
                    </span>
                  ) : null}
                </Field>
              </>
            ) : (
              <>
            {/* 1. 入库日期（禁止选未来时间，对齐源码 disabledDate） */}
            <Field label="入库日期" required>
              <Input
                type="datetime-local"
                max={new Date().toISOString().slice(0, 16)}
                value={form.inboundDate ? form.inboundDate.replace(" ", "T").slice(0, 16) : ""}
                onChange={(event) => {
                  const val = event.target.value.replace("T", " ")
                  onChange({ inboundDate: val ? `${val}:00` : "" })
                }}
              />
            </Field>

            {/* 2. 货主类型 */}
            <Field label="货主类型" required>
              <Select
                value={form.ownerType || undefined}
                onValueChange={(value) => {
                  if (!value) return
                  onChange({
                    ownerType: value as OwnerType,
                    ownerName: "",
                    ownerIdentifier: "",
                    contactPhone: "",
                    idCardNo: "",
                    isNewOwner: false,
                    partnerId: "",
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <span
                    className={cn(
                      "flex-1 text-left text-xs font-medium",
                      !form.ownerType && "text-muted-foreground"
                    )}
                  >
                    {form.ownerType
                      ? form.ownerType === "企业货主"
                        ? "企业"
                        : "个人"
                      : "请选择货主类型"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {OWNER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "企业货主" ? "企业" : "个人"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* 3. 货主（合作方引用） */}
            <Field label="货主" required className="sm:col-span-2 lg:col-span-2">
              <div className="flex flex-col gap-2">
              <div className="flex gap-1.5">
                <div className="min-w-0 flex-1">
                  <OwnerNameSearchSelect
                    ownerType={form.ownerType}
                    ownerName={form.ownerName}
                    ownerIdentifier={form.ownerIdentifier}
                    onQuickAdd={onQuickAddOwner}
                    onSelect={(selection) => {
                      const ownerName = selection.ownerName.trim()
                      const targetType =
                        form.ownerType || selection.ownerType || "企业货主"
                      const archive = findOwnerSearchRecord(
                        targetType,
                        ownerName
                      )
                      const ownerIdentifierHint =
                        selection.ownerIdentifier ??
                        form.ownerIdentifier ??
                        archive?.ownerIdentifier ??
                        ""
                      const resolvedArchive =
                        archive ??
                        findOwnerSearchRecord(targetType, ownerName) ??
                        resolveOwnerSearchRecord({
                          ownerType: targetType,
                          ownerName,
                          ownerIdentifier: ownerIdentifierHint,
                        })

                      const patch: Partial<InboundFormState> = {
                        ownerName,
                        ownerType: targetType,
                      }

                      if (selection.ownerIdentifier !== undefined) {
                        patch.ownerIdentifier = selection.ownerIdentifier
                      } else if (resolvedArchive?.ownerIdentifier) {
                        patch.ownerIdentifier = resolvedArchive.ownerIdentifier
                      }

                      if (selection.idCardNo !== undefined) {
                        patch.idCardNo = selection.idCardNo
                      } else if (resolvedArchive?.idCardNo) {
                        patch.idCardNo = resolvedArchive.idCardNo
                      }

                      if (selection.contactPhone !== undefined) {
                        patch.contactPhone = selection.contactPhone
                      } else if (resolvedArchive?.contactPhone) {
                        patch.contactPhone = resolvedArchive.contactPhone
                      }

                      if (selection.isNewOwner !== undefined) {
                        patch.isNewOwner = resolvedArchive
                          ? false
                          : selection.isNewOwner
                      } else if (resolvedArchive) {
                        patch.isNewOwner = false
                      }

                      if (selection.partnerId !== undefined) {
                        patch.partnerId = selection.partnerId
                      } else if (resolvedArchive?.partnerId) {
                        patch.partnerId = resolvedArchive.partnerId
                      } else if (selection.isNewOwner) {
                        patch.partnerId = ""
                      }

                      onChange(patch)
                    }}
                  />
                </div>
                {onQuickAddOwner ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={onQuickAddOwner}
                  >
                    + 快速添加货主
                  </Button>
                ) : null}
                {(!form.ownerType || isEnterprise) ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0 text-primary border-primary/30 hover:bg-primary/5"
                    title="营业执照 OCR 拍照识别（自动回填）"
                    aria-label="证照识别"
                    onClick={onOcrHint}
                  >
                    <CameraIcon className="size-4" />
                  </Button>
                ) : null}
              </div>
                {isArchivedOwner && matchedArchive ? (
                  <div className="col-span-full flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-muted-foreground">档案货主</span>
                    {matchedArchive.contactPhoneVerified ? (
                      <Badge
                        variant="outline"
                        className={
                          CONTACT_PHONE_VERIFY_BADGE_CLASS[
                            matchedArchive.contactPhoneVerified
                          ]
                        }
                      >
                        {
                          CONTACT_PHONE_VERIFY_LABELS[
                            matchedArchive.contactPhoneVerified
                          ]
                        }
                      </Badge>
                    ) : null}
                    {matchedArchive.partnerId ? (
                      <Link
                        to={`/用户中心/合作方管理/合作方档案/详情/${matchedArchive.partnerId}`}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        查看货主
                      </Link>
                    ) : null}
                    {matchedArchive.contactPhoneVerified === "UNVERIFIED" &&
                    isFinancialInboundType(form.inboundType) ? (
                      <span className="text-amber-700">
                        提交审核时将需完成手机短信确认（PA-R04b）
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Field>

            {/* 4. 货主标识（反显时置灰不可修改，个人手机号脱敏） */}
            <Field
              label="货主标识"
              required
            >
              <Input
                placeholder={
                  !form.ownerType
                    ? INBOUND_OWNER_FORM_PLACEHOLDERS.ownerTypeFirst
                    : ownerFieldsLocked
                    ? "系统档案反显，不可修改"
                    : isEnterprise
                    ? INBOUND_OWNER_FORM_PLACEHOLDERS.enterpriseCreditCode
                    : INBOUND_OWNER_FORM_PLACEHOLDERS.personalMobile
                }
                value={
                  isPersonal && ownerFieldsLocked && ownerIdentifierPlain
                    ? maskPhoneNumber(ownerIdentifierPlain)
                    : form.ownerIdentifier
                }
                disabled={!form.ownerType || ownerFieldsLocked}
                maxLength={isPersonal ? 11 : 18}
                className={cn(
                  (!form.ownerType || ownerFieldsLocked) &&
                    "bg-muted/60 text-muted-foreground cursor-not-allowed select-none"
                )}
                onChange={(event) =>
                  onChange({ ownerIdentifier: event.target.value.trim() })
                }
              />
            </Field>

            {/* 5. 补充身份核验：个人身份证号（脱敏反显置灰） / 企业联系电话 */}
            {isPersonal ? (
              <Field label="身份证号" required>
                {showPersonalIdCardEcho ? (
                  <div
                    aria-readonly
                    className={cn(
                      "flex h-8 w-full items-center rounded-lg border border-input bg-muted/60 px-2.5 text-sm select-none",
                      idCardMaskedDisplay
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {idCardMaskedDisplay || "系统档案暂无身份证号"}
                  </div>
                ) : (
                  <Input
                    placeholder={INBOUND_OWNER_FORM_PLACEHOLDERS.personalIdCard}
                    value={form.idCardNo}
                    maxLength={18}
                    onChange={(event) =>
                      onChange({ idCardNo: event.target.value.trim() })
                    }
                  />
                )}
              </Field>
            ) : isEnterprise ? (
              <Field label="联系电话" required>
                <Input
                  placeholder={
                    ownerFieldsLocked
                      ? "系统档案反显，不可修改"
                      : INBOUND_OWNER_FORM_PLACEHOLDERS.enterpriseContact
                  }
                  value={
                    ownerFieldsLocked &&
                    (form.contactPhone || matchedArchive?.contactPhone)
                      ? maskPhoneNumber(
                          form.contactPhone || matchedArchive?.contactPhone || ""
                        )
                      : form.contactPhone
                  }
                  disabled={ownerFieldsLocked}
                  className={cn(
                    ownerFieldsLocked &&
                      "bg-muted/60 text-muted-foreground cursor-not-allowed select-none"
                  )}
                  onChange={(event) =>
                    onChange({ contactPhone: event.target.value.trim() })
                  }
                />
              </Field>
            ) : (
              <Field label="联系方式">
                <Input placeholder="请先选择货主类型" disabled className="bg-muted/60 text-muted-foreground cursor-not-allowed" />
              </Field>
            )}

            {/* 6. 入库类型 */}
            <Field label="入库类型" required>
              <InboundTypeSelect
                value={form.inboundType}
                onChange={(inboundType) =>
                  onChange({
                    inboundType,
                    relatedOrderNo: "",
                    relatedOrderLabel: "",
                  })
                }
              />
            </Field>

            {/* 7. 关联单号（当选质押/抵押/监管服务时展示，否则放仓库） */}
            {needsRelated ? (
              <Field label="关联单号" required>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-start text-xs font-normal"
                  onClick={onPickRelatedOrder}
                >
                  {form.relatedOrderLabel ||
                    (form.inboundType === "质押入库" ||
                    form.inboundType === "抵押入库" ||
                    form.inboundType === "监管服务入库"
                      ? RELATED_ORDER_PLACEHOLDER[form.inboundType]
                      : null) ||
                    "请选择关联单号"}
                </Button>
              </Field>
            ) : null}

            {/* 8. 入库仓库 */}
            <Field label="入库仓库" required>
              <WarehouseSelect
                value={form.warehouseId}
                onChange={(warehouseId) =>
                  onChange({ warehouseId, storeroomIds: [] })
                }
              />
            </Field>

            {/* 9. 入库库房 */}
            <Field label="入库库房" required>
              <StoreroomMultiSelect
                options={storeroomOptions}
                selected={form.storeroomIds}
                onToggle={toggleStoreroom}
                disabled={!form.warehouseId}
                onAuditConflict={() => onFormHint?.(STOREROOM_AUDIT_CONFLICT_MESSAGE)}
              />
            </Field>
              </>
            )}
          </div>

          {/* 10. 备注信息 */}
          <Field label="备注" className="pb-0">
            <div className="relative">
              <Textarea
                placeholder="请输入备注说明（最多 140 字）"
                maxLength={140}
                className="resize-none pb-7 pr-16"
                rows={3}
                value={form.remark}
                onChange={(event) => onChange({ remark: event.target.value })}
              />
              <span className="pointer-events-none absolute bottom-2 right-2.5 select-none text-[11px] text-muted-foreground">
                {form.remark.length}/140
              </span>
            </div>
          </Field>
        </CardContent>
      ) : null}
    </Card>
  )
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-foreground">
        {required ? <span className="text-destructive">* </span> : null}
        {label}
      </Label>
      {children}
    </div>
  )
}

function WarehouseSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  const currentWarehouse = FORM_WAREHOUSES.find((wh) => wh.id === value)

  return (
    <Select value={value || undefined} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="w-full">
        <span
          className={cn(
            "flex-1 text-left text-xs font-medium truncate",
            !currentWarehouse && "text-muted-foreground"
          )}
        >
          {currentWarehouse ? currentWarehouse.name : "请选择仓库"}
        </span>
      </SelectTrigger>
      <SelectContent>
        {FORM_WAREHOUSES.map((wh) => (
          <SelectItem key={wh.id} value={wh.id}>
            {wh.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
