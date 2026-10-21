import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { StoreroomNode } from "../domain/types"
import type { StoreroomInboundAuditYesNo } from "../lib/storeroom-inbound-audit"

type StoreroomFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  initial?: StoreroomNode
  /** 租户「出入库是否需要审核」总开关 */
  inOutRequiresAudit: "是" | "否"
  initialInboundAudit: StoreroomInboundAuditYesNo
  defaultInboundAuditForCreate: StoreroomInboundAuditYesNo
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: {
    name: string
    remark: string
    inboundAudit: StoreroomInboundAuditYesNo
  }) => void
}

export function StoreroomFormDialog({
  open,
  mode,
  initial,
  inOutRequiresAudit,
  initialInboundAudit,
  defaultInboundAuditForCreate,
  onOpenChange,
  onSubmit,
}: StoreroomFormDialogProps) {
  const [name, setName] = useState("")
  const [remark, setRemark] = useState("")
  const [inboundAudit, setInboundAudit] =
    useState<StoreroomInboundAuditYesNo>("是")

  const auditEditable = inOutRequiresAudit === "是"

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
    setRemark(initial?.remark ?? "")
    setInboundAudit(
      mode === "edit"
        ? initialInboundAudit
        : defaultInboundAuditForCreate
    )
  }, [
    open,
    initial,
    mode,
    initialInboundAudit,
    defaultInboundAuditForCreate,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "添加库房" : "编辑库房"}</DialogTitle>
        </DialogHeader>
        <PrototypeAnnotationTarget annotationIds={["wh-63-storeroom-form"]}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>
                库房名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="请输入库房名称"
              />
            </div>

            <div className="space-y-2">
              <Label>
                出入库是否审核 <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-6">
                {(["是", "否"] as const).map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="storeroom-inbound-audit"
                      className="size-4 accent-primary"
                      checked={inboundAudit === option}
                      disabled={!auditEditable}
                      onChange={() => setInboundAudit(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {auditEditable ? (
                <>
                  <ProductFieldHint>
                    选「是」表示该库房普通货物出入库需走审批；保存后与【基础配置】受控库房清单自动同步。
                  </ProductFieldHint>
                  <PrototypeSpecCallout>
                    【库房出入库审核双端同步与以最后修改为准规则】(R03)：本表单与基础配置穿梭框共享受控数据。
                  </PrototypeSpecCallout>
                </>
              ) : (
                <ProductFieldHint>
                  租户已关闭出入库审核，本项固定为「否」；请先在基础配置开启总开关。
                </ProductFieldHint>
              )}
            </div>

            <div className="space-y-2">
              <Label>备注信息</Label>
              <Textarea
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                placeholder="请输入备注信息"
                maxLength={500}
                rows={3}
              />
            </div>
          </div>
        </PrototypeAnnotationTarget>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={() => {
              if (!name.trim()) return
              onSubmit({
                name: name.trim(),
                remark: remark.trim(),
                inboundAudit: auditEditable ? inboundAudit : "否",
              })
              onOpenChange(false)
            }}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
