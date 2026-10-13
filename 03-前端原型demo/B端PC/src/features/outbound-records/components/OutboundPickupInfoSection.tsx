import type { ReactNode } from "react"
import { ChevronDownIcon, ChevronUpIcon, ImagePlus, Trash2, Eye } from "lucide-react"
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

interface OutboundPickupInfoSectionProps {
  form: OutboundFormState
  onPatch: (patch: Partial<OutboundFormState>) => void
  expanded: boolean
  onToggle: () => void
  onPreviewImage: (url: string) => void
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

export function OutboundPickupInfoSection({
  form,
  onPatch,
  expanded,
  onToggle,
  onPreviewImage,
}: OutboundPickupInfoSectionProps) {
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

  return (
    <Card className="shadow-xs">
      {/* 头部折叠开关 */}
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
          提货信息
        </button>
      </div>

      {expanded && (
        <CardContent className="space-y-4 pt-5 pb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 提货人类型 */}
            <Field label="提货人类型" required>
              <Select
                value={form.pickupPersonType}
                onValueChange={(val) =>
                  onPatch({ pickupPersonType: val as PickupPersonType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="个人">个人</SelectItem>
                  <SelectItem value="企业">企业</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* 提货人姓名 */}
            <Field label="提货人姓名" required>
              <Input
                placeholder="例如：张师傅"
                value={form.pickupName}
                onChange={(e) => onPatch({ pickupName: e.target.value })}
              />
            </Field>

            {/* 提货人联系电话 */}
            <Field label="联系电话" required>
              <Input
                placeholder="请输入11位提货人手机号"
                value={form.pickupPhone}
                onChange={(e) => onPatch({ pickupPhone: e.target.value })}
                className="font-mono"
              />
            </Field>

            {/* 提货人身份证号 */}
            <Field label="证件号码" required>
              <Input
                placeholder="请输入18位身份证号"
                value={form.pickupIdCardNo}
                onChange={(e) => onPatch({ pickupIdCardNo: e.target.value })}
                className="font-mono"
              />
            </Field>

            {/* 提货车牌号 */}
            <Field label="提货车牌号">
              <Input
                placeholder="例如：川A·88888"
                value={form.plateNo}
                onChange={(e) => onPatch({ plateNo: e.target.value })}
                className="font-mono"
              />
            </Field>
          </div>

          {/* 现场照片上传与抓拍（C06 照片必传） */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center text-xs font-medium text-foreground">
                <span className="mr-0.5 text-destructive">*</span>
                现场实物/装车照片
                <span className="text-muted-foreground ml-2 font-normal">
                  （至少上传 1 张，至多 10 张）
                </span>
              </Label>
              <span className="text-xs text-muted-foreground font-mono">
                已上传 {form.sitePhotos.length} / 10 张
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              {form.sitePhotos.map((url, idx) => (
                <div
                  key={idx}
                  className="group relative size-20 overflow-hidden rounded-md border bg-muted/20"
                >
                  <img
                    src={url}
                    alt={`现场照片-${idx + 1}`}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onPreviewImage(url)}
                      className="rounded p-1 text-white hover:bg-white/20"
                      title="查看大图"
                    >
                      <Eye className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="rounded p-1 text-white hover:bg-destructive"
                      title="删除"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {form.sitePhotos.length < 10 && (
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  className="flex size-20 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/10 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <ImagePlus className="size-5 mb-1" />
                  <span className="text-[10px]">添加照片</span>
                </button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
