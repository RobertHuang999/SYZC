import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  MAJOR_CATEGORY_SPEC_CASCADE_NOTE,
  MAJOR_CATEGORY_USER_NAME_HINT,
} from "../lib/goods-spec-ui-labels"

type MajorCategoryFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  initialName?: string
  onOpenChange: (open: boolean) => void
  /** 返回错误文案表示保存失败；返回 null 表示成功 */
  onSubmit: (name: string) => string | null
}

export function MajorCategoryFormDialog({
  open,
  mode,
  initialName,
  onOpenChange,
  onSubmit,
}: MajorCategoryFormDialogProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(initialName ?? "")
    setError(null)
  }, [open, initialName])

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError("请填写大类名称")
      return
    }
    if (trimmed.length > 20) {
      setError("大类名称最多 20 个字")
      return
    }
    const submitError = onSubmit(trimmed)
    if (submitError) {
      setError(submitError)
      return
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "添加大类" : "编辑大类"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-1">
          <Label htmlFor="major-category-name">
            <span className="mr-1 font-bold text-destructive">*</span>
            大类名称
          </Label>
          <Input
            id="major-category-name"
            value={name}
            maxLength={20}
            placeholder="请输入大类名称，例如：有色金属"
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                handleSave()
              }
            }}
            aria-invalid={Boolean(error)}
          />
          <div className="flex items-center justify-between gap-3">
            <ProductFieldHint>{MAJOR_CATEGORY_USER_NAME_HINT}</ProductFieldHint>
            <span className="shrink-0 text-xs text-muted-foreground">
              {name.trim().length}/20
            </span>
          </div>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>

        <PrototypeSpecCallout>{MAJOR_CATEGORY_SPEC_CASCADE_NOTE}</PrototypeSpecCallout>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
