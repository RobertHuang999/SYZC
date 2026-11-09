import { Fragment, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Plus, Trash2, Upload } from "lucide-react"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { relocationRecordDocuments } from "../documents/relocation-record-documents"
import { relocationRecordAnnotations } from "../annotations/relocation-record.annotations"
import { FormPageHeader } from "@/shared/components/FormPageHeader"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  OWNER_OPTIONS,
  RELOCATION_LIST_PATH,
  RELOCATION_TYPE_OPTIONS,
  ROOM_ZONE_OPTIONS,
} from "../domain/constants"
import type { RelocationOwnerType, RelocationType } from "../domain/types"

type FormGoodsLine = {
  id: string
  goodsName: string
  outLocation: string
  outSpecific: string
  inboundTime: string
  barcode: string
  quantity: string
  unit: string
  availableQty: number
  inRoomZone: string
  inSpecific: string
}

const initialGoods: FormGoodsLine[] = []

const templateGoods: Omit<FormGoodsLine, "id"> = {
  goodsName: "黑色金属-热轧卷板-Q235",
  outLocation: "青白江大宗商品监管1号仓-2号库房-常温区",
  outSpecific: "C-12垛位",
  inboundTime: "2026-08-30 13:20:00",
  barcode: "SYZC-BC-20260830-221",
  quantity: "",
  unit: "吨",
  availableQty: 800,
  inRoomZone: "",
  inSpecific: "",
}

const nowLocal = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
    now.getHours(),
  )}:${pad(now.getMinutes())}`
}

export function RelocationRecordFormPage() {
  const navigate = useNavigate()

  const [moveTime, setMoveTime] = useState(nowLocal())
  const [ownerType, setOwnerType] = useState<RelocationOwnerType>("企业")
  const [ownerId, setOwnerId] = useState("")
  const [moveType, setMoveType] = useState<RelocationType>("普通移库")
  const [relatedNo, setRelatedNo] = useState("")
  const [remark, setRemark] = useState("")
  const [goods, setGoods] = useState<FormGoodsLine[]>(initialGoods)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const groupedGoods = useMemo(() => {
    const map = new Map<string, FormGoodsLine[]>()
    for (const line of goods) {
      const lines = map.get(line.goodsName) ?? []
      lines.push(line)
      map.set(line.goodsName, lines)
    }
    return [...map.entries()].map(([name, lines]) => ({ name, lines }))
  }, [goods])

  const removeGroup = (name: string) => {
    setGoods((prev) => prev.filter((line) => line.goodsName !== name))
  }
  const [photos, setPhotos] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [leaveOpen, setLeaveOpen] = useState(false)

  const initialSnapshot = useRef(
    JSON.stringify({ moveTime, ownerType, ownerId, moveType, relatedNo, remark, goods, photos }),
  )
  const isDirty =
    JSON.stringify({ moveTime, ownerType, ownerId, moveType, relatedNo, remark, goods, photos }) !==
    initialSnapshot.current

  const owner = OWNER_OPTIONS.find((item) => item.id === ownerId)
  const requireRelated = moveType === "质押移库" || moveType === "抵押移库"
  const categoryCount = new Set(goods.map((line) => line.goodsName)).size
  const totalQty = goods.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0)

  const handleBack = () => {
    if (isDirty) {
      setLeaveOpen(true)
      return
    }
    navigate(RELOCATION_LIST_PATH)
  }

  const updateLine = (id: string, patch: Partial<FormGoodsLine>) => {
    setGoods((prev) => prev.map((line) => (line.id === id ? { ...line, ...patch } : line)))
  }

  const handleAddGoods = () => {
    setGoods((prev) => [
      ...prev,
      { ...templateGoods, id: `G-${String(prev.length + 1).padStart(3, "0")}` },
    ])
  }

  const handleSubmit = () => {
    if (!owner) {
      setErrorMessage("请选择货主")
      return
    }
    if (requireRelated && !relatedNo.trim()) {
      setErrorMessage("质押移库、抵押移库必须填写关联单号")
      return
    }
    if (goods.length === 0) {
      setErrorMessage("请至少添加一条移库货品")
      return
    }
    for (const line of goods) {
      const qty = Number(line.quantity)
      if (!qty || qty <= 0) {
        setErrorMessage(`货品【${line.goodsName}】的移库数量必须大于 0`)
        return
      }
      if (qty > line.availableQty) {
        setErrorMessage(
          `货品【${line.goodsName}】的移库数量不能超过可用量（${line.availableQty}${line.unit}）`,
        )
        return
      }
      if (!line.inRoomZone) {
        setErrorMessage(`请为货品【${line.goodsName}】选择移入库房/分区`)
        return
      }
    }
    if (photos.length === 0) {
      setErrorMessage("请上传至少一张移库现场照片")
      return
    }
    setErrorMessage(null)
    navigate(RELOCATION_LIST_PATH)
  }

  return (
    <PrototypeAnnotationProvider
      title="新增移库原型批注"
      documents={relocationRecordDocuments}
      annotations={relocationRecordAnnotations}
    >
      <div className="space-y-4 p-6 pb-24">
        <FormPageHeader
          title="新增移库"
          description="同一仓库内更换库房、分区或垛位；质押、抵押移库必须关联对应单据"
          onBack={handleBack}
        />

        <PrototypeSpecCallout>
          移库类型为质押、抵押时必须填写关联单号；移库数量必须大于 0 且不得超过移出储位的可用量；必须选择移入库房与分区；至少上传一张现场照片。仓单移库请到「仓单管理」操作。
        </PrototypeSpecCallout>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm font-semibold">基础信息</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="移库日期" required>
                <Input
                  type="datetime-local"
                  value={moveTime}
                  onChange={(e) => setMoveTime(e.target.value)}
                  className="h-[34px] text-sm"
                />
              </Field>

              <Field label="移库类型" required>
                <Select
                  value={moveType}
                  onValueChange={(val) => setMoveType((val ?? "普通移库") as RelocationType)}
                >
                  <SelectTrigger className="h-[34px] text-sm">
                    <SelectValue>{() => moveType}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {RELOCATION_TYPE_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="仓单移库" disabled>
                      仓单移库（请到仓单管理操作）
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="货主类型" required>
                <Select
                  value={ownerType}
                  onValueChange={(val) => {
                    const next = (val ?? "企业") as RelocationOwnerType
                    setOwnerType(next)
                    const first = OWNER_OPTIONS.find((item) => item.type === next)
                    setOwnerId(first?.id ?? "")
                  }}
                >
                  <SelectTrigger className="h-[34px] text-sm">
                    <SelectValue>{() => ownerType}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="企业">企业</SelectItem>
                    <SelectItem value="个人">个人</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="货主" required>
                <Select
                  value={ownerId}
                  onValueChange={(val) => setOwnerId(val ?? "")}
                >
                  <SelectTrigger className="h-[34px] text-sm">
                    <SelectValue>
                      {() =>
                        OWNER_OPTIONS.find((item) => item.id === ownerId)?.name ?? "请选择货主"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {OWNER_OPTIONS.filter((item) => item.type === ownerType).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="货主标识">
                <Input value={owner?.identifier ?? ""} readOnly className="h-[34px] text-sm bg-slate-50" />
              </Field>

              <Field label="关联单号" required={requireRelated}>
                <Input
                  value={relatedNo}
                  onChange={(e) => setRelatedNo(e.target.value)}
                  disabled={!requireRelated}
                  placeholder={
                    requireRelated ? "请输入质押单 / 抵押单号" : "普通移库无需关联单号"
                  }
                  className="h-[34px] text-sm"
                />
              </Field>

              <Field label="备注" className="sm:col-span-2 lg:col-span-3">
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value.slice(0, 140))}
                  placeholder="填写移库原因或现场说明，最多 140 字"
                  rows={2}
                />
                <div className="text-right text-xs text-muted-foreground">{remark.length}/140</div>
              </Field>
            </div>
          </CardContent>
        </Card>

        <PrototypeAnnotationTarget annotationIds={["relocation-form-goods"]}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b py-3">
              <CardTitle className="text-sm font-semibold">货品明细（{goods.length} 个储位）</CardTitle>
              <Button type="button" size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={handleAddGoods}>
                <Plus className="h-3.5 w-3.5" />
                添加货品
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1280px] text-xs">
                  <thead className="border-b bg-slate-50 text-slate-600">
                    <tr className="h-10">
                      <th className="w-16 px-3 text-center font-semibold">序号</th>
                      <th className="w-60 px-3 text-left font-semibold">货物名称</th>
                      <th className="w-56 px-3 text-left font-semibold">移出位置</th>
                      <th className="w-32 px-3 text-left font-semibold">移出具体位置</th>
                      <th className="w-40 px-3 text-left font-semibold">入库时间</th>
                      <th className="w-40 px-3 text-left font-semibold">移库数量</th>
                      <th className="w-52 px-3 text-left font-semibold">移入库房/分区</th>
                      <th className="w-40 px-3 text-left font-semibold">移入具体位置</th>
                      <th className="w-20 px-3 text-center font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupedGoods.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="h-32 text-center text-muted-foreground">
                          暂无移库货品，请点击右上角【添加货品】
                        </td>
                      </tr>
                    ) : (
                      groupedGoods.map((group, gIdx) => {
                        const isCollapsed = collapsedGroups.has(group.name)
                        const groupQty = group.lines.reduce(
                          (sum, line) => sum + (Number(line.quantity) || 0),
                          0,
                        )
                        return (
                          <Fragment key={group.name}>
                            <tr className="h-[56px] bg-slate-50/70">
                              <td className="px-3 text-center text-muted-foreground">{gIdx + 1}</td>
                              <td colSpan={4} className="px-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCollapsedGroups((prev) => {
                                      const next = new Set(prev)
                                      if (next.has(group.name)) next.delete(group.name)
                                      else next.add(group.name)
                                      return next
                                    })
                                  }
                                  className="flex items-center gap-2 text-left"
                                >
                                  <ChevronDown
                                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                                      isCollapsed ? "-rotate-90" : ""
                                    }`}
                                  />
                                  <span className="font-semibold text-foreground">
                                    {group.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({group.lines.length} 个储位)
                                  </span>
                                </button>
                              </td>
                              <td className="px-3 text-right">
                                <span className="font-medium tabular-nums text-foreground">
                                  {groupQty.toLocaleString("zh-CN", { maximumFractionDigits: 4 })}
                                </span>
                                <span className="ml-1 text-xs text-muted-foreground">
                                  {group.lines[0]?.unit}
                                </span>
                              </td>
                              <td colSpan={2} />
                              <td className="px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeGroup(group.name)}
                                  className="text-xs text-destructive hover:underline"
                                >
                                  <Trash2 className="mr-0.5 inline h-3.5 w-3.5" />
                                  移除
                                </button>
                              </td>
                            </tr>

                            {!isCollapsed &&
                              group.lines.map((line, index) => (
                                <tr key={line.id} className="h-[72px] bg-white">
                                  <td className="px-3 text-center text-muted-foreground">
                                    {index + 1}
                                  </td>
                                  <td className="px-3 pl-8 text-[11px] text-muted-foreground">
                                    {line.barcode}
                                  </td>
                                  <td className="px-3 text-slate-600">
                                    <div className="line-clamp-2">{line.outLocation}</div>
                                  </td>
                                  <td className="px-3 text-slate-600">
                                    {line.outSpecific || "—"}
                                  </td>
                                  <td className="whitespace-nowrap px-3 text-slate-600">
                                    {line.inboundTime}
                                  </td>
                                  <td className="px-3">
                                    <div className="flex items-center gap-1">
                                      <Input
                                        value={line.quantity}
                                        onChange={(e) =>
                                          updateLine(line.id, { quantity: e.target.value })
                                        }
                                        className="h-8 w-20 text-right text-xs"
                                        placeholder="0"
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {line.unit}
                                      </span>
                                      <span className="text-[11px] text-muted-foreground">
                                        可用 {line.availableQty}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3">
                                    <Select
                                      value={line.inRoomZone || undefined}
                                      onValueChange={(val) =>
                                        updateLine(line.id, { inRoomZone: val ?? "" })
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="请选择" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {ROOM_ZONE_OPTIONS.map((option) => (
                                          <SelectItem key={option} value={option}>
                                            {option}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-3">
                                    <Input
                                      value={line.inSpecific}
                                      onChange={(e) =>
                                        updateLine(line.id, {
                                          inSpecific: e.target.value.slice(0, 140),
                                        })
                                      }
                                      placeholder="货架 / 垛位"
                                      className="h-8 text-xs"
                                    />
                                  </td>
                                  <td className="px-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setGoods((prev) =>
                                          prev.filter((item) => item.id !== line.id),
                                        )
                                      }
                                      className="text-xs text-destructive hover:underline"
                                    >
                                      移除
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </Fragment>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm font-semibold">现场照片</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-3">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt="现场照片"
                  className="h-20 w-28 rounded border object-cover"
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setPhotos((prev) => [
                    ...prev,
                    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
                  ])
                }
                className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded border border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Upload className="h-4 w-4" />
                上传照片
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              提交审核前至少上传 1 张现场移位照片，最多 10 张，单张不超过 5MB。
            </p>
          </CardContent>
        </Card>

        {errorMessage && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card px-6 py-3">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                货品品类数：<strong className="text-foreground">{categoryCount}</strong>
              </span>
              <span>
                货品总数量：
                <strong className="text-foreground">
                  {totalQty.toLocaleString("zh-CN", { maximumFractionDigits: 4 })}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 px-4 text-xs" onClick={handleBack}>
                取消
              </Button>
              <Button size="sm" className="h-9 px-5 text-xs" onClick={handleSubmit}>
                提交审核
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存确认</DialogTitle>
              <DialogDescription>
                当前移库申请还有未提交的内容，离开将丢失已填写的货品和储位信息。确定返回列表吗？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeaveOpen(false)}>
                继续编辑
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setLeaveOpen(false)
                  navigate(RELOCATION_LIST_PATH)
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrototypeAnnotationProvider>
  )
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label className="text-xs font-medium text-foreground">
        {required && <span className="mr-0.5 text-rose-500">*</span>}
        {label}
      </label>
      {children}
    </div>
  )
}
