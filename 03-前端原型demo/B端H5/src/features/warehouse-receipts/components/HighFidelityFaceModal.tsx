import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Camera,
  ShieldCheck,
  Scan,
  X,
  FileText,
  Smartphone,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type FaceSignatureResult = {
  faceVerified: boolean
  smsVerified: boolean
  smsCode: string
}

export function HighFidelityFaceModal({
  open,
  title = "数字仓单电子签章认证",
  ownerPhone = "138****0001",
  onClose,
  onSuccess,
}: {
  open: boolean
  title?: string
  ownerPhone?: string
  onClose: () => void
  onSuccess: (result: FaceSignatureResult) => void
}) {
  const [step, setStep] = useState<"face" | "sms">("face")
  const [faceScanning, setFaceScanning] = useState(false)
  const [facePassed, setFacePassed] = useState(false)
  const [faceTip, setFaceTip] = useState("请将面部对准取景框，保持光线充足")

  // 短信部分
  const [countdown, setCountdown] = useState(0)
  const [smsCode, setSmsCode] = useState("")
  const [smsSent, setSmsSent] = useState(false)
  const [protocolAgreed, setProtocolAgreed] = useState(true)
  const [protocolOpen, setProtocolOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setStep("face")
      setFaceScanning(false)
      setFacePassed(false)
      setCountdown(0)
      setSmsCode("")
      setSmsSent(false)
      setErrorMsg(null)
    }
  }, [open])

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [countdown])

  // 人脸扫描仿真流程
  const handleStartScan = () => {
    setFaceScanning(true)
    setErrorMsg(null)
    setFaceTip("正在采集面部生物特征...")

    setTimeout(() => {
      setFaceTip("请眨眨眼，保持头部正对屏幕...")
    }, 800)

    setTimeout(() => {
      setFaceTip("公安权威人脸底库比对中 (匹配度 99.2%)...")
    }, 1600)

    setTimeout(() => {
      setFaceScanning(false)
      setFacePassed(true)
      setFaceTip("人脸识别核验通过！")
      // 1 秒后自动切换到第二阶段短信验证
      setTimeout(() => {
        setStep("sms")
        handleSendSms()
      }, 700)
    }, 2400)
  }

  // 发送短信验证码
  const handleSendSms = () => {
    setSmsSent(true)
    setCountdown(60)
    setErrorMsg(null)
  }

  // 填入测试码
  const handleFillTestCode = () => {
    setSmsCode("888888")
  }

  const handleSubmit = () => {
    if (!facePassed) {
      setErrorMsg("请先完成活体人脸识别")
      return
    }
    if (!smsCode || smsCode.length !== 6) {
      setErrorMsg("请输入 6 位短信验证码")
      return
    }
    if (!protocolAgreed) {
      setErrorMsg("请先勾选并同意仓单监管电子协议")
      return
    }

    onSuccess({
      faceVerified: true,
      smsVerified: true,
      smsCode,
    })
  }

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* 弹层卡片 */}
      <div className="relative z-10 flex max-h-[92%] w-full flex-col rounded-t-3xl bg-white shadow-2xl animate-slide-up">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-blue-600" />
            <h3 className="text-base font-bold text-[#232D39]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 步骤指示器 */}
        <div className="grid grid-cols-2 border-b border-gray-100 bg-gray-50/70 text-xs font-medium">
          <div
            className={cn(
              "flex items-center justify-center gap-1.5 py-2.5 transition-colors",
              step === "face"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600 bg-white"
                : facePassed
                ? "text-emerald-600"
                : "text-gray-400",
            )}
          >
            {facePassed ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <Camera className="size-3.5" />
            )}
            1. 活体人脸识别
          </div>
          <div
            className={cn(
              "flex items-center justify-center gap-1.5 py-2.5 transition-colors",
              step === "sms"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600 bg-white"
                : "text-gray-400",
            )}
          >
            <Smartphone className="size-3.5" />
            2. 短信动态码核验
          </div>
        </div>

        {/* 主体交互区 */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {step === "face" ? (
            /* 人脸扫描视图 */
            <div className="flex flex-col items-center justify-center py-4 text-center">
              {/* 人脸圆形取景框 */}
              <div className="relative flex size-44 items-center justify-center rounded-full border-4 border-dashed border-blue-400/60 bg-gradient-to-b from-blue-50/40 to-slate-100/60 shadow-inner">
                {faceScanning ? (
                  <>
                    {/* 扫描线动画 */}
                    <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34D399] animate-bounce" />
                    <Scan className="size-20 text-blue-500/80 animate-pulse" />
                  </>
                ) : facePassed ? (
                  <CheckCircle2 className="size-24 text-emerald-500 animate-scale-up" />
                ) : (
                  <Camera className="size-16 text-blue-600/70" />
                )}

                {/* 四角边框 */}
                <div className="absolute inset-2 pointer-events-none rounded-full border border-blue-500/20" />
              </div>

              {/* 实时状态提示 */}
              <p className="mt-4 text-sm font-semibold text-[#232D39]">
                {faceTip}
              </p>
              <p className="mt-1 text-xs text-[#232D39]/45">
                国家公安公民网络身份安全认证系统 · 活体防伪比对
              </p>

              {!facePassed && !faceScanning ? (
                <button
                  type="button"
                  onClick={handleStartScan}
                  className="mt-6 flex h-11 w-4/5 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md active:bg-blue-700"
                >
                  正对摄像头，开始人脸核验
                </button>
              ) : null}
            </div>
          ) : (
            /* 短信验证与协议签署视图 */
            <div className="space-y-4 py-1">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  当事人人脸生物特征识别已通过
                </span>
                <button
                  type="button"
                  onClick={() => setStep("face")}
                  className="text-blue-600 underline"
                >
                  重新核验
                </button>
              </div>

              {/* 短信验证码输入 */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    验证码已发送至：{ownerPhone}
                  </span>
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleSendSms}
                    className={cn(
                      "text-xs font-medium",
                      countdown > 0
                        ? "text-gray-400"
                        : "text-blue-600 active:underline",
                    )}
                  >
                    {countdown > 0 ? `${countdown}s 后重新获取` : "重新获取"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={smsCode}
                    onChange={(e) =>
                      setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="请输入 6 位短信动态验证码"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-base font-semibold tracking-widest text-[#232D39] outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleFillTestCode}
                    className="shrink-0 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-600 active:bg-blue-100"
                  >
                    填入测试码 888888
                  </button>
                </div>
              </div>

              {/* 协议勾选 */}
              <div className="flex items-start gap-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  id="agree-protocol"
                  checked={protocolAgreed}
                  onChange={(e) => setProtocolAgreed(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="agree-protocol"
                  className="text-[#232D39]/70 leading-relaxed"
                >
                  我已阅读并完全同意
                  <button
                    type="button"
                    onClick={() => setProtocolOpen(true)}
                    className="font-medium text-blue-600 underline ml-0.5"
                  >
                    《SYZC 数字仓单资产存管与物权质押监管协议》
                  </button>
                  ，确认本次电子签章及资产登记具备法定约束力。
                </label>
              </div>

              {errorMsg ? (
                <p className="text-center text-xs font-medium text-red-600">
                  {errorMsg}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* 底部按钮栏 */}
        <div className="shrink-0 border-t border-gray-100 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {step === "sms" ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white shadow-md active:bg-blue-700"
            >
              签署并提交开立申请
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 active:bg-gray-50"
            >
              取消
            </button>
          )}
        </div>
      </div>

      {/* 电子协议弹窗 */}
      {protocolOpen ? (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[80%] w-full flex-col rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-[#232D39]">
                数字仓单存管协议全文
              </h4>
              <button
                type="button"
                onClick={() => setProtocolOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto py-3 text-xs leading-relaxed text-[#232D39]/80 space-y-2">
              <p className="font-semibold">第一条 仓单性质与物权效力</p>
              <p>
                本数字仓单系依据森云科技存货监管系统（SYZC）区块链上链认证生成的电子权利凭证，具备合法货权物权属性，受相关法律法规保护。
              </p>
              <p className="font-semibold">第二条 双因子强认证与电子签名</p>
              <p>
                当事人通过活体人脸识别比对以及手机动态短信验证码完成的电子签章行为，视为本人/本企业合法授权的真实意思表示。
              </p>
              <p className="font-semibold">第三条 监管与动碰规则</p>
              <p>
                仓单在押存续期间，仓单项下货品受到实时物联监库保护，出库、补货、移库等资产动碰操作需遵循单流程互斥原则（R-DWR-04）。
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setProtocolAgreed(true)
                setProtocolOpen(false)
              }}
              className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white active:bg-blue-700"
            >
              我已阅读并知晓全部条款
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

