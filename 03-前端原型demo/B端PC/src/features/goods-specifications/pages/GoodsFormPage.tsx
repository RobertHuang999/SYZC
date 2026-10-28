import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { AlertCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GOODS_LIST_PATH } from "../domain/constants"
import type { GoodsInboundCollectConfig } from "../domain/types"
import {
  createSku,
  findSku,
  findSubcategory,
  isSkuCombinationTaken,
  listMajorCategories,
  listSubcategories,
  resolveCollectField,
  updateSku,
  useGoodsSpecRevision,
} from "../lib/store"
import { InboundCollectEditor } from "../components/InboundCollectEditor"

type GoodsFormMode = "create" | "edit"

export function GoodsFormPage() {
  useGoodsSpecRevision()
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams] = useSearchParams()
  const mode: GoodsFormMode = id ? "edit" : "create"

  const categories = listMajorCategories()
  const subcategories = listSubcategories()
  const currentSku = id ? findSku(id) : undefined

  // 首帧同步计算初始归属分类
  const initialIds = useMemo(() => {
    if (mode === "edit" && currentSku) {
      const sub = findSubcategory(currentSku.subcategoryId)
      return {
        categoryId: sub?.categoryId ?? "",
        subcategoryId: sub?.id ?? currentSku.subcategoryId,
      }
    }
    const querySubId = searchParams.get("subcategoryId")
    if (querySubId) {
      const sub = findSubcategory(querySubId)
      if (sub) {
        return { categoryId: sub.categoryId, subcategoryId: sub.id }
      }
    }
    const firstEnabledCat = categories.find((c) => c.status === "ENABLED")
    const firstSub = firstEnabledCat
      ? subcategories.find(
          (s) => s.categoryId === firstEnabledCat.id && s.status === "ENABLED"
        )
      : undefined
    return {
      categoryId: firstEnabledCat?.id ?? "",
      subcategoryId: firstSub?.id ?? "",
    }
  }, [mode, currentSku, searchParams, categories, subcategories])

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialIds.categoryId)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(initialIds.subcategoryId)
  const [specValues, setSpecValues] = useState<Record<string, string>>(() =>
    mode === "edit" && currentSku ? { ...currentSku.specValues } : {}
  )
  const [measureParam, setMeasureParam] = useState<string>(() =>
    mode === "edit" && currentSku ? currentSku.measureParam : ""
  )
  const [measureUnit, setMeasureUnit] = useState<string>(() =>
    mode === "edit" && currentSku ? currentSku.measureUnit : ""
  )
  const [inboundCollect, setInboundCollect] = useState<GoodsInboundCollectConfig[]>(() =>
    mode === "edit" && currentSku
      ? currentSku.inboundCollect.map((item) => ({ ...item }))
      : []
  )

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 当外部 currentSku 或路由 ID 变更时同步校准
  useEffect(() => {
    if (mode === "edit" && currentSku) {
      const sub = findSubcategory(currentSku.subcategoryId)
      if (sub) {
        setSelectedCategoryId(sub.categoryId)
        setSelectedSubcategoryId(sub.id)
      }
      setSpecValues({ ...currentSku.specValues })
      setMeasureParam(currentSku.measureParam)
      setMeasureUnit(currentSku.measureUnit)
      setInboundCollect(currentSku.inboundCollect.map((item) => ({ ...item })))
    }
  }, [mode, currentSku])

  // 可选大类（过滤出启用状态或当前关联大类）
  const enabledCategories = useMemo(
    () => categories.filter((c) => c.status === "ENABLED" || c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )

  // 联动可选品类（过滤所属大类下的启用品类或当前关联品类）
  const availableSubcategories = useMemo(() => {
    if (!selectedCategoryId) return []
    return subcategories.filter(
      (s) =>
        s.categoryId === selectedCategoryId &&
        (s.status === "ENABLED" || s.id === selectedSubcategoryId)
    )
  }, [subcategories, selectedCategoryId, selectedSubcategoryId])

  const activeSubcategory = useMemo(
    () => findSubcategory(selectedSubcategoryId),
    [selectedSubcategoryId]
  )

  // 切换大类联动
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId)
    const subs = subcategories.filter(
      (s) => s.categoryId === catId && s.status === "ENABLED"
    )
    const nextSubId = subs[0]?.id ?? ""
    setSelectedSubcategoryId(nextSubId)
    setSpecValues({})
    setDirty(true)
  }

  // 切换品类联动
  const handleSubcategoryChange = (subId: string) => {
    setSelectedSubcategoryId(subId)
    setSpecValues({})
    setDirty(true)
  }

  // 规格输入值变动
  const handleSpecChange = (dimension: string, value: string) => {
    setSpecValues((prev) => ({
      ...prev,
      [dimension]: value,
    }))
    setDirty(true)
  }

  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!dirty) return
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [dirty])

  const handleNavigateAway = () => {
    if (dirty && !window.confirm("当前有未保存的修改，确认离开吗？")) {
      return
    }
    navigate(GOODS_LIST_PATH)
  }

  // 检查已引用入库单锁定
  const isLocked = mode === "edit" && Boolean(currentSku?.hasInboundOrders)

  // 若编辑模式下未找到 SKU
  if (mode === "edit" && !currentSku) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2 border-b pb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(GOODS_LIST_PATH)}
          >
            返回列表
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          未查询到 ID 为「{id}」的货品主档记录，请确认链接参数或返回列表重新选择。
        </div>
      </div>
    )
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)

    if (!selectedCategoryId) {
      setErrorMessage("请选择货品大类")
      return
    }
    if (!selectedSubcategoryId) {
      setErrorMessage("请选择品类")
      return
    }

    // 校验动态规格维度必填
    const dimensions = activeSubcategory?.specDimensions ?? []
    for (const dim of dimensions) {
      if (!specValues[dim] || !specValues[dim].trim()) {
        setErrorMessage(`请输入规格参数【${dim}】`)
        return
      }
    }

    if (!measureParam.trim()) {
      setErrorMessage("请输入或选择计量参数")
      return
    }
    if (!measureUnit.trim()) {
      setErrorMessage("请输入或选择单位")
      return
    }

    // 入库收集项：保质期必须指定固定单位，建议默认数值必须为 1~9999 的正整数
    for (const item of inboundCollect) {
      const field = resolveCollectField(item.fieldId)
      if (field?.isShelfLife) {
        if (!item.shelfLifeUnit) {
          setErrorMessage("请为保质期指定固定单位")
          return
        }
        if (item.suggestedValue?.trim()) {
          const value = Number(item.suggestedValue)
          if (!Number.isInteger(value) || value < 1 || value > 9999) {
            setErrorMessage("建议默认保质期数值需为 1 至 9999 的正整数")
            return
          }
        }
      }
    }

    // 组合唯一性校验 (同一品类下规格组合+计量不可重复)
    const taken = isSkuCombinationTaken(
      selectedSubcategoryId,
      specValues,
      measureParam.trim(),
      measureUnit.trim(),
      id
    )
    if (taken) {
      setErrorMessage("同一品类下已存在相同规格参数组合及计量单位的货品档案，请勿重复创建！")
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === "create") {
        createSku({
          subcategoryId: selectedSubcategoryId,
          specValues,
          measureParam: measureParam.trim(),
          measureUnit: measureUnit.trim(),
          inboundCollect,
        })
        setToastMessage("添加货品成功")
      } else if (id) {
        updateSku(id, {
          subcategoryId: selectedSubcategoryId,
          specValues,
          measureParam: measureParam.trim(),
          measureUnit: measureUnit.trim(),
          inboundCollect,
        })
        setToastMessage("修改货品成功")
      }

      setDirty(false)
      setTimeout(() => {
        navigate(GOODS_LIST_PATH)
      }, 500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-6">
      {/* 顶部操作卡片（对齐 01 整体架构与 04 新增编辑规范） */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              type="button"
              className="hover:text-foreground hover:underline"
              onClick={handleNavigateAway}
            >
              货品管理
            </button>
            <span>/</span>
            <span className="font-medium text-foreground">
              {mode === "create" ? "添加货品" : "编辑货品"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {mode === "create"
              ? "添加货品"
              : `编辑货品 — ${activeSubcategory?.name ?? "货品"} · ${currentSku?.id ?? ""}`}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleNavigateAway}
          >
            取消
          </Button>
          <Button
            type="button"
            disabled={isLocked || isSubmitting}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </div>
      </div>

      {/* 业务拦截/锁定警告 */}
      {isLocked && (
        <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <AlertCircleIcon className="mt-0.5 size-5 shrink-0 text-slate-500" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">入库单业务锁定提示</p>
            <p className="text-muted-foreground leading-relaxed">
              该货品已被仓储入库单业务引用。为保障现场监管、仓单确权及业务流水一致性，基础规格与关键参数已被锁定，不可修改。如需调整单价，请在列表中使用【设置价格】功能。
            </p>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 表单内容 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 卡片 1: 基础信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">基础信息</CardTitle>
            <CardDescription>
              选择货品归属大类与品类，系统将自动带出预设的规格参数维度供填写。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {/* 大类 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  <span className="text-destructive mr-1">*</span>货品大类:
                </Label>
                <Select
                  disabled={isLocked}
                  value={selectedCategoryId}
                  onValueChange={(val) => {
                    if (val) handleCategoryChange(val)
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择货品大类">
                      {(val) => {
                        const cat = categories.find((c) => c.id === val)
                        return cat ? cat.name : "请选择货品大类"
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {enabledCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 品类 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  <span className="text-destructive mr-1">*</span>品类:
                </Label>
                <Select
                  disabled={isLocked || !selectedCategoryId}
                  value={selectedSubcategoryId}
                  onValueChange={(val) => {
                    if (val) handleSubcategoryChange(val)
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择品类">
                      {(val) => {
                        const sub = subcategories.find((s) => s.id === val)
                        return sub ? sub.name : "请选择品类"
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 计量参数 · 与单位同为手动录入（SKU-F02 分离维护） */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  <span className="text-destructive mr-1">*</span>计量参数:
                </Label>
                <Input
                  disabled={isLocked}
                  value={measureParam}
                  placeholder="如：重量、个数、体积"
                  className="h-9"
                  onChange={(e) => {
                    setMeasureParam(e.target.value)
                    setDirty(true)
                  }}
                />
              </div>

              {/* 计量单位 · 字段清单：单行文本（ASCII 如「包」） */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  <span className="text-destructive mr-1">*</span>单位:
                </Label>
                <Input
                  disabled={isLocked}
                  value={measureUnit}
                  placeholder="如：吨、包、桶"
                  className="h-9"
                  onChange={(e) => {
                    setMeasureUnit(e.target.value)
                    setDirty(true)
                  }}
                />
              </div>
            </div>

            {/* 动态规格参数列表 - 一行四个排版 */}
            {activeSubcategory && activeSubcategory.specDimensions.length > 0 && (
              <div className="rounded-lg border border-border/70 bg-slate-50/50 p-4.5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    【{activeSubcategory.name}】规格参数配置
                  </span>
                  <span className="text-xs text-muted-foreground">
                    共 {activeSubcategory.specDimensions.length} 项规格维度（全部必填）
                  </span>
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {activeSubcategory.specDimensions.map((dim) => (
                    <div key={dim} className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground/85">
                        <span className="text-destructive mr-1">*</span>
                        {dim}:
                      </Label>
                      <Input
                        disabled={isLocked}
                        value={specValues[dim] ?? ""}
                        placeholder={`请输入${dim}`}
                        className="h-9 bg-background"
                        onChange={(e) => handleSpecChange(dim, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 卡片 2: 入库收集信息 */}
        <Card className="p-6">
          <InboundCollectEditor
            value={inboundCollect}
            disabled={isLocked}
            onChange={(next) => {
              if (!isLocked) setInboundCollect(next)
            }}
          />
        </Card>
      </form>

      {/* 轻提示（居中黑底白字胶囊） */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
