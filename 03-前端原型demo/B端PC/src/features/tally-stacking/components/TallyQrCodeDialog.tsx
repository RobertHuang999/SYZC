import React, { useState } from "react"
import { QrCode, Copy, Printer, Check, Layers } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { TallyStackingMainItem } from "@/features/shared/mock/inventory-shared-seed"

interface TallyQrCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: TallyStackingMainItem | null
}

export const TallyQrCodeDialog: React.FC<TallyQrCodeDialogProps> = ({
  open,
  onOpenChange,
  item,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("main")
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const isMain = selectedTab === "main"
  const currentSub = item.subItems.find((s) => s.subId === selectedTab)

  const activeBarcode = isMain
    ? item.mainCode
    : currentSub
    ? currentSub.subCode
    : item.mainCode

  const activeLocation = isMain
    ? "全单汇总（共 " + item.subItems.length + " 个实际货位）"
    : `${currentSub?.houseName} / ${currentSub?.partitionName} / ${currentSub?.locationCode}`

  const activeQty = isMain
    ? `${item.availableQuantity.toFixed(3)} ${item.unit} (总数 ${item.totalQuantity.toFixed(3)} ${item.unit})`
    : `${currentSub?.availableQuantity.toFixed(3)} ${currentSub?.unit} (垛位总数 ${currentSub?.totalQuantity.toFixed(3)} ${currentSub?.unit})`

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeBarcode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    alert(`【模拟打印条码标签】已发送打印任务至现场标签打印机：\n条码：${activeBarcode}\n货品：${item.specification}\n库位：${activeLocation}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <QrCode className="h-5 w-5 text-primary" />
            <span>主子二维码防伪查看</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            支持入库批次主码与现场物理货位子码双轨溯源防伪。
          </DialogDescription>
        </DialogHeader>

        {/* 顶部主/子码切换按钮组 */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg text-xs mt-1">
          <button
            type="button"
            onClick={() => setSelectedTab("main")}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              isMain
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            主码 (入库单级)
          </button>
          {item.subItems.map((sub, idx) => (
            <button
              key={sub.subId}
              type="button"
              onClick={() => setSelectedTab(sub.subId)}
              className={`px-2.5 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                selectedTab === sub.subId
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              子码{idx + 1} ({sub.locationCode})
            </button>
          ))}
        </div>

        {/* 二维码展示核心卡片 */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 mt-2">
          {/* 模拟高保真 SVG 二维码 */}
          <div className="relative p-3 bg-white rounded-lg shadow-sm border border-slate-200">
            <svg
              className="w-40 h-40 text-slate-900"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* 二维码定位角 */}
              <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="11" width="13" height="13" />
              <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="76" y="11" width="13" height="13" />
              <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="76" width="13" height="13" />
              {/* 模拟二维码点阵 */}
              <rect x="36" y="10" width="8" height="8" />
              <rect x="50" y="12" width="6" height="6" />
              <rect x="38" y="24" width="6" height="6" />
              <rect x="48" y="26" width="10" height="6" />
              <rect x="10" y="38" width="6" height="8" />
              <rect x="22" y="44" width="8" height="6" />
              <rect x="36" y="38" width="12" height="12" />
              <rect x="54" y="40" width="6" height="6" />
              <rect x="68" y="36" width="10" height="8" />
              <rect x="84" y="42" width="6" height="6" />
              <rect x="38" y="56" width="6" height="8" />
              <rect x="52" y="54" width="8" height="8" />
              <rect x="68" y="52" width="10" height="12" />
              <rect x="84" y="58" width="6" height="6" />
              <rect x="38" y="72" width="8" height="6" />
              <rect x="50" y="74" width="12" height="6" />
              <rect x="40" y="84" width="8" height="8" />
              <rect x="56" y="86" width="8" height="6" />
              <rect x="72" y="78" width="6" height="8" />
              <rect x="84" y="76" width="8" height="12" />
            </svg>
            <div className="text-center font-mono text-xs font-bold text-slate-800 mt-2">
              {activeBarcode}
            </div>
          </div>

          {/* 属性参数 */}
          <div className="w-full text-xs space-y-1.5 mt-4 text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">货品规格：</span>
              <span className="font-medium text-slate-900 text-right truncate max-w-[200px]" title={item.specification}>
                {item.specification}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">对应货位：</span>
              <span className="font-medium text-slate-800 text-right">{activeLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">在库可用：</span>
              <span className="font-medium text-emerald-600 text-right">{activeQty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">源头单号：</span>
              <span className="font-mono text-slate-800 text-right">{item.inboundOrderNo}</span>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "已复制条码" : "复制条码编号"}
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs gap-1.5 bg-primary text-white"
          >
            <Printer className="h-3.5 w-3.5" />
            打印防伪标签
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

