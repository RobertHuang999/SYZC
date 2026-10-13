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
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { OWNER_TYPES, RELATED_ORDER_PLACEHOLDER } from "../domain/form-constants"
import { InboundTypeSelect } from "./InboundTypeSelect"
import { OwnerNameSearchSelect } from "./OwnerNameSearchSelect"
import { StoreroomMultiSelect } from "./StoreroomMultiSelect"
import type { InboundFormState, OwnerType } from "../domain/form-types"
import {
  FORM_STOREROOMS,
  FORM_WAREHOUSES,
} from "../mock/inbound-form.mock"

type InboundBasicInfoSectionProps = {
  form: InboundFormState
  expanded: boolean
  onToggle: () => void
  onChange: (patch: Partial<InboundFormState>) => void
  onCancel: () => void
  onSubmit: () => void
  onPickRelatedOrder: () => void
  onOcrHint?: () => void
}

export function InboundBasicInfoSection({
  form,
  expanded,
  onToggle,
  onChange,
  onCancel,
  onSubmit,
  onPickRelatedOrder,
  onOcrHint,
}: InboundBasicInfoSectionProps) {
  const isEnterprise = form.ownerType === "企业货主"
  const isPersonal = form.ownerType === "个人货主"
  const needsRelated =
    form.inboundType === "质押入库" || form.inboundType === "抵押入库"

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
    <Card>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium"
          onClick={onToggle}
        >
          {expanded ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
          基础信息
        </button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            取消
          </Button>
          <Button type="button" size="sm" onClick={onSubmit}>
            提交审核
          </Button>
        </div>
      </div>
      {expanded ? (
        <CardContent className="space-y-4 pt-4">
          <div className="grid gap-4 lg:grid-cols-4">
            <Field label="入库日期" required>
              <Input
                value={form.inboundDate}
                onChange={(event) =>
                  onChange({ inboundDate: event.target.value })
                }
              />
            </Field>
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
                  <SelectValue placeholder="请选择货主类型" />
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
            <Field label="货主名称" required>
              <div className="flex gap-1">
                <div className="min-w-0 flex-1">
                  <OwnerNameSearchSelect
                    ownerType={form.ownerType}
                    ownerName={form.ownerName}
                    ownerIdentifier={form.ownerIdentifier}
                    disabled={!form.ownerType}
                    onSelect={(selection) => onChange(selection)}
                  />
                </div>
                {isEnterprise ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    aria-label="证照识别"
                    onClick={onOcrHint}
                  >
                    <CameraIcon className="size-4 text-primary" />
                  </Button>
                ) : null}
              </div>
            </Field>

            {isEnterprise ? (
              <Field label="货主标识" required>
                <Input
                  placeholder="请输入公司统一社会信用代码"
                  value={form.ownerIdentifier}
                  onChange={(event) =>
                    onChange({ ownerIdentifier: event.target.value })
                  }
                />
              </Field>
            ) : isPersonal ? (
              <Field label="货主标识" required>
                <Input
                  placeholder="请输入手机号码"
                  value={form.ownerIdentifier}
                  onChange={(event) =>
                    onChange({ ownerIdentifier: event.target.value })
                  }
                />
              </Field>
            ) : (
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
            )}

            {isEnterprise ? (
              <Field label="联系电话" required>
                <Input
                  placeholder="请输入联系电话"
                  value={form.contactPhone}
                  onChange={(event) =>
                    onChange({ contactPhone: event.target.value })
                  }
                />
              </Field>
            ) : isPersonal ? (
              <Field label="身份证号" required>
                <Input
                  placeholder="请输入货主身份证号"
                  value={form.idCardNo}
                  onChange={(event) => onChange({ idCardNo: event.target.value })}
                />
              </Field>
            ) : (
              <Field label="入库仓库" required>
                <WarehouseSelect
                  value={form.warehouseId}
                  onChange={(warehouseId) =>
                    onChange({ warehouseId, storeroomIds: [] })
                  }
                />
              </Field>
            )}

            {isEnterprise || isPersonal ? (
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
            ) : (
              <Field label="入库库房" required>
                <StoreroomMultiSelect
                  options={storeroomOptions}
                  selected={form.storeroomIds}
                  onToggle={toggleStoreroom}
                  disabled={!form.warehouseId}
                />
              </Field>
            )}

            {needsRelated && (isEnterprise || isPersonal) ? (
              <Field label="关联单号" required>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-start font-normal"
                  onClick={onPickRelatedOrder}
                >
                  {form.relatedOrderLabel ||
                    (form.inboundType === "质押入库" ||
                    form.inboundType === "抵押入库"
                      ? RELATED_ORDER_PLACEHOLDER[form.inboundType]
                      : null) ||
                    "请选择关联单号"}
                </Button>
              </Field>
            ) : null}

            {isEnterprise || isPersonal ? (
              <Field label="入库仓库" required>
                <WarehouseSelect
                  value={form.warehouseId}
                  onChange={(warehouseId) =>
                    onChange({ warehouseId, storeroomIds: [] })
                  }
                />
              </Field>
            ) : null}

            {isEnterprise || isPersonal ? (
              <Field label="入库库房" required>
                <StoreroomMultiSelect
                  options={storeroomOptions}
                  selected={form.storeroomIds}
                  onToggle={toggleStoreroom}
                  disabled={!form.warehouseId}
                />
              </Field>
            ) : null}
          </div>

          <Field label="备注">
            <Textarea
              placeholder="请输入备注"
              maxLength={140}
              value={form.remark}
              onChange={(event) => onChange({ remark: event.target.value })}
            />
            <p className="text-right text-xs text-muted-foreground">
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
    <div className={cn("space-y-2", className)}>
      <Label>
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
  return (
    <Select value={value || undefined} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="请选择仓库" />
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

