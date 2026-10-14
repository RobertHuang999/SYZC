import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Search } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  flattenPartitions,
  getWarehouseById,
} from "../mock/warehouses.mock"
import type { StoreroomNode, WarehouseRecord } from "../domain/types"
import { WAREHOUSE_LIST_ROUTE, type WarehouseDetailTab } from "../domain/constants"
import { DetailTabBar } from "../components/DetailTabBar"
import { BottomSheet } from "../components/BottomSheet"
import {
  ChangeHighlight,
  VersionChangeProvider,
  VersionChangeToggleBar,
} from "../components/VersionChangeHighlight"
import { useWarehouseOpsSnapshot } from "../hooks/use-warehouse-ops-snapshot"
import { resolveStoreroomInboundAuditYesNo } from "../lib/storeroom-inbound-audit"

export function WarehouseDetailPage() {
  const { id } = useParams()
  const { ops, refresh } = useWarehouseOpsSnapshot()
  const [warehouse, setWarehouse] = useState<WarehouseRecord | undefined>(() =>
    getWarehouseById(id)
  )
  const [tab, setTab] = useState<WarehouseDetailTab>("basic")
  const [keyword, setKeyword] = useState("")
  const [storeroomSheet, setStoreroomSheet] = useState<StoreroomNode | null>(
    null
  )
  const [partitionSheet, setPartitionSheet] = useState<
    ReturnType<typeof flattenPartitions>[number] | null
  >(null)
  useEffect(() => {
    setWarehouse(getWarehouseById(id))
    refresh()
  }, [id, refresh])

  const partitions = useMemo(
    () => (warehouse ? flattenPartitions(warehouse) : []),
    [warehouse]
  )

  if (!warehouse) {
    return (
      <MobileShell>
        <NavBar title="仓库详情" backTo={WAREHOUSE_LIST_ROUTE} />
        <p className="p-4 text-sm text-gray-500">仓库不存在</p>
      </MobileShell>
    )
  }

  const filteredStorerooms = warehouse.storerooms.filter(
    (r) => !keyword.trim() || r.name.includes(keyword.trim())
  )
  const filteredPartitions = partitions.filter(
    (p) =>
      !keyword.trim() ||
      p.name.includes(keyword.trim()) ||
      p.storeroomName.includes(keyword.trim())
  )
  const filteredFacilities = warehouse.facilities.filter(
    (f) => !keyword.trim() || f.name.includes(keyword.trim())
  )

  const auditYesNo = (roomId: string) =>
    resolveStoreroomInboundAuditYesNo(roomId, ops)

  return (
    <VersionChangeProvider>
      <MobileShell>
        <NavBar title="仓库详情" backTo={WAREHOUSE_LIST_ROUTE} />
        <VersionChangeToggleBar />

        <PrototypeAnnotationTarget annotationIds={["wh-h5-detail-tabs"]}>
          <DetailTabBar active={tab} onChange={setTab} />
        </PrototypeAnnotationTarget>

        {(tab === "storeroom" || tab === "partition" || tab === "facility") && (
          <div className="relative shrink-0 border-b border-gray-100 bg-white px-3 py-2">
            <Search className="absolute left-5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm"
              placeholder={
                tab === "partition"
                  ? "请输入库房/分区名称"
                  : tab === "facility"
                    ? "请输入设备名称"
                    : "请输入库房名称"
              }
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-3 pb-6">
          {tab === "basic" && (
            <div className="space-y-3">
              <Section title="仓库基础信息">
                <Row label="仓库名称" value={warehouse.name} />
                <Row label="仓库地址" value={warehouse.address} />
                <Row label="仓库面积" value={`${warehouse.area.toLocaleString()} ㎡`} />
                <Row
                  label="仓库类型"
                  value={warehouse.warehouseTypes.join("、") || "通用/常温库"}
                />
                <Row
                  label="仓库监管员类型"
                  value={warehouse.supervisorType || "按人"}
                />
                <Row
                  label="仓库监管员"
                  value={
                    warehouse.supervisors && warehouse.supervisors.length > 0
                      ? warehouse.supervisors.join("、")
                      : "张伟、李明"
                  }
                />
                <Row
                  label="片区经理类型"
                  value={warehouse.regionalManagerType || "按人"}
                />
                <Row
                  label="片区经理"
                  value={
                    warehouse.regionalManagers && warehouse.regionalManagers.length > 0
                      ? warehouse.regionalManagers.join("、")
                      : "陈建国、王崇"
                  }
                />
              </Section>
              <Section title="管理方信息">
                <Row
                  label="管理方类型"
                  value={warehouse.managerType === "ENTERPRISE" ? "企业" : "个人"}
                />
                <Row label="管理企业名称/姓名" value={warehouse.managerName} />
                <Row
                  label="统一社会信用代码/身份证号"
                  value={warehouse.managerIdNumber}
                />
                <Row label="管理方联系电话" value={warehouse.managerPhone || "—"} />
                <Row
                  label="仓库与管理方的权属关系"
                  value={
                    warehouse.ownership === "OWNED"
                      ? "自有"
                      : warehouse.ownership === "LEASED"
                        ? "租赁"
                        : "其他"
                  }
                />
              </Section>
              <Section title="中仓登准入">
                <Row
                  label="是否中仓登准入"
                  value={warehouse.zhongdengAccess === "YES" ? "已准入" : "未准入"}
                />
                {warehouse.zhongdengAccess === "YES" && warehouse.zhongdengId ? (
                  <Row label="中仓登仓库 ID 号" value={warehouse.zhongdengId} />
                ) : null}
              </Section>
            </div>
          )}

          {tab === "storeroom" && (
            <PrototypeAnnotationTarget annotationIds={["wh-h5-63-audit"]}>
              <div className="space-y-3">
                {filteredStorerooms.map((room) => (
                  <ChangeHighlight key={room.id} label="6.3 · 审核只读">
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            [库] {room.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            出入库审核：
                            <span className="font-medium text-amber-800">
                              {auditYesNo(room.id)}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {room.remark || "暂无备注"}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                          已启用
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2 border-t border-gray-100 pt-2 text-xs">
                        <button
                          type="button"
                          className="ml-auto text-blue-600"
                          onClick={() => setStoreroomSheet(room)}
                        >
                          查看详情 ▶
                        </button>
                      </div>
                    </div>
                  </ChangeHighlight>
                ))}
              </div>
            </PrototypeAnnotationTarget>
          )}

          {tab === "partition" && (
            <div className="space-y-3">
              {filteredPartitions.map((part) => (
                <div
                  key={part.id}
                  className="rounded-xl bg-white p-3 shadow-sm"
                >
                  <p className="font-medium">[分] {part.name}</p>
                  <p className="text-xs text-gray-500">
                    所属库房: {part.storeroomName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {part.remark || "暂无备注"}
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-xs text-blue-600"
                    onClick={() => setPartitionSheet(part)}
                  >
                    查看详情 ▶
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "facility" && (
            <div className="space-y-2 rounded-xl bg-white p-3 shadow-sm">
              {filteredFacilities.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">暂无设备</p>
              ) : (
                filteredFacilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="flex justify-between border-b border-gray-50 py-2 text-sm last:border-0"
                  >
                    <span>
                      [{fac.name.slice(0, 1)}] {fac.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      有效期: {fac.validUntil}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white p-3">
          <Link
            to={`${WAREHOUSE_LIST_ROUTE}/${warehouse.id}/edit`}
            className="block w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-medium text-white"
          >
            编辑仓库主档
          </Link>
        </div>

        <BottomSheet
          open={Boolean(storeroomSheet)}
          title="库房详情"
          onClose={() => setStoreroomSheet(null)}
        >
          {storeroomSheet ? (
            <ChangeHighlight label="6.3 · 只读">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">出入库审核</dt>
                  <dd className="font-medium text-amber-800">
                    {auditYesNo(storeroomSheet.id)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">库房名称</dt>
                  <dd>{storeroomSheet.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">备注信息</dt>
                  <dd>{storeroomSheet.remark || "暂无备注"}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-gray-500">
                6.3 起不在移动端修改审核策略；请至 PC【基础配置 → 仓储作业参数】维护。
              </p>
            </ChangeHighlight>
          ) : null}
        </BottomSheet>

        <BottomSheet
          open={Boolean(partitionSheet)}
          title="分区详情"
          onClose={() => setPartitionSheet(null)}
        >
          {partitionSheet ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">分区名称</dt>
                <dd>{partitionSheet.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">所属库房</dt>
                <dd>{partitionSheet.storeroomName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">备注信息</dt>
                <dd>{partitionSheet.remark || "暂无备注"}</dd>
              </div>
            </dl>
          ) : null}
        </BottomSheet>

      </MobileShell>
    </VersionChangeProvider>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold">{title}</h2>
      <dl className="space-y-2">{children}</dl>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <dt className="shrink-0 text-gray-500">{label}</dt>
      <dd className="text-right text-gray-900">{value}</dd>
    </div>
  )
}
