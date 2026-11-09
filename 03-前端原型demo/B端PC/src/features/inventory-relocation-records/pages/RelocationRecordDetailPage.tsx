import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { Badge } from "@/components/ui/badge"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailTabShell } from "@/shared/components/DetailTabShell"
import { relocationRecordDocuments } from "../documents/relocation-record-documents"
import { relocationRecordAnnotations } from "../annotations/relocation-record.annotations"
import { RELOCATION_LIST_PATH } from "../domain/constants"
import { relocationRecordsMock } from "../mock/relocation-records.mock"

export function RelocationRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("goods")

  const record =
    relocationRecordsMock.find((item) => item.id === id) || relocationRecordsMock[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <PrototypeAnnotationProvider
      title="移库详情原型批注"
      documents={relocationRecordDocuments}
      annotations={relocationRecordAnnotations}
    >
      <div className="space-y-4 p-6">
        <DetailPageHeader
          title="移库单详情"
          number={record.id}
          numberLabel="移库单号"
          status={
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 px-2.5 text-xs text-emerald-700">
              已通过
            </Badge>
          }
          onBack={() => navigate(RELOCATION_LIST_PATH)}
          onCopy={handleCopy}
          copied={copied}
        />

        <DetailSection title="基础信息">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DetailField label="移库时间">{record.moveTime}</DetailField>
            <DetailField label="移库类型">{record.moveType}</DetailField>
            <DetailField label="关联单号">{record.relatedNo || "—"}</DetailField>
            <DetailField label="仓库名称">{record.warehouseName}</DetailField>
            <DetailField label="货主名称">{record.ownerName}</DetailField>
            <DetailField label="货主标识">{record.ownerIdentifier}</DetailField>
            <DetailField label="制单人">
              {record.creatorName}（{record.creatorOrg}）
            </DetailField>
            <DetailField label="制单时间">{record.createTime}</DetailField>
            <DetailField label="备注信息">{record.remark || "—"}</DetailField>
          </div>
        </DetailSection>

        <DetailTabShell
          tabs={[
            { key: "goods", label: "移库货品明细" },
            { key: "photos", label: "现场凭证" },
            { key: "audit", label: "审核记录" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        >
          {activeTab === "goods" && (
            <PrototypeAnnotationTarget annotationIds={["relocation-detail-goods"]}>
              <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[1240px] text-xs">
                <thead className="border-b bg-slate-50 text-slate-600">
                  <tr className="h-10">
                    <th className="w-16 px-3 text-center font-semibold">序号</th>
                    <th className="w-56 px-3 text-left font-semibold">货物名称</th>
                    <th className="w-64 px-3 text-left font-semibold">移出位置</th>
                    <th className="w-36 px-3 text-left font-semibold">移出具体位置</th>
                    <th className="w-40 px-3 text-left font-semibold">入库时间</th>
                    <th className="w-52 px-3 text-left font-semibold">存货条码</th>
                    <th className="w-24 px-3 text-right font-semibold">移库数量</th>
                    <th className="w-64 px-3 text-left font-semibold">移入位置</th>
                    <th className="w-36 px-3 text-left font-semibold">移入具体位置</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {record.goods.map((line, index) => (
                    <tr key={line.id} className="h-[72px]">
                      <td className="px-3 text-center text-muted-foreground">{index + 1}</td>
                      <td className="px-3 font-medium text-foreground">{line.goodsName}</td>
                      <td className="px-3 text-slate-600">
                        <div className="line-clamp-2">{line.outLocation}</div>
                      </td>
                      <td className="px-3 text-slate-600">{line.outSpecific || "—"}</td>
                      <td className="px-3 whitespace-nowrap text-slate-600">{line.inboundTime}</td>
                      <td className="px-3 text-slate-600">
                        <span className="break-all">{line.barcode}</span>
                      </td>
                      <td className="px-3 text-right">
                        <span className="tabular-nums font-medium">
                          {line.quantity.toLocaleString("zh-CN", { maximumFractionDigits: 4 })}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">{line.unit}</span>
                      </td>
                      <td className="px-3 text-slate-600">{line.inRoomZone}</td>
                      <td className="px-3 text-slate-600">{line.inSpecific || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </PrototypeAnnotationTarget>
          )}

          {activeTab === "photos" && (
          <div className="flex flex-wrap items-center gap-3">
            {record.photos.length > 0 ? (
              record.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt="移库现场照片"
                  className="h-24 w-32 rounded border object-cover"
                />
              ))
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
          )}

          {activeTab === "audit" && (
          <div className="space-y-4">
            {record.auditNodes.map((node) => (
              <div
                key={node.id}
                className="rounded-lg border border-slate-200 p-3.5 text-sm dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{node.title}</span>
                  <span className="text-xs text-muted-foreground">{node.handleTime}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>处理人：{node.handlerName}</span>
                  <span className="text-emerald-600">{node.result}</span>
                </div>
                {node.comment && (
                  <div className="mt-2 rounded bg-slate-50 px-2.5 py-2 text-xs text-slate-600 dark:bg-slate-900">
                    意见：{node.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </DetailTabShell>
      </div>
    </PrototypeAnnotationProvider>
  )
}
