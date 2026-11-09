import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  CheckCircle2,
  Copy,
  FileText,
  Home,
  ShieldCheck,
  Check,
  ArrowRight,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ReceiptStepBar } from "../../components/ReceiptStepBar"
import { receiptH5DetailPath } from "../../domain/constants"

const INITIATE_STEPS = ["货主主体", "圈选货品", "协议与认证", "完成凭证"] as const

export function ReceiptInitiateSuccessPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const receiptId = params.get("id") || ""
  const receiptCode = params.get("code") || `CD${Date.now()}`

  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(receiptCode)
    setCopied(true)
    showToast("仓单编号已复制到剪贴板")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <MobileShell>
      {/* 统一为全站标准底色 bg-[#edf2f8] */}
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        {/* 顶部导航 */}
        <NavBar title="开立成功" showBack={false} />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
          {/* 步骤条：当前第 4 步完成态，对齐经典蓝 theme="blue" */}
          <ReceiptStepBar current={3} steps={INITIATE_STEPS} theme="blue" />

          {/* 成功状态卡片 */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-[#232D39]/8 bg-white p-6 text-center shadow-xs">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner mb-3">
              <CheckCircle2 className="size-10 stroke-[2.5]" />
            </div>

            <h2 className="text-lg font-bold text-[#232D39]">
              数字仓单申请开立成功
            </h2>
            <p className="mt-1 text-xs text-[#232D39]/50">
              资产已完成物理锁仓与物联防伪核验，区块链防篡改存证已同步
            </p>

            {/* 仓单凭单展示盒：对齐全站蓝灰科技色 */}
            <div className="mt-5 w-full rounded-lg border border-blue-200/80 bg-gradient-to-r from-blue-50/50 to-slate-50/70 p-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-900/70 font-medium">
                  数字仓单凭单编码
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  <ShieldCheck className="size-3" />
                  已上链防伪
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-base font-bold tracking-tight text-[#232D39] break-all">
                  {receiptCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 active:bg-blue-50 shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-600" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      复制
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-blue-200/50 pt-2 text-[11px] text-[#232D39]/60">
                <span>生成时间：刚刚</span>
                <span>认证机构：中仓登第三方</span>
              </div>
            </div>

            {/* 后续指引 */}
            <div className="mt-4 w-full rounded-xl bg-gray-50 p-3 text-left text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-700">后续操作指引：</p>
              <p>• 您可在【工作台 → 仓储 → 仓单管理】集中查阅名下仓单台账。</p>
              <p>• 仓单已具备银行质押融资与货权流转准入资格，支持随时在线开具质押或动碰出库。</p>
            </div>
          </div>
        </div>

        {/* 底部按钮栏：对齐全站样式 */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex gap-3 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(35,45,57,0.06)]">
          <button
            type="button"
            onClick={() => navigate("/m/tasks")}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            <Home className="size-4" />
            返回业务办理
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                receiptId
                  ? receiptH5DetailPath(receiptId)
                  : "/m/workspace/warehouse-receipts",
              )
            }
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-md active:bg-blue-700"
          >
            <FileText className="size-4" />
            查看仓单详情
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-center text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
