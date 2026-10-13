import type { ReactNode } from "react"
import {
  FileText,
  MapPin,
  Plus,
  Trash2,
  X,
  Eye,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import {
  FORM_PARTITIONS,
  FORM_STOREROOMS,
  GOODS_SPEC_TREE,
} from "../mock/inbound-form.mock"
import {
  applySpecTemplate,
  formatGoodsCardTitle,
  parseQuantity,
  unstackedQuantity,
} from "../lib/inbound-form-utils"

// 模拟现场抓拍样例图
const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80",
]

type InboundGoodsLineCardProps = {
  index: number
  line: GoodsLineForm
  form: InboundFormState
  showMeasureError?: boolean
  onChange: (line: GoodsLineForm) => void
  onRemove: () => void
  onPreviewImage?: (url: string) => void
}

export function InboundGoodsLineCard({
  index,
  line,
  form,
  showMeasureError,
  onChange,
  onRemove,
  onPreviewImage,
}: InboundGoodsLineCardProps) {
  const unstacked = unstackedQuantity(line)
  const measureMissing = line.measureValue.trim() === ""
  const hasStackedQty = line.stackings.some(
    (row) => parseQuantity(row.quantity) > 0
  )
  const measureInvalid =
    measureMissing && (Boolean(showMeasureError) || hasStackedQty)
  const categories = Array.from(new Set(GOODS_SPEC_TREE.map((g) => g.category)))
  const varieties = GOODS_SPEC_TREE.filter((g) => g.category === line.category).map(
    (g) => g.variety
  )
  const specs = GOODS_SPEC_TREE.filter(
    (g) => g.category === line.category && g.variety === line.variety
  ).map((g) => g.spec)

  // 严格限定库房只能是基础信息勾选的库房
  const allowedStorerooms = FORM_STOREROOMS.filter(
    (room) =>
      form.storeroomIds.includes(room.id) &&
      (!form.warehouseId || room.warehouseId === form.warehouseId)
  )

  const updateStacking = (
    rowId: string,
    patch: Partial<GoodsLineForm["stackings"][number]>
  ) => {
    onChange({
      ...line,
      stackings: line.stackings.map((row) =>
        row.id === rowId ? { ...row, ...patch } : row
      ),
    })
  }

  const addStacking = () => {
    const defaultRoom = allowedStorerooms[0]?.id ?? ""
    onChange({
      ...line,
      stackings: [
        ...line.stackings,
        {
          id: `stack-${Date.now()}`,
          storeroomId: defaultRoom,
          partitionId: FORM_PARTITIONS[defaultRoom]?.[0] ?? "",
          locationText: "",
          quantity: "",
        },
      ],
    })
  }

  // 模拟添加照片
  const handleAddPhoto = () => {
    if (line.sitePhotoCount >= 10) return
    onChange({
      ...line,
      sitePhotoCount: Math.min(10, line.sitePhotoCount + 1),
    })
  }

  // 模拟移除照片
  const handleRemovePhoto = (_photoIndex: number) => {
    onChange({
      ...line,
      sitePhotoCount: Math.max(0, line.sitePhotoCount - 1),
    })
  }

  // 模拟添加补充资料
  const handleAddSupplement = () => {
    if (line.supplementCount >= 10) return
    onChange({
      ...line,
      supplementCount: Math.min(10, line.supplementCount + 1),
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm">
      {/* 货品卡片头部：序号 + 货品名 + 未堆放警告 + 移除 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {index + 1}
          </span>
          <span className="font-semibold text-foreground text-sm">
            {formatGoodsCardTitle(line)}
          </span>
          {unstacked > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-destructive border border-rose-200">
              <AlertCircle className="size-3.5" />
              未堆放数量：{unstacked.toFixed(4)} {line.measureUnit}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="size-3.5" />
              已全部堆放完成
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-rose-200 text-destructive hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
          onClick={onRemove}
        >
          <Trash2 className="size-3.5" />
          移除货品
        </Button>
      </div>

      {/* 规格与计量属性 5 列网格 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="货品大类" required>
          <Select
            value={line.category}
            onValueChange={(category) => {
              if (!category) return
              const first = GOODS_SPEC_TREE.find((g) => g.category === category)
              onChange(
                applySpecTemplate(
                  line,
                  category,
                  first?.variety ?? "",
                  first?.spec ?? ""
                )
              )
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="品类" required>
          <Select
            value={line.variety}
            onValueChange={(variety) => {
              if (!variety) return
              const firstSpec =
                GOODS_SPEC_TREE.find(
                  (g) => g.category === line.category && g.variety === variety
                )?.spec ?? ""
              onChange(applySpecTemplate(line, line.category, variety, firstSpec))
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {varieties.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="规格" required>
          <Select
            value={line.spec}
            onValueChange={(spec) => {
              if (!spec) return
              onChange(applySpecTemplate(line, line.category, line.variety, spec))
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {specs.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label={line.measureLabel || "计量数量"} required>
          <div className="flex gap-1.5">
            <Input
              type="number"
              step="0.0001"
              placeholder="0.0000"
              className={cn(
                "min-w-0 flex-1 font-mono text-sm",
                measureInvalid && "border-destructive focus-visible:ring-destructive/30"
              )}
              value={line.measureValue}
              onChange={(event) =>
                onChange({ ...line, measureValue: event.target.value })
              }
            />
            <Select
              value={line.measureUnit}
              onValueChange={(unit) => unit && onChange({ ...line, measureUnit: unit })}
            >
              <SelectTrigger className="w-20 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(GOODS_SPEC_TREE.find(
                  (g) =>
                    g.category === line.category &&
                    g.variety === line.variety &&
                    g.spec === line.spec
                )?.units ?? [line.measureUnit]).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {measureInvalid ? (
            <p className="text-[11px] text-destructive">请输入入库数量</p>
          ) : null}
        </Field>

        <Field label="生产批次/牌号">
          <Input
            placeholder="如 20260901-A"
            value={line.extraInfo}
            onChange={(event) =>
              onChange({ ...line, extraInfo: event.target.value })
            }
          />
        </Field>
      </div>

      {/* 堆放位置区域（对齐源码 store-apply-info.vue 堆放位置） */}
      <div className="mt-5 rounded-lg border border-border/70 bg-muted/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <MapPin className="size-4 text-primary" />
            堆放位置 ({line.stackings.length} 个具体位置)
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs text-primary border-primary/30 hover:bg-primary/5"
            disabled={allowedStorerooms.length === 0}
            onClick={addStacking}
          >
            <Plus className="size-3.5" />
            添加位置
          </Button>
        </div>

        {allowedStorerooms.length === 0 ? (
          <div className="rounded border border-dashed border-amber-300 bg-amber-50/50 p-3 text-center text-xs text-amber-700">
            ⚠️ 提示：请先在上方「基础信息」中选择入库仓库与库房，方可在此分配堆放货位
          </div>
        ) : (
          <div className="space-y-2.5">
            {line.stackings.length > 0 && (
              <div className="hidden grid-cols-[1.2fr_1fr_1.4fr_120px_36px] gap-2.5 px-2 text-[11px] font-medium text-muted-foreground lg:grid">
                <span>
                  <span className="text-destructive">* </span>入库库房
                </span>
                <span>
                  <span className="text-destructive">* </span>入库分区
                </span>
                <span>具体堆放位置说明</span>
                <span className="text-right">
                  <span className="text-destructive">* </span>堆放数量 ({line.measureUnit})
                </span>
                <span />
              </div>
            )}

            {line.stackings.map((row) => (
              <div
                key={row.id}
                className="grid gap-2 rounded-md border bg-card p-2.5 shadow-2xs lg:grid-cols-[1.2fr_1fr_1.4fr_120px_36px] items-center"
              >
                {/* 1. 库房 */}
                <Select
                  value={row.storeroomId}
                  onValueChange={(id) =>
                    id &&
                    updateStacking(row.id, {
                      storeroomId: id,
                      partitionId: FORM_PARTITIONS[id]?.[0] ?? "",
                    })
                  }
                >
                  <SelectTrigger className="h-8.5 text-xs">
                    <SelectValue placeholder="请选择库房" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedStorerooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 2. 分区 */}
                <Select
                  value={row.partitionId}
                  onValueChange={(id) => id && updateStacking(row.id, { partitionId: id })}
                >
                  <SelectTrigger className="h-8.5 text-xs">
                    <SelectValue placeholder="请选择分区" />
                  </SelectTrigger>
                  <SelectContent>
                    {(FORM_PARTITIONS[row.storeroomId] ?? []).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 3. 具体位置 */}
                <Input
                  className="h-8.5 text-xs"
                  placeholder="如: 1号库架-A垛位"
                  value={row.locationText}
                  onChange={(event) =>
                    updateStacking(row.id, { locationText: event.target.value })
                  }
                />

                {/* 4. 堆放数量 */}
                <Input
                  type="number"
                  step="0.0001"
                  className="h-8.5 text-xs font-mono text-right"
                  placeholder="0.0000"
                  value={row.quantity}
                  onChange={(event) =>
                    updateStacking(row.id, { quantity: event.target.value })
                  }
                />

                {/* 5. 删除行 */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    onChange({
                      ...line,
                      stackings: line.stackings.filter((s) => s.id !== row.id),
                    })
                  }
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 附件信息（现场照片 + 补充资料，对齐源码） */}
      <div className="mt-5 border-t border-border/70 pt-4">
        <p className="text-xs font-semibold text-foreground mb-3">附件信息</p>
        <div className="grid gap-5 md:grid-cols-2">
          {/* 现场照片 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">
                <span className="text-destructive">* </span>现场照片
              </Label>
              <span className="text-[11px] text-muted-foreground">
                已上传 {line.sitePhotoCount}/10 张（jpg/png/jpeg）
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {Array.from({ length: line.sitePhotoCount }).map((_, pIdx) => {
                const imgUrl = SAMPLE_PHOTOS[pIdx % SAMPLE_PHOTOS.length]
                return (
                  <div
                    key={pIdx}
                    className="group relative size-20 overflow-hidden rounded-md border bg-muted"
                  >
                    <img
                      src={imgUrl}
                      alt={`现场照片 ${pIdx + 1}`}
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="text-white hover:text-primary transition-colors p-1"
                        title="查看大图"
                        onClick={() => onPreviewImage?.(imgUrl)}
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="text-white hover:text-destructive transition-colors p-1"
                        title="删除照片"
                        onClick={() => handleRemovePhoto(pIdx)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              })}

              {line.sitePhotoCount < 10 && (
                <button
                  type="button"
                  className="flex size-20 flex-col items-center justify-center rounded-md border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
                  onClick={handleAddPhoto}
                >
                  <Plus className="size-5" />
                  <span className="mt-1 text-[10px]">上传照片</span>
                </button>
              )}
            </div>
          </div>

          {/* 补充资料 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">补充资料</Label>
              <span className="text-[11px] text-muted-foreground">
                图片与 PDF 共计 {line.supplementCount}/10 个
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {Array.from({ length: line.supplementCount }).map((_, docIdx) => (
                <div
                  key={docIdx}
                  className="group relative flex h-20 w-32 flex-col justify-between rounded-md border bg-muted/40 p-2 text-xs"
                >
                  <div className="flex items-center gap-1.5 text-primary">
                    <FileText className="size-4 text-rose-500 shrink-0" />
                    <span className="line-clamp-1 font-medium text-[11px]">
                      过磅质检单_{docIdx + 1}.pdf
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>1.4 MB</span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        onChange({
                          ...line,
                          supplementCount: Math.max(0, line.supplementCount - 1),
                        })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {line.supplementCount < 10 && (
                <button
                  type="button"
                  className="flex h-20 w-32 flex-col items-center justify-center rounded-md border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
                  onClick={handleAddSupplement}
                >
                  <Upload className="size-5" />
                  <span className="mt-1 text-[10px]">上传资料/PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 备注 */}
      <div className="mt-4 space-y-1.5">
        <Label className="text-xs">货品备注</Label>
        <Textarea
          placeholder="请输入该货品的规格备注（选填）"
          maxLength={140}
          className="resize-none"
          rows={2}
          value={line.remark}
          onChange={(event) => onChange({ ...line, remark: event.target.value })}
        />
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">
        {required ? <span className="text-destructive">* </span> : null}
        {label}
      </Label>
      {children}
    </div>
  )
}
