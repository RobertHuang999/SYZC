import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PartnerSubject, SubjectType } from "../domain/types"
import { PartnerVerifyDialog } from "./PartnerVerifyDialog"
import {
  type JobQuickCreateScene,
  quickCreatePartnerFromJob,
} from "../lib/quick-create-partner"
import {
  PARTNER_QUICK_CREATE_CERT_ADDRESS_LABEL,
  PARTNER_QUICK_CREATE_CERT_ADDRESS_SPEC_NOTE,
  PARTNER_QUICK_CREATE_CERT_ADDRESS_USER_HINT,
  PARTNER_QUICK_CREATE_INBOUND_SPEC,
  PARTNER_QUICK_CREATE_INBOUND_USER,
  PARTNER_QUICK_CREATE_OUTBOUND_SPEC,
  PARTNER_QUICK_CREATE_OUTBOUND_USER,
  PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_SPEC,
  PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_USER,
  PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_SPEC,
  PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_USER,
  PARTNER_OWNER_ENTERPRISE_AGENT_USER_HINT,
} from "../lib/partner-archive-ui-labels"

type PartnerQuickCreateSheetProps = {
  open: boolean
  scene: JobQuickCreateScene
  onOpenChange: (open: boolean) => void
  onCreated: (partner: PartnerSubject) => void
  onError?: (message: string) => void
}

const SCENE_COPY: Record<
  JobQuickCreateScene,
  { title: string; hintUser: string; hintSpec: string; roleReadonly: string }
> = {
  INBOUND_OWNER: {
    title: "快速添加货主",
    hintUser: PARTNER_QUICK_CREATE_INBOUND_USER,
    hintSpec: PARTNER_QUICK_CREATE_INBOUND_SPEC,
    roleReadonly: "货主",
  },
  OUTBOUND_PICKUP_AGENT: {
    title: "快速添加提货经办人",
    hintUser: PARTNER_QUICK_CREATE_OUTBOUND_USER,
    hintSpec: PARTNER_QUICK_CREATE_OUTBOUND_SPEC,
    roleReadonly: "提货经办人",
  },
  SUPERVISION_FUNDER: {
    title: "快捷添加资金方",
    hintUser: PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_USER,
    hintSpec: PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_SPEC,
    roleReadonly: "资金方",
  },
  SUPERVISION_SERVICE_PROVIDER: {
    title: "快捷添加服务方",
    hintUser: PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_USER,
    hintSpec: PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_SPEC,
    roleReadonly: "服务方",
  },
}

export function PartnerQuickCreateSheet({
  open,
  scene,
  onOpenChange,
  onCreated,
  onError,
}: PartnerQuickCreateSheetProps) {
  const copy = SCENE_COPY[scene]
  const [subjectTypeLabel, setSubjectTypeLabel] = useState<"个人" | "企业">("个人")
  const subjectType: SubjectType = subjectTypeLabel === "企业" ? "ENTERPRISE" : "INDIVIDUAL"
  const [name, setName] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [agentName, setAgentName] = useState("")
  const [province, setProvince] = useState("江苏省")
  const [city, setCity] = useState("无锡市")
  const [district, setDistrict] = useState("滨湖区")
  const [detailAddress, setDetailAddress] = useState("")
  const [dirty, setDirty] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const enterpriseOnly =
      scene === "SUPERVISION_FUNDER" || scene === "SUPERVISION_SERVICE_PROVIDER"
    setSubjectTypeLabel(enterpriseOnly ? "企业" : scene === "OUTBOUND_PICKUP_AGENT" ? "个人" : "个人")
    setName("")
    setIdNumber("")
    setContactPhone("")
    setAgentName("")
    setProvince("江苏省")
    setCity("无锡市")
    setDistrict("滨湖区")
    setDetailAddress("")
    setDirty(false)
  }, [open, scene])

  const markDirty = () => setDirty(true)

  const validate = (): string | null => {
    if (!name.trim()) return "请填写主体名称"
    if (!contactPhone.trim() || contactPhone.trim().length < 11) {
      return "请填写 11 位联系手机"
    }
    if (subjectType === "INDIVIDUAL") {
      if (idNumber.trim().length < 18) return "请填写 18 位身份证号"
    } else if (idNumber.trim().length < 18) {
      return "请填写 18 位统一社会信用代码"
    }
    return null
  }

  const persist = (verifiedOnCreate: boolean) => {
    const err = validate()
    if (err) {
      onError?.(err)
      return
    }
    const result = quickCreatePartnerFromJob({
      scene,
      subjectType,
      name,
      idNumber,
      contactPhone,
      agentName,
      province,
      city,
      district,
      detailAddress,
      verifiedOnCreate,
      createdBy: "当前用户",
    })
    if (!result.ok) {
      onError?.(result.message)
      return
    }
    onCreated(result.partner)
    onOpenChange(false)
  }

  const handleClose = () => {
    if (dirty) {
      const ok = window.confirm("有未保存内容，确定关闭？")
      if (!ok) return
    }
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
        <DialogContent className="max-h-[90vh] max-w-[640px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.hintUser}</DialogDescription>
            <PrototypeSpecCallout>{copy.hintSpec}</PrototypeSpecCallout>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="space-y-1.5">
              <Label>主体类型</Label>
              <Select
                value={subjectTypeLabel}
                onValueChange={(v) => {
                  setSubjectTypeLabel(v as "个人" | "企业")
                  markDirty()
                }}
                disabled={
                  scene === "OUTBOUND_PICKUP_AGENT" ||
                  scene === "SUPERVISION_FUNDER" ||
                  scene === "SUPERVISION_SERVICE_PROVIDER"
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="个人">个人</SelectItem>
                  <SelectItem value="企业">企业</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>挂接角色</Label>
              <Input value={copy.roleReadonly} disabled className="bg-muted/60" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>
                <span className="text-destructive">* </span>
                {subjectType === "ENTERPRISE" ? "企业名称" : "姓名"}
              </Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  markDirty()
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                <span className="text-destructive">* </span>
                联系手机
              </Label>
              <Input
                maxLength={11}
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value)
                  markDirty()
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                <span className="text-destructive">* </span>
                {subjectType === "ENTERPRISE" ? "统一社会信用代码" : "身份证号"}
              </Label>
              <Input
                maxLength={18}
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value)
                  markDirty()
                }}
              />
            </div>
            {subjectType === "ENTERPRISE" ? (
              <div className="space-y-1.5 sm:col-span-2">
                <Label>经办人姓名</Label>
                <Input
                  value={agentName}
                  onChange={(e) => {
                    setAgentName(e.target.value)
                    markDirty()
                  }}
                />
                {scene === "INBOUND_OWNER" ? (
                  <ProductFieldHint>{PARTNER_OWNER_ENTERPRISE_AGENT_USER_HINT}</ProductFieldHint>
                ) : null}
              </div>
            ) : null}
            {scene === "INBOUND_OWNER" ? (
              <>
                <div className="space-y-1.5">
                  <Label>省</Label>
                  <Input value={province} onChange={(e) => { setProvince(e.target.value); markDirty() }} />
                </div>
                <div className="space-y-1.5">
                  <Label>市</Label>
                  <Input value={city} onChange={(e) => { setCity(e.target.value); markDirty() }} />
                </div>
                <div className="space-y-1.5">
                  <Label>区</Label>
                  <Input value={district} onChange={(e) => { setDistrict(e.target.value); markDirty() }} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{PARTNER_QUICK_CREATE_CERT_ADDRESS_LABEL}</Label>
                  <Input
                    value={detailAddress}
                    onChange={(e) => {
                      setDetailAddress(e.target.value)
                      markDirty()
                    }}
                    placeholder="街道、门牌号等（选填）"
                  />
                  <ProductFieldHint>{PARTNER_QUICK_CREATE_CERT_ADDRESS_USER_HINT}</ProductFieldHint>
                  <PrototypeSpecCallout>{PARTNER_QUICK_CREATE_CERT_ADDRESS_SPEC_NOTE}</PrototypeSpecCallout>
                </div>
              </>
            ) : null}
            <PrototypeSpecCallout className="sm:col-span-2">
              创建来源：
              {scene === "INBOUND_OWNER"
                ? "入库快捷建档"
                : scene === "OUTBOUND_PICKUP_AGENT"
                  ? "出库快捷建档"
                  : "监管办理快捷建档"}{" "}
              · 创建人：当前用户（审计字段，非用户提示）
            </PrototypeSpecCallout>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              取消
            </Button>
            {scene === "INBOUND_OWNER" ? (
              <Button type="button" variant="secondary" onClick={() => setVerifyOpen(true)}>
                保存并验证
              </Button>
            ) : null}
            <Button type="button" onClick={() => persist(false)}>
              保存并提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PartnerVerifyDialog
        open={verifyOpen}
        mode="VERIFY_CONTACT"
        verifyContext="CREATE_ARCHIVE"
        subjectType={subjectType}
        name={name}
        idNumber={idNumber}
        contactPhone={contactPhone}
        fullAddress={`${province}${city}${district}${detailAddress}`}
        roles={["OWNER"]}
        onOpenChange={setVerifyOpen}
        onConfirm={() => {
          setVerifyOpen(false)
          persist(true)
        }}
      />
    </>
  )
}
