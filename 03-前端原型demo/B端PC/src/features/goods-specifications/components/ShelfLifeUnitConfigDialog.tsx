import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getShelfLifeUnitConfig,
  updateShelfLifeUnitConfig,
} from "../lib/store"
import {
  INBOUND_COLLECT_SPEC_SHELF_LIFE_NOTE,
  INBOUND_COLLECT_USER_RECOMMEND_UNIT_HINT,
  INBOUND_COLLECT_USER_SHELF_LIFE_UNITS_HINT,
} from "../lib/inbound-collect-ui-labels"
import { AlertCircle, CalendarClock, ShieldCheck } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}

export function ShelfLifeUnitConfigDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [allowDay, setAllowDay] = useState(true)
  const [allowMonth, setAllowMonth] = useState(true)
  const [allowYear, setAllowYear] = useState(true)
  const [recommendedUnit, setRecommendedUnit] = useState<
    "DAY" | "MONTH" | "YEAR"
  >("MONTH")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      const cfg = getShelfLifeUnitConfig()
      setAllowDay(cfg.allowDay)
      setAllowMonth(cfg.allowMonth)
      setAllowYear(cfg.allowYear)
      setRecommendedUnit(cfg.recommendedUnit)
      setErrorMessage(null)
    }
  }, [open])

  // 处理开关变动，执行至少保留 1 项的即时校验拦截 (R05)
  const handleToggleDay = (checked: boolean) => {
    if (!checked && !allowMonth && !allowYear) {
      setErrorMessage("至少保留一个可用保质期单位")
      return
    }
    setErrorMessage(null)
    setAllowDay(checked)
    if (!checked && recommendedUnit === "DAY") {
      setRecommendedUnit(allowMonth ? "MONTH" : "YEAR")
    }
  }

  const handleToggleMonth = (checked: boolean) => {
    if (!checked && !allowDay && !allowYear) {
      setErrorMessage("至少保留一个可用保质期单位")
      return
    }
    setErrorMessage(null)
    setAllowMonth(checked)
    if (!checked && recommendedUnit === "MONTH") {
      setRecommendedUnit(allowDay ? "DAY" : "YEAR")
    }
  }

  const handleToggleYear = (checked: boolean) => {
    if (!checked && !allowDay && !allowMonth) {
      setErrorMessage("至少保留一个可用保质期单位")
      return
    }
    setErrorMessage(null)
    setAllowYear(checked)
    if (!checked && recommendedUnit === "YEAR") {
      setRecommendedUnit(allowMonth ? "MONTH" : "DAY")
    }
  }

  const handleSave = () => {
    if (!allowDay && !allowMonth && !allowYear) {
      setErrorMessage("至少保留一个可用保质期单位")
      return
    }

    const res = updateShelfLifeUnitConfig({
      allowDay,
      allowMonth,
      allowYear,
      recommendedUnit,
    })

    if (!res.success) {
      setErrorMessage(res.error || "没保存成功，请重试；仍然失败请刷新页面后再提交")
      return
    }

    onSuccess("保质期度量单位白名单已更新")
    onOpenChange(false)
  }

  const activeOptions: Array<{ value: "DAY" | "MONTH" | "YEAR"; label: string }> =
    []
  if (allowDay) activeOptions.push({ value: "DAY", label: "按【天】计量 (DAY)" })
  if (allowMonth)
    activeOptions.push({ value: "MONTH", label: "按【月】计量 (MONTH)" })
  if (allowYear)
    activeOptions.push({ value: "YEAR", label: "按【年】计量 (YEAR)" })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[540px] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-semibold text-slate-900">
              保质期度量单位配置
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            这里开启的单位，货品建档时才能选；天、月、年不能全关，至少要留一个。
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4 pt-2">
          {/* 白名单开关矩阵 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              <span className="text-destructive mr-1">*</span>允许启用的保质期单位
            </Label>
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-3">
              {/* 天 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    按【天】计量
                  </div>
                  <div className="text-xs text-muted-foreground">
                    适用于生鲜果蔬、速冻调理制品、超短货龄冷链品类
                  </div>
                </div>
                <Switch
                  checked={allowDay}
                  onCheckedChange={handleToggleDay}
                />
              </div>

              <div className="border-t border-slate-200" />

              {/* 月 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    按【月】计量
                  </div>
                  <div className="text-xs text-muted-foreground">
                    适用于八角、调味品、预包装粮油、大宗深加工品
                  </div>
                </div>
                <Switch
                  checked={allowMonth}
                  onCheckedChange={handleToggleMonth}
                />
              </div>

              <div className="border-t border-slate-200" />

              {/* 年 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    按【年】计量
                  </div>
                  <div className="text-xs text-muted-foreground">
                    适用于花椒、中药材、红酒、长储战略大宗储备
                  </div>
                </div>
                <Switch
                  checked={allowYear}
                  onCheckedChange={handleToggleYear}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>{INBOUND_COLLECT_USER_SHELF_LIFE_UNITS_HINT}</span>
            </div>
          </div>

          {/* 推荐基准单位 */}
          <div className="space-y-1.5">
            <Label htmlFor="recommend-unit" className="text-sm font-medium">
              <span className="text-destructive mr-1">*</span>推荐基准单位
            </Label>
            <Select
              value={recommendedUnit}
              onValueChange={(val) =>
                setRecommendedUnit(val as "DAY" | "MONTH" | "YEAR")
              }
            >
              <SelectTrigger id="recommend-unit" className="h-9 bg-white">
                <SelectValue placeholder="请选择推荐基准单位">
                  {(val) =>
                    activeOptions.find((option) => option.value === val)?.label ??
                    "请选择推荐基准单位"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProductFieldHint>{INBOUND_COLLECT_USER_RECOMMEND_UNIT_HINT}</ProductFieldHint>
          </div>

          {/* 规格对照（评审用，非上线文案） */}
          <PrototypeSpecCallout>
            {INBOUND_COLLECT_SPEC_SHELF_LIFE_NOTE}
          </PrototypeSpecCallout>
        </div>

        <DialogFooter className="pt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取 消
          </Button>
          <Button type="button" onClick={handleSave}>
            保 存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
