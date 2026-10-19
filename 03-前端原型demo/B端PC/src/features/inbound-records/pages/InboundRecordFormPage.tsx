import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { InboundBasicInfoSection } from "../components/InboundBasicInfoSection"
import { InboundFormSummaryBar } from "../components/InboundFormSummaryBar"
import { InboundGoodsSection } from "../components/InboundGoodsSection"
import { RelatedOrderPickerDialog } from "../components/RelatedOrderPickerDialog"
import { OwnerVerifyDialog } from "../components/OwnerVerifyDialog"
import { markContactPhoneVerified } from "@/features/partner-archives/lib/contact-phone-verify"
import { ApprovalFlowSelectDialog } from "../components/ApprovalFlowSelectDialog"
import { ImageViewerModal } from "../components/ImageViewerModal"
import { INBOUND_FORM_MESSAGES } from "@prototype/shared/inbound/form-messages"
import { generateMockInboundOrderNo } from "@prototype/shared/inbound/mock-inbound-order-no"
import { INBOUND_RECORD_LIST_PATH } from "../domain/constants"
import type { InboundFormState } from "../domain/form-types"
import { inboundRecordDocuments } from "../documents/inbound-record-documents"
import { inboundRecordFormAnnotations } from "../annotations/inbound-record-form.annotations"
import {
  calcFormTotals,
  createEmptyGoodsLine,
  createInitialFormState,
  findFirstUnstackedLine,
  formHasDirtyFields,
  validateStoreroomAuditConsistency,
} from "../lib/inbound-form-utils"
import {
  FORM_WAREHOUSES,
  getRelatedOrdersByType,
  resolveOwnerSearchRecord,
} from "../mock/inbound-form.mock"
import { needsOwnerSmsAtSubmit } from "../lib/inbound-owner-verify"
import { partnerArchivesMock } from "@/features/partner-archives/mock/partner-archives.mock"
import {
  inboundAppliesMock,
  inboundRecordsMock,
  CURRENT_USER_NAME,
  CURRENT_USER_ORG,
} from "../mock/inbound-records.mock"
import { InboundStagingSwitchDialog } from "@/features/inbound-staging-reg/components/InboundStagingSwitchDialog"
import { INBOUND_STAGING_FORM_PATH } from "@/features/inbound-staging-reg/domain/constants"
import {
  getStagingRegByNo,
  markStagingConverted,
} from "@/features/inbound-staging-reg/mock/inbound-staging.mock"
import { formFromStagingReg } from "@/features/inbound-staging-reg/lib/staging-form-utils"
import { INBOUND_FORMAL_STAGING_CHANNEL_ENABLED } from "@prototype/shared/inbound/inbound-633-delivery"
import { PartnerQuickCreateSheet } from "@/features/partner-archives/components/PartnerQuickCreateSheet"
import type { PartnerSubject } from "@/features/partner-archives/domain/types"
import { resolveContactPhoneVerified } from "@/features/partner-archives/lib/contact-phone-verify"

export function InboundRecordFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sourceRegId = searchParams.get("sourceRegId")
  const [form, setForm] = useState<InboundFormState>(() => createInitialFormState())
  const [basicExpanded, setBasicExpanded] = useState(true)
  const [goodsExpanded, setGoodsExpanded] = useState(true)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [relatedOpen, setRelatedOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [highlightGoodsId, setHighlightGoodsId] = useState<string | null>(null)

  // 选项 A：完整还原两大业务确认弹窗
  const [ownerVerifyOpen, setOwnerVerifyOpen] = useState(false)
  const [ownerVerifyRequireSms, setOwnerVerifyRequireSms] = useState(false)
  const [flowSelectOpen, setFlowSelectOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // 图片全屏大图预览弹窗
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [stagingSwitchOpen, setStagingSwitchOpen] = useState(false)
  const [ownerQuickCreateOpen, setOwnerQuickCreateOpen] = useState(false)

  const totals = useMemo(() => calcFormTotals(form.goodsLines), [form.goodsLines])

  const patchForm = (patch: Partial<InboundFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2800)
  }

  const applyPartnerOwner = (partner: PartnerSubject) => {
    const isEnterprise = partner.subjectType === "ENTERPRISE"
    patchForm({
      ownerType: isEnterprise ? "企业货主" : "个人货主",
      ownerName: partner.name,
      ownerIdentifier: isEnterprise ? partner.idNumber : partner.contactPhone,
      contactPhone: partner.contactPhone,
      idCardNo: isEnterprise ? "" : partner.idNumber,
      partnerId: partner.id,
      isNewOwner: false,
    })
    showToast(`已绑定货主 ${partner.name}（${resolveContactPhoneVerified(partner) === "VERIFIED" ? "已验证" : "未验证"}）`)
  }

  useEffect(() => {
    if (!INBOUND_FORMAL_STAGING_CHANNEL_ENABLED && sourceRegId) return
    if (!sourceRegId) return
    const reg = getStagingRegByNo(sourceRegId)
    if (!reg) return
    if (reg.inboundType === "仓单入库") {
      showToast("仓单暂存请在手机端「入库发起」转正，PC 新增页不支持仓单制单")
      return
    }
    if (reg.status !== "待补全") {
      showToast(`登记单 ${sourceRegId} 已非待补全，无法再次转正预填`)
      return
    }
    setForm(formFromStagingReg(reg))
    showToast(`已加载暂存登记 ${sourceRegId} 快照预填（Mock）`)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅 sourceRegId 变化时整表预填
  }, [sourceRegId])

  const handleCancel = () => {
    if (formHasDirtyFields(form)) {
      setLeaveOpen(true)
      return
    }
    navigate(-1)
  }

  // 营业执照 OCR 拍照模拟识别
  const handleOcr = () => {
    showToast("正在进行营业执照 OCR 图像识别...")
    window.setTimeout(() => {
      patchForm({
        ownerType: "企业货主",
        ownerName: "四川华西大宗商品供应链管理有限公司",
        ownerIdentifier: "91510100MA6289B51X",
        contactPhone: "028-87654321",
      })
      showToast("营业执照 OCR 识别成功：已自动回填企业全称与统一社会信用代码")
    }, 500)
  }

  // 点击「提交审核」首先进行表单完整度校验
  const handleStartSubmit = () => {
    if (!form.inboundDate) {
      showToast("请填写入库日期")
      return
    }
    if (new Date(form.inboundDate).getTime() > Date.now()) {
      showToast("入库日期不能大于当前时间")
      return
    }
    if (!form.ownerType) {
      showToast("请选择货主类型")
      return
    }
    if (!form.partnerId) {
      showToast("请先搜索选择货主，或通过【快速添加货主】完成建档")
      return
    }
    if (!form.ownerName.trim()) {
      showToast("请填写货主名称")
      return
    }
    if (!form.ownerIdentifier.trim()) {
      showToast("请填写货主标识（统一社会信用代码或手机号）")
      return
    }
    if (!form.warehouseId) {
      showToast("请选择入库仓库")
      return
    }
    if (form.storeroomIds.length === 0) {
      showToast("请选择入库库房")
      return
    }

    const needSystemRelated =
      Boolean(form.inboundType) && form.inboundType !== "普通入库"
    if (needSystemRelated && !form.relatedOrderNo.trim()) {
      showToast("请选择关联单号（非普通入库须绑定系统有效单据，P06）")
      return
    }
    if (needSystemRelated && form.relatedOrderNo.trim()) {
      const orders = getRelatedOrdersByType(form.inboundType)
      const matched = orders.some((o) => o.orderNo === form.relatedOrderNo.trim())
      if (!matched) {
        showToast("关联单号须从系统有效订单中选择，手填单号不可提交正式入库")
        return
      }
    }

    const storeroomAudit = validateStoreroomAuditConsistency(form.storeroomIds)
    if (!storeroomAudit.valid) {
      showToast(storeroomAudit.message || "所选库房属性不一致")
      return
    }

    if (form.goodsLines.length === 0) {
      showToast(INBOUND_FORM_MESSAGES.needGoods)
      return
    }

    const missingSku = form.goodsLines.find((line) => !line.skuId)
    if (missingSku) {
      setHighlightGoodsId(missingSku.id)
      showToast("请为每条货品选择大类、品类及货品规格")
      return
    }

    const emptyMeasure = form.goodsLines.find(
      (line) => line.measureValue.trim() === ""
    )
    if (emptyMeasure) {
      setHighlightGoodsId(emptyMeasure.id)
      showToast(INBOUND_FORM_MESSAGES.needMeasure)
      return
    }

    // 未堆放数量清零强阻断校验（对齐 11yuanma store-apply-info.vue line 2489）
    const badLine = findFirstUnstackedLine(form.goodsLines)
    if (badLine) {
      setHighlightGoodsId(badLine.id)
      showToast(`货品存在未堆放数量，请完成全部堆放后再提交`)
      return
    }

    const needsPhoto = form.goodsLines.some((line) => line.sitePhotoCount < 1)
    if (needsPhoto) {
      showToast(INBOUND_FORM_MESSAGES.needPhoto)
      return
    }

    // 格式校验
    if (form.ownerType === "个人货主") {
      if (form.idCardNo && form.idCardNo.length < 18) {
        showToast("请输入正确的身份证号码（18位）")
        return
      }
      if (form.ownerIdentifier.length < 11) {
        showToast("请输入正确的货主手机号码（11位）")
        return
      }
    } else if (form.ownerType === "企业货主") {
      if (form.ownerIdentifier.length < 18) {
        showToast("请输入正确的公司统一社会信用代码（18位）")
        return
      }
    }

    const archive = resolveOwnerSearchRecord({
      ownerType: form.ownerType,
      ownerName: form.ownerName,
      ownerIdentifier: form.ownerIdentifier,
    })
    const needsSms = needsOwnerSmsAtSubmit(form, archive)

    if (needsSms) {
      setOwnerVerifyRequireSms(true)
      setOwnerVerifyOpen(true)
      return
    }

    setFlowSelectOpen(true)
  }

  // 步骤 2：货主信息及验证码核验通过，打开【流程确认弹窗】
  const handleOwnerVerifySuccess = () => {
    setOwnerVerifyOpen(false)
    setOwnerVerifyRequireSms(false)
    if (form.partnerId) {
      const partner = partnerArchivesMock.find((item) => item.id === form.partnerId)
      if (partner) {
        markContactPhoneVerified(partner)
      }
    }
    setFlowSelectOpen(true)
  }

  // 步骤 3：选择审批流程并完成最终提交
  const handleFlowConfirm = (_flowId: string) => {
    setSubmitLoading(true)

    window.setTimeout(() => {
      setSubmitLoading(false)
      setFlowSelectOpen(false)

      const newApplyOrderNo = generateMockInboundOrderNo()

      // 组装新申请并加入前端 Mock 列表，状态为 0 (待审核)
      const firstLine = form.goodsLines[0]
      const newApplyRow = {
        id: `apply-${Date.now()}`,
        orderNo: newApplyOrderNo,
        inboundTime: form.inboundDate,
        ownerName: form.ownerName,
        ownerType: form.ownerType === "企业货主" ? ("2" as const) : ("1" as const),
        ownerIdentifierMasked:
          form.ownerType === "个人货主"
            ? form.ownerIdentifier.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
            : form.ownerIdentifier,
        ownerMobile: form.ownerType === "个人货主" ? form.ownerIdentifier : form.contactPhone,
        ownerNo: form.ownerType === "企业货主" ? form.ownerIdentifier : form.idCardNo,
        cateName: firstLine?.category || "大宗商品",
        typeName: firstLine?.variety || "品类",
        concatAttrValue: firstLine?.spec || "标准规格",
        goodsSpec: firstLine
          ? `${firstLine.category}-${firstLine.variety}-${firstLine.spec}`
          : "大宗商品",
        amount: totals.goodsTotal,
        unit: firstLine?.measureUnit || "吨",
        inboundType:
          form.inboundType === "质押入库"
            ? "PLEDGE"
            : form.inboundType === "抵押入库"
            ? "MORTGAGE"
            : form.inboundType === "监管服务入库"
            ? "SUPERVISION_SERVICE"
            : "NORMAL",
        inboundTypeLabel: form.inboundType || "普通入库",
        repoName: FORM_WAREHOUSES.find((w) => w.id === form.warehouseId)?.name || "默认仓库",
        houseName: "1号库房, 2号库房",
        operator: "当前制单人(仓储作业部)",
        createByName: "当前制单人",
        createOrgName: "仓储监管一部",
        createByUserId: "USER-CURRENT",
        checkStatus: 0 as const, // 待审核
        fromSource: "1",
        sourceRegId: sourceRegId ?? null,
      }
      inboundAppliesMock.unshift(newApplyRow)

      // 同步插入到入库记录 Mock 列表最前列
      inboundRecordsMock.unshift({
        id: `inbound-${Date.now()}`,
        orderNo: newApplyOrderNo,
        ownerName: form.ownerName,
        ownerType: form.ownerType === "企业货主" ? "2" : "1",
        ownerIdentifierMasked:
          form.ownerType === "个人货主"
            ? form.ownerIdentifier.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
            : form.ownerIdentifier,
        inboundType: form.inboundType || "普通入库",
        inboundDate: form.inboundDate,
        warehouseName: FORM_WAREHOUSES.find((w) => w.id === form.warehouseId)?.name || "默认仓库",
        houseName: "1号库房",
        relatedOrderNo: form.relatedOrderNo || null,
        goodsNames: form.goodsLines.map((g) => `${g.category}-${g.variety}-${g.spec}`),
        inboundQuantity: totals.goodsTotal,
        unit: firstLine?.measureUnit || "吨",
        creatorDisplay: `${CURRENT_USER_NAME}(${CURRENT_USER_ORG})`,
        createByName: CURRENT_USER_NAME,
        createOrgName: CURRENT_USER_ORG,
        createdAt: form.inboundDate,
        checkStatus: 2,
      })

      if (sourceRegId) {
        markStagingConverted(sourceRegId, newApplyOrderNo)
      }

      showToast(`提交审核成功！入库申请单号 ${newApplyOrderNo} 已进入审批流程。`)

      // 平滑跳转至入库记录台账
      window.setTimeout(() => {
        navigate(INBOUND_RECORD_LIST_PATH)
      }, 1000)
    }, 600)
  }

  return (
    <PrototypeAnnotationProvider
      title="新增入库"
      documents={inboundRecordDocuments}
      annotations={inboundRecordFormAnnotations}
    >
      <div className="flex min-h-full flex-col bg-muted/10">
        <div className="flex-1 space-y-4 p-6 pb-4">
          <PrototypeAnnotationTarget annotationIds={["inbound-form-page"]}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">新增入库</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  支持普通/质押/抵押/仓单/监管服务入库；货品三级联动与多库位理货堆放分配
                </p>
              </div>
              <div className="flex items-center gap-2">
                {INBOUND_FORMAL_STAGING_CHANNEL_ENABLED ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setStagingSwitchOpen(true)}
                  >
                    入库暂存登记
                  </Button>
                ) : null}
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  取 消
                </Button>
                <Button type="button" size="sm" onClick={handleStartSubmit}>
                  提交审核
                </Button>
              </div>
            </div>
          </PrototypeAnnotationTarget>

          {INBOUND_FORMAL_STAGING_CHANNEL_ENABLED && sourceRegId ? (
            <div className="rounded-md border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-900">
              暂存转正预填：{sourceRegId}（正式单不展示来源暂存单号；提交成功回写登记单【已转正式】）
            </div>
          ) : null}

          {/* 基础信息卡片 */}
          <PrototypeAnnotationTarget annotationIds={["inbound-form-basic"]}>
            <InboundBasicInfoSection
              form={form}
              expanded={basicExpanded}
              onToggle={() => setBasicExpanded((v) => !v)}
              onChange={patchForm}
              onPickRelatedOrder={() => setRelatedOpen(true)}
              onOcrHint={handleOcr}
              onFormHint={showToast}
              onQuickAddOwner={() => setOwnerQuickCreateOpen(true)}
            />
          </PrototypeAnnotationTarget>

          {/* 货品明细卡片 */}
          <PrototypeAnnotationTarget annotationIds={["inbound-form-goods"]}>
            <InboundGoodsSection
              form={form}
              expanded={goodsExpanded}
              highlightGoodsId={highlightGoodsId}
              onToggle={() => setGoodsExpanded((v) => !v)}
              onAddGoods={() => {
                if (!form.warehouseId || form.storeroomIds.length === 0) {
                  showToast("请先在基础信息中选择入库仓库与库房")
                  return
                }
                patchForm({
                  goodsLines: [
                    ...form.goodsLines,
                    createEmptyGoodsLine(),
                  ],
                })
              }}
              onUpdateLine={(lineId, nextLine) => {
                patchForm({
                  goodsLines: form.goodsLines.map((line) =>
                    line.id === lineId ? nextLine : line
                  ),
                })
              }}
              onRemoveLine={(lineId) => {
                patchForm({
                  goodsLines: form.goodsLines.filter((l) => l.id !== lineId),
                })
              }}
              onPreviewImage={(url) => setPreviewImageUrl(url)}
            />
          </PrototypeAnnotationTarget>
        </div>

        {/* 底部合计栏（对齐源码 store-apply-info.vue total-tip，仅保留合计信息提示） */}
        <div className="sticky bottom-0 z-20 border-t bg-card/95 px-6 py-3 backdrop-blur shadow-xs">
          <InboundFormSummaryBar
            categoryCount={totals.categoryCount}
            goodsTotal={totals.goodsTotal}
            stackedTotal={totals.stackedTotal}
            noStackTotal={totals.noStackTotal}
            variant="footer"
          />
        </div>

        {/* 步骤 1：货主信息确认弹窗 */}
        <OwnerVerifyDialog
          open={ownerVerifyOpen}
          isNewOwner={form.isNewOwner}
          requireSmsVerification={ownerVerifyRequireSms}
          ownerType={form.ownerType}
          ownerName={form.ownerName}
          ownerIdentifier={form.ownerIdentifier}
          contactPhone={form.contactPhone}
          idCardNo={form.idCardNo}
          onOpenChange={(open) => {
            setOwnerVerifyOpen(open)
            if (!open) setOwnerVerifyRequireSms(false)
          }}
          onBack={() => {
            setOwnerVerifyOpen(false)
            setOwnerVerifyRequireSms(false)
          }}
          onConfirm={handleOwnerVerifySuccess}
          onSendSmsHint={(phone) => showToast(`验证码已模拟发送至 ${phone}，演示请输入 123456`)}
        />

        {/* 步骤 2：流程确认对话框 */}
        <ApprovalFlowSelectDialog
          open={flowSelectOpen}
          loading={submitLoading}
          onOpenChange={setFlowSelectOpen}
          onCancel={() => setFlowSelectOpen(false)}
          onConfirm={handleFlowConfirm}
        />

        {/* 关联单据选择弹窗 */}
        <RelatedOrderPickerDialog
          open={relatedOpen}
          inboundType={form.inboundType}
          currentOwnerName={form.ownerName}
          rows={getRelatedOrdersByType(form.inboundType)}
          onOpenChange={setRelatedOpen}
          onSelect={(order) => {
            patchForm({
              relatedOrderNo: order.orderNo,
              relatedOrderLabel: `${order.orderNo} · ${order.ownerName}`,
              ownerName: order.ownerName,
              ownerType: order.ownerType,
              ownerIdentifier: order.ownerIdentifier,
              idCardNo: order.idCardNo || "",
              contactPhone: order.contactPhone || "",
              warehouseId: order.warehouseId || form.warehouseId || FORM_WAREHOUSES[0].id,
            })
            showToast(`已成功关联${order.orderType}【${order.orderNo}】，自动反显货主信息及${order.ownerType === "个人货主" ? "身份证号" : "统一代码"}`)
            setRelatedOpen(false)
          }}
        />

        {INBOUND_FORMAL_STAGING_CHANNEL_ENABLED ? (
          <InboundStagingSwitchDialog
            open={stagingSwitchOpen}
            onClose={() => setStagingSwitchOpen(false)}
            onNavigateBlank={() => {
              setStagingSwitchOpen(false)
              navigate(INBOUND_STAGING_FORM_PATH)
            }}
            onNavigateWithCopy={() => {
              setStagingSwitchOpen(false)
              navigate(INBOUND_STAGING_FORM_PATH, { state: { copyFromFormal: form } })
              showToast("已带入当前表单至暂存登记页（Mock）")
            }}
          />
        ) : null}

        <PartnerQuickCreateSheet
          open={ownerQuickCreateOpen}
          scene="INBOUND_OWNER"
          onOpenChange={setOwnerQuickCreateOpen}
          onCreated={applyPartnerOwner}
          onError={showToast}
        />

        {/* 离开确认对话框 */}
        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>未保存确认</DialogTitle>
              <DialogDescription>
                当前表单存在已编辑内容，离开将丢失未提交的数据。确定返回吗？
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
                  navigate(-1)
                }}
              >
                确定离开
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 图片预览弹窗 */}
        <ImageViewerModal
          open={previewImageUrl !== null}
          images={previewImageUrl ? [previewImageUrl] : []}
          initialIndex={0}
          onClose={() => setPreviewImageUrl(null)}
        />

        {toast ? (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
