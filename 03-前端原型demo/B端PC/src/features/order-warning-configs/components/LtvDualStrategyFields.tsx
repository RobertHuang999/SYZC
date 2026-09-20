import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LTV_DISPLAY_LABEL,
  LTV_FOOTER_HINT,
  LTV_UNAVAILABLE_HINT,
  LTV_RELEASE_METHOD_OPTIONS,
  formatLtvPercent,
  parseReleaseMethodsParam,
  serializeReleaseMethods,
  toggleReleaseMethod,
  type LtvReleaseMethod,
} from "../lib/ltv-utils"

type LtvDualStrategyFieldsProps = {
  params: Record<string, string>
  currentLtv?: string | null
  onChange: (patch: Record<string, string>) => void
}

function LtvScaleBar({
  currentLtv,
  marginCallLtv,
  closeOutLtv,
}: {
  currentLtv?: string | null
  marginCallLtv: string
  closeOutLtv: string
}) {
  const current = Number(currentLtv)
  const margin = Number(marginCallLtv)
  const close = Number(closeOutLtv)
  const max = Math.max(
    Number.isFinite(close) ? close : 0,
    Number.isFinite(margin) ? margin : 0,
    Number.isFinite(current) ? current : 0,
    100
  )

  const toPercent = (value: number) =>
    Number.isFinite(value) && max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full bg-muted">
        {Number.isFinite(margin) && margin > 0 && (
          <span
            className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-amber-500"
            style={{ left: `${toPercent(margin)}%` }}
            title={`补仓线 ${formatLtvPercent(String(margin))}`}
          />
        )}
        {Number.isFinite(close) && close > 0 && (
          <span
            className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-red-500"
            style={{ left: `${toPercent(close)}%` }}
            title={`平仓线 ${formatLtvPercent(String(close))}`}
          />
        )}
        {Number.isFinite(current) && current >= 0 && (
          <span
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary"
            style={{ left: `${toPercent(current)}%` }}
            title={`当前 ${formatLtvPercent(String(current))}`}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          <span className="mr-1 inline-block size-2 rounded-full bg-primary" />
          当前率 {currentLtv ? formatLtvPercent(currentLtv) : "—"}
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-0.5 bg-amber-500 align-middle" />
          补仓线 {formatLtvPercent(marginCallLtv)}
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-0.5 bg-red-500 align-middle" />
          平仓线 {formatLtvPercent(closeOutLtv)}
        </span>
      </div>
    </div>
  )
}

function LtvTriggerConditionInput({
  value,
  placeholder,
  onChange,
}: {
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1 text-sm leading-snug">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted-foreground">
        <span>若 {LTV_DISPLAY_LABEL} 超过</span>
        <Input
          className="h-8 w-[4.5rem]"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <span>% 时触发预警</span>
      </div>
      <p className="text-xs text-muted-foreground">不含等于该阈值</p>
    </div>
  )
}

function ReleaseMethodCell({
  selected,
  onToggle,
}: {
  selected: string[]
  onToggle: (method: LtvReleaseMethod) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {LTV_RELEASE_METHOD_OPTIONS.map((method) => (
        <label key={method} className="flex items-center gap-1.5 text-sm whitespace-nowrap">
          <input
            type="checkbox"
            checked={selected.includes(method)}
            onChange={() => onToggle(method)}
          />
          {method}
        </label>
      ))}
    </div>
  )
}

export function LtvDualStrategyFields({
  params,
  currentLtv,
  onChange,
}: LtvDualStrategyFieldsProps) {
  const marginSelected = parseReleaseMethodsParam(params.marginCallReleaseMethods)
  const closeSelected = parseReleaseMethodsParam(params.closeOutReleaseMethods)
  const marginCall = Number(params.marginCallLtv)
  const closeOut = Number(params.closeOutLtv)
  const closeOutInvalid =
    Number.isFinite(marginCall) &&
    Number.isFinite(closeOut) &&
    closeOut > 0 &&
    marginCall > 0 &&
    closeOut <= marginCall

  return (
    <>
      <div className="md:col-span-2 space-y-1 text-sm">
        <div>
          <span className="text-muted-foreground">当前订单{LTV_DISPLAY_LABEL}：</span>
          <span className="font-medium text-foreground">
            {currentLtv ? formatLtvPercent(currentLtv) : "—"}
          </span>
        </div>
        {!currentLtv && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {LTV_UNAVAILABLE_HINT}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <LtvScaleBar
          currentLtv={currentLtv}
          marginCallLtv={params.marginCallLtv ?? ""}
          closeOutLtv={params.closeOutLtv ?? ""}
        />
      </div>

      <div className="md:col-span-2 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">类型</TableHead>
              <TableHead className="min-w-[15rem]">触发条件</TableHead>
              <TableHead>解除方式（多选）</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">补仓线</TableCell>
              <TableCell>
                <LtvTriggerConditionInput
                  value={params.marginCallLtv ?? ""}
                  placeholder="75"
                  onChange={(value) => onChange({ marginCallLtv: value })}
                />
              </TableCell>
              <TableCell>
                <ReleaseMethodCell
                  selected={marginSelected}
                  onToggle={(method) =>
                    onChange({
                      marginCallReleaseMethods: serializeReleaseMethods(
                        toggleReleaseMethod(marginSelected, method)
                      ),
                    })
                  }
                />
                {marginSelected.length === 0 && (
                  <p className="mt-1 text-xs text-destructive">请至少选择 1 项</p>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">平仓线</TableCell>
              <TableCell>
                <LtvTriggerConditionInput
                  value={params.closeOutLtv ?? ""}
                  placeholder="85"
                  onChange={(value) => onChange({ closeOutLtv: value })}
                />
              </TableCell>
              <TableCell>
                <ReleaseMethodCell
                  selected={closeSelected}
                  onToggle={(method) =>
                    onChange({
                      closeOutReleaseMethods: serializeReleaseMethods(
                        toggleReleaseMethod(closeSelected, method)
                      ),
                    })
                  }
                />
                {closeSelected.length === 0 && (
                  <p className="mt-1 text-xs text-destructive">请至少选择 1 项</p>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="md:col-span-2 space-y-1 text-xs text-muted-foreground">
        <p>{LTV_FOOTER_HINT}</p>
        {closeOutInvalid && (
          <p className="text-destructive">平仓线须高于补仓线</p>
        )}
      </div>
    </>
  )
}
