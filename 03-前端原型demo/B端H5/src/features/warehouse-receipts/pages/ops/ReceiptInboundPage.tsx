import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Camera, ChevronRight, ImagePlus, Lock, Plus, Trash2, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { getWarehouseTopology } from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import { FaceSignatureSheet } from "../../components/FaceSignatureSheet"
import { ReceiptOpsHeader } from "../../components/ReceiptOpsHeader"
import { ReceiptSelectSheet } from "../../components/ReceiptSheet"
import { getMobileReceiptById } from "../../mock/warehouse-receipts.mock"
import { backToReceiptDetail } from "../../lib/ops-utils"

type GoodsRow = {
  id: string
  name: string
  quantity: string
  unit: string
  position: string
}

export function ReceiptInboundPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const receipt = useMemo(() => getMobileReceiptById(id), [id])
  const topology = useMemo(
    () => getWarehouseTopology(receipt?.warehouseName ?? ""),
    [receipt?.warehouseName],
  )

  const [houseName, setHouseName] = useState("")
  const [zoneName, setZoneName] = useState("")
  const [houseOpen, setHouseOpen] = useState(false)
  const [zoneOpen, setZoneOpen] = useState(false)
  const [rows, setRows] = useState<GoodsRow[]>([
    { id: "row-1", name: "", quantity: "", unit: "公斤", position: "" },
    { id: "row-2", name: "", quantity: "", unit: "公斤", position: "" },
  ])
  const [photos, setPhotos] = useState<string[]>([])
  const [signOpen, setSignOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!receipt) {
    return (
      <MobileShell>
        <NavBar title="仓单入库" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该仓单
        </div>
      </MobileShell>
    )
  }

  const zones =
    topology.houses.find((house) => house.name === houseName)?.zones ?? []

  const patchRow = (rowId: string, patch: Partial<GoodsRow>) =>
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    )

  const submit = () => {
    if (!houseName) {
      showToast("请选择入库库房")
      return
    }
    if (!zoneName) {
      showToast("请选择入库分区")
      return
    }
    const validRows = rows.filter((row) => row.name.trim() || row.quantity)
    if (validRows.length === 0) {
      showToast("请至少填写一行入库货物明细")
      return
    }
    for (const row of validRows) {
      if (!row.name.trim()) {
        showToast("请填写入库货品名称")
        return
      }
      if (!Number(row.quantity) || Number(row.quantity) <= 0) {
        showToast("入库数量必须大于 0")
        return
      }
    }
    if (photos.length === 0) {
      showToast("请至少上传 1 张过磅单或现场核对照片")
      return
    }
    setSignOpen(true)
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-ops-inbound"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <NavBar title="仓单入库" onBack={() => navigate(-1)} />

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-28 pt-3">
            <ReceiptOpsHeader
              receipt={receipt}
              hint="由仓单条目发起入库：入库类型与关联单号已锁定，审批通过后新增批次自动并入本仓单。"
            />

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <h3 className="text-sm font-semibold text-[#232D39]">入库信息</h3>
              <div className="mt-2.5 space-y-2">
                <LockedRow label="入库类型" value="仓单入库" />
                <LockedRow label="关联单号" value={receipt.code} />
                <LockedRow label="货主主体" value={receipt.owner.name} />
                <LockedRow label="入库仓库" value={receipt.warehouseName} />

                <SelectRow
                  label="入库库房"
                  value={houseName}
                  placeholder="请选择库房"
                  onClick={() => setHouseOpen(true)}
                />
                <SelectRow
                  label="入库分区"
                  value={zoneName}
                  placeholder={houseName ? "请选择分区" : "请先选择库房"}
                  disabled={!houseName}
                  onClick={() => setZoneOpen(true)}
                />
              </div>
            </section>

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#232D39]">入库货物明细</h3>
                <button
                  type="button"
                  onClick={() =>
                    setRows((prev) => [
                      ...prev,
                      {
                        id: `row-${Date.now()}`,
                        name: "",
                        quantity: "",
                        unit: "公斤",
                        position: "",
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600 active:bg-blue-100"
                >
                  <Plus className="size-3.5" />
                  添加一行
                </button>
              </div>

              <div className="mt-2.5 space-y-2">
                {rows.map((row, index) => (
                  <div
                    key={row.id}
                    className="rounded-lg border border-[#232D39]/8 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#232D39]/50">
                        货物 {index + 1}
                      </span>
                      {rows.length > 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setRows((prev) => prev.filter((item) => item.id !== row.id))
                          }
                          className="text-[#232D39]/35 active:text-rose-500"
                          aria-label="删除该行"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      ) : null}
                    </div>

                    <input
                      value={row.name}
                      onChange={(event) =>
                        patchRow(row.id, { name: event.target.value })
                      }
                      placeholder="货品名称，如 水果-西瓜-超级-宁夏"
                      className="mt-2 w-full rounded-lg bg-[#232D39]/4 px-3 py-2 text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                    />

                    <div className="mt-2 flex gap-2">
                      <input
                        inputMode="decimal"
                        value={row.quantity}
                        onChange={(event) =>
                          patchRow(row.id, {
                            quantity: event.target.value.replace(/[^\d.]/g, ""),
                          })
                        }
                        placeholder="数量"
                        className="min-w-0 flex-1 rounded-lg bg-[#232D39]/4 px-3 py-2 text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                      />
                      <select
                        value={row.unit}
                        onChange={(event) =>
                          patchRow(row.id, { unit: event.target.value })
                        }
                        className="w-20 rounded-lg bg-[#232D39]/4 px-2 py-2 text-sm text-[#232D39] outline-none"
                      >
                        {["公斤", "斤", "吨", "箱"].map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                      <input
                        value={row.position}
                        onChange={(event) =>
                          patchRow(row.id, { position: event.target.value })
                        }
                        placeholder="垛位"
                        className="w-24 rounded-lg bg-[#232D39]/4 px-3 py-2 text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#232D39]/60">
                  <span className="mr-0.5 text-[#EF3E3E]">*</span>
                  过磅单与现场照片（{photos.length}/10）
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (photos.length >= 10) {
                      showToast("最多上传 10 张照片")
                      return
                    }
                    setPhotos((prev) => [...prev, `入库过磅单-${prev.length + 1}.jpg`])
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600 active:bg-blue-100"
                >
                  <ImagePlus className="size-3.5" />
                  添加照片
                </button>
              </div>
              {photos.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <span
                      key={photo}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#232D39]/5 px-2 py-1 text-[11px] text-[#232D39]/65"
                    >
                      <Camera className="size-3" />
                      {photo}
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos((prev) => prev.filter((_, idx) => idx !== index))
                        }
                        aria-label="移除照片"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-[11px] text-[#232D39]/35">
                  继承入库标准，需上传过磅单与现场核对照片
                </p>
              )}
            </section>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[#232D39]/8 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={submit}
              className="h-11 w-full rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
            >
              提交入库申请
            </button>
          </div>
        </PrototypeAnnotationTarget>

        <ReceiptSelectSheet
          open={houseOpen}
          title="选择入库库房"
          options={topology.houses.map((house) => ({
            id: house.name,
            label: house.name,
            description: `出入库审核：${house.audit}`,
          }))}
          selectedId={houseName}
          onClose={() => setHouseOpen(false)}
          onSelect={(option) => {
            setHouseName(option.id)
            setZoneName("")
          }}
        />

        <ReceiptSelectSheet
          open={zoneOpen}
          title="选择入库分区"
          options={zones.map((zone) => ({ id: zone.name, label: zone.name }))}
          selectedId={zoneName}
          onClose={() => setZoneOpen(false)}
          onSelect={(option) => setZoneName(option.id)}
        />

        <FaceSignatureSheet
          open={signOpen}
          title="仓单入库 · 电子签章"
          description="入库将新增仓单资产批次，须由经办人完成人脸活体识别与短信验证码校验。"
          agreementLabel="本人确认入库货物真实、过磅数据与照片无误，并同意并入本仓单"
          onClose={() => setSignOpen(false)}
          onConfirm={() => {
            setSignOpen(false)
            backToReceiptDetail(
              navigate,
              receipt.id,
              "仓单入库申请已提交，等待审批；通过后新批次自动并入本仓单",
            )
          }}
        />

        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-center text-xs text-white">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}

function LockedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#232D39]/6 px-3 py-2.5">
      <span className="text-xs text-[#232D39]/55">{label}</span>
      <span className="flex min-w-0 items-center gap-1 text-sm text-[#232D39]/55">
        <Lock className="size-3.5 shrink-0" />
        <span className="truncate">{value}</span>
      </span>
    </div>
  )
}

function SelectRow({
  label,
  value,
  placeholder,
  disabled,
  onClick,
}: {
  label: string
  value: string
  placeholder: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg bg-[#232D39]/4 px-3 py-2.5 text-left ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <span className="text-xs text-[#232D39]/55">{label}</span>
      <span className="flex items-center gap-1">
        <span
          className={`text-sm ${value ? "text-[#232D39]" : "text-[#232D39]/30"}`}
        >
          {value || placeholder}
        </span>
        <ChevronRight className="size-3.5 text-[#232D39]/30" />
      </span>
    </button>
  )
}
