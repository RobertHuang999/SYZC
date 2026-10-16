import { useEffect, useRef, useState } from "react"
import { Building2, CalendarDays, Package } from "lucide-react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { MobileDownSelectSheet } from "@/features/inbound-records/components/MobileDownSelectSheet"
import { MobileStoreroomMultiSheet } from "@/features/inbound-records/components/MobileStoreroomMultiSheet"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { NativeInboundStepBar } from "@/features/inbound-records/components/NativeInboundStepBar"
import {
  INBOUND_TYPE_OPTIONS,
  inboundTypeNameToCode,
} from "@/features/inbound-records/domain/inbound-type-options"
import type { ManualInboundType } from "@/features/inbound-records/domain/form-types"
import { FORM_WAREHOUSES, FORM_STOREROOMS } from "@/features/inbound-records/mock/inbound-form.mock"
import { formHasDirtyFields } from "@/features/inbound-records/lib/inbound-form-utils"
import { INBOUND_FORM_MESSAGES } from "@prototype/shared/inbound/form-messages"
import { getStagingRegById } from "@prototype/shared/inbound/inbound-staging.mock"
import {
  clearInboundStagingSession,
  loadInboundStagingForm,
  saveInboundStagingForm,
  saveStagingEditId,
} from "../lib/inbound-staging-session"
import { createStagingInitialForm, formFromStagingRegRow, validateStagingBasicStep } from "../lib/staging-form-utils"
import { handleStackBack } from "@/shared/navigation/stack-back"
import {
  H5_INBOUND_INITIATE_ROUTE,
  INBOUND_STAGING_FORM_RESUME,
  INBOUND_STAGING_GOODS_ROUTE,
  INBOUND_STAGING_LIST_ROUTE,
  inboundStagingDetailPath,
} from "../domain/constants"
import { STAGING_P01_BANNER } from "@prototype/shared/inbound/staging-ui-labels"

export function InboundStagingFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("edit")
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(createStagingInitialForm)
  const [typeOpen, setTypeOpen] = useState(false)
  const [warehouseOpen, setWarehouseOpen] = useState(false)
  const [storeroomOpen, setStoreroomOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const resume = (location.state as { resumeStagingDraft?: boolean } | null)?.resumeStagingDraft
    if (resume) {
      const saved = loadInboundStagingForm()
      if (saved) setForm(saved)
      return
    }
    if (editId) {
      const reg = getStagingRegById(editId)
      if (reg && reg.status === "待补全") {
        const next = formFromStagingRegRow(reg)
        setForm(next)
        saveStagingEditId(editId)
        saveInboundStagingForm(next)
        return
      }
    }
    clearInboundStagingSession()
    setForm(createStagingInitialForm())
  }, [location.key, location.state, editId])

  const patch = (p: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...p }))

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const typeCode = inboundTypeNameToCode(form.inboundType)
  const isNormal = typeCode === "NORMAL"

  const warehouseName = FORM_WAREHOUSES.find((w) => w.id === form.warehouseId)?.name
  const storeroomLabel =
    form.storeroomIds.length === 0
      ? ""
      : form.storeroomIds
          .map((id) => FORM_STOREROOMS.find((r) => r.id === id)?.name)
          .filter(Boolean)
          .join("、")

  const toggleStoreroom = (roomIds: string[]) => {
    patch({ storeroomIds: roomIds })
  }

  const goNext = () => {
    const err = validateStagingBasicStep(form)
    if (err) {
      showToast(err)
      return
    }
    saveInboundStagingForm(form)
    navigate(INBOUND_STAGING_GOODS_ROUTE, { state: INBOUND_STAGING_FORM_RESUME })
  }

  const formBackFallback = editId
    ? inboundStagingDetailPath(editId)
    : INBOUND_STAGING_LIST_ROUTE

  const leaveToPrevious = () => {
    handleStackBack(navigate, location, formBackFallback)
  }

  const handleBack = () => {
    if (formHasDirtyFields(form)) {
      setLeaveOpen(true)
      return
    }
    leaveToPrevious()
  }

  const datetimeLocalValue = form.inboundDate.slice(0, 16).replace(" ", "T")
  const title = editId ? "编辑入库暂存登记" : "新增入库暂存登记"

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-blue-50/80 to-[#F2F3F7]">
        <PrototypeAnnotationTarget annotationIds={["inbound-staging-h5-form"]}>
          <NavBar title={title} onBack={handleBack} />
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
          <NativeInboundStepBar current={0} />

          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {STAGING_P01_BANNER}
          </div>

          <NativeInfoCard title="现场说明" icon={<Building2 className="size-5" />}>
            <NativeFormRow label="货主/送货说明">
              <input
                className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                placeholder="档案联想或手填临时说明"
                maxLength={100}
                value={form.ownerName}
                onChange={(e) => patch({ ownerName: e.target.value })}
              />
            </NativeFormRow>
            <p className="px-1 pb-2 text-[11px] leading-relaxed text-[#232D39]/50">
              暂存可手填司机/车牌；转正须选档案货主（P03 · 临时待核）
            </p>
            <div className="relative mt-1 rounded-lg bg-[#232D39]/5 p-3">
              <textarea
                className="min-h-[60px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                placeholder="备注（现场卸车、月台堆放等）"
                maxLength={140}
                value={form.remark}
                onChange={(e) => patch({ remark: e.target.value })}
              />
              <p className="text-right text-xs text-[#232D39]/30">{form.remark.length}/140</p>
            </div>
          </NativeInfoCard>

          <NativeInfoCard title="入库信息" icon={<Package className="size-5" />}>
            <NativeFormRow
              label="入库日期"
              required
              onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
            >
              <span className="text-[#232D39]">{form.inboundDate || "请选择"}</span>
              <CalendarDays className="size-4 text-[#232D39]/50" />
            </NativeFormRow>
            <input
              ref={dateInputRef}
              type="datetime-local"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              value={datetimeLocalValue}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return
                patch({ inboundDate: v.replace("T", " ") + ":00" })
              }}
            />

            <NativeFormRow label="入库类型" required showChevron onClick={() => setTypeOpen(true)}>
              <span className={form.inboundType ? "text-[#232D39]" : "text-[#232D39]/30"}>
                {form.inboundType || "请选择"}
              </span>
            </NativeFormRow>

            {!isNormal && form.inboundType ? (
              <NativeFormRow label="关联单号">
                <input
                  className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                  placeholder="可手填纸质单号"
                  maxLength={50}
                  value={form.relatedOrderNo}
                  onChange={(e) => patch({ relatedOrderNo: e.target.value })}
                />
              </NativeFormRow>
            ) : null}

            {form.inboundType ? (
              <>
                <NativeFormRow
                  label="入库仓库"
                  required
                  showChevron
                  onClick={() => setWarehouseOpen(true)}
                  className={!isNormal && form.inboundType ? "border-t border-[#232D39]/10" : ""}
                >
                  <span className={warehouseName ? "text-[#232D39]" : "text-[#232D39]/30"}>
                    {warehouseName || "请选择"}
                  </span>
                </NativeFormRow>
                <NativeFormRow
                  label="入库库房"
                  showChevron
                  onClick={() => {
                    if (!form.warehouseId) {
                      showToast("请先选择入库仓库")
                      return
                    }
                    setStoreroomOpen(true)
                  }}
                >
                  <span className={storeroomLabel ? "text-[#232D39]" : "text-[#232D39]/30"}>
                    {storeroomLabel || "选填（P04）"}
                  </span>
                </NativeFormRow>
              </>
            ) : null}
          </NativeInfoCard>

          <button
            type="button"
            className="mb-3 w-full rounded-lg border border-[#232D39]/10 bg-white px-3 py-2 text-xs text-[#232D39]/70"
            onClick={() => navigate(H5_INBOUND_INITIATE_ROUTE)}
          >
            切换至【正式入库发起】通道
          </button>

          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-center rounded-lg bg-blue-600 text-base font-medium text-white active:bg-blue-700"
            onClick={goNext}
          >
            下一步
          </button>
        </div>
      </div>

      <MobileDownSelectSheet
        open={typeOpen}
        title="选择入库类型"
        options={INBOUND_TYPE_OPTIONS.map((t) => ({ id: t.id, label: t.name }))}
        selectedId={INBOUND_TYPE_OPTIONS.find((t) => t.name === form.inboundType)?.id}
        onClose={() => setTypeOpen(false)}
        onSelect={(opt) => {
          const item = INBOUND_TYPE_OPTIONS.find((t) => t.id === opt.id)
          if (!item) return
          patch({
            inboundType: item.name as ManualInboundType,
            relatedOrderNo: "",
            warehouseId: "",
            storeroomIds: [],
          })
        }}
      />

      <MobileDownSelectSheet
        open={warehouseOpen}
        title="选择入库仓库"
        options={FORM_WAREHOUSES.map((w) => ({ id: w.id, label: w.name }))}
        selectedId={form.warehouseId}
        onClose={() => setWarehouseOpen(false)}
        onSelect={(opt) => patch({ warehouseId: opt.id, storeroomIds: [] })}
      />

      <MobileStoreroomMultiSheet
        open={storeroomOpen}
        title="选择库房"
        rooms={FORM_STOREROOMS.filter((r) => r.warehouseId === form.warehouseId)}
        selectedIds={form.storeroomIds}
        onClose={() => setStoreroomOpen(false)}
        onConfirm={toggleStoreroom}
      />

      {leaveOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-4">
            <p className="font-medium">确认离开</p>
            <p className="mt-2 text-sm text-gray-600">{INBOUND_FORM_MESSAGES.leaveConfirm}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border py-2 text-sm"
                onClick={() => setLeaveOpen(false)}
              >
                继续编辑
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white"
                onClick={() => {
                  clearInboundStagingSession()
                  leaveToPrevious()
                }}
              >
                离开
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}
