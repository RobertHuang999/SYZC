import { useEffect, useMemo, useState } from "react"
import { Camera, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { InboundFormSummaryBarMobile } from "@/features/inbound-records/components/InboundFormSummaryBarMobile"
import { InboundGoodsLineCardMobile } from "@/features/inbound-records/components/InboundGoodsLineCardMobile"
import { NativeInboundStepBar } from "@/features/inbound-records/components/NativeInboundStepBar"
import type { InboundFormState } from "@/features/inbound-records/domain/form-types"
import {
  calcFormTotals,
  createEmptyGoodsLine,
  normalizeGoodsLine,
} from "@/features/inbound-records/lib/inbound-form-utils"
import { saveStagingReg } from "@prototype/shared/inbound/inbound-staging.mock"
import {
  clearInboundStagingSession,
  loadInboundStagingForm,
  loadStagingEditId,
  saveInboundStagingForm,
} from "../lib/inbound-staging-session"
import {
  buildSavePayload,
  validateStagingGoodsStep,
} from "../lib/staging-form-utils"
import {
  INBOUND_STAGING_FORM_RESUME,
  INBOUND_STAGING_FORM_ROUTE,
  inboundStagingDetailPath,
} from "../domain/constants"

export function InboundStagingGoodsPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<InboundFormState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [photoCount, setPhotoCount] = useState(0)

  useEffect(() => {
    const saved = loadInboundStagingForm()
    if (!saved?.inboundType || !saved.warehouseId) {
      navigate(INBOUND_STAGING_FORM_ROUTE, { replace: true })
      return
    }
    setForm({
      ...saved,
      goodsLines: (saved.goodsLines?.length ? saved.goodsLines : [createEmptyGoodsLine()]).map(
        (line) => normalizeGoodsLine(line),
      ),
    })
  }, [navigate])

  const patch = (p: Partial<InboundFormState>) => {
    setForm((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...p }
      saveInboundStagingForm(next)
      return next
    })
  }

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const totals = useMemo(() => calcFormTotals(form?.goodsLines ?? []), [form?.goodsLines])

  if (!form) {
    return (
      <MobileShell>
        <NavBar
          title="入库暂存登记"
          onBack={() => navigate(INBOUND_STAGING_FORM_ROUTE, { state: INBOUND_STAGING_FORM_RESUME })}
        />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">加载中…</div>
      </MobileShell>
    )
  }

  const handleSave = () => {
    const err = validateStagingGoodsStep(form)
    if (err) {
      showToast(err)
      return
    }
    const editId = loadStagingEditId() ?? undefined
    const payload = buildSavePayload(form, editId)
    if (!payload) {
      showToast("保存失败，请检查必填项")
      return
    }
    const saved = saveStagingReg(payload)
    clearInboundStagingSession()
    showToast(`已保存 ${saved.regNo}`)
    window.setTimeout(() => navigate(inboundStagingDetailPath(saved.id)), 800)
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["inbound-staging-h5-form"]}>
        <NavBar
          title="入库暂存登记"
          onBack={() => navigate(INBOUND_STAGING_FORM_ROUTE, { state: INBOUND_STAGING_FORM_RESUME })}
        />
      </PrototypeAnnotationTarget>

      <NativeInboundStepBar current={1} />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#F2F3F7] px-4 pb-36 pt-1">
        <section className="rounded-lg bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#232D39]">合计信息</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-blue-600"
              onClick={() => patch({ goodsLines: [...form.goodsLines, createEmptyGoodsLine()] })}
            >
              <Plus className="size-4" />
              添加货物
            </button>
          </div>
          <div className="mt-3 space-y-1 text-xs text-[#232D39]/80">
            <p>货品品类数：{totals.categoryCount}</p>
            <p>申报总数量：{totals.goodsTotal}</p>
          </div>
          <p className="mt-2 text-[11px] text-amber-700">暂存弱校验 P02：规格/SKU/现场照非强制</p>
        </section>

        {form.goodsLines.map((line, index) => (
          <InboundGoodsLineCardMobile
            key={line.id}
            index={index}
            line={line}
            form={form}
            onChange={(next) =>
              patch({
                goodsLines: form.goodsLines.map((l) => (l.id === line.id ? next : l)),
              })
            }
            onRemove={() =>
              form.goodsLines.length > 1
                ? patch({ goodsLines: form.goodsLines.filter((l) => l.id !== line.id) })
                : showToast("至少保留一条货品")
            }
          />
        ))}

        <section className="rounded-lg border border-dashed border-[#232D39]/15 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#232D39]">
            <Camera className="size-4 text-blue-600" />
            现场照片（选填 P05）
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-5 text-sm text-blue-600"
            onClick={() => {
              setPhotoCount((c) => Math.min(c + 1, 10))
              showToast("已模拟上传 1 张现场照片")
            }}
          >
            拍照 / 上传 ({photoCount}/10)
          </button>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-20">
        <InboundFormSummaryBarMobile
          categoryCount={totals.categoryCount}
          goodsTotal={totals.goodsTotal}
          stackedTotal={totals.stackedTotal}
          noStackTotal={totals.noStackTotal}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-[#232D39]/10 bg-white p-3 pb-safe">
        <button
          type="button"
          className="flex h-[44px] flex-1 items-center justify-center rounded-lg border border-[#232D39]/20 text-sm text-[#232D39]"
          onClick={() => navigate(INBOUND_STAGING_FORM_ROUTE, { state: INBOUND_STAGING_FORM_RESUME })}
        >
          上一步
        </button>
        <button
          type="button"
          className="flex h-[44px] flex-[1.2] items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
          onClick={handleSave}
        >
          保存登记
        </button>
      </div>

      {toast ? (
        <div className="fixed bottom-32 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}
