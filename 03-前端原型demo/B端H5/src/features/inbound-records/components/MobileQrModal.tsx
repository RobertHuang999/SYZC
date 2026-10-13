import { X, QrCode, Download } from "lucide-react"

type MobileQrModalProps = {
  open: boolean
  orderNo: string
  goodsName: string
  position: string
  quantityLabel: string
  qrCodeNo: string
  qrCodeUrl?: string
  onClose: () => void
}

export function MobileQrModal({
  open,
  orderNo,
  goodsName,
  position,
  quantityLabel,
  qrCodeNo,
  qrCodeUrl,
  onClose,
}: MobileQrModalProps) {
  if (!open) return null

  const codeImg =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      qrCodeNo
    )}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <button
          type="button"
          className="absolute right-3.5 top-3.5 rounded-full p-1 text-gray-400 active:bg-gray-100"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <QrCode className="size-5 text-orange-600" />
          <h3 className="text-base font-bold text-gray-900">存货条形码与二维码</h3>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <img
              src={codeImg}
              alt="存货二维码"
              className="size-44 rounded-lg border border-gray-200 bg-white p-2 object-contain"
            />
            <span className="mt-3 font-mono text-sm font-semibold tracking-wider text-gray-800">
              {qrCodeNo}
            </span>
            <span className="mt-1 text-[11px] text-gray-400">长按可保存二维码图片</span>
          </div>

          <div className="mt-4 w-full space-y-1.5 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">所属入库单：</span>
              <span className="font-mono font-medium text-gray-800">{orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">入库货物：</span>
              <span className="max-w-[200px] truncate text-right font-medium text-gray-800">
                {goodsName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">堆放库位：</span>
              <span className="font-medium text-gray-800">{position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">堆放数量：</span>
              <span className="font-semibold text-orange-600">{quantityLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-xs font-medium text-gray-700 active:bg-gray-50"
            onClick={() => window.open(codeImg, "_blank")}
          >
            <Download className="size-3.5" />
            查看原图
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-orange-600 py-2.5 text-xs font-medium text-white active:bg-orange-700"
            onClick={onClose}
          >
            关 闭
          </button>
        </div>
      </div>
    </div>
  )
}
