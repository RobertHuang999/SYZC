import { useState } from "react"
import {
  AlertCircle,
  Camera,
  Cpu,
  Info,
  ShieldAlert,
  X,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { Toast } from "@/components/ui/Toast"
import { canManualRelease } from "../domain/actions"
import {
  getReleaseError,
  MAX_PHOTO_COUNT,
  MAX_SITUATION_LENGTH,
  validatePhoto,
} from "../domain/release-validation"
import { getDeviceWarningById } from "../mock/device-warning-events.mock"

export function DeviceWarningEventReleasePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = getDeviceWarningById(id)
  const [situation, setSituation] = useState("")
  const [photoNames, setPhotoNames] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!event) {
    return (
      <MobileShell>
        <NavBar title="解除预警" />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
          <Cpu className="size-12 text-gray-300 mb-2" />
          <p>未找到对应的设备预警记录</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
          >
            返回上一页
          </button>
        </div>
      </MobileShell>
    )
  }

  const accessError = getReleaseError(event)
  if (accessError) {
    return (
      <MobileShell>
        <NavBar title="解除预警" />
        <div className="m-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
            <AlertCircle className="size-4 text-amber-600" />
            <span>无法人工解除该预警</span>
          </div>
          <p className="leading-relaxed text-amber-700">{accessError}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-3 w-full rounded-xl bg-amber-600 py-2.5 text-xs font-semibold text-white active:bg-amber-700"
          >
            返回详情页
          </button>
        </div>
      </MobileShell>
    )
  }

  const handlePhotoChange = (files: FileList | null) => {
    if (!files) return
    const nextNames = [...photoNames]
    for (const file of Array.from(files)) {
      const error = validatePhoto(file, nextNames.length)
      if (error) {
        showToast(error)
        continue
      }
      nextNames.push(file.name)
    }
    setPhotoNames(nextNames)
  }

  const removePhoto = (index: number) => {
    setPhotoNames((prev) => prev.filter((_, i) => i !== index))
  }

  const handleValidateAndOpenConfirm = () => {
    if (!situation.trim()) {
      showToast("请填写现场情况说明")
      return
    }
    if (situation.trim().length > MAX_SITUATION_LENGTH) {
      showToast("情况说明不可超过 200 字")
      return
    }
    if (!canManualRelease(event)) {
      showToast("该类型预警不支持人工解除，请等待自动恢复")
      return
    }
    setConfirmDialogOpen(true)
  }

  const handleExecuteRelease = () => {
    setSubmitting(true)
    setConfirmDialogOpen(false)

    setTimeout(() => {
      setSubmitting(false)
      showToast("预警解除成功！整轮触发记录已归档")
      setTimeout(() => {
        navigate("/m/iot/device-warning-events")
      }, 1200)
    }, 600)
  }

  return (
    <MobileShell>
      <NavBar title="解除设备预警" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3.5 overflow-y-auto px-3.5 py-3">
          {/* 1. 待解除预警简要卡片 */}
          <section className="rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono text-slate-700">
                    {event.deviceCode}
                  </span>
                  <span className="text-xs text-gray-500">
                    {event.warningType}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-bold text-gray-900">
                  {event.ruleName}
                </h3>
              </div>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs"
                style={{ backgroundColor: event.severityColor }}
              >
                {event.severityCode} {event.severityName}
              </span>
            </div>

            <div className="mt-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">所属位置：</span>
                <span className="font-medium text-gray-800">{event.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">报警设备：</span>
                <span className="font-medium text-gray-800">{event.deviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">累计触发：</span>
                <span className="font-bold text-orange-600">⚡ {event.triggerCount} 次</span>
              </div>
            </div>
          </section>

          {/* 2. 联动与归档提醒 */}
          <div className="rounded-xl bg-blue-50/70 p-3 text-xs text-blue-900 border border-blue-100/80 leading-relaxed flex items-start gap-2">
            <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">解除规则与联动机制：</div>
              <p className="mt-0.5 text-blue-800 text-[11px]">
                提交后系统将自动联动同库位监控进行<strong>即时高清抓拍存证</strong>；确认解除后归档整轮 {event.triggerCount} 次触发并取消后续升级任务。
              </p>
            </div>
          </div>

          {/* 3. 表单分组：情况说明 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-gray-900 flex items-center gap-1">
                <span>现场核查与处置情况说明</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">
                {situation.length}/{MAX_SITUATION_LENGTH}
              </span>
            </div>

            <textarea
              className="w-full min-h-24 rounded-xl border border-gray-200 bg-slate-50/60 p-3 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              placeholder="请详细描述现场核查结果、处置措施及复核情况（如：已现场检查智能挂锁物理完好，系巡检作业误碰...）"
              maxLength={MAX_SITUATION_LENGTH}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
          </section>

          {/* 4. 表单分组：现场照片上传 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-gray-900">
                现场复核照片凭证
              </label>
              <span className="text-[11px] text-gray-400">
                最多 {MAX_PHOTO_COUNT} 张
              </span>
            </div>

            {/* 上传区域 */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {photoNames.map((name, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50/50 p-2 text-center"
                >
                  <Camera className="size-6 text-blue-600 mb-1" />
                  <span className="w-full truncate text-[10px] text-gray-700 font-medium">
                    {name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs"
                    aria-label="删除照片"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}

              {photoNames.length < MAX_PHOTO_COUNT && (
                <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-slate-50/80 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                  <Camera className="size-5 text-gray-400 mb-1" />
                  <span className="text-[10px] font-medium">拍摄/相册</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    multiple
                    onChange={(e) => handlePhotoChange(e.target.files)}
                  />
                </label>
              )}
            </div>

            <p className="text-[11px] text-gray-400">
              支持 JPG / PNG 格式现场核验照片，单张不超过 10MB。
            </p>
          </section>
        </div>

        {/* 底部固定操作栏 */}
        <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-gray-200/90 bg-white/95 px-4 py-3 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
          >
            取消
          </button>
          <button
            type="button"
            disabled={!situation.trim() || submitting}
            onClick={handleValidateAndOpenConfirm}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md active:bg-blue-700 disabled:opacity-40 disabled:shadow-none"
          >
            {submitting ? "正在解除归档..." : "确认解除预警"}
          </button>
        </div>
      </div>

      {/* 二次确认对话框 */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
            aria-label="关闭对话框"
            onClick={() => setConfirmDialogOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[340px] rounded-3xl bg-white p-5 shadow-2xl animate-scale-up text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShieldAlert className="size-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              确认解除该轮次告警？
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed text-left rounded-xl bg-slate-50 p-3 border border-slate-100">
              • 预警规则：<strong>{event.ruleName}</strong><br />
              • 关联设备：{event.deviceName}<br />
              • 归档说明：提交后将归档整轮 <strong>{event.triggerCount}</strong> 次触发，并记录您的处置签名。
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialogOpen(false)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
              >
                再检查下
              </button>
              <button
                type="button"
                onClick={handleExecuteRelease}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-blue-700"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
