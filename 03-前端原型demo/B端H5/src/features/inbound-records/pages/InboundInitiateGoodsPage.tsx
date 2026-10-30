import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { markStagingConverted } from "@prototype/shared/inbound/inbound-staging.mock"
import { generateMockInboundOrderNo } from "@prototype/shared/inbound/mock-inbound-order-no"
import { INBOUND_FORM_MESSAGES } from "@prototype/shared/inbound/form-messages"
import { getSkuById } from "@prototype/shared/goods/goods-sku-catalog"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { InboundFormSummaryBarMobile } from "../components/InboundFormSummaryBarMobile"
import { InboundGoodsLineCardMobile } from "../components/InboundGoodsLineCardMobile"
import { NativeInboundStepBar } from "../components/NativeInboundStepBar"
import type { InboundFormState } from "../domain/form-types"
import {
  INBOUND_INITIATE_ROUTE,
  INBOUND_INITIATE_RESUME_STATE,
  INBOUND_LIST_ROUTE,
} from "../domain/constants"
import { EXISTING_OWNERS } from "../mock/inbound-form.mock"
import {
  calcFormTotals,
  createEmptyGoodsLine,
  findFirstUnstackedLine,
  normalizeGoodsLine,
} from "../lib/inbound-form-utils"
import {
  buildMobileDetailFromInitiateForm,
  prependMobileInboundListItem,
  registerMobileInboundDetailOverride,
} from "../lib/mobile-detail-utils"
import {
  clearInboundInitiateSession,
  loadInboundInitiateForm,
  saveInboundInitiateForm,
} from "../lib/inbound-initiate-session"

export function InboundInitiateGoodsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sourceRegId = searchParams.get("sourceRegId")
  const [form, setForm] = useState<InboundFormState | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const saved = loadInboundInitiateForm()
    if (!saved?.inboundType) {
      navigate(INBOUND_INITIATE_ROUTE, { replace: true })
      return
    }
    setForm({
      ...saved,
      goodsLines: (saved.goodsLines ?? []).map((line) => normalizeGoodsLine(line)),
    })
  }, [navigate])

  const patch = (p: Partial<InboundFormState>) => {
    setForm((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...p }
      saveInboundInitiateForm(next)
      return next
    })
  }

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const totals = useMemo(
    () => calcFormTotals(form?.goodsLines ?? []),
    [form?.goodsLines]
  )

  if (!form) {
    return (
      <MobileShell>
        <NavBar
          title="入库单填写"
          onBack={() => navigate(INBOUND_INITIATE_ROUTE, { state: INBOUND_INITIATE_RESUME_STATE })}
        />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          加载中…
        </div>
      </MobileShell>
    )
  }

  const validateGoods = (): boolean => {
    if (form.goodsLines.length === 0) {
      showToast(INBOUND_FORM_MESSAGES.needGoods)
      return false
    }
    const missingSku = form.goodsLines.find((l) => !l.skuId)
    if (missingSku) {
      showToast("请为每条货品选择大类、品类及货品规格")
      return false
    }
    const emptyMeasure = form.goodsLines.find((l) => l.measureValue.trim() === "")
    if (emptyMeasure) {
      showToast(INBOUND_FORM_MESSAGES.needMeasure)
      return false
    }

    // 入库收集项：必填强校验 + 区间/百分比/保质期/日期常识校验（对齐 06/07 全链路规则）
    for (const line of form.goodsLines) {
      const sku = getSkuById(line.skuId)
      if (!sku) continue

      for (const field of sku.inboundCollect) {
        const raw = (line.collectValues[field.fieldKey] ?? "").trim()
        if (field.control === "range") {
          const [min = "", max = ""] = raw.split("|").map((s) => s.trim())
          if (field.required && (!min || !max)) {
            showToast(`请完整填写「${field.label}」的最小值和最大值`)
            return false
          }
          if ((min && !max) || (!min && max)) {
            showToast(`请完整填写「${field.label}」的最小值和最大值`)
            return false
          }
          if (min && max && Number(min) > Number(max)) {
            showToast(`「${field.label}」最小值不能大于最大值，请核对`)
            return false
          }
          continue
        }

        if (field.required && !raw) {
          showToast(`请填写「${field.label}」`)
          return false
        }

        if (field.control === "percent" && raw) {
          const n = Number(raw)
          if (!Number.isFinite(n) || n < 0 || n > 100) {
            showToast(`「${field.label}」须为 0 至 100 之间的有效百分比数值`)
            return false
          }
        }

        if (field.control === "period" && raw) {
          const n = Number(raw)
          if (!Number.isInteger(n) || n < 1 || n > 9999) {
            showToast(`「${field.label}」须为 1 至 9999 的正整数`)
            return false
          }
          if (!field.unitLocked && !(line.collectValues[`${field.fieldKey}Unit`] ?? field.unit ?? "").trim()) {
            showToast(`请选择「${field.label}」的单位`)
            return false
          }
        }
      }

      const productionField = sku.inboundCollect.find(
        (field) => field.label === "生产日期"
      )
      const expiryField = sku.inboundCollect.find((field) => field.label === "过期时间")
      if (productionField && expiryField) {
        const productionDate = line.collectValues[productionField.fieldKey]
        const expiryDate = line.collectValues[expiryField.fieldKey]
        if (productionDate && expiryDate && expiryDate <= productionDate) {
          showToast("过期时间必须晚于生产日期，请核对实物包装")
          return false
        }
      }
    }
    const badLine = findFirstUnstackedLine(form.goodsLines)
    if (badLine) {
      showToast(INBOUND_FORM_MESSAGES.unstacked)
      return false
    }
    if (form.goodsLines.some((l) => l.sitePhotoCount < 1)) {
      showToast(INBOUND_FORM_MESSAGES.needPhoto)
      return false
    }
    return true
  }

  const submitCore = () => {
    const orderNo = generateMockInboundOrderNo()
    const detail = buildMobileDetailFromInitiateForm(form, orderNo)
    const listId = `m-inbound-${Date.now()}`
    detail.id = listId
    registerMobileInboundDetailOverride(listId, detail)
    prependMobileInboundListItem(form, orderNo, listId)
    if (sourceRegId) {
      markStagingConverted(sourceRegId, orderNo)
    }
    clearInboundInitiateSession()
    showToast(
      sourceRegId
        ? `${INBOUND_FORM_MESSAGES.submitSuccess}；暂存 ${sourceRegId} 已回写【已转正式】`
        : INBOUND_FORM_MESSAGES.submitSuccess,
    )
    window.setTimeout(() => navigate(INBOUND_LIST_ROUTE), 1200)
  }

  const handleSubmit = () => {
    if (!validateGoods()) return
    const isNew =
      form.isNewOwner ||
      (form.ownerName.trim().length > 0 && !EXISTING_OWNERS.has(form.ownerName.trim()))
    patch({ isNewOwner: isNew })
    // 对齐 11yuanma 现网：直接提交入库单，不强制触发短信验证码弹窗阻断
    submitCore()
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["inbound-h5-initiate-goods"]}>
        <NavBar
          title="入库单填写"
          onBack={() => navigate(INBOUND_INITIATE_ROUTE, { state: INBOUND_INITIATE_RESUME_STATE })}
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
              onClick={() => {
                if (form.storeroomIds.length === 0) {
                  showToast(INBOUND_FORM_MESSAGES.needStoreroomFirst)
                  return
                }
                patch({ goodsLines: [...form.goodsLines, createEmptyGoodsLine()] })
              }}
            >
              <Plus className="size-4" />
              添加货物
            </button>
          </div>
          <div className="mt-3 space-y-1 text-xs text-[#232D39]/80">
            <p>货品品类数：{totals.categoryCount}</p>
            <p>货品总数量：{totals.goodsTotal}</p>
            <p>理货堆放数：{totals.stackedTotal}</p>
          </div>
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
              patch({ goodsLines: form.goodsLines.filter((l) => l.id !== line.id) })
            }
          />
        ))}
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
          onClick={() =>
            navigate(INBOUND_INITIATE_ROUTE, { state: INBOUND_INITIATE_RESUME_STATE })
          }
        >
          上一步
        </button>
        <button
          type="button"
          className="flex h-[44px] flex-[1.2] items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
          onClick={handleSubmit}
        >
          提交审核
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
