import { useMemo, useState, type ReactNode } from "react"
import { Calendar, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MANUAL_OUTBOUND_TYPE_OPTIONS } from "../domain/constants"
import type { OutboundFormState } from "../domain/form-types"
import type { OwnerType, OutboundTypeName } from "../domain/types"
import { RELATED_ORDER_CANDIDATES, type RelatedOrderItem } from "../mock/outbound-form.mock"
import { PartnerChangeFieldMark } from "@/components/form/PartnerChangeZone"
import { PartnerArchiveEmbeddedPicker } from "@/features/partner-archives/components/PartnerArchiveEmbeddedPicker"
import {
  OUTBOUND_OWNER_PARTNER_CHANGE_SPEC,
  OUTBOUND_OWNER_PARTNER_CHANGE_USER,
} from "@prototype/shared/partner-change/partner-change-ui-labels"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { PartnerSelectorValue } from "@/features/partner-archives/components/PartnerArchiveSelector"
import { partnerArchivesMock } from "@/features/partner-archives/mock/partner-archives.mock"
import { resolveContactPhoneVerified } from "@/features/partner-archives/lib/contact-phone-verify"
import { maskLoginPhone } from "@/features/partner-archives/lib/detail-utils"
import { resolvePartnerIdentityDisplay } from "@/features/partner-archives/lib/partner-archive-rules"

interface OutboundBasicInfoSectionProps {
  form: OutboundFormState
  onPatch: (patch: Partial<OutboundFormState>) => void
  onSelectRelatedOrder: (order: RelatedOrderItem) => void
  expanded: boolean
  onToggle: () => void
  onHint?: (message: string) => void
}

function FormItem({
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

export function OutboundBasicInfoSection({
  form,
  onPatch,
  onSelectRelatedOrder,
  expanded,
  onToggle,
  onHint,
}: OutboundBasicInfoSectionProps) {
  const [confirmRelatedOrder, setConfirmRelatedOrder] =
    useState<RelatedOrderItem | null>(null)
  const [showRelatedDialog, setShowRelatedDialog] = useState(false)

  const ownerSelection = useMemo((): PartnerSelectorValue | null => {
    if (!form.ownerPartnerId) return null
    const partner = partnerArchivesMock.find((p) => p.id === form.ownerPartnerId)
    if (!partner) return null
    const role = partner.roles.find((r) => r.roleType === "OWNER")
    if (!role) return null
    return {
      partnerId: partner.id,
      partnerNo: partner.partnerNo,
      name: partner.name,
      idNumber: partner.idNumber,
      idNumberMasked: partner.idNumberMasked,
      subjectType: partner.subjectType,
      roleType: "OWNER",
      roleStatus: role.roleStatus,
      subjectStatus: partner.status,
      contactPhoneVerified: resolveContactPhoneVerified(partner),
    }
  }, [form.ownerPartnerId])

  const isRelatedType =
    form.type === "仓单出库" || form.type === "质押出库" || form.type === "抵押出库"

  // 货主类型变更
  const handleOwnerTypeChange = (newType: OwnerType) => {
    onPatch({
      ownerType: newType,
      ownerName: "",
      ownerIdentifier: "",
      contactPhone: "",
      ownerIdCard: "",
      ownerPartnerId: "",
      relatedNo: "",
      goodsList: [],
    })
  }

  const applyOwnerPartner = (payload: PartnerSelectorValue | null) => {
    if (!payload) {
      onPatch({
        ownerPartnerId: "",
        ownerName: "",
        ownerIdentifier: "",
        contactPhone: "",
        ownerIdCard: "",
        relatedNo: "",
        goodsList: [],
      })
      return
    }
    const partner = partnerArchivesMock.find((p) => p.id === payload.partnerId)
    if (!partner) return
    const expected =
      form.ownerType === "企业" ? ("ENTERPRISE" as const) : ("INDIVIDUAL" as const)
    if (partner.subjectType !== expected) {
      onHint?.(
        form.ownerType === "企业"
          ? "所选档案为企业货主，请先将货主类型切换为企业"
          : "所选档案为个人货主，请先将货主类型切换为个人",
      )
      return
    }
    const identityDisplay = resolvePartnerIdentityDisplay(partner)
    const phoneMasked = maskLoginPhone(partner.contactPhone)
    onPatch({
      ownerPartnerId: partner.id,
      ownerName: partner.name,
      ownerIdentifier:
        partner.subjectType === "INDIVIDUAL" ? phoneMasked : identityDisplay,
      ownerIdCard: identityDisplay,
      contactPhone: partner.contactPhone,
      relatedNo: "",
      goodsList: [],
    })
  }

  // 出库类型变更
  const handleTypeChange = (newType: OutboundTypeName) => {
    onPatch({
      type: newType,
      relatedNo: "",
      goodsList: [],
    })
  }

  // 可选关联单据
  const availableRelatedOrders = RELATED_ORDER_CANDIDATES.filter(
    (item) => item.type === form.type
  )

  const confirmFillRelated = () => {
    if (!confirmRelatedOrder) return
    onPatch({
      relatedNo: confirmRelatedOrder.orderNo,
      warehouseName: confirmRelatedOrder.warehouseName,
      ownerName: confirmRelatedOrder.ownerName,
      ownerIdentifier: confirmRelatedOrder.ownerIdentifier,
    })
    onSelectRelatedOrder(confirmRelatedOrder)
    setShowRelatedDialog(false)
    setConfirmRelatedOrder(null)
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

      {expanded && (
        <CardContent className="space-y-4 pt-5 pb-6 text-xs">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. 出库日期 */}
            <FormItem label="出库日期" required>
              <div className="relative">
                <Calendar className="size-4 absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={form.outboundDate}
                  onChange={(e) => onPatch({ outboundDate: e.target.value })}
                  placeholder="请选择出库日期"
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </FormItem>

            {/* 2. 货主类型 */}
            <FormItem label="货主类型:" required>
              <Select
                value={form.ownerType}
                onValueChange={(val) => handleOwnerTypeChange((val || "个人") as OwnerType)}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="请选择货主类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="个人" className="text-xs">个人</SelectItem>
                  <SelectItem value="企业" className="text-xs">企业</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            <div className="sm:col-span-2 lg:col-span-4">
              <PrototypeAnnotationTarget annotationIds={["outbound-form-partner-owner"]}>
                <PartnerChangeFieldMark
                  markId="outbound-owner"
                  userHint={OUTBOUND_OWNER_PARTNER_CHANGE_USER}
                  specNote={OUTBOUND_OWNER_PARTNER_CHANGE_SPEC}
                >
                  <PartnerArchiveEmbeddedPicker
                    archiveMenu="货主信息"
                    fieldLabel="货主"
                    required
                    enableQuickCreate={false}
                    hideEmbeddedHints
                    value={form.ownerPartnerId || undefined}
                    selection={ownerSelection}
                    onChange={applyOwnerPartner}
                  />
                </PartnerChangeFieldMark>
              </PrototypeAnnotationTarget>
            </div>

            {/* 4 & 5. 个人 vs 企业动态列 */}
            {form.ownerType === "个人" ? (
              <>
                <FormItem label="货主标识:" required>
                  <Input
                    disabled
                    value={form.ownerIdentifier}
                    placeholder="请输入手机号码"
                    className="h-9 text-xs border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed"
                  />
                </FormItem>
                <FormItem label="身份证号:" required>
                  <Input
                    disabled
                    value={form.ownerIdCard}
                    placeholder="请输入货主身份证号"
                    className="h-9 text-xs border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed"
                  />
                </FormItem>
              </>
            ) : (
              <>
                <FormItem label="货主标识:" required>
                  <Input
                    disabled
                    value={form.ownerIdentifier}
                    placeholder="请输入公司统一社会信用编码"
                    className="h-9 text-xs border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed"
                  />
                </FormItem>
                <FormItem label="联系电话:" required>
                  <Input
                    disabled
                    value={form.contactPhone}
                    placeholder="请输入联系电话"
                    className="h-9 text-xs border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed"
                  />
                </FormItem>
              </>
            )}

            <FormItem label="出库类型" required>
              <Select
                value={form.type}
                onValueChange={(val) => handleTypeChange((val || "普通出库") as OutboundTypeName)}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="请选择出库类型" />
                </SelectTrigger>
                <SelectContent>
                  {MANUAL_OUTBOUND_TYPE_OPTIONS.map((name) => (
                    <SelectItem key={name} value={name} className="text-xs">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

            {isRelatedType ? (
              <FormItem label="关联单号" required>
                <Input
                  readOnly
                  value={form.relatedNo || ""}
                  placeholder="点击选择关联单号"
                  onClick={() => setShowRelatedDialog(true)}
                  className="h-9 text-xs cursor-pointer bg-background hover:border-primary/50"
                />
              </FormItem>
            ) : null}
          </div>

          <FormItem label="备注" className="pb-0">
            <div className="relative">
              <Textarea
                value={form.notes}
                maxLength={140}
                rows={3}
                onChange={(e) => onPatch({ notes: e.target.value })}
                placeholder="请输入备注"
                className="text-xs resize-none pb-7 pr-16"
              />
              <span className="pointer-events-none absolute bottom-2 right-2.5 select-none text-[11px] text-muted-foreground">
                {form.notes?.length || 0}/140
              </span>
            </div>
          </FormItem>
        </CardContent>
      )}

      {/* 关联业务单选择弹窗 (O02) */}
      <Dialog open={showRelatedDialog} onOpenChange={setShowRelatedDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-foreground">
              选择关联【{form.type}】业务单据
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              请选择本次出库所依附的业务单号，系统将自动回填质押货物明细及监管仓库：
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-60 overflow-y-auto space-y-2 py-2">
            {availableRelatedOrders.map((order) => (
              <div
                key={order.orderNo}
                onClick={() => setConfirmRelatedOrder(order)}
                className={cn(
                  "p-3 rounded-lg border text-xs cursor-pointer transition-colors",
                  confirmRelatedOrder?.orderNo === order.orderNo
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex justify-between items-center font-medium">
                  <span className="text-foreground">{order.orderNo}</span>
                  <span className="text-emerald-600 font-semibold">{order.status}</span>
                </div>
                <div className="text-muted-foreground text-[11px] mt-1 flex justify-between">
                  <span>货主：{order.ownerName}</span>
                  <span>仓库：{order.warehouseName}</span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowRelatedDialog(false)
                setConfirmRelatedOrder(null)
              }}
              className="text-xs"
            >
              取消
            </Button>
            <Button
              size="sm"
              disabled={!confirmRelatedOrder}
              onClick={confirmFillRelated}
              className="text-xs"
            >
              确认带出货品
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
