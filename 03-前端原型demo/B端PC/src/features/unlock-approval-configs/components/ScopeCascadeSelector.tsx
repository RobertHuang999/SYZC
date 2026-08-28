import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ScopeType } from "../domain/types"
import {
  STOREROOM_OPTIONS,
  WAREHOUSE_OPTIONS,
  ZONE_OPTIONS,
} from "../mock/reference-data.mock"
import { FieldLabelWithHelp } from "./FieldHelpTooltip"

type ScopeCascadeSelectorProps = {
  scopeType: ScopeType | ""
  warehouseName: string
  storeroomNames: string[]
  zoneNames: string[]
  readOnly?: boolean
  onChange: (patch: {
    warehouseName?: string
    storeroomNames?: string[]
    zoneNames?: string[]
  }) => void
}

export function ScopeCascadeSelector({
  scopeType,
  warehouseName,
  storeroomNames,
  zoneNames,
  readOnly = false,
  onChange,
}: ScopeCascadeSelectorProps) {
  const showStoreroom =
    scopeType === "库房" || scopeType === "分区" || scopeType === "指定设备"
  const showZone = scopeType === "分区" || scopeType === "指定设备"

  const storeroomOptions = warehouseName
    ? STOREROOM_OPTIONS[warehouseName] ?? []
    : []
  const zoneOptions = storeroomNames.flatMap(
    (storeroom) => ZONE_OPTIONS[storeroom] ?? []
  )

  const toggleStoreroom = (name: string) => {
    const exists = storeroomNames.includes(name)
    const nextStorerooms = exists
      ? storeroomNames.filter((item) => item !== name)
      : [...storeroomNames, name]
    const validZones = zoneNames.filter((zone) =>
      nextStorerooms.some((storeroom) =>
        (ZONE_OPTIONS[storeroom] ?? ([] as string[])).includes(zone)
      )
    )
    onChange({ storeroomNames: nextStorerooms, zoneNames: validZones })
  }

  const toggleZone = (name: string) => {
    const exists = zoneNames.includes(name)
    onChange({
      zoneNames: exists
        ? zoneNames.filter((item) => item !== name)
        : [...zoneNames, name],
    })
  }

  if (!scopeType || scopeType === "未绑定位置全局") {
    return null
  }

  return (
    <div className="md:col-span-2 space-y-4 rounded-lg border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>范围选择</span>
        {warehouseName && (
          <>
            <span>/</span>
            <Badge variant="secondary">{warehouseName}</Badge>
          </>
        )}
        {storeroomNames.map((name) => (
          <Badge key={name} variant="outline">
            {name}
          </Badge>
        ))}
        {zoneNames.map((name) => (
          <Badge key={name} variant="outline">
            {name}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>
            <FieldLabelWithHelp
              required
              label="适用仓库"
              help="先选仓库，再选下级库房/分区；切换仓库会清空已选库房与分区。"
            />
          </Label>
          {readOnly ? (
            <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">
              {warehouseName || "—"}
            </div>
          ) : (
            <Select
              value={warehouseName || "none"}
              onValueChange={(value) => {
                if (!value || value === "none") return
                onChange({
                  warehouseName: value,
                  storeroomNames: [],
                  zoneNames: [],
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" disabled>
                  请选择仓库
                </SelectItem>
                {WAREHOUSE_OPTIONS.map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {showStoreroom && (
          <div className="space-y-2 md:col-span-2">
            <Label>
              <FieldLabelWithHelp
                required
                label="适用库房"
                help="支持多选；须属于上方已选仓库。库房类型至少选 1 个。"
              />
            </Label>
            {!warehouseName ? (
              <p className="text-sm text-muted-foreground">请先选择适用仓库</p>
            ) : readOnly ? (
              <div className="text-sm">{storeroomNames.join("、") || "—"}</div>
            ) : (
              <MultiCheckList
                options={storeroomOptions}
                selected={storeroomNames}
                onToggle={toggleStoreroom}
                emptyText="该仓库下暂无库房"
              />
            )}
          </div>
        )}

        {showZone && warehouseName && storeroomNames.length > 0 && (
          <div className="space-y-2 md:col-span-3">
            <Label>
              <FieldLabelWithHelp
                required={scopeType === "分区"}
                label="适用分区"
                help="支持多选；选项来自已选库房下的分区。"
              />
            </Label>
            {readOnly ? (
              <div className="text-sm">{zoneNames.join("、") || "—"}</div>
            ) : (
              <MultiCheckList
                options={zoneOptions}
                selected={zoneNames}
                onToggle={toggleZone}
                emptyText="所选库房下暂无分区"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MultiCheckList({
  options,
  selected,
  onToggle,
  emptyText,
}: {
  options: string[]
  selected: string[]
  onToggle: (name: string) => void
  emptyText: string
}) {
  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:bg-muted/50"
            )}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
