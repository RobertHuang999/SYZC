import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import {
  FORM_TRANSFER_TYPE_OPTIONS,
} from "../domain/constants"
import type { TransferFormState, OwnerType } from "../domain/form-types"
import type { TransferType } from "../domain/types"
import { ownersMock, relatedOrdersMock } from "../mock/transfer-form.mock"

interface Props {
  form: TransferFormState
  onChange: (updated: Partial<TransferFormState>) => void
}

export function TransferBasicInfoSection({ form, onChange }: Props) {
  const handleOwnerTypeChange = (type: OwnerType) => {
    onChange({
      ownerType: type,
      ownerId: "",
      ownerName: "",
      ownerIdentity: "",
      idCardNo: "",
    })
  }

  const handleOwnerSelect = (ownerId: string) => {
    const owner = ownersMock.find((o) => o.id === ownerId)
    if (owner) {
      onChange({
        ownerId: owner.id,
        ownerName: owner.name,
        ownerIdentity: owner.identity,
        idCardNo: owner.idCardNo || "",
      })
    }
  }

  const handleTransferTypeChange = (type: TransferType) => {
    // 切换移库类型时，清空关联单号与明细
    onChange({
      transferType: type,
      relatedId: "",
      normalGroups: [],
      pledgeItems: [],
    })
  }

  const handleRelatedOrderSelect = (orderNo: string) => {
    const order = relatedOrdersMock.find((o) => o.orderNo === orderNo)
    if (order) {
      onChange({
        relatedId: order.orderNo,
        pledgeItems: order.items.map((item) => ({ ...item })),
      })
    }
  }

  const filteredOwners = ownersMock.filter((o) => o.type === form.ownerType)

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="py-3 px-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="text-base font-semibold text-foreground flex items-center justify-between">
          <span>基础信息</span>
          <span className="text-xs font-normal text-muted-foreground">
            标 <span className="text-red-500">*</span> 为必填项
          </span>
        </h3>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* 字段栅格布局：对齐规范 md:grid-cols-2 lg:grid-cols-3 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. 移库日期 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <span className="text-red-500">*</span> 移库日期
            </label>
            <Input
              type="datetime-local"
              value={form.transferTime ? form.transferTime.replace(" ", "T") : ""}
              onChange={(e) =>
                onChange({ transferTime: e.target.value.replace("T", " ") })
              }
              className="h-[34px] text-sm"
            />
            <ProductFieldHint>移库业务实际作业时间，不可选择未来时间</ProductFieldHint>
          </div>

          {/* 2. 货主类型 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <span className="text-red-500">*</span> 货主类型
            </label>
            <Select
              value={form.ownerType}
              onValueChange={(val) => handleOwnerTypeChange(val as OwnerType)}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENTERPRISE">企业</SelectItem>
                <SelectItem value="PERSONAL">个人</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. 货主名称 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <span className="text-red-500">*</span> 货主名称
            </label>
            <Select
              value={form.ownerId}
              onValueChange={(val) => val && handleOwnerSelect(val)}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue placeholder="请选择或输入货主名称" />
              </SelectTrigger>
              <SelectContent>
                {filteredOwners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. 货主标识 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              货主标识 (统一社会信用代码/手机号)
            </label>
            <Input
              value={form.ownerIdentity || "--"}
              readOnly
              className="h-[34px] text-sm bg-slate-100 dark:bg-slate-800 text-muted-foreground"
            />
          </div>

          {/* 5. 身份证号 (仅个人货主) */}
          {form.ownerType === "PERSONAL" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">身份证号</label>
              <Input
                value={form.idCardNo || "--"}
                readOnly
                className="h-[34px] text-sm bg-slate-100 dark:bg-slate-800 text-muted-foreground"
              />
            </div>
          )}

          {/* 6. 移库类型 (遵循 R02 仓单置灰) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <span className="text-red-500">*</span> 移库类型
            </label>
            <Select
              value={form.transferType}
              onValueChange={(val) => handleTransferTypeChange(val as TransferType)}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORM_TRANSFER_TYPE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className={opt.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 7. 关联单号 (质押/抵押移库条件必选 R04) */}
          {(form.transferType === "PLEDGE" || form.transferType === "MORTGAGE") && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1">
                <span className="text-red-500">*</span> 关联单号
              </label>
              <Select
                value={form.relatedId}
                onValueChange={(val) => val && handleRelatedOrderSelect(val)}
              >
                <SelectTrigger className="h-[34px] text-sm border-amber-500/50">
                  <SelectValue placeholder="请选择关联监管业务单号" />
                </SelectTrigger>
                <SelectContent>
                  {relatedOrdersMock
                    .filter((ro) => ro.orderType === form.transferType)
                    .map((ro) => (
                      <SelectItem key={ro.orderNo} value={ro.orderNo}>
                        {ro.orderNo} ({ro.bankName} - {ro.ownerName})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* 规格对照说明 */}
        <PrototypeSpecCallout>
          【移库类型来源与仓单移库置灰】(R02)：仓单移库已签发法定数字仓单，禁止脱离仓单管理发起调拨，选项置灰锁定；抵质押移库严格绑定质权/抵押单号
          (R04)。
        </PrototypeSpecCallout>

        {/* 8. 备注 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-foreground">备注信息</label>
            <span className="text-xs text-muted-foreground">
              {form.remark.length}/140
            </span>
          </div>
          <Textarea
            value={form.remark}
            onChange={(e) => onChange({ remark: e.target.value.slice(0, 140) })}
            placeholder="请输入移库原因、备忘说明（不超过 140 字）"
            className="text-sm h-20 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}

