import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  WAREHOUSE_LIST_ROUTE,
  WORKSPACE_ROUTE,
  warehouseDetailPath,
} from "../domain/constants"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { getWarehouseById, warehousesMock } from "../mock/warehouses.mock"
import type { WarehouseRecord } from "../domain/types"
import { WarehouseFormBody } from "../components/WarehouseFormBody"
import {
  createEmptyWarehouseFormState,
  formStateToWarehousePayload,
  regionLabelFromKey,
  warehouseRecordToFormState,
  type WarehouseFormState,
} from "../lib/warehouse-form-state"

type WarehouseFormPageProps = {
  /** 由 `/warehouse-management/:id/edit` 路由挂载 */
  isEditRoute?: boolean
}

export function WarehouseFormPage({ isEditRoute = false }: WarehouseFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = isEditRoute && Boolean(id)
  const existing = useMemo(
    () => (isEdit ? getWarehouseById(id) : undefined),
    [id, isEdit]
  )

  const [form, setForm] = useState<WarehouseFormState>(() =>
    existing ? warehouseRecordToFormState(existing) : createEmptyWarehouseFormState()
  )
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const zhongdengDisabled = form.managerType === "INDIVIDUAL"
  const pageTitle = isEdit
    ? `编辑仓库${form.name.trim() ? ` — ${form.name.trim()}` : ""}`
    : "新增仓库"

  useEffect(() => {
    if (existing) {
      setForm(warehouseRecordToFormState(existing))
      setDirty(false)
    }
  }, [existing?.id])

  useEffect(() => {
    if (!dirty) return
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [dirty])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  if (isEdit && !existing) {
    return (
      <MobileShell>
        <NavBar title="编辑仓库" backTo={WAREHOUSE_LIST_ROUTE} />
        <p className="p-4 text-sm text-gray-500">未找到对应仓库</p>
      </MobileShell>
    )
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast("请填写仓库名称")
      return
    }
    if (!form.regionKey) {
      showToast("请选择省市区")
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

    const payload = formStateToWarehousePayload(
      form,
      regionLabelFromKey(form.regionKey)
    )
    const now = new Date().toISOString().slice(0, 19).replace("T", " ")

    if (existing) {
      Object.assign(existing, payload)
      setDirty(false)
      showToast("保存成功")
      window.setTimeout(() => navigate(warehouseDetailPath(existing.id)), 400)
      return
    }

    const newId = `wh-new-${Date.now()}`
    const newRecord: WarehouseRecord = {
      id: newId,
      status: "ENABLED",
      createdBy: "当前用户",
      createdAt: now,
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
      supervisorType: payload.supervisorType,
      supervisors: payload.supervisors,
      regionalManagerType: payload.regionalManagerType,
      regionalManagers: payload.regionalManagers,
    }
    warehousesMock.unshift(newRecord)
    setDirty(false)
    showToast("添加成功")
    window.setTimeout(() => navigate(warehouseDetailPath(newId)), 400)
  }

  const handleBack = () => {
    if (dirty && !window.confirm("有未保存的修改，确定离开吗？")) {
      return
    }
    if (isEdit && existing) {
      navigate(warehouseDetailPath(existing.id))
      return
    }
    navigate(WORKSPACE_ROUTE)
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget
        annotationIds={[isEdit ? "wh-h5-form-edit" : "wh-h5-form"]}
      >
        <NavBar title={pageTitle} onBack={handleBack} />
      </PrototypeAnnotationTarget>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 pb-24">
        <WarehouseFormBody
          form={form}
          zhongdengDisabled={zhongdengDisabled}
          onChange={(next) => {
            setDirty(true)
            setForm(next)
          }}
        />
      </div>
      <div className="shrink-0 border-t border-gray-100 bg-white p-3">
        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white"
          onClick={handleSave}
        >
          保存
        </button>
      </div>
      {toast ? (
        <div className="fixed bottom-20 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}
