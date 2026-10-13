import type { ReactNode } from "react"
import { MapPinIcon, PlusIcon, XIcon } from "lucide-react"
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

type InboundGoodsLineCardProps = {
  index: number
  line: GoodsLineForm
  form: InboundFormState
  showMeasureError?: boolean
  onChange: (line: GoodsLineForm) => void
  onRemove: () => void
}

export function InboundGoodsLineCard({
  index,
  line,
  form,
  showMeasureError,
  onChange,
  onRemove,
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

  return (
    <div className="rounded-md border border-border/80 bg-card p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-orange-400 text-sm font-semibold text-orange-500">
              {index + 1}
            </span>
            <span className="text-primary">{formatGoodsCardTitle(line)}</span>
          </p>
          <p
            className={
              unstacked > 0
                ? "mt-1 pl-9 text-sm font-medium text-destructive"
                : "mt-1 pl-9 text-sm text-muted-foreground"
            }
          >
            未堆放数量: {unstacked.toFixed(4)}
          </p>
        </div>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto shrink-0 p-0 text-destructive"
          onClick={onRemove}
        >
          移除货品
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
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
        <Field label={line.measureLabel || "重量"} required>
          <div className="flex gap-1">
            <Input
              type="number"
              className={cn(
                "min-w-0 flex-1",
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
              <SelectTrigger className="w-20">
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
            <p className="text-xs text-destructive">请输入数量</p>
          ) : null}
        </Field>
        <Field label="品种">
          <Input
            placeholder="请输入内容"
            value={line.extraInfo}
            onChange={(event) =>
              onChange({ ...line, extraInfo: event.target.value })
            }
          />
        </Field>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPinIcon className="size-4 text-orange-500" />
            堆放位置 ({line.stackings.length}个位置)
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-primary"
            onClick={addStacking}
          >
            <PlusIcon className="mr-0.5 size-3.5" />
            添加位置
          </Button>
        </div>
        {line.stackings.length > 0 ? (
          <div className="hidden gap-2 px-1 text-xs text-muted-foreground lg:grid lg:grid-cols-[1fr_1fr_1fr_120px_36px]">
            <span>
              <span className="text-destructive">* </span>入库库房
            </span>
            <span>
              <span className="text-destructive">* </span>入库分区
            </span>
            <span>具体位置</span>
            <span>
              <span className="text-destructive">* </span>堆放数量
            </span>
            <span />
          </div>
        ) : null}
        {line.stackings.map((row) => (
          <div
            key={row.id}
            className="grid gap-2 rounded-md border bg-muted/10 p-3 lg:grid-cols-[1fr_1fr_1fr_120px_36px]"
          >
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
              <SelectTrigger>
                <SelectValue placeholder="入库库房" />
              </SelectTrigger>
              <SelectContent>
                {allowedStorerooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={row.partitionId}
              onValueChange={(id) => id && updateStacking(row.id, { partitionId: id })}
            >
              <SelectTrigger>
                <SelectValue placeholder="入库分区" />
              </SelectTrigger>
              <SelectContent>
                {(FORM_PARTITIONS[row.storeroomId] ?? []).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="请输入具体位置"
              value={row.locationText}
              onChange={(event) =>
                updateStacking(row.id, { locationText: event.target.value })
              }
            />
            <Input
              type="number"
              placeholder="堆放数量"
              value={row.quantity}
              onChange={(event) =>
                updateStacking(row.id, { quantity: event.target.value })
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() =>
                onChange({
                  ...line,
                  stackings: line.stackings.filter((s) => s.id !== row.id),
                })
              }
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        <Label>备注</Label>
        <Textarea
          placeholder="请输入备注"
          maxLength={140}
          value={line.remark}
          onChange={(event) => onChange({ ...line, remark: event.target.value })}
        />
        <p className="text-right text-xs text-muted-foreground">
          {line.remark.length}/140
        </p>
      </div>

      <div className="mt-4 space-y-3 border-t pt-4">
        <p className="text-sm font-medium">附件信息</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>
              <span className="text-destructive">* </span>现场照片
            </Label>
            <button
              type="button"
              className="mt-2 flex h-24 w-24 items-center justify-center rounded-md border border-dashed bg-muted/20"
              onClick={() =>
                onChange({
                  ...line,
                  sitePhotoCount: Math.min(10, line.sitePhotoCount + 1),
                })
              }
            >
              <PlusIcon className="size-6 text-muted-foreground" />
            </button>
            <p className="mt-1 text-xs text-muted-foreground">
              图片格式 jpg、png、jpeg，最多 10 个（已 {line.sitePhotoCount}）
            </p>
          </div>
          <div>
            <Label>补充资料</Label>
            <div className="mt-2 flex flex-wrap items-start gap-2">
              <button
                type="button"
                className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed bg-muted/20"
                onClick={() =>
                  onChange({
                    ...line,
                    supplementCount: Math.min(10, line.supplementCount + 1),
                  })
                }
              >
                <PlusIcon className="size-6 text-muted-foreground" />
              </button>
              <Button
                type="button"
                size="sm"
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                上传PDF
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              图片与 PDF 合计最多 10 个（已 {line.supplementCount}）
            </p>
          </div>
        </div>
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
    <div className="space-y-2">
      <Label>
        {required ? <span className="text-destructive">* </span> : null}
        {label}
      </Label>
      {children}
    </div>
  )
}
