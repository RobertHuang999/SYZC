import { X, FileText, Download, CheckCircle2 } from "lucide-react"

type MobilePdfModalProps = {
  open: boolean
  title?: string
  fileName: string
  fileSize?: string
  orderNo?: string
  ownerName?: string
  warehouseName?: string
  onClose: () => void
}

export function MobilePdfModal({
  open,
  title = "单据与凭证预览",
  fileName,
  fileSize = "1.2 MB",
  orderNo = "2108438504322834433",
  ownerName = "成都锦城冷链物流有限公司",
  warehouseName = "海霸王仓库",
  onClose,
}: MobilePdfModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div className="relative flex max-h-[88vh] w-full max-w-sm flex-col rounded-2xl bg-white shadow-2xl">
        {/* 标题栏 */}
        <div className="flex items-center justify-between border-b border-gray-100 p-3.5">
          <div className="flex items-center gap-1.5">
            <FileText className="size-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-900">{title}</span>
          </div>
          <button
            type="button"
            className="rounded-full p-1 text-gray-400 active:bg-gray-100"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 模拟 PDF 纸张内容 */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-3">
          <div className="relative mx-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm text-xs">
            {/* 模拟电子章 */}
            <div className="pointer-events-none absolute bottom-4 right-4 flex size-20 items-center justify-center rounded-full border-2 border-red-500/80 text-[10px] font-bold text-red-500/80 -rotate-12">
              <div className="text-center">
                <p>森云存管</p>
                <p>业务专用章</p>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-2 text-center">
              <h2 className="text-sm font-bold tracking-wide text-gray-900">
                供应链金融存货监管系统
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-500">入库验收确认凭证（存管备查联）</p>
            </div>

            <div className="mt-3 space-y-1.5 text-[11px] text-gray-700">
              <p className="flex justify-between">
                <span className="text-gray-400">单据流水：</span>
                <span className="font-semibold">{orderNo}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">出质/存货方：</span>
                <span className="truncate max-w-[150px] font-medium">{ownerName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">监管仓库：</span>
                <span>{warehouseName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">文件名称：</span>
                <span className="truncate max-w-[150px] text-blue-600">{fileName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">防伪校验码：</span>
                <span className="text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="size-3" />
                  已数字签名（区块链可溯）
                </span>
              </p>
            </div>

            <div className="mt-4 rounded border border-dashed border-gray-200 bg-gray-50 p-2 text-[10px] text-gray-500 leading-relaxed">
              本凭证由森云科技 SYZC 存管平台根据现场 IoT
              传感器、地磅过磅称重、AI车牌抓拍及仓管员验核结果自动归档生成，具备司法存证效力。
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between border-t border-gray-100 p-3">
          <span className="text-[11px] text-gray-400">{fileSize} · PDF格式</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 active:bg-gray-50"
              onClick={onClose}
            >
              关 闭
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white active:bg-blue-700"
              onClick={() => {
                alert(`已启动下载：${fileName}`)
                onClose()
              }}
            >
              <Download className="size-3" />
              下 载
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
