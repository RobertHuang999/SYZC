import { useEffect, useState } from "react"
import { ChevronRight, LockIcon, XIcon } from "lucide-react"
import type { PartnerSubject, SubjectType } from "@prototype/B端PC/src/features/partner-archives/domain/types"
import { PARTNER_FORM_SUBJECT_TYPE_OPTIONS } from "@prototype/B端PC/src/features/partner-archives/domain/constants"
import {
  type JobQuickCreateScene,
  quickCreatePartnerFromJob,
} from "@prototype/B端PC/src/features/partner-archives/lib/quick-create-partner"
import {
  PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER,
  PARTNER_FORM_ADDRESS_USER_HINT_OTHER,
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
  partnerQuickCreateArchiveUserHint,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { PARTNER_FORM_LOCKED_BUTTON_H5 } from "@prototype/shared/partner-archives/partner-form-field-styles"
import {
  partnerCityOptions,
  partnerDistrictOptions,
  partnerProvinceOptions,
} from "@prototype/shared/partner-archives/partner-address-options"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import { MobileDownSelectSheet } from "@/features/inbound-records/components/MobileDownSelectSheet"
import { PartnerVerifySheet } from "./PartnerVerifySheet"

type Props = {
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
    subjectTypeLocked: "个人" | "企业" | null
  }
> = {
  INBOUND_OWNER: {
    title: "快速添加货主",
    hintUser: PARTNER_QUICK_CREATE_INBOUND_USER,
    hintSpec: PARTNER_QUICK_CREATE_INBOUND_SPEC,
    roleReadonly: "货主",
    archiveMenu: "货主信息",
    entryName: "入库快捷建档",
    subjectTypeLocked: null,
  },
  OUTBOUND_PICKUP_AGENT: {
    title: "快速添加提货经办人",
    hintUser: PARTNER_QUICK_CREATE_OUTBOUND_USER,
    hintSpec: PARTNER_QUICK_CREATE_OUTBOUND_SPEC,
    roleReadonly: "提货经办人",
    archiveMenu: "提货人信息",
    entryName: "出库快捷建档",
    subjectTypeLocked: "个人",
  },
  SUPERVISION_FUNDER: {
    title: "快捷添加资金方",
    hintUser: PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_USER,
    hintSpec: PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_SPEC,
    roleReadonly: "资金方",
    archiveMenu: "资金方信息",
    entryName: "监管办理快捷建档",
    subjectTypeLocked: "企业",
  },
  SUPERVISION_SERVICE_PROVIDER: {
    title: "快捷添加服务方",
    hintUser: PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_USER,
    hintSpec: PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_SPEC,
    roleReadonly: "服务方",
    archiveMenu: "服务方信息",
    entryName: "监管办理快捷建档",
    subjectTypeLocked: "企业",
  },
}

type PickerKind = "type" | "province" | "city" | "district" | null

const FIELD_INPUT_CLASS =
  "w-full min-w-0 bg-transparent text-right text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"

export function PartnerQuickCreateSheetMobile({
  open,
  scene,
  onOpenChange,
  onCreated,
  onError,
}: Props) {
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
  const [picker, setPicker] = useState<PickerKind>(null)
  const [verifyOpen, setVerifyOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setSubjectTypeLabel(copy.subjectTypeLocked ?? "个人")
    setName("")
    setIdNumber("")
    setContactPhone("")
    setAgentName("")
    setProvince("江苏省")
    setCity("无锡市")
    setDistrict("滨湖区")
    setDetailAddress("")
    setPicker(null)
    setVerifyOpen(false)
  }, [open, scene, copy.subjectTypeLocked])

  if (!open) return null

  const showAddress =
    scene === "INBOUND_OWNER" || scene === "OUTBOUND_PICKUP_AGENT"
  const certAddressUserHint =
    scene === "INBOUND_OWNER"
      ? PARTNER_QUICK_CREATE_CERT_ADDRESS_USER_HINT
      : PARTNER_FORM_ADDRESS_USER_HINT_OTHER
  const certAddressSpecNote =
    scene === "INBOUND_OWNER"
      ? PARTNER_QUICK_CREATE_CERT_ADDRESS_SPEC_NOTE
      : PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER
  const roleReadonly = copy.roleReadonly

  const validate = (): string | null => {
    if (!name.trim()) return "请填写主体名称"
    if (!contactPhone.trim() || contactPhone.trim().length < 11) {
      return "请填写 11 位联系手机"
    }
    if (idNumber.trim().length < 18) {
      return subjectType === "ENTERPRISE"
        ? "请填写 18 位统一社会信用代码"
        : "请填写 18 位身份证号"
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

  const pickerOptions =
    picker === "type"
      ? PARTNER_FORM_SUBJECT_TYPE_OPTIONS.map((label) => ({ id: label, label }))
      : picker === "province"
        ? partnerProvinceOptions().map((label) => ({ id: label, label }))
        : picker === "city"
          ? partnerCityOptions(province).map((label) => ({ id: label, label }))
          : picker === "district"
            ? partnerDistrictOptions(province, city).map((label) => ({ id: label, label }))
            : []

  const pickerSelected =
    picker === "type"
      ? subjectTypeLabel
      : picker === "province"
        ? province
        : picker === "city"
          ? city
          : picker === "district"
            ? district
            : undefined

  const pickerTitle =
    picker === "type"
      ? "选择主体类型"
      : picker === "province"
        ? "选择省份"
        : picker === "city"
          ? "选择城市"
          : "选择区/县"

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="关闭"
        className="absolute inset-0 bg-black/45"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#232D39]/10 px-4 py-3.5">
          <h2 className="text-base font-bold text-[#232D39]">{copy.title}</h2>
          <button
            type="button"
            aria-label="关闭"
            className="-mr-1 rounded-full p-1 text-[#232D39]/40"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3">
          <p className="text-xs leading-relaxed text-[#232D39]/55">
            {partnerQuickCreateArchiveUserHint(copy.archiveMenu)}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#232D39]/55">{copy.hintUser}</p>

          <section className="mt-4">
            <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-[#232D39]">
              <span className="h-3.5 w-1 rounded-full bg-blue-600" />
              基础档案资料
            </h3>
            <NativeFormRow label="主体类型" required>
              <button
                type="button"
                className={
                  copy.subjectTypeLocked
                    ? `w-full text-right text-sm ${PARTNER_FORM_LOCKED_BUTTON_H5}`
                    : "flex w-full items-center justify-end gap-1 text-right text-sm text-[#232D39]"
                }
                onClick={() => setPicker("type")}
                disabled={Boolean(copy.subjectTypeLocked)}
              >
                {subjectTypeLabel}
                {copy.subjectTypeLocked ? null : (
                  <ChevronRight
                    className="size-4 shrink-0 text-[#2A3339]/30"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            </NativeFormRow>
            <NativeFormRow label="合作角色">
              <span className="flex items-center gap-1.5 text-sm text-[#232D39]">
                <LockIcon className="size-3.5 shrink-0 text-[#232D39]/40" />
                {roleReadonly}
                <span className="text-xs text-[#232D39]/45">自动带入</span>
              </span>
            </NativeFormRow>
            <NativeFormRow label="主体名称" required>
              <input
                className={FIELD_INPUT_CLASS}
                maxLength={subjectType === "ENTERPRISE" ? 100 : 30}
                placeholder={
                  subjectType === "ENTERPRISE"
                    ? "请输入营业执照标准全称"
                    : "请输入居民身份证姓名"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </NativeFormRow>
            <NativeFormRow
              label={subjectType === "ENTERPRISE" ? "统一社会信用代码" : "身份证号"}
              required
            >
              <input
                className={FIELD_INPUT_CLASS}
                placeholder={
                  subjectType === "ENTERPRISE"
                    ? "请输入18位统一社会信用代码"
                    : "请输入18位居民身份证号"
                }
                maxLength={18}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </NativeFormRow>
            <NativeFormRow label="联系手机" required>
              <input
                className={FIELD_INPUT_CLASS}
                inputMode="numeric"
                placeholder="请输入11位手机号码"
                maxLength={11}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ""))}
              />
            </NativeFormRow>
            {subjectType === "ENTERPRISE" ? (
              <NativeFormRow label="经办人姓名">
                <input
                  className={FIELD_INPUT_CLASS}
                  placeholder="请输入企业业务对接人姓名"
                  maxLength={30}
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </NativeFormRow>
            ) : null}
          </section>

          {showAddress ? (
            <section className="mt-4">
              <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-[#232D39]">
                <span className="h-3.5 w-1 rounded-full bg-blue-600" />
                证件登记地址
              </h3>
              <NativeFormRow label="省">
                <button
                  type="button"
                  className="flex w-full items-center justify-end gap-1 text-right text-sm text-[#232D39]"
                  onClick={() => setPicker("province")}
                >
                  {province}
                  <ChevronRight
                    className="size-4 shrink-0 text-[#2A3339]/30"
                    strokeWidth={2.5}
                  />
                </button>
              </NativeFormRow>
              <NativeFormRow label="市">
                <button
                  type="button"
                  className="flex w-full items-center justify-end gap-1 text-right text-sm text-[#232D39]"
                  onClick={() => setPicker("city")}
                >
                  {city}
                  <ChevronRight
                    className="size-4 shrink-0 text-[#2A3339]/30"
                    strokeWidth={2.5}
                  />
                </button>
              </NativeFormRow>
              <NativeFormRow label="区/县">
                <button
                  type="button"
                  className="flex w-full items-center justify-end gap-1 text-right text-sm text-[#232D39]"
                  onClick={() => setPicker("district")}
                >
                  {district}
                  <ChevronRight
                    className="size-4 shrink-0 text-[#2A3339]/30"
                    strokeWidth={2.5}
                  />
                </button>
              </NativeFormRow>
              <NativeFormRow label="详细地址">
                <input
                  className={FIELD_INPUT_CLASS}
                  placeholder="街道、门牌号（选填）"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />
              </NativeFormRow>
              <ProductFieldHint className="mt-1.5 text-[#232D39]/55">
                {certAddressUserHint}
              </ProductFieldHint>
            </section>
          ) : null}

          <PrototypeSpecCallout className="mt-4">
            <div className="space-y-1">
              <p>{copy.hintSpec}</p>
              {showAddress ? <p>{certAddressSpecNote}</p> : null}
              <p>落库创建来源固定为「人工建档」；本弹窗为{copy.entryName}入口。</p>
            </div>
          </PrototypeSpecCallout>
        </div>

        <div className="flex gap-2 border-t border-[#232D39]/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex-1 rounded-lg border border-[#232D39]/15 py-2.5 text-sm text-[#232D39]"
            onClick={() => onOpenChange(false)}
          >
            取消
          </button>
          {scene === "INBOUND_OWNER" ? (
            <button
              type="button"
              className="flex-1 rounded-lg border border-blue-200 bg-blue-50 py-2.5 text-sm font-medium text-blue-700"
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
            </button>
          ) : null}
          <button
            type="button"
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white"
            onClick={() => persist(false)}
          >
            保存并提交
          </button>
        </div>
      </div>

      <MobileDownSelectSheet
        open={picker !== null}
        title={pickerTitle}
        options={pickerOptions}
        selectedId={pickerSelected}
        onClose={() => setPicker(null)}
        onSelect={(option) => {
          if (picker === "type") {
            setSubjectTypeLabel(option.label as "个人" | "企业")
          } else if (picker === "province") {
            setProvince(option.label)
            const nextCity = partnerCityOptions(option.label)[0] ?? ""
            setCity(nextCity)
            setDistrict(partnerDistrictOptions(option.label, nextCity)[0] ?? "")
          } else if (picker === "city") {
            setCity(option.label)
            setDistrict(partnerDistrictOptions(province, option.label)[0] ?? "")
          } else if (picker === "district") {
            setDistrict(option.label)
          }
        }}
      />

      <PartnerVerifySheet
        open={verifyOpen}
        mode="VERIFY_CONTACT"
        verifyContext="CREATE_ARCHIVE"
        subjectType={subjectType}
        name={name.trim()}
        idNumber={idNumber.trim()}
        contactPhone={contactPhone.trim()}
        fullAddress={`${province}${city}${district}${detailAddress.trim()}`}
        roles={["OWNER"]}
        agentName={subjectType === "ENTERPRISE" ? agentName.trim() : undefined}
        onClose={() => setVerifyOpen(false)}
        onConfirm={() => {
          setVerifyOpen(false)
          persist(true)
        }}
      />
    </div>
  )
}
