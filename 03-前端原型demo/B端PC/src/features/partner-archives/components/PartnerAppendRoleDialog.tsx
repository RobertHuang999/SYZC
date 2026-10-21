import { useEffect, useMemo, useState, type MouseEvent } from "react"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PartnerSubject } from "../domain/types"
import {
  otherArchiveMenus,
  linkedArchiveMenuLabel,
} from "../lib/linked-partner-archives"

type PartnerAppendRoleDialogProps = {
  partner: PartnerSubject | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (targetMenus: PartnerArchiveMenuLabel[]) => void
}

export function PartnerAppendRoleDialog({
  partner,
  open,
  onOpenChange,
  onConfirm,
}: PartnerAppendRoleDialogProps) {
  const availableMenus = useMemo(() => {
    if (!partner) {
      return []
    }
    const linked = new Set(
      (partner.linkedPartnerArchives ?? []).map((item) => item.targetMenu),
    )
    return otherArchiveMenus(partner.archiveMenu).filter((menu) => !linked.has(menu))
  }, [partner])

  const [selectedMenus, setSelectedMenus] = useState<PartnerArchiveMenuLabel[]>([])
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setSelectedMenus([])
      setConfirmCreateOpen(false)
    }
  }, [open, partner?.id])

  if (!partner) {
    return null
  }

  const toggleMenu = (menu: PartnerArchiveMenuLabel) => {
    setSelectedMenus((current) =>
      current.includes(menu) ? current.filter((item) => item !== menu) : [...current, menu],
    )
  }

  const handlePrimaryConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (selectedMenus.length === 0) {
      return
    }
    setConfirmCreateOpen(true)
  }

  const handleCreateConfirm = () => {
    onConfirm(selectedMenus)
    setConfirmCreateOpen(false)
    onOpenChange(false)
  }

  const linkedSummary =
    partner.linkedPartnerArchives && partner.linkedPartnerArchives.length > 0
      ? partner.linkedPartnerArchives.map((item) => linkedArchiveMenuLabel(item)).join("、")
      : "——"

  return (
    <>
      <Dialog open={open && !confirmCreateOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>追加合作方档案角色</DialogTitle>
            <DialogDescription>
              为「{partner.name}」在其它子菜单创建独立主档或建立关联（当前菜单：{partner.archiveMenu}）。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div className="rounded-md border bg-muted/40 px-3 py-2.5">
              <div className="text-xs text-muted-foreground">已关联其他合作档案</div>
              <div className="mt-1 font-medium leading-relaxed">{linkedSummary}</div>
            </div>

            {availableMenus.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                已关联全部可选子菜单，无需再次追加。
              </p>
            ) : (
              <div className="space-y-2">
                <Label>
                  目标菜单
                  <span className="ml-0.5 font-bold text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {availableMenus.map((menu) => {
                    const isSelected = selectedMenus.includes(menu)
                    return (
                      <Button
                        key={menu}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={cn(!isSelected && "bg-background")}
                        onClick={() => toggleMenu(menu)}
                      >
                        {menu}
                      </Button>
                    )
                  })}
                </div>
                <ProductFieldHint>
                  确认后将在所选菜单为该身份创建独立主档（若该菜单已有同证号主档，则仅建立关联）。
                </ProductFieldHint>
                <PrototypeSpecCallout>
                  【主体识别与库内匹配总则】(PA-R03) · 【合作方子菜单分视图与隐式角色规则】(PA-R12)
                </PrototypeSpecCallout>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button
              type="button"
              disabled={availableMenus.length === 0 || selectedMenus.length === 0}
              onClick={handlePrimaryConfirm}
            >
              下一步
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCreateOpen} onOpenChange={setConfirmCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认创建独立主档</DialogTitle>
            <DialogDescription>
              {selectedMenus.map((m) => `将在【${m}】为该身份创建独立主档（或关联已有主档）`).join("；")}
              。是否继续？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmCreateOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleCreateConfirm}>
              确认创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
