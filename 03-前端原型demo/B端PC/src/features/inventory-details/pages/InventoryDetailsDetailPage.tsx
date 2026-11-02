import React from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Building2, MapPin, Package, Users, FileText, ArrowUpRight, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DetailSection, DetailField } from "@/shared/components/DetailSection"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryDetailsDocuments } from "../documents/inventory-details-documents"
import { inventoryDetailsDetailAnnotations } from "../annotations/inventory-details-detail.annotations"
import { SHARED_INVENTORY_DETAILS } from "@/features/shared/mock/inventory-shared-seed"

export const InventoryDetailsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = React.useState(false)

  const record = SHARED_INVENTORY_DETAILS.find((item) => item.id === id) || SHARED_INVENTORY_DETAILS[0]

  const handleCopyBarcode = () => {
    navigator.clipboard?.writeText(record.barcode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PrototypeAnnotationProvider
      documents={inventoryDetailsDocuments}
      annotations={inventoryDetailsDetailAnnotations}
    >
      <div className="space-y-4 p-6 max-w-7xl mx-auto">
        {/* 顶部导航与状态条 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-detail-page"]}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    存货明细详情
                  </h1>
                  <span className="font-mono text-sm text-slate-500">
                    ({record.barcode})
                  </span>
                  {record.status === "NORMAL" && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      正常在库
                    </Badge>
                  )}
                  {record.status === "FROZEN" && (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                      审批冻结中
                    </Badge>
                  )}
                  {record.status === "EMPTY" && (
                    <Badge variant="outline" className="text-slate-500">
                      已出库
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  物理货位最细粒度台账画像与批次全息生命周期追溯。
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyBarcode}
                className="h-8 text-xs gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "已复制条码" : "复制存货条码"}
              </Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {/* 1. 基础物理空间落位 */}
        <DetailSection title="物理空间与货位画像">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailField label="实体监管仓库">
              <span className="font-medium text-slate-900">{record.warehouseName}</span>
            </DetailField>
            <DetailField label="具体库房">
              <span>{record.houseName}</span>
            </DetailField>
            <DetailField label="存储分区">
              <span>{record.partitionName}</span>
            </DetailField>
            <DetailField label="货位/垛位编号">
              {record.isVirtual ? (
                <span className="text-amber-600 font-medium">虚拟未分配垛位 (兜底)</span>
              ) : (
                <strong className="text-slate-900 font-bold">{record.locationCode}</strong>
              )}
            </DetailField>
            <DetailField label="存货条码编号">
              <span className="font-mono text-slate-900 font-medium">{record.barcode}</span>
            </DetailField>
            <DetailField label="物联网 RFID 标签">
              <span className="font-mono text-slate-600">{record.rfidTag || "--"}</span>
            </DetailField>
            <DetailField label="入库上架时间">
              <span className="text-slate-700">{record.inboundDate}</span>
            </DetailField>
            <DetailField label="最后动碰/移库时间">
              <span className="text-slate-700">{record.lastMoveDate}</span>
            </DetailField>
          </div>
        </DetailSection>

        {/* 2. 存货与货主信息 */}
        <DetailSection title="货品规格与权属货主">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailField label="货品全称与规格">
              <span className="font-semibold text-slate-900">{record.specification}</span>
            </DetailField>
            <DetailField label="所属品类 / 大类">
              <span>{record.variety} / {record.category}</span>
            </DetailField>
            <DetailField label="计量单位">
              <span>{record.unit}</span>
            </DetailField>
            <DetailField label="参考单价(万元)">
              {record.unitPrice !== null ? (
                <span className="font-medium text-slate-900">¥{record.unitPrice.toFixed(2)} 万元/{record.unit}</span>
              ) : (
                <span className="text-amber-600">待点价结算中 (未定价)</span>
              )}
            </DetailField>
            <DetailField label="存货权属货主">
              <span className="font-medium text-slate-900">{record.ownerName}</span>
            </DetailField>
            <DetailField label="货主身份标识">
              <span className="font-mono text-slate-700">{record.ownerIdentifierMasked}</span>
            </DetailField>
            <DetailField label="联系方式">
              <span className="text-slate-700">{record.ownerPhoneMasked}</span>
            </DetailField>
            <DetailField label="主体类型">
              <span>{record.ownerType === "2" ? "企业法人货主" : "个人独资/自然人"}</span>
            </DetailField>
          </div>
        </DetailSection>

        {/* 3. 数量核算与资产价值 */}
        <DetailSection title="资产数量与货值核算">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailField label="期初入库堆放数量">
              <span className="font-medium text-slate-800">{record.initialQuantity.toFixed(3)} {record.unit}</span>
            </DetailField>
            <DetailField label="当前在库可用数量">
              <span className="font-semibold text-emerald-600">{record.availableQuantity.toFixed(3)} {record.unit}</span>
            </DetailField>
            <DetailField label="当前审批冻结数量">
              <span className="font-semibold text-amber-600">{record.frozenQuantity.toFixed(3)} {record.unit}</span>
            </DetailField>
            <DetailField label="当前库存总数">
              <span className="font-bold text-slate-900">{record.totalQuantity.toFixed(3)} {record.unit}</span>
            </DetailField>
            <DetailField label="当前货值总额估值">
              {record.totalPrice !== null ? (
                <span className="font-bold text-slate-900">
                  ¥{record.totalPrice.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} 万元
                </span>
              ) : (
                <span className="text-amber-600 font-medium">暂无估值 (未定价货物)</span>
              )}
            </DetailField>
            <DetailField label="冻结占用说明">
              <span className="text-slate-600">{record.freezeReason || "无流转冻结，全量可用"}</span>
            </DetailField>
          </div>
        </DetailSection>

        {/* 4. 关联单据溯源 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-detail-order-link"]}>
          <DetailSection title="关联单据链与履约追溯">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr className="h-9">
                    <th className="px-3 py-1.5 min-w-[120px]">单据关系类型</th>
                    <th className="px-3 py-1.5 min-w-[200px]">业务单号</th>
                    <th className="px-3 py-1.5 min-w-[140px]">关联变动数量</th>
                    <th className="px-3 py-1.5 min-w-[140px]">发生时间</th>
                    <th className="px-3 py-1.5 w-24 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="h-10 hover:bg-slate-50">
                    <td className="px-3 py-1.5 font-medium text-slate-700">源头入库单据</td>
                    <td className="px-3 py-1.5 font-mono text-slate-900">{record.inboundOrderNo}</td>
                    <td className="px-3 py-1.5 text-slate-800 font-medium">+{record.initialQuantity.toFixed(3)} {record.unit}</td>
                    <td className="px-3 py-1.5 text-slate-500">{record.inboundDate}</td>
                    <td className="px-3 py-1.5 text-center">
                      <Link
                        to={`/仓储/入库管理/入库记录/详情/${record.inboundOrderNo}`}
                        className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                      >
                        <span>查看入库</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                  {record.freezeOrderNo && (
                    <tr className="h-10 hover:bg-slate-50">
                      <td className="px-3 py-1.5 font-medium text-amber-700">流转冻结单据</td>
                      <td className="px-3 py-1.5 font-mono text-slate-900">{record.freezeOrderNo}</td>
                      <td className="px-3 py-1.5 text-amber-600 font-medium">锁定 {record.frozenQuantity.toFixed(3)} {record.unit}</td>
                      <td className="px-3 py-1.5 text-slate-500">{record.lastMoveDate}</td>
                      <td className="px-3 py-1.5 text-center">
                        <Link
                          to={`/仓储/出库管理/出库记录`}
                          className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                        >
                          <span>查看业务</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>
      </div>
    </PrototypeAnnotationProvider>
  )
}

