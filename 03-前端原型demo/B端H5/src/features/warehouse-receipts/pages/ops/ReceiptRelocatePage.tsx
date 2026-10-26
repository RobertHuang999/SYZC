import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Check, ChevronRight, Lock } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { getWarehouseTopology } from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import { FaceSignatureSheet } from "../../components/FaceSignatureSheet"
import { ReceiptOpsHeader } from "../../components/ReceiptOpsHeader"
import { ReceiptSelectSheet } from "../../components/ReceiptSheet"
import { getMobileReceiptById } from "../../mock/warehouse-receipts.mock"
import { backToReceiptDetail } from "../../lib/ops-utils"
import { cn } from "@/lib/utils"

export function ReceiptRelocatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const receipt = useMemo(() => getMobileReceiptById(id), [id])

  const lots = useMemo(
    () =>
      (receipt?.goodsGroups ?? []).flatMap((group) =>
        group.lots.map((lot) => ({ lot, group })),
      ),
    [receipt],
  )

  const topology = useMemo(
    () => getWarehouseTopology(receipt?.warehouseName ?? ""),
    [receipt?.warehouseName],
  )

  const [selected, setSelected] = useState<string[]>([])
  const [houseName, setHouseName] = useState("")
  const [zoneName, setZoneName] = useState("")
  const [position, setPosition] = useState("")
  const [reason, setReason] = useState("")
  const [houseOpen, setHouseOpen] = useState(false)
  const [zoneOpen, setZoneOpen] = useState(false)
  const [positionOpen, setPositionOpen] = useState(false)
  const [signOpen, setSignOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!receipt) {
    return (
      <MobileShell>
        <NavBar title="仓单移库" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该仓单
        </div>
      </MobileShell>
    )
  }

  const selectedLots = lots.filter((item) => selected.includes(item.lot.id))
  const zones =
    topology.houses.find((house) => house.name === houseName)?.zones ?? []
  const positions =
    zones.find((zone) => zone.name === zoneName)?.positions ?? []

  const submit = () => {
    if (selected.length === 0) {
      showToast("请至少勾选一个拟移库批次")
      return
    }
    if (!houseName) {
      showToast("请选择目标库房")
      return
    }
    if (!zoneName) {
      showToast("请选择目标分区")
      return
    }
    if (positions.length > 0 && !position) {
      showToast("请选择目标具体位置（垛位）")
      return
    }
    setSignOpen(true)
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-ops-relocate"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <NavBar title="仓单移库" onBack={() => navigate(-1)} />

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-28 pt-3">
            <ReceiptOpsHeader
              receipt={receipt}
              hint="仓单货物严禁跨仓库移库，仅支持在同一实体仓库内调整库房、分区与具体垛位。"
            />

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <h3 className="text-sm font-semibold text-[#232D39]">
                选择拟移库批次
              </h3>
              <div className="mt-2.5 space-y-2">
                {lots.map(({ lot, group }) => {
                  const active = selected.includes(lot.id)
                  return (
                    <button
                      key={lot.id}
                      type="button"
                      onClick={() =>
                        setSelected((prev) =>
                          active
                            ? prev.filter((item) => item !== lot.id)
                            : [...prev, lot.id],
                        )
                      }
                      className={cn(
                        "flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2.5 text-left",
                        active
                          ? "border-blue-300 bg-blue-50/50"
                          : "border-[#232D39]/8 bg-white active:bg-[#232D39]/4",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium text-[#232D39]">
                          {group.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#232D39]/50">
                          原位置：{lot.warehouseName}-{lot.houseName}-
                          {lot.zoneName}-{lot.position || "--"}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#232D39]/45">
                          在单数量：{formatReceiptQuantity(lot.quantity)}
                          {lot.unit}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                          active
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-[#232D39]/20",
                        )}
                      >
                        {active ? <Check className="size-3" /> : null}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <h3 className="text-sm font-semibold text-[#232D39]">目标位置</h3>

              <div className="mt-2.5 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-[#232D39]/4 px-3 py-2.5">
                  <span className="text-xs text-[#232D39]/55">目标仓库</span>
                  <span className="flex items-center gap-1 text-sm text-[#232D39]/60">
                    <Lock className="size-3.5" />
                    {receipt.warehouseName}
                  </span>
                </div>

                <SelectRow
                  label="目标库房"
                  value={houseName}
                  placeholder="请选择库房"
                  onClick={() => setHouseOpen(true)}
                />
                <SelectRow
                  label="目标分区"
                  value={zoneName}
                  placeholder="请先选择库房"
                  disabled={!houseName}
                  onClick={() => setZoneOpen(true)}
                />
                <SelectRow
                  label="目标具体位置"
                  value={position}
                  placeholder={zoneName ? "请选择垛位" : "请先选择分区"}
                  disabled={!zoneName}
                  onClick={() => setPositionOpen(true)}
                />
              </div>

              {selectedLots.length > 0 ? (
                <div className="mt-3 rounded-lg bg-[#232D39]/3 px-3 py-2 text-[11px] leading-relaxed text-[#232D39]/55">
                  原位置：
                  {[...new Set(
                    selectedLots.map(
                      (item) =>
                        `${item.lot.warehouseName}-${item.lot.houseName}-${item.lot.zoneName}-${item.lot.position || "--"}`,
                    ),
                  )].join("；")}
                  <br />
                  目标位置：{receipt.warehouseName}-{houseName || "--"}-
                  {zoneName || "--"}-{position || "--"}
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <h3 className="text-sm font-semibold text-[#232D39]">移库原因</h3>
              <div className="mt-2 rounded-lg bg-[#232D39]/4 px-3 py-2">
                <textarea
                  value={reason}
                  maxLength={140}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="补充移库作业事由（选填，最多 140 字）"
                  className="min-h-[56px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                />
                <p className="text-right text-[11px] text-[#232D39]/30">
                  {reason.length}/140
                </p>
              </div>
            </section>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[#232D39]/8 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={submit}
              className="h-11 w-full rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
            >
              提交移库申请
            </button>
          </div>
        </PrototypeAnnotationTarget>

        <ReceiptSelectSheet
          open={houseOpen}
          title="选择目标库房"
          description={`仅展示 ${receipt.warehouseName} 内的有效库房`}
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
            setPosition("")
          }}
        />

        <ReceiptSelectSheet
          open={zoneOpen}
          title="选择目标分区"
          options={zones.map((zone) => ({ id: zone.name, label: zone.name }))}
          selectedId={zoneName}
          onClose={() => setZoneOpen(false)}
          onSelect={(option) => {
            setZoneName(option.id)
            setPosition("")
          }}
        />

        <ReceiptSelectSheet
          open={positionOpen}
          title="选择具体位置"
          description="未划分垛位的分区可选择「--」"
          options={
            positions.length > 0
              ? positions.map((item) => ({ id: item, label: item }))
              : [{ id: "--", label: "--（该分区未划分垛位）" }]
          }
          selectedId={position}
          onClose={() => setPositionOpen(false)}
          onSelect={(option) => setPosition(option.id)}
        />

        <FaceSignatureSheet
          open={signOpen}
          title="仓单移库 · 电子签章"
          description="移库将改变货物的物理存放位置，须由经办人完成人脸活体识别与短信验证码校验。"
          agreementLabel="本人确认移库批次、目标库位与原因真实有效"
          onClose={() => setSignOpen(false)}
          onConfirm={() => {
            setSignOpen(false)
            backToReceiptDetail(
              navigate,
              receipt.id,
              "仓单移库申请已提交，等待审批；通过后将原子更新批次垛位",
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
      className={cn(
        "flex w-full items-center justify-between rounded-lg bg-[#232D39]/4 px-3 py-2.5 text-left",
        disabled && "opacity-50",
      )}
    >
      <span className="text-xs text-[#232D39]/55">{label}</span>
      <span className="flex items-center gap-1">
        <span
          className={cn(
            "text-sm",
            value ? "text-[#232D39]" : "text-[#232D39]/30",
          )}
        >
          {value || placeholder}
        </span>
        <ChevronRight className="size-3.5 text-[#232D39]/30" />
      </span>
    </button>
  )
}
