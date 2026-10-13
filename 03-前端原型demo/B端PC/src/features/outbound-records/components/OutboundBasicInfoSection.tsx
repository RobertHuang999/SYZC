import { useState, type ReactNode } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
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
import {
  OWNER_CANDIDATES,
  RELATED_ORDER_CANDIDATES,
  type RelatedOrderItem,
} from "../mock/outbound-form.mock"

interface OutboundBasicInfoSectionProps {
  form: OutboundFormState
  onPatch: (patch: Partial<OutboundFormState>) => void
  onSelectRelatedOrder: (order: RelatedOrderItem) => void
  expanded: boolean
  onToggle: () => void
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
      <Label className="flex items-center text-xs font-medium text-foreground">
        {required && <span className="mr-0.5 text-destructive">*</span>}
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
}: OutboundBasicInfoSectionProps) {
  const [confirmRelatedOrder, setConfirmRelatedOrder] =
    useState<RelatedOrderItem | null>(null)

  const isRelatedType =
    form.type === "仓单出库" || form.type === "质押出库" || form.type === "抵押出库"

  // 根据当前货主与出库类型过滤可用的关联单据
  const availableRelatedOrders = RELATED_ORDER_CANDIDATES.filter(
    (item) =>
      item.type === form.type &&
      (!form.ownerName || item.ownerName === form.ownerName)
  )

  const handleOwnerTypeChange = (newType: OwnerType) => {
    onPatch({
      ownerType: newType,
      ownerName: "",
      ownerIdentifier: "",
      contactPhone: "",
      ownerIdCard: "",
      relatedNo: "",
      goodsList: [],
    })
  }

  const handleOwnerSelect = (ownerId: string) => {
    const candidate = OWNER_CANDIDATES.find((c) => c.id === ownerId)
    if (!candidate) return

    onPatch({
      ownerName: candidate.name,
      ownerIdentifier: candidate.identifier,
      contactPhone: candidate.phone,
      ownerIdCard: candidate.idCard || "",
      relatedNo: "",
      goodsList: [],
    })
  }

  const handleTypeChange = (newType: OutboundTypeName) => {
    onPatch({
      type: newType,
      relatedNo: "",
      goodsList: [],
    })
  }

  const handleRelatedNoChange = (selectedNo: string | null) => {
    if (!selectedNo) return
    const found = availableRelatedOrders.find((r) => r.orderNo === selectedNo)
    if (found) {
      setConfirmRelatedOrder(found)
    }
  }

  const confirmFillRelated = () => {
    if (!confirmRelatedOrder) return
    onPatch({
      relatedNo: confirmRelatedOrder.orderNo,
      warehouseName: confirmRelatedOrder.warehouseName,
      ownerName: confirmRelatedOrder.ownerName,
      ownerIdentifier: confirmRelatedOrder.ownerIdentifier,
    })
    onSelectRelatedOrder(confirmRelatedOrder)
    setConfirmRelatedOrder(null)
  }

  return (
    <Card className="shadow-xs">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
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
        <CardContent className="space-y-4 pt-5 pb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. 出库日期 */}
            <Field label="出库日期" required>
              <Input
                type="datetime-local"
                max={new Date().toISOString().slice(0, 16)}
                value={
                  form.outboundDate
                    ? form.outboundDate.replace(" ", "T").slice(0, 16)
                    : ""
                }
                onChange={(event) => {
                  const val = event.target.value.replace("T", " ")
                  onPatch({ outboundDate: val ? `${val}:00` : "" })
                }}
              />
            </Field>

            {/* 2. 货主类型 */}
            <Field label="货主类型" required>
              <Select
                value={form.ownerType}
                onValueChange={(val) => handleOwnerTypeChange(val as OwnerType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="企业">企业</SelectItem>
                  <SelectItem value="个人">个人</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* 3. 货主名称 */}
            <Field label="货主名称" required>
              <Select
                value={
                  OWNER_CANDIDATES.find(
                    (c) =>
                      c.name === form.ownerName && c.type === form.ownerType
                  )?.id || ""
                }
                onValueChange={(val) => handleOwnerSelect(val || "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="请选择货主主体" />
                </SelectTrigger>
                <SelectContent>
                  {OWNER_CANDIDATES.filter((c) => c.type === form.ownerType).map(
                    (c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </Field>

            {/* 4. 出库类型 */}
            <Field label="出库类型" required>
              <Select
                value={form.type}
                onValueChange={(val) =>
                  handleTypeChange(val as OutboundTypeName)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MANUAL_OUTBOUND_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* 5. 货主标识 */}
            <Field
              label={
                form.ownerType === "企业"
                  ? "统一社会信用代码"
                  : "身份证号 / 手机号"
              }
              required
            >
              <Input
                readOnly
                placeholder="选择货主后自动反显"
                value={form.ownerIdentifier}
                className="bg-muted/40 font-mono"
              />
            </Field>

            {/* 6. 联系电话 */}
            <Field label="联系电话">
              <Input
                readOnly
                placeholder="自动反显"
                value={form.contactPhone}
                className="bg-muted/40 font-mono"
              />
            </Field>

            {/* 7. 仓库名称 */}
            <Field label="监管仓库" required>
              <Input
                readOnly={isRelatedType}
                placeholder={
                  isRelatedType ? "关联单据后自动带出" : "请输入监管仓库名称"
                }
                value={form.warehouseName}
                onChange={(e) => onPatch({ warehouseName: e.target.value })}
                className={isRelatedType ? "bg-muted/40" : ""}
              />
            </Field>

            {/* 8. 关联业务单号（当类型为 仓单/质押/抵押 时必填） */}
            {isRelatedType && (
              <Field
                label={`关联${
                  form.type === "仓单出库"
                    ? "仓单单号"
                    : form.type === "质押出库"
                    ? "质押单号"
                    : "抵押单号"
                }`}
                required
              >
                <Select
                  value={form.relatedNo}
                  onValueChange={handleRelatedNoChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择关联单号" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRelatedOrders.map((r) => (
                      <SelectItem key={r.orderNo} value={r.orderNo}>
                        {r.orderNo} ({r.items.length}种商品 · {r.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {/* 9. 备注 */}
            <Field label="出库备注" className="sm:col-span-2 lg:col-span-4">
              <Textarea
                placeholder="请输入出库备注说明..."
                value={form.notes}
                onChange={(e) => onPatch({ notes: e.target.value })}
                rows={2}
              />
            </Field>
          </div>
        </CardContent>
      )}

      {/* 关联单据确认填充货物弹窗 (O02) */}
      <Dialog
        open={confirmRelatedOrder !== null}
        onOpenChange={(open) => !open && setConfirmRelatedOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>填充关联货物信息</DialogTitle>
            <DialogDescription>
              检测到已选择关联单据【{confirmRelatedOrder?.orderNo}
              】，是否自动填充该单据下的可出库货物明细，便于快速制单？
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-muted/40 p-3 text-xs space-y-1">
            <p>• 货主：{confirmRelatedOrder?.ownerName}</p>
            <p>• 仓库：{confirmRelatedOrder?.warehouseName}</p>
            <p>• 货品品类数：{confirmRelatedOrder?.items.length} 种</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (confirmRelatedOrder) {
                  onPatch({ relatedNo: confirmRelatedOrder.orderNo })
                }
                setConfirmRelatedOrder(null)
              }}
            >
              仅关联单号
            </Button>
            <Button onClick={confirmFillRelated}>确认自动填充货物</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
