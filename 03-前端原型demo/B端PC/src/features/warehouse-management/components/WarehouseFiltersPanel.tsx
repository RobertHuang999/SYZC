import type { ReactNode } from "react"
import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { DEFAULT_WAREHOUSE_FILTERS } from "../domain/constants"
import type { WarehouseFilters } from "../domain/types"

type WarehouseFiltersPanelProps = {
  value: WarehouseFilters
  onChange: (value: WarehouseFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
  onDownloadTemplate?: () => void
}

export function WarehouseFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
  onDownloadTemplate,
}: WarehouseFiltersPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          onSearch={onSearch}
          onReset={() => {
            onChange({ ...DEFAULT_WAREHOUSE_FILTERS })
            onReset()
          }}
          onAdd={onAdd}
          addLabel="添加仓库"
          extraActions={
            onDownloadTemplate ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDownloadTemplate}
              >
                <DownloadIcon className="mr-1.5 size-4" />
                下载仓库信息登记表
              </Button>
            ) : null
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="仓库名称">
            <Input
              placeholder="请输入仓库名称"
              value={value.nameKeyword}
              onChange={(event) =>
                onChange({ ...value, nameKeyword: event.target.value })
              }
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="中仓登准入仓标记">
            <Select
              value={value.zhongdeng}
              onValueChange={(next) => {
                if (!next) return
                onChange({
                  ...value,
                  zhongdeng: next as WarehouseFilters["zhongdeng"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部</SelectItem>
                <SelectItem value="是">是</SelectItem>
                <SelectItem value="否">否</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
