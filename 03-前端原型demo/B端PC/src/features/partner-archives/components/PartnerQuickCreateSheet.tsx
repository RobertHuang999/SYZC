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

type PartnerQuickCreateSheetProps = {
  open: boolean
  scene: JobQuickCreateScene
  onOpenChange: (open: boolean) => void
  onCreated: (partner: PartnerSubject) => void
  onError?: (message: string) => void
}

const SCENE_COPY: Record<
  JobQuickCreateScene,
  { title: string; hint: string; roleReadonly: string }
> = {
  INBOUND_OWNER: {
    title: "快速添加货主",
    hint: "保存并提交后联系手机为「未验证」；普通入库可直接引用；金融类入库提交前须验证（PA-R04b）。",
    roleReadonly: "货主",
  },
  OUTBOUND_PICKUP_AGENT: {
    title: "快速添加提货经办人",
    hint: "仅通过本入口建档；失焦手输不会自动沉淀档案。角色为提货经办人，不触发个人货主地址唯一校验。",
    roleReadonly: "提货经办人",
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
    setSubjectTypeLabel(scene === "OUTBOUND_PICKUP_AGENT" ? "个人" : "个人")
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
    if (scene === "INBOUND_OWNER" && !detailAddress.trim()) {
      return "个人货主须填写证件地址"
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
            <DialogDescription className="text-xs leading-relaxed">{copy.hint}</DialogDescription>
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
                disabled={scene === "OUTBOUND_PICKUP_AGENT"}
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
                  <Label>
                    <span className="text-destructive">* </span>
                    证件地址
                  </Label>
                  <Input
                    value={detailAddress}
                    onChange={(e) => {
                      setDetailAddress(e.target.value)
                      markDirty()
                    }}
                  />
                </div>
              </>
            ) : null}
            <p className="sm:col-span-2 text-[11px] text-muted-foreground">
              创建来源：{scene === "INBOUND_OWNER" ? "入库快捷建档" : "出库快捷建档"} · 创建人：当前用户
            </p>
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
