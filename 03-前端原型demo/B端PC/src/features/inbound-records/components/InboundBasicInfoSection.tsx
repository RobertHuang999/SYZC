import type { ReactNode } from "react"
import { CameraIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { OWNER_TYPES, RELATED_ORDER_PLACEHOLDER } from "../domain/form-constants"
import { InboundTypeSelect } from "./InboundTypeSelect"
import { OwnerNameSearchSelect } from "./OwnerNameSearchSelect"
import { StoreroomMultiSelect } from "./StoreroomMultiSelect"
import type { InboundFormState, OwnerType } from "../domain/form-types"
import { FORM_STOREROOMS, FORM_WAREHOUSES } from "../mock/inbound-form.mock"

function maskPhoneNumber(phone?: string): string {
  if (!phone) return ""
  if (phone.length === 11) {
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`
  }
  return phone
}

function maskIdCardNo(idCard?: string): string {
  if (!idCard) return ""
  if (idCard.length >= 10) {
    return `${idCard.slice(0, 6)}****${idCard.slice(-4)}`
  }
  return idCard
}

type InboundBasicInfoSectionProps = {
  form: InboundFormState
  expanded: boolean
  onToggle: () => void
  onChange: (patch: Partial<InboundFormState>) => void
  onPickRelatedOrder: () => void
  onOcrHint?: () => void
}

export function InboundBasicInfoSection({
  form,
  expanded,
  onToggle,
  onChange,
  onPickRelatedOrder,
  onOcrHint,
}: InboundBasicInfoSectionProps) {
  const isEnterprise = form.ownerType === "企业货主"
  const isPersonal = form.ownerType === "个人货主"
  const needsRelated =
    form.inboundType === "质押入库" ||
    form.inboundType === "抵押入库" ||
    form.inboundType === "监管服务入库"

  const storeroomOptions = FORM_STOREROOMS.filter(
    (room) => !form.warehouseId || room.warehouseId === form.warehouseId
  )

  const toggleStoreroom = (roomId: string) => {
    const exists = form.storeroomIds.includes(roomId)
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            {/* 3. 货主名称 */}
            <Field label="货主名称" required>
              <div className="flex gap-1.5">
                <div className="min-w-0 flex-1">
                  <OwnerNameSearchSelect
                    ownerType={form.ownerType}
                    ownerName={form.ownerName}
                    ownerIdentifier={form.ownerIdentifier}
                    onSelect={(selection) => {
                      const targetType =
                        form.ownerType || selection.ownerType || "企业货主"
                      onChange({
                        ownerType: targetType,
                        ownerName: selection.ownerName,
                        ownerIdentifier: selection.ownerIdentifier,
                        idCardNo: selection.idCardNo,
                        contactPhone: selection.contactPhone,
                        isNewOwner: selection.isNewOwner,
                      })
                    }}
                  />
                </div>
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
            </Field>

            {/* 4. 货主标识（反显时置灰不可修改，个人手机号脱敏） */}
            <Field
              label="货主标识"
              required
            >
              <Input
                placeholder={
                  !form.ownerType
                    ? "请先选择货主类型"
                    : !form.isNewOwner && form.ownerName
                    ? "系统档案反显，不可修改"
                    : isEnterprise
                    ? "请输入统一社会信用代码"
                    : "请输入手机号码"
                }
                value={
                  isPersonal && !form.isNewOwner && Boolean(form.ownerName)
                    ? maskPhoneNumber(form.ownerIdentifier)
                    : form.ownerIdentifier
                }
                disabled={!form.ownerType || (!form.isNewOwner && Boolean(form.ownerName))}
                maxLength={isPersonal ? 11 : 18}
                className={cn(
                  "font-mono",
                  (!form.ownerType || (!form.isNewOwner && Boolean(form.ownerName))) &&
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
                <Input
                  placeholder={
                    !form.isNewOwner && form.ownerName
                      ? "系统档案反显，不可修改"
                      : "请输入货主身份证号"
                  }
                  value={
                    !form.isNewOwner && Boolean(form.ownerName)
                      ? maskIdCardNo(form.idCardNo)
                      : form.idCardNo
                  }
                  disabled={!form.isNewOwner && Boolean(form.ownerName)}
                  maxLength={18}
                  className={cn(
                    "font-mono",
                    !form.isNewOwner &&
                      Boolean(form.ownerName) &&
                      "bg-muted/60 text-muted-foreground cursor-not-allowed select-none"
                  )}
                  onChange={(event) => onChange({ idCardNo: event.target.value.trim() })}
                />
              </Field>
            ) : isEnterprise ? (
              <Field label="联系电话" required>
                <Input
                  placeholder={
                    !form.isNewOwner && form.ownerName
                      ? "系统档案反显，不可修改"
                      : "请输入企业联系电话"
                  }
                  value={
                    !form.isNewOwner && Boolean(form.ownerName)
                      ? maskPhoneNumber(form.contactPhone)
                      : form.contactPhone
                  }
                  disabled={!form.isNewOwner && Boolean(form.ownerName)}
                  className={cn(
                    "font-mono",
                    !form.isNewOwner &&
                      Boolean(form.ownerName) &&
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
              />
            </Field>
          </div>

          {/* 10. 备注信息 */}
          <Field label="备注">
            <Textarea
              placeholder="请输入备注说明（最多 140 字）"
              maxLength={140}
              className="resize-none"
              rows={3}
              value={form.remark}
              onChange={(event) => onChange({ remark: event.target.value })}
            />
            <p className="text-right text-xs text-muted-foreground mt-1">
              {form.remark.length}/140
            </p>
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
