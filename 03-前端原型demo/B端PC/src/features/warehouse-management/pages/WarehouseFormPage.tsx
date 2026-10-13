import { useEffect, useMemo, useState } from "react"
import { ArrowLeftIcon } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { warehouseManagementDocuments } from "../documents/warehouse-management-documents"
import { WarehouseFormBody } from "../components/WarehouseFormBody"
import { WAREHOUSE_LIST_PATH } from "../domain/constants"
import { warehousesMock } from "../mock/warehouses.mock"
import type { WarehouseRecord } from "../domain/types"
import {
  createEmptyWarehouseFormState,
  formStateToWarehousePayload,
  warehouseRecordToFormState,
  type WarehouseFormState,
} from "../lib/warehouse-form-state"
import { WAREHOUSE_REGION_OPTIONS } from "../domain/form-constants"

function findWarehouse(id: string | undefined) {
  if (!id) return undefined
  return warehousesMock.find((item) => item.id === id)
}

function regionLabelFromKey(key: string) {
  const [province, city, district] = key.split("|")
  const hit = WAREHOUSE_REGION_OPTIONS.find(
    (item) =>
      item.province === province &&
      item.city === city &&
      item.district === district
  )
  if (hit) {
    return `${hit.province}${hit.city}${hit.district}`
  }
  return [province, city, district].filter(Boolean).join("")
}

export function WarehouseFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const existing = useMemo(() => findWarehouse(id), [id])

  const [form, setForm] = useState<WarehouseFormState>(() =>
    existing ? warehouseRecordToFormState(existing) : createEmptyWarehouseFormState()
  )
  const [dirty, setDirty] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const pageTitle = isEdit
    ? `编辑仓库 — ${form.name.trim() || existing?.name || "仓库"}`
    : "新增仓库"
  const zhongdengDisabled = form.managerType === "INDIVIDUAL"

  useEffect(() => {
    if (!dirty) return
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [dirty])

  const showToast = (message: string, durationMs = 2600) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), durationMs)
  }

  if (isEdit && !existing) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(WAREHOUSE_LIST_PATH)}>
          <ArrowLeftIcon />
          返回
        </Button>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应仓库
        </div>
      </div>
    )
  }

  const handleNavigateAway = () => {
    if (dirty && !window.confirm("当前有未保存的修改，确认离开吗？")) {
      return
    }
    if (isEdit && existing) {
      navigate(`${WAREHOUSE_LIST_PATH}/详情/${existing.id}`)
      return
    }
    navigate(WAREHOUSE_LIST_PATH)
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast("请填写仓库名称")
      return
    }
    if (!form.addressDetail.trim()) {
      showToast("请填写仓库详细地址")
      return
    }
    if (form.warehouseTypes.length === 0) {
      showToast("请至少选择一种仓库类型")
      return
    }
    if (
      form.zhongdengAccess === "YES" &&
      !zhongdengDisabled &&
      !form.zhongdengId.trim()
    ) {
      showToast("已准入时请填写中仓登仓库 ID")
      return
    }

    const payload = formStateToWarehousePayload(form, regionLabelFromKey(form.regionKey))
    const now = new Date().toISOString().slice(0, 19).replace("T", " ")

    if (existing) {
      Object.assign(existing, payload, { updatedAt: now, version: existing.version + 1 })
      setDirty(false)
      showToast("保存成功")
      window.setTimeout(() => {
        navigate(`${WAREHOUSE_LIST_PATH}/详情/${existing.id}`)
      }, 600)
      return
    }

    const newRecord: WarehouseRecord = {
      id: `wh-new-${Date.now()}`,
      status: "ENABLED",
      createdBy: "当前用户",
      createdAt: now,
      updatedAt: now,
      version: 1,
      storerooms: [],
      facilities: [],
      hasInventory: false,
      zhongdengAccess: payload.zhongdengAccess ?? "NO",
      managerType: payload.managerType ?? "ENTERPRISE",
      managerName: payload.managerName ?? "",
      managerIdNumber: payload.managerIdNumber ?? "",
      managerPhone: payload.managerPhone ?? "",
      ownership: payload.ownership ?? "OWNED",
      name: payload.name ?? "",
      address: payload.address ?? "",
      area: payload.area ?? 1,
      warehouseTypes: payload.warehouseTypes ?? ["通用/常温库"],
      otherTypeName: payload.otherTypeName,
      zhongdengId: payload.zhongdengId,
    }
    warehousesMock.unshift(newRecord)
    setDirty(false)
    showToast("添加成功")
    window.setTimeout(() => {
      navigate(`${WAREHOUSE_LIST_PATH}/详情/${newRecord.id}`)
    }, 600)
  }

  return (
    <PrototypeAnnotationProvider
      title={`${pageTitle} · 原型批注`}
      documents={warehouseManagementDocuments}
      annotations={[]}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["wh-form-page"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleNavigateAway}>
                <ArrowLeftIcon />
                取消
              </Button>
              <Button type="button" onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <WarehouseFormBody
          form={form}
          zhongdengDisabled={zhongdengDisabled}
          onChange={(next) => {
            setDirty(true)
            setForm(next)
          }}
        />

        {toastMessage ? (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
