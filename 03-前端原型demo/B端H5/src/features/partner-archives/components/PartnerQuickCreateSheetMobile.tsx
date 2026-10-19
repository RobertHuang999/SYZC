import { useEffect, useState } from "react"
import type { PartnerSubject } from "@prototype/B端PC/src/features/partner-archives/domain/types"
import {
  type JobQuickCreateScene,
  quickCreatePartnerFromJob,
} from "@prototype/B端PC/src/features/partner-archives/lib/quick-create-partner"

type Props = {
  open: boolean
  scene: JobQuickCreateScene
  onOpenChange: (open: boolean) => void
  onCreated: (partner: PartnerSubject) => void
  onError?: (message: string) => void
}

export function PartnerQuickCreateSheetMobile({
  open,
  scene,
  onOpenChange,
  onCreated,
  onError,
}: Props) {
  const [name, setName] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [detailAddress, setDetailAddress] = useState("")

  useEffect(() => {
    if (!open) return
    setName("")
    setIdNumber("")
    setContactPhone("")
    setDetailAddress("")
  }, [open, scene])

  if (!open) return null

  const title = scene === "INBOUND_OWNER" ? "快速添加货主" : "快速添加提货经办人"

  const save = () => {
    const result = quickCreatePartnerFromJob({
      scene,
      subjectType: "INDIVIDUAL",
      name,
      idNumber,
      contactPhone,
      province: "江苏省",
      city: "无锡市",
      district: "滨湖区",
      detailAddress: scene === "INBOUND_OWNER" ? detailAddress : "（出库经办人可不填地址）",
      createdBy: "当前用户",
    })
    if (!result.ok) {
      onError?.(result.message)
      return
    }
    onCreated(result.partner)
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <div className="max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-8 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#232D39]">{title}</h2>
          <button type="button" className="text-sm text-[#232D39]/60" onClick={() => onOpenChange(false)}>
            关闭
          </button>
        </div>
        <p className="mb-4 text-xs text-[#232D39]/60">
          默认保存并提交 · 联系手机未验证；创建人=当前用户
        </p>
        <label className="mb-3 block text-sm">
          <span className="text-[#EF3E3E]">*</span> 姓名
          <input
            className="mt-1 w-full rounded-lg border border-[#232D39]/15 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="mb-3 block text-sm">
          <span className="text-[#EF3E3E]">*</span> 联系手机
          <input
            className="mt-1 w-full rounded-lg border border-[#232D39]/15 px-3 py-2 text-sm"
            maxLength={11}
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </label>
        <label className="mb-3 block text-sm">
          <span className="text-[#EF3E3E]">*</span> 身份证号
          <input
            className="mt-1 w-full rounded-lg border border-[#232D39]/15 px-3 py-2 text-sm"
            maxLength={18}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
        </label>
        {scene === "INBOUND_OWNER" ? (
          <div className="mb-4 space-y-2">
            <label className="block text-sm">
              证件登记地址
              <input
                className="mt-1 w-full rounded-lg border border-[#232D39]/15 px-3 py-2 text-sm"
                placeholder="街道、门牌号等（选填）"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
              />
            </label>
            <p className="text-xs leading-relaxed text-[#232D39]/55">
              选填。填写后将校验是否与租户内其他货主重复；不填不影响保存。
            </p>
          </div>
        ) : null}
        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white"
          onClick={save}
        >
          保存并提交
        </button>
      </div>
    </div>
  )
}
