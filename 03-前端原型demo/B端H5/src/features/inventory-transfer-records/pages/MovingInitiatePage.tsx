import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Camera, CalendarDays, Plus, Store } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { MobileDownSelectSheet } from "@/features/inbound-records/components/MobileDownSelectSheet"
import { MovingStepBar } from "../components/MovingStepBar"
import { MOVING_FLOW_TYPES } from "../domain/constants"
import {
  MOVING_OWNER_CANDIDATES,
  RELATED_PLEDGE_ORDERS,
  type MovingOwnerCandidate,
} from "../mock/moving-form.mock"
import {
  loadMovingSession,
  saveMovingSession,
  type MovingFormState,
} from "../lib/moving-initiate-session"

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=500&q=80",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=500&q=80",
]

export function MovingInitiatePage() {
  const navigate = useNavigate()
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [formState, setFormState] = useState<MovingFormState>(() => loadMovingSession())
  const [dirty, setDirty] = useState(false)
  const [ownerSelectOpen, setOwnerSelectOpen] = useState(false)
  const [typeSelectOpen, setTypeSelectOpen] = useState(false)
  const [orderSelectOpen, setOrderSelectOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const patch = (next: Partial<MovingFormState>) => {
    setFormState((prev) => ({ ...prev, ...next }))
    setDirty(true)
  }

  const handleOwnerTypeChange = (type: 1 | 2) => {
    const candidate = MOVING_OWNER_CANDIDATES.find((item) => item.ownerType === type)
    if (!candidate) return
    patch({
      ownerType: type,
      ownerId: candidate.ownerId,
      ownerName: candidate.ownerName,
      ownerIdentity: candidate.ownerIdentity,
      ownerMobile: candidate.ownerMobile,
    })
  }

  const handleSelectOwner = (candidate: MovingOwnerCandidate) => {
    patch({
      ownerType: candidate.ownerType,
      ownerId: candidate.ownerId,
      ownerName: candidate.ownerName,
      ownerIdentity: candidate.ownerIdentity,
      ownerMobile: candidate.ownerMobile,
    })
    setOwnerSelectOpen(false)
  }

  const handleSelectType = (typeId: string) => {
    const matched = MOVING_FLOW_TYPES.find((item) => item.id === typeId)
    patch({
      flowType: (matched?.id ?? "NORMAL") as MovingFormState["flowType"],
      relatedOrderId: "",
      relatedOrderCode: "",
    })
    setTypeSelectOpen(false)
  }

  const handleAddPhoto = () => {
    if (formState.pictureScene.length >= 10) {
      showToast("现场照片最多只允许上传 10 张")
      return
    }
    const nextPhoto = SAMPLE_PHOTOS[formState.pictureScene.length % SAMPLE_PHOTOS.length]
    patch({ pictureScene: [...formState.pictureScene, nextPhoto] })
  }

  const handleRemovePhoto = (index: number) => {
    patch({ pictureScene: formState.pictureScene.filter((_, idx) => idx !== index) })
  }

  const handleBack = () => {
    if (dirty) {
      setLeaveOpen(true)
      return
    }
    navigate("/m/tasks")
  }

  const handleNext = () => {
    if (!formState.moveDate) {
      showToast("请选择移库日期")
      return
    }
    if (formState.flowType !== "NORMAL" && !formState.relatedOrderCode) {
      showToast("非普通移库须先选择关联单号")
      return
    }
    if (formState.pictureScene.length === 0) {
      showToast("移库现场照片为强管控要素，至少需上传 1 张")
      return
    }
    saveMovingSession(formState)
    setDirty(false)
    navigate("/m/transfer/initiate/goods")
  }

  const currentTypeName =
    MOVING_FLOW_TYPES.find((type) => type.id === formState.flowType)?.name || "普通移库"
  const datetimeLocalValue = formState.moveDate
    ? formState.moveDate.slice(0, 16).replace(" ", "T")
    : ""

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["moving-h5-initiate"]}>
        <NavBar title="移库单填写" onBack={handleBack} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        <MovingStepBar currentStep={0} />

        <NativeInfoCard title="货主信息" icon={<Building2 className="size-5" />}>
          <NativeFormRow label="货主类型" required>
            <div className="flex gap-6">
              {(
                [
                  { value: 2 as const, label: "企业" },
                  { value: 1 as const, label: "个人" },
                ] as const
              ).map(({ value, label }) => {
                const active = formState.ownerType === value
                return (
                  <button
                    key={value}
                    type="button"
                    className={`flex h-[26px] w-14 items-center justify-center rounded-md text-sm ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "bg-[#232D39]/5 text-[#232D39]/60"
                    }`}
                    onClick={() => handleOwnerTypeChange(value)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </NativeFormRow>

          <NativeFormRow label="货主名称" required showChevron onClick={() => setOwnerSelectOpen(true)}>
            <span className="truncate text-[#232D39]">{formState.ownerName || "请选择货主"}</span>
          </NativeFormRow>

          <NativeFormRow label="货主标识" required>
            <span className="text-[#232D39]/80">{formState.ownerMobile || "—"}</span>
          </NativeFormRow>

          <NativeFormRow label={formState.ownerType === 1 ? "身份证号" : "统一社会信用代码"} required>
            <span className="truncate text-[#232D39]/80">
              {formState.ownerIdentity || "—"}
            </span>
          </NativeFormRow>
        </NativeInfoCard>

        <NativeInfoCard title="移库信息" icon={<Store className="size-5" />}>
          <NativeFormRow
            label="移库日期"
            required
            onClick={() =>
              dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()
            }
          >
            <span className="text-[#232D39]">{formState.moveDate || "请选择"}</span>
            <CalendarDays className="size-4 text-[#232D39]/50" />
          </NativeFormRow>
          <input
            ref={dateInputRef}
            type="datetime-local"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            value={datetimeLocalValue}
            onChange={(event) => {
              if (!event.target.value) return
              patch({ moveDate: event.target.value.replace("T", " ") })
            }}
          />

          <NativeFormRow label="移库类型" required showChevron onClick={() => setTypeSelectOpen(true)}>
            <span className="text-[#232D39]">{currentTypeName}</span>
          </NativeFormRow>

          {formState.flowType !== "NORMAL" ? (
            <NativeFormRow label="关联单号" required showChevron onClick={() => setOrderSelectOpen(true)}>
              <span
                className={
                  formState.relatedOrderCode ? "text-blue-600" : "text-[#232D39]/30"
                }
              >
                {formState.relatedOrderCode || "请选择关联单号"}
              </span>
            </NativeFormRow>
          ) : null}

          <div className="relative mt-3 rounded-lg bg-[#232D39]/5 p-3">
            <textarea
              className="min-h-[60px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
              placeholder="备注"
              maxLength={140}
              value={formState.remark}
              onChange={(event) => patch({ remark: event.target.value })}
            />
            <p className="text-right text-xs text-[#232D39]/30">
              {formState.remark.length}/140
            </p>
          </div>

          <div className="space-y-2 border-t border-[#232D39]/10 py-3.5">
            <div className="flex items-center justify-between text-sm text-[#232D39]">
              <span>
                <span className="mr-0.5 text-[#EF3E3E]">*</span>现场照片
              </span>
              <span className="text-xs text-[#232D39]/40">
                {formState.pictureScene.length}/10
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {formState.pictureScene.map((photo, index) => (
                <div
                  key={`${photo}-${index}`}
                  className="relative size-16 overflow-hidden rounded-lg border border-[#232D39]/10"
                >
                  <img src={photo} alt="现场照片" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white"
                    aria-label="删除照片"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formState.pictureScene.length < 10 ? (
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="flex size-16 flex-col items-center justify-center rounded-lg border border-dashed border-[#232D39]/20 bg-[#232D39]/[0.02] text-[#232D39]/50 active:bg-[#232D39]/5"
                >
                  <Camera className="size-5" />
                  <span className="mt-0.5 text-[10px]">拍照上传</span>
                </button>
              ) : null}
            </div>
            <p className="text-[11px] text-[#232D39]/45">
              注：图片格式为 jpg、png、jpeg，最多支持上传 10 个文件
            </p>
          </div>
        </NativeInfoCard>

        <button
          type="button"
          className="mt-4 flex h-[52px] w-full items-center justify-center rounded-lg bg-blue-600 text-base font-medium text-white active:bg-blue-700"
          onClick={handleNext}
        >
          下一步
        </button>
      </div>

      {/* 货主选择 */}
      <MobileDownSelectSheet
        open={ownerSelectOpen}
        title="选择货主"
        options={MOVING_OWNER_CANDIDATES.filter(
          (candidate) => candidate.ownerType === formState.ownerType
        ).map((candidate) => ({
          id: candidate.ownerId,
          label: `${candidate.ownerName}（${candidate.ownerIdentity}）`,
        }))}
        selectedId={formState.ownerId}
        onClose={() => setOwnerSelectOpen(false)}
        onSelect={(option) => {
          const candidate = MOVING_OWNER_CANDIDATES.find(
            (item) => item.ownerId === option.id
          )
          if (candidate) handleSelectOwner(candidate)
        }}
      />

      {/* 移库类型选择 */}
      <MobileDownSelectSheet
        open={typeSelectOpen}
        title="选择移库类型"
        options={MOVING_FLOW_TYPES.map((type) => ({ id: type.id, label: type.name }))}
        selectedId={formState.flowType}
        onClose={() => setTypeSelectOpen(false)}
        onSelect={(option) => handleSelectType(option.id)}
      />

      {/* 关联单号选择 */}
      <MobileDownSelectSheet
        open={orderSelectOpen}
        title="选择关联单号"
        options={RELATED_PLEDGE_ORDERS.map((order) => ({
          id: order.id,
          label: `${order.code}（${order.repoName} · ${order.totalAmount}${order.unit}）`,
        }))}
        selectedId={formState.relatedOrderId}
        onClose={() => setOrderSelectOpen(false)}
        onSelect={(option) => {
          const order = RELATED_PLEDGE_ORDERS.find((item) => item.id === option.id)
          if (!order) return
          patch({
            relatedOrderId: order.id,
            relatedOrderCode: order.code,
            ownerId: MOVING_OWNER_CANDIDATES.find(
              (candidate) => candidate.ownerName === order.ownerName
            )?.ownerId ?? formState.ownerId,
          })
          setOrderSelectOpen(false)
        }}
      />

      {leaveOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-4">
            <p className="font-medium">确认离开</p>
            <p className="mt-2 text-sm text-gray-600">
              当前填写内容尚未保存，离开将丢失未提交的数据。确定离开吗？
            </p>
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
                onClick={() => navigate("/m/tasks")}
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
