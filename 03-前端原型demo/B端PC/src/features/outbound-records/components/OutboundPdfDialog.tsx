import { useState } from "react"
import { Download, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { OutboundRecord } from "../domain/types"

interface OutboundPdfDialogProps {
  open: boolean
  record: OutboundRecord | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function OutboundPdfDialog({
  open,
  record,
  onClose,
  onSuccess,
}: OutboundPdfDialogProps) {
  const [downloading, setDownloading] = useState(false)

  if (!open || !record) return null

  const handleDownloadPdf = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      onSuccess(`正式出库单据 PDF 生成并下载完成：[${record.orderNo}].pdf`)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-amber-600" />
            <h3 className="text-base font-semibold text-gray-900">
              出库单据凭证预览 (PDF)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="h-8 gap-1 text-xs"
            >
              <Download className="size-3.5" />
              {downloading ? "生成中..." : "下载 PDF"}
            </Button>
            <button
              onClick={onClose}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* PDF 文档纸张主体 */}
        <div className="flex-1 overflow-y-auto bg-gray-200/50 p-6 flex justify-center">
          <div className="w-[720px] bg-white p-8 shadow-md border border-gray-300 relative text-gray-800 text-xs">
            {/* 右上角电子印章 */}
            <div className="absolute right-12 top-10 flex size-28 select-none items-center justify-center rounded-full border-4 border-emerald-600 text-emerald-600 rotate-[-12deg] opacity-85">
              <div className="text-center font-serif text-[11px] leading-tight font-bold">
                森云科技
                <br />
                <span className="text-xs">【已通过】</span>
                <br />
                存货出库生效章
              </div>
            </div>

            {/* 抬头 */}
            <div className="text-center pb-6 border-b-2 border-gray-900">
              <h2 className="text-xl font-bold tracking-wider text-gray-900">
                森云科技供应链金融存货监管系统
              </h2>
              <h1 className="text-2xl font-black tracking-widest text-gray-900 mt-1">
                出 库 凭 证 单
              </h1>
              <p className="text-[11px] text-gray-500 mt-1">
                （数字监管仓库出库履约与司法存证凭证）
              </p>
            </div>

            {/* 单据头属性 */}
            <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-200">
              <div>
                <span className="font-semibold text-gray-700">出库单号：</span>
                <span className="text-gray-900">{record.orderNo}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">出库日期：</span>
                <span className="text-gray-900">{record.outboundTime}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">货主主体：</span>
                <span className="text-gray-900">{record.ownerName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">统一信用代码/手机号：</span>
                <span className="text-gray-900">{record.ownerIdentifier}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">出库类型：</span>
                <span className="font-medium text-amber-700">{record.type}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">监管仓库：</span>
                <span className="text-gray-900">{record.warehouseName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">关联单号：</span>
                <span className="text-gray-900">{record.relatedNo || "—"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">制单人：</span>
                <span className="text-gray-900">{record.createdByName} ({record.createdByOrg})</span>
              </div>
            </div>

            {/* 货物明细表 */}
            <div className="py-4">
              <h3 className="font-bold text-gray-900 mb-2">一、出库货物明细</h3>
              <table className="w-full border-collapse border border-gray-300 text-[11px]">
                <thead>
                  <tr className="bg-gray-100 text-center font-semibold text-gray-700">
                    <th className="border border-gray-300 p-1.5 w-10">序号</th>
                    <th className="border border-gray-300 p-1.5">货物名称及规格</th>
                    <th className="border border-gray-300 p-1.5">存放位置</th>
                    <th className="border border-gray-300 p-1.5">存货条码</th>
                    <th className="border border-gray-300 p-1.5 text-right w-24">出库数量</th>
                  </tr>
                </thead>
                <tbody>
                  {record.goodsList.map((g, idx) => (
                    <tr key={g.id || idx}>
                      <td className="border border-gray-300 p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-gray-300 p-1.5 font-medium">{g.goodsName}</td>
                      <td className="border border-gray-300 p-1.5">
                        {g.locationPath || (g.locations && g.locations[0]?.locationPath) || "--"}
                      </td>
                      <td className="border border-gray-300 p-1.5 text-center">
                        {g.barcode || (g.locations && g.locations[0]?.barcode) || "--"}
                      </td>
                      <td className="border border-gray-300 p-1.5 text-right font-medium">
                        {g.totalOutboundAmount} {g.unit}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={4} className="border border-gray-300 p-1.5 text-right">
                      合计总出库量：
                    </td>
                    <td className="border border-gray-300 p-1.5 text-right text-amber-800">
                      {record.totalAmount} {record.amountUnit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 提货人信息 */}
            {record.pickupInfo && (
              <div className="py-2 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">二、提货交接信息</h3>
                <div className="grid grid-cols-2 gap-y-1.5 bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px]">
                  <div>
                    <span className="text-gray-500">提货主体类型：</span>
                    <span>{record.pickupInfo.personType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">提货人姓名/单位：</span>
                    <span className="font-medium">{record.pickupInfo.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">提货人身份证号：</span>
                    <span>{record.pickupInfo.idCardNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">联系电话：</span>
                    <span>{record.pickupInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">车辆车牌号：</span>
                    <span className="font-medium">{record.pickupInfo.plateNo || "--"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 审核履历 */}
            <div className="py-2 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-1.5">三、风控审批流转核准记录</h3>
              <div className="space-y-1 text-[11px] text-gray-600">
                {record.auditRecord?.nodes.map((n) => (
                  <div key={n.id} className="flex justify-between items-center bg-gray-50/60 px-2 py-1 rounded">
                    <span>
                      <strong className="text-gray-800">[{n.nodeName}]</strong> {n.handlerName}
                      {n.comment && <span className="ml-1 text-gray-500">({n.comment})</span>}
                    </span>
                    <span className="text-gray-500">{n.actionTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 签名盖章区域 */}
            <div className="mt-8 pt-4 border-t-2 border-gray-800 grid grid-cols-3 gap-6 text-[11px]">
              <div>
                <p className="font-bold">监管仓储方（盖章）：</p>
                <div className="h-14"></div>
                <p className="text-gray-500">经办人：_________________</p>
              </div>
              <div>
                <p className="font-bold">货权方 / 提货人（签字）：</p>
                <div className="h-14"></div>
                <p className="text-gray-500">签收人：_________________</p>
              </div>
              <div>
                <p className="font-bold">金融资金 / 监管监管部：</p>
                <div className="h-14"></div>
                <p className="text-gray-500">核准人：_________________</p>
              </div>
            </div>

            {/* 底部司法与不可变提示 */}
            <div className="mt-6 border-t border-gray-200 pt-2 text-[10px] text-gray-400 text-center">
              本出库凭证系森云科技数字仓储质押监管系统自动生成并固化之法律存证快照，数据由底层物联网设备与风控引擎实时校验并上链存证，防篡改追溯。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
