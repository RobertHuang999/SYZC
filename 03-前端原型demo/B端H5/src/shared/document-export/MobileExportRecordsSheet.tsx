import { X } from "lucide-react"
import {
  MOBILE_EXPORT_STATUS_TEXT,
  type MobileExportRecordItem,
  type MobileExportRecordStatus,
} from "@/shared/document-export-records"

type Props = {
  open: boolean
  records: MobileExportRecordItem[]
  onClose: () => void
}

const STATUS_CLASS: Record<MobileExportRecordStatus, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-600",
  GENERATING: "bg-amber-50 text-amber-700",
  FAILED: "bg-rose-50 text-rose-600",
}

function splitDateTime(value: string) {
  const [date, time] = value.split(" ")
  return { date: date ?? value, time: time ?? "" }
}

export function MobileExportRecordsSheet({ open, records, onClose }: Props) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-[70] flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[78%] w-full min-w-0 flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-up">
        <div className="relative shrink-0 px-4 pb-2 pt-3">
          <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-gray-300" />
          <h3 className="text-center text-[17px] font-medium text-[#232D39]">下载记录</h3>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex size-8 items-center justify-center text-[#232D39]/45"
            aria-label="关闭"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-1">
          {records.length === 0 ? (
            <p className="py-16 text-center text-sm text-[#909399]">暂无历史导出记录</p>
          ) : (
            <table className="w-full table-fixed border-collapse text-[11px] leading-snug text-[#4e5969]">
              <colgroup>
                <col className="w-8" />
                <col className="w-[30%]" />
                <col className="w-[22%]" />
                <col className="w-[22%]" />
                <col className="w-12" />
                <col className="w-10" />
              </colgroup>
              <thead>
                <tr className="text-[#303133]">
                  <th className="px-0.5 py-2 text-center font-medium">序号</th>
                  <th className="px-1 py-2 text-left font-medium">文件名</th>
                  <th className="px-1 py-2 text-left font-medium">操作人</th>
                  <th className="px-1 py-2 text-left font-medium">时间</th>
                  <th className="px-0.5 py-2 text-center font-medium">状态</th>
                  <th className="px-0.5 py-2 text-center font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item, index) => {
                  const stamp = splitDateTime(item.createTime)
                  return (
                    <tr key={item.id} className="border-t border-[#f0f0f0] align-top">
                      <td className="px-0.5 py-2.5 text-center text-[#909399]">{index + 1}</td>
                      <td className="break-all px-1 py-2.5 text-[#232D39]">{item.fileName}</td>
                      <td className="px-1 py-2.5">
                        <span className="block text-[#232D39]">{item.creator}</span>
                        <span className="mt-0.5 block text-[10px] leading-tight text-[#909399]">
                          {item.creatorOrg}
                        </span>
                      </td>
                      <td className="px-1 py-2.5">
                        <span className="block">{stamp.date}</span>
                        {stamp.time ? <span className="block text-[#909399]">{stamp.time}</span> : null}
                      </td>
                      <td className="px-0.5 py-2.5 text-center">
                        <span
                          className={`inline-block rounded px-1 py-0.5 text-[10px] font-medium ${STATUS_CLASS[item.status]}`}
                        >
                          {MOBILE_EXPORT_STATUS_TEXT[item.status]}
                        </span>
                      </td>
                      <td className="px-0.5 py-2.5 text-center">
                        {item.status === "SUCCESS" ? (
                          <button
                            type="button"
                            className="font-medium text-blue-600"
                            onClick={() => {
                              window.alert(
                                `【模拟安全下载】正在下载文件：${item.fileName}\n记录行数：${item.recordCount}`
                              )
                            }}
                          >
                            下载
                          </button>
                        ) : (
                          <span className="text-[#c0c4cc]">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {records.length > 0 ? (
            <p className="py-4 text-center text-xs text-[#c0c4cc]">没有更多了</p>
          ) : null}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] shrink-0" />
      </div>
    </div>
  )
}
