import { useEffect, useState, type ReactNode } from "react"
import { LockIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { PARTNER_FORM_LOCKED_FIELD_PC } from "@prototype/shared/partner-archives/partner-form-field-styles"
import {
  partnerCityOptions,
  partnerDistrictOptions,
  partnerProvinceOptions,
} from "@prototype/shared/partner-archives/partner-address-options"
import { PARTNER_FORM_SUBJECT_TYPE_OPTIONS } from "../domain/constants"
import type { PartnerSubject, SubjectType } from "../domain/types"
import { PartnerVerifyDialog } from "./PartnerVerifyDialog"
import {
  type JobQuickCreateScene,
  quickCreatePartnerFromJob,
} from "../lib/quick-create-partner"
import {
  PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER,
  PARTNER_FORM_ADDRESS_USER_HINT_OTHER,
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
  partnerQuickCreateArchiveUserHint,
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
  {
    title: string
    hintUser: string
    hintSpec: string
    roleReadonly: string
    archiveMenu: string
    entryName: string
  }
> = {
  INBOUND_OWNER: {
    title: "快速添加货主",
    hintUser: PARTNER_QUICK_CREATE_INBOUND_USER,
    hintSpec: PARTNER_QUICK_CREATE_INBOUND_SPEC,
    roleReadonly: "货主",
    archiveMenu: "货主信息",
    entryName: "入库快捷建档",
  },
  OUTBOUND_PICKUP_AGENT: {
    title: "快速添加提货经办人",
    hintUser: PARTNER_QUICK_CREATE_OUTBOUND_USER,
    hintSpec: PARTNER_QUICK_CREATE_OUTBOUND_SPEC,
    roleReadonly: "提货经办人",
    archiveMenu: "提货人信息",
    entryName: "出库快捷建档",
  },
  SUPERVISION_FUNDER: {
    title: "快捷添加资金方",
    hintUser: PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_USER,
    hintSpec: PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_SPEC,
    roleReadonly: "资金方",
    archiveMenu: "资金方信息",
    entryName: "监管办理快捷建档",
  },
  SUPERVISION_SERVICE_PROVIDER: {
    title: "快捷添加服务方",
    hintUser: PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_USER,
    hintSpec: PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_SPEC,
    roleReadonly: "服务方",
    archiveMenu: "服务方信息",
    entryName: "监管办理快捷建档",
  },
}

/** 与【用户中心 / 合作方档案】新增页一致的必填标记 */
function RequiredMark() {
  return <span className="mr-1 font-bold text-destructive">*</span>
}

function QuickCreateSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="h-4 w-1 rounded-full bg-primary/80" />
        {title}
      </h3>
      {children}
    </section>
  )
}

export function PartnerQuickCreateSheet({
  open,
  scene,
  onOpenChange,
  onCreated,
  onError,
}: PartnerQuickCreateSheetProps) {
  const copy = SCENE_COPY[scene]
  const showCertAddressSection =
    scene === "INBOUND_OWNER" || scene === "OUTBOUND_PICKUP_AGENT"
  const certAddressUserHint =
    scene === "INBOUND_OWNER"
      ? PARTNER_QUICK_CREATE_CERT_ADDRESS_USER_HINT
      : PARTNER_FORM_ADDRESS_USER_HINT_OTHER
  const certAddressSpecNote =
    scene === "INBOUND_OWNER"
      ? PARTNER_QUICK_CREATE_CERT_ADDRESS_SPEC_NOTE
      : PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER
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

  const subjectTypeLocked = scene === "OUTBOUND_PICKUP_AGENT" || scene === "SUPERVISION_FUNDER" || scene === "SUPERVISION_SERVICE_PROVIDER"

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
        <DialogContent className="max-h-[90vh] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-[680px]">
          <DialogHeader className="gap-1.5 border-b px-6 py-4 pr-12">
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>
              {partnerQuickCreateArchiveUserHint(copy.archiveMenu)}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 space-y-6 overflow-y-auto px-6 py-5">
            <ProductFieldHint>{copy.hintUser}</ProductFieldHint>

            <QuickCreateSection title="基础档案资料">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    <RequiredMark />
                    主体类型
                  </Label>
                  <Select
                    value={subjectTypeLabel}
                    onValueChange={(v) => {
                      setSubjectTypeLabel(v as "个人" | "企业")
                      markDirty()
                    }}
                    disabled={subjectTypeLocked}
                  >
                    <SelectTrigger
                      className={cn("w-full", subjectTypeLocked && PARTNER_FORM_LOCKED_FIELD_PC)}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTNER_FORM_SUBJECT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>合作角色</Label>
                  <div className="flex h-9 items-center gap-2 rounded-md border border-dashed bg-muted/50 px-3 text-sm text-muted-foreground">
                    <LockIcon className="size-3.5 shrink-0" />
                    <span className="text-foreground">{copy.roleReadonly}</span>
                    <span className="text-xs">（由当前入口自动带入）</span>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>
                    <RequiredMark />
                    主体名称
                  </Label>
                  <Input
                    value={name}
                    maxLength={subjectType === "ENTERPRISE" ? 100 : 30}
                    placeholder={
                      subjectType === "ENTERPRISE"
                        ? "请输入营业执照标准全称"
                        : "请输入居民身份证姓名"
                    }
                    onChange={(e) => {
                      setName(e.target.value)
                      markDirty()
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    <RequiredMark />
                    联系手机
                  </Label>
                  <Input
                    maxLength={11}
                    inputMode="numeric"
                    placeholder="请输入11位手机号码"
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value)
                      markDirty()
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    <RequiredMark />
                    {subjectType === "ENTERPRISE" ? "统一社会信用代码" : "身份证号"}
                  </Label>
                  <Input
                    maxLength={18}
                    placeholder={
                      subjectType === "ENTERPRISE"
                        ? "请输入18位统一社会信用代码"
                        : "请输入18位居民身份证号"
                    }
                    value={idNumber}
                    onChange={(e) => {
                      setIdNumber(e.target.value)
                      markDirty()
                    }}
                  />
                </div>

                {subjectType === "ENTERPRISE" ? (
                  <div className="space-y-2 sm:col-span-2">
                    <Label>经办人姓名</Label>
                    <Input
                      maxLength={30}
                      placeholder="请输入企业业务对接人姓名"
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
              </div>
            </QuickCreateSection>

            {showCertAddressSection ? (
              <QuickCreateSection title={PARTNER_QUICK_CREATE_CERT_ADDRESS_LABEL}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                    <div className="space-y-2">
                      <Label>省</Label>
                      <Select
                        value={province}
                        onValueChange={(next) => {
                          if (!next) return
                          markDirty()
                          setProvince(next)
                          const nextCity = partnerCityOptions(next)[0] ?? ""
                          setCity(nextCity)
                          setDistrict(partnerDistrictOptions(next, nextCity)[0] ?? "")
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择省份" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerProvinceOptions().map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>市</Label>
                      <Select
                        value={city}
                        onValueChange={(next) => {
                          if (!next) return
                          markDirty()
                          setCity(next)
                          setDistrict(partnerDistrictOptions(province, next)[0] ?? "")
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择城市" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerCityOptions(province).map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>区</Label>
                      <Select
                        value={district}
                        onValueChange={(next) => {
                          if (!next) return
                          markDirty()
                          setDistrict(next)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择区县" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerDistrictOptions(province, city).map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>详细地址</Label>
                    <Input
                      placeholder="街道、门牌号等（选填）"
                      value={detailAddress}
                      onChange={(e) => {
                        setDetailAddress(e.target.value)
                        markDirty()
                      }}
                    />
                    <ProductFieldHint>{certAddressUserHint}</ProductFieldHint>
                  </div>
                </div>
              </QuickCreateSection>
            ) : null}

            <PrototypeSpecCallout>
              <div className="space-y-1">
                <p>{copy.hintSpec}</p>
                {showCertAddressSection ? <p>{certAddressSpecNote}</p> : null}
                <p>
                  落库创建来源固定为「人工建档」；本弹窗为{copy.entryName}入口（入口差异见
                  【操作审批日志生成与防篡改规则】(PA-R07)，非上线用户文案）。
                </p>
              </div>
            </PrototypeSpecCallout>
          </div>

          <DialogFooter className="mx-0 mb-0 gap-2 px-6 py-3 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              取消
            </Button>
            {scene === "INBOUND_OWNER" ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const err = validate()
                  if (err) {
                    onError?.(err)
                    return
                  }
                  setVerifyOpen(true)
                }}
              >
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
