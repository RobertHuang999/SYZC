import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RelatedOrderOption } from "../domain/form-types"

type RelatedOrderPickerDialogProps = {
  open: boolean
  title: string
  rows: RelatedOrderOption[]
  onOpenChange: (open: boolean) => void
  onSelect: (row: RelatedOrderOption) => void
}

export function RelatedOrderPickerDialog({
  open,
  title,
  rows,
  onOpenChange,
  onSelect,
}: RelatedOrderPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-12">序号</TableHead>
                <TableHead className="w-[140px]">抵押单号</TableHead>
                <TableHead className="w-24">货主名称</TableHead>
                <TableHead className="w-28">货主标识</TableHead>
                <TableHead className="min-w-[200px]">货物</TableHead>
                <TableHead className="w-36">抵押时间</TableHead>
                <TableHead className="w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-mono text-xs">{row.orderNo}</TableCell>
                  <TableCell>{row.ownerName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.ownerIdentifierMasked}
                  </TableCell>
                  <TableCell className="text-xs leading-snug">
                    {row.goodsSummary.slice(0, 2).map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                    {row.goodsSummary.length > 2 ? (
                      <div className="text-muted-foreground">更多…</div>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">
                    {row.mortgageTime}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => {
                        onSelect(row)
                        onOpenChange(false)
                      }}
                    >
                      选择
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">共 {rows.length} 条</p>
      </DialogContent>
    </Dialog>
  )
}
