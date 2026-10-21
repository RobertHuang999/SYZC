import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { duplicateAddressConflictsMock } from "../mock/platform-basic-config.mock"

type DuplicateAddressDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DuplicateAddressDialog({
  open,
  onOpenChange,
}: DuplicateAddressDialogProps) {
  const conflicts = duplicateAddressConflictsMock

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>历史重复证件地址排查结果</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          系统中已存在 {conflicts.length}{" "}
          组个人货主的地址重复。若开启一人一址校验，以下主体在档案绑货主或快捷建档时将可能被拦截：
        </p>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="border-b px-3 py-2 font-medium">冲突地址</th>
                <th className="border-b px-3 py-2 font-medium">冲突主体 1</th>
                <th className="border-b px-3 py-2 font-medium">冲突主体 2</th>
              </tr>
            </thead>
            <tbody>
              {conflicts.map((row) => (
                <tr key={row.address} className="border-b last:border-0">
                  <td className="px-3 py-3 align-top">{row.address}</td>
                  <td className="px-3 py-3 align-top">{row.subject1}</td>
                  <td className="px-3 py-3 align-top">{row.subject2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          建议：请先前往「用户中心 → 合作方档案 → 货主信息」核实修正重复地址后再开启一人一址校验。
        </p>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
