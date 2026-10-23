import { useMemo, type ReactNode } from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Plus,
  Trash2,
  Eye,
} from "lucide-react"
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
import { cn } from "@/lib/utils"
import type { OutboundFormState } from "../domain/form-types"
import type { PickupPersonType } from "../domain/types"
import { PartnerChangeFieldMark } from "@/components/form/PartnerChangeZone"
import { PartnerArchiveEmbeddedPicker } from "@/features/partner-archives/components/PartnerArchiveEmbeddedPicker"
import {
  OUTBOUND_PICKUP_AGENT_PARTNER_CHANGE_SPEC,
  OUTBOUND_PICKUP_AGENT_PARTNER_CHANGE_USER,
} from "@prototype/shared/partner-change/partner-change-ui-labels"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { PartnerSelectorValue } from "@/features/partner-archives/components/PartnerArchiveSelector"
import { partnerArchivesMock } from "@/features/partner-archives/mock/partner-archives.mock"
import { resolveContactPhoneVerified } from "@/features/partner-archives/lib/contact-phone-verify"

interface OutboundPickupInfoSectionProps {
  form: OutboundFormState
  onPatch: (patch: Partial<OutboundFormState>) => void
  expanded: boolean
  onToggle: () => void
  onPreviewImage: (url: string) => void
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

export function OutboundPickupInfoSection({
  form,
  onPatch,
  expanded,
  onToggle,
  onPreviewImage,
}: OutboundPickupInfoSectionProps) {
  const pickupSelection = useMemo((): PartnerSelectorValue | null => {
    if (!form.pickupAgentPartnerId) return null
    const partner = partnerArchivesMock.find((p) => p.id === form.pickupAgentPartnerId)
    if (!partner) return null
    const role = partner.roles.find((r) => r.roleType === "PICKUP_AGENT")
    if (!role) return null
    return {
      partnerId: partner.id,
      partnerNo: partner.partnerNo,
      name: partner.name,
      idNumberMasked: partner.idNumberMasked,
      subjectType: partner.subjectType,
      roleType: "PICKUP_AGENT",
      roleStatus: role.roleStatus,
      subjectStatus: partner.status,
      contactPhoneVerified: resolveContactPhoneVerified(partner),
    }
  }, [form.pickupAgentPartnerId])

  const applyPickupPartner = (payload: PartnerSelectorValue | null) => {
    if (!payload) {
      onPatch({
        pickupAgentPartnerId: "",
        pickupName: "",
        pickupIdCardNo: "",
        pickupPhone: "",
      })
      return
    }
    const partner = partnerArchivesMock.find((p) => p.id === payload.partnerId)
    if (!partner) return
    onPatch({
      pickupPersonType: "个人",
      pickupAgentPartnerId: partner.id,
      pickupName: partner.name,
      pickupIdCardNo: partner.idNumberMasked,
      pickupPhone: partner.contactPhone,
    })
  }

  const pickupFieldsLocked = Boolean(form.pickupAgentPartnerId)
  // 模拟上传照片
  const handleUploadPhoto = () => {
    if (form.sitePhotos.length >= 10) return
    const mockImages = [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    ]
    const nextImage = mockImages[form.sitePhotos.length % mockImages.length]
    onPatch({ sitePhotos: [...form.sitePhotos, nextImage] })
  }

  const handleRemovePhoto = (index: number) => {
    const list = [...form.sitePhotos]
    list.splice(index, 1)
    onPatch({ sitePhotos: list })
  }

  const isPersonal = form.pickupPersonType === "个人"

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
          提货信息
        </button>
      </div>

      {expanded && (
        <CardContent className="space-y-4 pt-5 pb-6 text-xs">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. 提货人类型 */}
            <FormItem label="提货人类型:" required>
              <Select
                value={form.pickupPersonType}
                onValueChange={(val) =>
                  onPatch({
                    pickupPersonType: (val || "个人") as PickupPersonType,
                    pickupName: "",
                    pickupIdCardNo: "",
                    pickupPhone: "",
                    pickupIdentity: "",
                    pickupOperator: "",
                  })
                }
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="请选择提货人类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="个人" className="text-xs">个人</SelectItem>
                  <SelectItem value="企业" className="text-xs">企业</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            {/* 个人提货人字段 */}
            {isPersonal ? (
              <>
                <div className="sm:col-span-2 lg:col-span-4">
                  <PrototypeAnnotationTarget annotationIds={["outbound-form-partner-pickup"]}>
                    <PartnerChangeFieldMark
                      markId="outbound-pickup-agent"
                      userHint={OUTBOUND_PICKUP_AGENT_PARTNER_CHANGE_USER}
                      specNote={OUTBOUND_PICKUP_AGENT_PARTNER_CHANGE_SPEC}
                    >
                      <PartnerArchiveEmbeddedPicker
                        archiveMenu="提货人信息"
                        fieldLabel="提货经办人"
                        required
                        hideEmbeddedHints
                        value={form.pickupAgentPartnerId || undefined}
                        selection={pickupSelection}
                        onChange={applyPickupPartner}
                      />
                    </PartnerChangeFieldMark>
                  </PrototypeAnnotationTarget>
                </div>
                <FormItem label="提货人姓名:" required>
                  <Input
                    value={form.pickupName}
                    onChange={(e) => onPatch({ pickupName: e.target.value })}
                    placeholder="请选择提货经办人或快捷建档"
                    disabled={pickupFieldsLocked}
                    className="h-9 text-xs disabled:bg-muted/60"
                  />
                </FormItem>
                <FormItem label="提货人身份证号:" required>
                  <Input
                    value={form.pickupIdCardNo}
                    onChange={(e) => onPatch({ pickupIdCardNo: e.target.value })}
                    placeholder="选中后只读反显"
                    disabled={pickupFieldsLocked}
                    className="h-9 text-xs disabled:bg-muted/60"
                  />
                </FormItem>
                <FormItem label="提货人电话:" required>
                  <Input
                    maxLength={11}
                    value={form.pickupPhone}
                    onChange={(e) => onPatch({ pickupPhone: e.target.value })}
                    placeholder="选中后只读反显"
                    disabled={pickupFieldsLocked}
                    className="h-9 text-xs disabled:bg-muted/60"
                  />
                </FormItem>
                <FormItem label="车牌号:">
                  <Input
                    value={form.plateNo}
                    onChange={(e) => onPatch({ plateNo: e.target.value })}
                    placeholder="请输入车牌号"
                    className="h-9 text-xs"
                  />
                </FormItem>
              </>
            ) : (
              /* 企业提货人字段 */
              <>
                <FormItem label="提货人名称:" required>
                  <Input
                    value={form.pickupName}
                    onChange={(e) => onPatch({ pickupName: e.target.value })}
                    placeholder="请输入公司名称"
                    className="h-9 text-xs"
                  />
                </FormItem>
                <FormItem label="统一社会信用编码:" required>
                  <Input
                    value={form.pickupIdentity}
                    onChange={(e) => onPatch({ pickupIdentity: e.target.value })}
                    placeholder="请输入统一社会信用编码"
                    className="h-9 text-xs"
                  />
                </FormItem>
                <FormItem label="经办人姓名:" required>
                  <Input
                    value={form.pickupOperator}
                    onChange={(e) => onPatch({ pickupOperator: e.target.value })}
                    placeholder="请输入经办人姓名"
                    className="h-9 text-xs"
                  />
                </FormItem>
                <FormItem label="经办人电话:" required>
                  <Input
                    maxLength={11}
                    value={form.pickupPhone}
                    onChange={(e) => onPatch({ pickupPhone: e.target.value })}
                    placeholder="请输入经办人电话"
                    className="h-9 text-xs"
                  />
                </FormItem>
              </>
            )}

            {!isPersonal ? (
              <>
                <FormItem label="经办人身份证号" required>
                  <Input
                    value={form.pickupIdCardNo}
                    onChange={(e) => onPatch({ pickupIdCardNo: e.target.value })}
                    placeholder="请输入经办人身份证号"
                    className="h-9 text-xs"
                  />
                </FormItem>
                <FormItem label="车牌号">
                  <Input
                    value={form.plateNo}
                    onChange={(e) => onPatch({ plateNo: e.target.value })}
                    placeholder="请输入车牌号"
                    className="h-9 text-xs"
                  />
                </FormItem>
              </>
            ) : null}
          </div>

          {/* 照片上传区域（严格对齐老系统截图） */}
          <div className="pt-2 space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              <span className="text-destructive">* </span>
              现场照片
            </Label>

            <div className="flex flex-wrap items-center gap-3">
              {/* 已上传图片缩略图 */}
              {form.sitePhotos.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="group relative size-20 rounded-md border overflow-hidden bg-muted/30 flex items-center justify-center shadow-xs"
                >
                  <img
                    src={imgUrl}
                    alt={`现场照片-${idx + 1}`}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onPreviewImage(imgUrl)}
                      className="text-white hover:text-primary-foreground"
                      title="查看大图"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="text-white hover:text-red-400"
                      title="删除"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 上传按钮（当不超过10张时） */}
              {form.sitePhotos.length < 10 && (
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  className="size-20 flex flex-col items-center justify-center rounded-md border border-dashed bg-muted/20 hover:bg-muted/40 text-muted-foreground transition-colors cursor-pointer select-none"
                >
                  <Plus className="size-5 mb-1" />
                  <span className="text-[11px]">请上传图片</span>
                </button>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground pt-0.5">
              注：图片格式为 jpg、png、jpeg，大小不超过 5M，最多支持上传 10 个文件
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
