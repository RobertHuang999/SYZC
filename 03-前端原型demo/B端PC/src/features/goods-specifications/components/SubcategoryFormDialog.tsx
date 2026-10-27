import { useEffect, useState } from "react"
import { MinusIcon } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import type { MajorCategory, Subcategory } from "../domain/types"
import {
  SUBCATEGORY_SPEC_SPEC_DIMENSION_NOTE,
  SUBCATEGORY_USER_CATEGORY_HINT,
  SUBCATEGORY_USER_NAME_HINT,
  SUBCATEGORY_USER_SPEC_HINT,
} from "../lib/goods-spec-ui-labels"

export type SubcategoryFormValues = {
  name: string
  categoryId: string
  specDimensions: string[]
}

type SubcategoryFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  initial?: Subcategory
  categories: MajorCategory[]
  defaultCategoryId?: string
  onOpenChange: (open: boolean) => void
  /** 返回错误文案表示保存失败；返回 null 表示成功 */
  onSubmit: (values: SubcategoryFormValues) => string | null
}

export function SubcategoryFormDialog({
  open,
  mode,
  initial,
  categories,
  defaultCategoryId,
  onOpenChange,
  onSubmit,
}: SubcategoryFormDialogProps) {
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [dimensions, setDimensions] = useState<string[]>([""])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
    setCategoryId(initial?.categoryId ?? defaultCategoryId ?? "")
    setDimensions(
      initial?.specDimensions.length ? [...initial.specDimensions] : [""]
    )
    setError(null)
  }, [open, initial, defaultCategoryId])

  const categoryOptions = categories.filter(
    (category) =>
      category.status === "ENABLED" || category.id === initial?.categoryId
  )

  const updateDimension = (index: number, value: string) => {
    setDimensions((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    )
    if (error) setError(null)
  }

  const addDimension = () => {
    if (dimensions.length >= 5) return
    setDimensions((current) => [...current, ""])
  }

  const removeDimension = (index: number) => {
    if (dimensions.length <= 1) return
    setDimensions((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError("请填写品类名称")
      return
    }
    if (trimmedName.length > 20) {
      setError("品类名称最多 20 个字")
      return
    }
    if (!categoryId) {
      setError("请选择所属大类")
      return
    }
    const trimmedDimensions = dimensions.map((item) => item.trim())
    if (trimmedDimensions.some((item) => !item)) {
      setError("请填写完整的货品规格参数")
      return
    }
    if (new Set(trimmedDimensions).size !== trimmedDimensions.length) {
      setError("货品规格参数不能重名")
      return
    }
    if (trimmedDimensions.length > 5) {
      setError("货品规格参数最多 5 组")
      return
    }

    const submitError = onSubmit({
      name: trimmedName,
      categoryId,
      specDimensions: trimmedDimensions,
    })
    if (submitError) {
      setError(submitError)
      return
    }
    onOpenChange(false)
  }

  const addDisabled = dimensions.length >= 5

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "添加品类" : "编辑品类"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="subcategory-name">
              <span className="mr-1 font-bold text-destructive">*</span>
              品类名称
            </Label>
            <Input
              id="subcategory-name"
              value={name}
              maxLength={20}
              placeholder="请输入品类名称，例如：电解铜"
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError(null)
              }}
              aria-invalid={Boolean(error)}
            />
            <div className="flex items-center justify-between gap-3">
              <ProductFieldHint>{SUBCATEGORY_USER_NAME_HINT}</ProductFieldHint>
              <span className="shrink-0 text-xs text-muted-foreground">
                {name.trim().length}/20
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              <span className="mr-1 font-bold text-destructive">*</span>
              所属大类
            </Label>
            <Select
              value={categoryId}
              onValueChange={(value) => {
                setCategoryId(value ?? "")
                if (error) setError(null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择所属大类">
                  {(val) => {
                    const cat = categoryOptions.find((c) => c.id === val)
                    return cat ? `${cat.name}${cat.status === "DISABLED" ? "（已停用）" : ""}` : "请选择所属大类"
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                    {category.status === "DISABLED" ? "（已停用）" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProductFieldHint>{SUBCATEGORY_USER_CATEGORY_HINT}</ProductFieldHint>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label>
                <span className="mr-1 font-bold text-destructive">*</span>
                货品规格参数
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={addDisabled}
                onClick={addDimension}
                title={addDisabled ? "规格参数最多 5 组" : "添加一组规格参数"}
              >
                添加规格参数
              </Button>
            </div>
            <ProductFieldHint>{SUBCATEGORY_USER_SPEC_HINT}</ProductFieldHint>

            <div className="space-y-2">
              {dimensions.map((dimension, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={dimension}
                    maxLength={20}
                    placeholder={`第 ${index + 1} 个规格参数，例如：牌号`}
                    onChange={(event) => updateDimension(index, event.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={dimensions.length <= 1}
                    onClick={() => removeDimension(index)}
                    title={
                      dimensions.length <= 1 ? "至少保留一组规格参数" : "删除该组规格参数"
                    }
                  >
                    <MinusIcon />
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              当前 {dimensions.length} 组，最多 5 组
            </div>
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>

        <PrototypeSpecCallout>{SUBCATEGORY_SPEC_SPEC_DIMENSION_NOTE}</PrototypeSpecCallout>

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
