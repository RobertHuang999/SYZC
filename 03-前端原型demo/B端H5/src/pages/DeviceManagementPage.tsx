import { useMemo, useState } from "react"
import {
  Activity,
  Battery,
  Camera,
  ChevronDown,
  Filter,
  History,
  Lock,
  MapPin,
  Play,
  Radio,
  Search,
  Signal,
  Video,
  X,
} from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
import { Toast } from "@/components/ui/Toast"
import { AccessControlDeviceCard } from "@/features/access-control-devices/components/AccessControlDeviceCard"
import { GetAccessPasswordSheet } from "@/features/access-control-devices/components/GetAccessPasswordSheet"
import { GetLockPasswordSheet } from "@/features/access-control-devices/components/GetLockPasswordSheet"
import { UnlockApplySubmitSheet } from "@/features/access-control-devices/components/UnlockApplySubmitSheet"
import {
  DEFAULT_ACCESS_DEVICE_FILTERS,
  WAREHOUSE_OPTIONS,
  loadCachedAccessDeviceFilters,
  saveCachedAccessDeviceFilters,
} from "@/features/access-control-devices/domain/constants"
import type {
  AccessDevice,
  AccessDeviceFilters,
  AccessDevicePasswordContext,
  UnlockApplySubmitContext,
} from "@/features/access-control-devices/domain/types"
import {
  filterAccessDevices,
  matchUnlockApprovalConfig,
  toPasswordContext,
} from "@/features/access-control-devices/lib/device-utils"
import { accessDevicesMock } from "@/features/access-control-devices/mock/access-devices.mock"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

const PAGE_SIZE = 10

type DeviceTabId =
  | "ws-device-access"
  | "ws-device-monitoring"
  | "ws-device-iot"
  | "ws-device-gps"
  | "ws-device-access-logs"

const DEVICE_TABS = [
  {
    id: "ws-device-access" as const,
    name: "门禁设备",
    icon: Lock,
    badge: "6.2",
    description: "挂锁门禁、人脸门禁；支持获取密码与发起审批",
  },
  {
    id: "ws-device-monitoring" as const,
    name: "监控设备",
    icon: Camera,
    description: "高清枪机、全景鹰眼；支持实时视频流与回放",
  },
  {
    id: "ws-device-iot" as const,
    name: "物联设备",
    icon: Radio,
    description: "温湿度传感、智能地磅、微波雷达料位计",
  },
  {
    id: "ws-device-gps" as const,
    name: "GPS设备",
    icon: MapPin,
    description: "在途押品与露天货位定位终端、实时轨迹追踪",
  },
  {
    id: "ws-device-access-logs" as const,
    name: "门禁事务记录",
    icon: History,
    description: "刷卡、人脸、密码开锁流水与异常试码审计",
  },
]

// 监控设备 Mock 数据
const MONITORING_DEVICES_MOCK = [
  {
    id: "CAM-001",
    name: "高清枪机-A1",
    code: "IPC-2026-0101",
    type: "高清网络摄像机",
    resolution: "4K (3840×2160)",
    status: "在线",
    warehouse: "华东一号仓",
    room: "A库",
    zone: "1区东门",
    channel: "CH-01",
    fps: "25 fps",
    bitrate: "4096 kbps",
  },
  {
    id: "CAM-002",
    name: "全景鹰眼球机-B2",
    code: "IPC-2026-0102",
    type: "红外全景球机",
    resolution: "4K (3840×2160)",
    status: "在线",
    warehouse: "华东一号仓",
    room: "B库",
    zone: "露天堆场全景",
    channel: "CH-02",
    fps: "30 fps",
    bitrate: "6144 kbps",
  },
  {
    id: "CAM-003",
    name: "AI警戒摄像机-03",
    code: "IPC-2026-0103",
    type: "智能行为分析摄像机",
    resolution: "2K (2560×1440)",
    status: "在线",
    warehouse: "华北智能仓",
    room: "1号库",
    zone: "主出入口",
    channel: "CH-05",
    fps: "25 fps",
    bitrate: "2048 kbps",
  },
  {
    id: "CAM-004",
    name: "防爆红外筒机-04",
    code: "IPC-2026-0104",
    type: "化工防爆筒机",
    resolution: "1080P",
    status: "离线",
    warehouse: "华南二号仓",
    room: "危险品库",
    zone: "防爆隔离区",
    channel: "CH-08",
    fps: "0 fps",
    bitrate: "0 kbps",
  },
]

// 物联设备 Mock 数据
const IOT_DEVICES_MOCK = [
  {
    id: "IOT-001",
    name: "智能温湿度传感器-TH01",
    code: "TH-2026-001",
    type: "环境传感器",
    status: "在线",
    warehouse: "华东一号仓",
    room: "A库 / 1区",
    battery: "96%",
    signal: "-65 dBm",
    lastReport: "2026-09-01 10:20:15",
    telemetry: { temp: "21.5 ℃", humidity: "48.2 %RH" },
  },
  {
    id: "IOT-002",
    name: "微波雷达料位计-RD01",
    code: "RD-2026-002",
    type: "雷达测距仪",
    status: "在线",
    warehouse: "华东一号仓",
    room: "露天堆场",
    battery: "市电供电",
    signal: "-58 dBm",
    lastReport: "2026-09-01 10:21:00",
    telemetry: { height: "4.85 m", volume: "1,240 m³" },
  },
  {
    id: "IOT-003",
    name: "高精度电子地磅-WG01",
    code: "WG-2026-003",
    type: "汽车衡称重终端",
    status: "在线",
    warehouse: "华北智能仓",
    room: "过磅处",
    battery: "市电供电",
    signal: "-52 dBm",
    lastReport: "2026-09-01 10:19:40",
    telemetry: { weight: "0.00 吨", status: "空秤就绪" },
  },
  {
    id: "IOT-004",
    name: "无线烟雾探测器-SM02",
    code: "SM-2026-004",
    type: "消防安防传感器",
    status: "在线",
    warehouse: "华南二号仓",
    room: "危化品库",
    battery: "92%",
    signal: "-72 dBm",
    lastReport: "2026-09-01 10:18:22",
    telemetry: { smokeLevel: "0.01 %", fireStatus: "正常安全" },
  },
]

// GPS设备 Mock 数据
const GPS_DEVICES_MOCK = [
  {
    id: "GPS-001",
    name: "押品追踪终端-GPS01",
    code: "GPS-2026-901",
    status: "定位中",
    warehouse: "华东一号仓",
    target: "苏E·88921 (在途运输)",
    battery: "88%",
    satellites: "14 颗",
    speed: "0 km/h (静止)",
    location: "江苏省苏州市工业园区星湖街 328 号",
    lastReport: "2026-09-01 10:22:04",
  },
  {
    id: "GPS-002",
    name: "集装箱电子封条-GPS02",
    code: "GPS-2026-902",
    status: "运动中",
    warehouse: "华北智能仓",
    target: "集装箱 TC-890214",
    battery: "95%",
    satellites: "16 颗",
    speed: "64 km/h",
    location: "G2 京沪高速 182km 处 (南向)",
    lastReport: "2026-09-01 10:24:18",
  },
  {
    id: "GPS-003",
    name: "露天货位定位标-GPS03",
    code: "GPS-2026-903",
    status: "定位中",
    warehouse: "华南二号仓",
    target: "露天堆场 4号钢卷垛位",
    battery: "82%",
    satellites: "12 颗",
    speed: "0 km/h (固定)",
    location: "广东省广州市南沙港保税园区 C-04",
    lastReport: "2026-09-01 10:15:30",
  },
]

// 门禁事务记录 Mock 数据
const ACCESS_LOGS_MOCK = [
  {
    id: "LOG-20260901-01",
    deviceName: "挂锁-LK01",
    deviceCode: "LK-2024-0012",
    deviceType: "挂锁门禁",
    warehouse: "华东一号仓 · A库",
    eventType: "密码开锁成功",
    operator: "张三 (zhang3)",
    applyNo: "UA20260822001",
    timestamp: "2026-09-01 09:30:15",
    isWarning: false,
  },
  {
    id: "LOG-20260901-02",
    deviceName: "人脸门禁-FC01",
    deviceCode: "FC-2024-0041",
    deviceType: "人脸门禁",
    warehouse: "华北智能仓 · 1区主门",
    eventType: "刷脸进门成功",
    operator: "李四 (li4)",
    applyNo: "免审长期授权",
    timestamp: "2026-09-01 09:12:08",
    isWarning: false,
  },
  {
    id: "LOG-20260901-03",
    deviceName: "挂锁-LK02",
    deviceCode: "LK-2024-0082",
    deviceType: "挂锁门禁",
    warehouse: "华东一号仓 · A库1区",
    eventType: "非法试码告警",
    operator: "未知人员",
    applyNo: "无关联申请",
    timestamp: "2026-09-01 08:45:00",
    isWarning: true,
    warningDetail: "密码连续输入错误 3 次，已锁定 15 分钟并推送风控预警",
  },
  {
    id: "LOG-20260901-04",
    deviceName: "挂锁-LK03",
    deviceCode: "LK-2024-0099",
    deviceType: "挂锁门禁",
    warehouse: "华南二号仓 · B库",
    eventType: "临时凭证下发生效",
    operator: "王五 (wang5)",
    applyNo: "UA20260822002",
    timestamp: "2026-09-01 08:30:00",
    isWarning: false,
  },
]

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
        active
          ? "bg-blue-600 font-medium text-white"
          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function OptionPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          active={value === option}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  )
}

export function DeviceManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = (searchParams.get("tab") as DeviceTabId) || "ws-device-access"

  const setTab = (tab: DeviceTabId) => {
    setSearchParams({ tab })
  }

  // 门禁设备专属状态
  const initialFilters = loadCachedAccessDeviceFilters()
  const [draftFilters, setDraftFilters] = useState<AccessDeviceFilters>(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState<AccessDeviceFilters>(initialFilters)
  const [keywordDraft, setKeywordDraft] = useState(initialFilters.keyword)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [toast, setToast] = useState<string | null>(null)

  const [submitOpen, setSubmitOpen] = useState(false)
  const [submitContext, setSubmitContext] = useState<UnlockApplySubmitContext | null>(null)
  const [lockOpen, setLockOpen] = useState(false)
  const [lockContext, setLockContext] = useState<AccessDevicePasswordContext | null>(null)
  const [accessOpen, setAccessOpen] = useState(false)
  const [accessContext, setAccessContext] = useState<AccessDevicePasswordContext | null>(null)

  // 监控设备查看直播弹窗
  const [liveStreamDevice, setLiveStreamDevice] = useState<
    (typeof MONITORING_DEVICES_MOCK)[number] | null
  >(null)

  // 监控/物联/GPS搜索词
  const [genericKeyword, setGenericKeyword] = useState("")

  const filteredAccessDevices = useMemo(
    () =>
      filterAccessDevices(
        accessDevicesMock,
        appliedFilters.keyword,
        appliedFilters.deviceType,
        appliedFilters.status,
        appliedFilters.warehouseName,
        appliedFilters.bindStatus
      ),
    [appliedFilters]
  )

  const visibleAccessDevices = useMemo(
    () => filteredAccessDevices.slice(0, visibleCount),
    [filteredAccessDevices, visibleCount]
  )

  const hasMoreAccess = visibleCount < filteredAccessDevices.length

  const activeFilterCount = [
    appliedFilters.status !== "全部",
    appliedFilters.warehouseName !== "全部",
    appliedFilters.bindStatus !== "全部",
  ].filter(Boolean).length

  const commitAccessFilters = (next: AccessDeviceFilters) => {
    setAppliedFilters(next)
    setDraftFilters(next)
    saveCachedAccessDeviceFilters(next)
  }

  const handleAccessSearch = () => {
    commitAccessFilters({ ...appliedFilters, keyword: keywordDraft.trim() })
    setVisibleCount(PAGE_SIZE)
  }

  const applyDrawerFilters = () => {
    commitAccessFilters(draftFilters)
    setFilterDrawerOpen(false)
    setVisibleCount(PAGE_SIZE)
  }

  const resetDrawerFilters = () => {
    const next = {
      ...DEFAULT_ACCESS_DEVICE_FILTERS,
      keyword: keywordDraft.trim(),
    }
    commitAccessFilters(next)
    setFilterDrawerOpen(false)
    setVisibleCount(PAGE_SIZE)
  }

  const handleGetPassword = (device: AccessDevice) => {
    const needApproval = matchUnlockApprovalConfig(device)
    const context = toPasswordContext(device)

    if (needApproval) {
      setSubmitContext(context)
      setSubmitOpen(true)
      return
    }

    if (device.deviceType === "挂锁门禁") {
      setLockContext(context)
      setLockOpen(true)
    } else {
      setAccessContext(context)
      setAccessOpen(true)
    }
  }

  const handleDeviceAction = (action: string, name: string) => {
    setToast(`已触发「${action}」（${name}）`)
  }

  return (
    <MobileShell>
      {/* 顶部主导航 */}
      <PrototypeAnnotationTarget annotationIds={["device-management-hub-page"]}>
        <NavBar title="设备管理" backTo="/m/workspace" />
      </PrototypeAnnotationTarget>

      {/* 页头 Tab 设备类型切换栏 */}
      <PrototypeAnnotationTarget annotationIds={["device-management-hub-tabs"]}>
        <div className="shrink-0 border-b border-gray-100 bg-white shadow-2xs">
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto px-3 py-2">
            {DEVICE_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = currentTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTab(tab.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/70"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </PrototypeAnnotationTarget>

      {/* ===================== Tab 1: 门禁设备 ===================== */}
      {currentTab === "ws-device-access" && (
        <div className="flex flex-1 flex-col min-h-0">
          <PrototypeAnnotationTarget annotationIds={["access-control-device-h5-filter"]}>
            <div className="shrink-0 space-y-2.5 border-b border-gray-100 bg-white px-3.5 py-2.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full rounded-xl bg-[#f4f5f7] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    placeholder="搜索门禁名称/编码"
                    value={keywordDraft}
                    onChange={(e) => setKeywordDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAccessSearch()}
                  />
                </div>
                <button
                  type="button"
                  className="relative flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-2xs"
                  onClick={() => {
                    setDraftFilters(appliedFilters)
                    setFilterDrawerOpen(true)
                  }}
                  aria-label="更多筛选"
                >
                  <Filter className="size-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Chip
                  label="全部类型"
                  active={appliedFilters.deviceType === "全部"}
                  onClick={() => {
                    const next = { ...appliedFilters, deviceType: "全部" as const }
                    commitAccessFilters(next)
                    setVisibleCount(PAGE_SIZE)
                  }}
                />
                <Chip
                  label="挂锁门禁"
                  active={appliedFilters.deviceType === "挂锁门禁"}
                  onClick={() => {
                    const next = { ...appliedFilters, deviceType: "挂锁门禁" as const }
                    commitAccessFilters(next)
                    setVisibleCount(PAGE_SIZE)
                  }}
                />
                <Chip
                  label="人脸门禁"
                  active={appliedFilters.deviceType === "人脸门禁"}
                  onClick={() => {
                    const next = { ...appliedFilters, deviceType: "人脸门禁" as const }
                    commitAccessFilters(next)
                    setVisibleCount(PAGE_SIZE)
                  }}
                />
                {appliedFilters.warehouseName !== "全部" && (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
                    {appliedFilters.warehouseName}
                  </span>
                )}
                {appliedFilters.status !== "全部" && (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
                    {appliedFilters.status}
                  </span>
                )}
              </div>
            </div>
          </PrototypeAnnotationTarget>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3">
            <PrototypeAnnotationTarget annotationIds={["access-control-device-h5-cards"]}>
              {visibleAccessDevices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
                  暂无门禁设备
                  <p className="mt-1 text-xs text-gray-400">请调整搜索或筛选条件</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleAccessDevices.map((device) => (
                    <AccessControlDeviceCard
                      key={device.id}
                      device={device}
                      onGetPassword={handleGetPassword}
                      onAction={(action, dev) =>
                        handleDeviceAction(action, dev.displayName)
                      }
                    />
                  ))}
                  {hasMoreAccess && (
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white py-3 text-xs font-medium text-gray-600 shadow-2xs active:scale-98"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    >
                      加载更多
                      <ChevronDown className="size-3.5" />
                    </button>
                  )}
                </div>
              )}
            </PrototypeAnnotationTarget>
          </div>

          <FilterDrawer
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            onReset={resetDrawerFilters}
            onConfirm={applyDrawerFilters}
          >
            <DrawerField label="设备类型">
              <OptionPills
                options={["全部", "挂锁门禁", "人脸门禁"] as const}
                value={draftFilters.deviceType}
                onChange={(deviceType) =>
                  setDraftFilters((current) => ({ ...current, deviceType }))
                }
              />
            </DrawerField>
            <DrawerField label="设备状态">
              <OptionPills
                options={["全部", "在线", "离线"] as const}
                value={draftFilters.status}
                onChange={(status) =>
                  setDraftFilters((current) => ({ ...current, status }))
                }
              />
            </DrawerField>
            <DrawerField label="绑定仓库">
              <OptionPills
                options={WAREHOUSE_OPTIONS}
                value={draftFilters.warehouseName}
                onChange={(warehouseName) =>
                  setDraftFilters((current) => ({ ...current, warehouseName }))
                }
              />
            </DrawerField>
            <DrawerField label="绑定状态">
              <OptionPills
                options={["全部", "已绑定", "未绑定"] as const}
                value={draftFilters.bindStatus}
                onChange={(bindStatus) =>
                  setDraftFilters((current) => ({ ...current, bindStatus }))
                }
              />
            </DrawerField>
          </FilterDrawer>

          <PrototypeAnnotationTarget annotationIds={["access-control-device-h5-sheets"]}>
            <UnlockApplySubmitSheet
              open={submitOpen}
              context={submitContext}
              onClose={() => setSubmitOpen(false)}
            />
            <GetLockPasswordSheet
              open={lockOpen}
              context={lockContext}
              onClose={() => setLockOpen(false)}
              onDirectSuccess={(applyNo) =>
                setToast(`免审获取密码成功，已写入我的申请记录（${applyNo}）`)
              }
            />
            <GetAccessPasswordSheet
              open={accessOpen}
              context={accessContext}
              onClose={() => setAccessOpen(false)}
              onDirectSuccess={(applyNo) =>
                setToast(`免审获取密码成功，已写入我的申请记录（${applyNo}）`)
              }
            />
          </PrototypeAnnotationTarget>
        </div>
      )}

      {/* ===================== Tab 2: 监控设备 ===================== */}
      {currentTab === "ws-device-monitoring" && (
        <div className="flex flex-1 flex-col min-h-0">
          <div className="shrink-0 border-b border-gray-100 bg-white px-3.5 py-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-xl bg-[#f4f5f7] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="搜索监控摄像头名称/通道"
                value={genericKeyword}
                onChange={(e) => setGenericKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
            {MONITORING_DEVICES_MOCK.filter(
              (dev) =>
                !genericKeyword ||
                dev.name.includes(genericKeyword) ||
                dev.code.includes(genericKeyword)
            ).map((camera) => (
              <div
                key={camera.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Camera className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {camera.name}
                      </h4>
                      <p className="font-mono text-xs text-gray-400">{camera.code}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      camera.status === "在线"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    ● {camera.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50/80 p-2.5 text-xs">
                  <div>
                    <span className="text-gray-400">位置：</span>
                    <span className="font-medium text-gray-700">
                      {camera.warehouse} {camera.room}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">通道：</span>
                    <span className="font-medium text-gray-700">{camera.channel}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">分辨率：</span>
                    <span className="font-medium text-gray-700">{camera.resolution}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">码率/帧率：</span>
                    <span className="font-medium text-gray-700">
                      {camera.bitrate} / {camera.fps}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => handleDeviceAction("回放录像", camera.name)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
                  >
                    查看回放
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiveStreamDevice(camera)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 active:scale-95 shadow-xs"
                  >
                    <Play className="size-3 fill-current" />
                    <span>查看直播</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== Tab 3: 物联设备 ===================== */}
      {currentTab === "ws-device-iot" && (
        <div className="flex flex-1 flex-col min-h-0">
          <div className="shrink-0 border-b border-gray-100 bg-white px-3.5 py-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-xl bg-[#f4f5f7] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="搜索温湿度/地磅/雷达传感设备"
                value={genericKeyword}
                onChange={(e) => setGenericKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
            {IOT_DEVICES_MOCK.filter(
              (dev) =>
                !genericKeyword ||
                dev.name.includes(genericKeyword) ||
                dev.code.includes(genericKeyword)
            ).map((iot) => (
              <div
                key={iot.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Radio className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {iot.name}
                      </h4>
                      <p className="font-mono text-xs text-gray-400">{iot.code}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                    ● {iot.status}
                  </span>
                </div>

                {/* 实时遥测数据卡片 */}
                <div className="rounded-xl bg-purple-50/40 border border-purple-100/80 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-900 font-medium">
                    <span className="flex items-center gap-1">
                      <Activity className="size-3.5 text-purple-600" />
                      实时传感器数据
                    </span>
                    <span className="text-[10px] text-gray-400">
                      更新：{iot.lastReport.slice(11)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(iot.telemetry).map(([key, val]) => (
                      <div
                        key={key}
                        className="rounded-lg bg-white px-2.5 py-1 text-purple-900 font-semibold shadow-2xs border border-purple-100"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Battery className="size-3.5 text-gray-400" />
                      {iot.battery}
                    </span>
                    <span className="flex items-center gap-1">
                      <Signal className="size-3.5 text-gray-400" />
                      {iot.signal}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeviceAction("遥测历史曲线", iot.name)}
                    className="text-xs font-medium text-purple-600 hover:underline"
                  >
                    查看数据报表 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== Tab 4: GPS设备 ===================== */}
      {currentTab === "ws-device-gps" && (
        <div className="flex flex-1 flex-col min-h-0">
          <div className="shrink-0 border-b border-gray-100 bg-white px-3.5 py-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-xl bg-[#f4f5f7] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="搜索GPS终端/关联车牌"
                value={genericKeyword}
                onChange={(e) => setGenericKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
            {GPS_DEVICES_MOCK.filter(
              (dev) =>
                !genericKeyword ||
                dev.name.includes(genericKeyword) ||
                dev.target.includes(genericKeyword)
            ).map((gps) => (
              <div
                key={gps.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <MapPin className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {gps.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium truncate">
                        关联：{gps.target}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700 border border-teal-200">
                    ● {gps.status}
                  </span>
                </div>

                <div className="rounded-xl bg-gray-50 p-2.5 space-y-1.5 text-xs">
                  <div className="text-gray-700 leading-relaxed">
                    <span className="text-gray-400">实时位置：</span>
                    {gps.location}
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-[11px]">
                    <span>速度：{gps.speed}</span>
                    <span>卫星：{gps.satellites}</span>
                    <span>电量：{gps.battery}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => handleDeviceAction("电子围栏设置", gps.name)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
                  >
                    电子围栏
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeviceAction("历史轨迹回放", gps.name)}
                    className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 active:scale-95 shadow-xs"
                  >
                    轨迹回放
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== Tab 5: 门禁事务记录 ===================== */}
      {currentTab === "ws-device-access-logs" && (
        <div className="flex flex-1 flex-col min-h-0">
          <div className="shrink-0 border-b border-gray-100 bg-white px-3.5 py-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-xl bg-[#f4f5f7] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="搜索通行人员/单号/设备"
                value={genericKeyword}
                onChange={(e) => setGenericKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
            {ACCESS_LOGS_MOCK.filter(
              (log) =>
                !genericKeyword ||
                log.operator.includes(genericKeyword) ||
                log.deviceName.includes(genericKeyword) ||
                log.applyNo.includes(genericKeyword)
            ).map((log) => (
              <div
                key={log.id}
                className={`rounded-2xl border bg-white p-4 shadow-xs space-y-2.5 ${
                  log.isWarning
                    ? "border-rose-200 bg-rose-50/20"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        log.isWarning ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                    />
                    <h4 className="font-semibold text-sm text-gray-900">
                      {log.eventType}
                    </h4>
                  </div>
                  <span className="font-mono text-[11px] text-gray-400">
                    {log.timestamp}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded-xl">
                  <div>
                    <span className="text-gray-400">操作人：</span>
                    <span className="font-medium text-gray-800">{log.operator}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">设备：</span>
                    <span className="font-medium text-gray-800">{log.deviceName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">位置：</span>
                    <span className="font-medium text-gray-800">{log.warehouse}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">关联申请：</span>
                    <span className="font-mono text-blue-600">{log.applyNo}</span>
                  </div>
                </div>

                {log.warningDetail && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg leading-relaxed">
                    {log.warningDetail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 监控设备实时直播流仿真弹窗 */}
      {liveStreamDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in-50">
          <div className="w-full max-w-sm rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden shadow-2xl space-y-3 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold text-sm">{liveStreamDevice.name}</span>
                <span className="text-[10px] bg-red-950/80 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/50">
                  LIVE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLiveStreamDevice(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 视频模拟画面 */}
            <div className="relative aspect-video w-full rounded-xl bg-slate-950 border border-gray-800 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial from-blue-900/20 via-transparent to-black/60" />
              <div className="z-10 flex flex-col items-center gap-2 text-gray-400">
                <Video className="size-8 text-blue-500 animate-pulse" />
                <span className="text-xs font-mono">
                  RTSP H.265 Stream · {liveStreamDevice.resolution}
                </span>
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                25.0 FPS | 4096 kbps
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>{liveStreamDevice.warehouse} · {liveStreamDevice.room}</span>
              <button
                type="button"
                onClick={() => handleDeviceAction("截图抓拍", liveStreamDevice.name)}
                className="text-xs text-blue-400 hover:underline"
              >
                抓拍留痕
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </MobileShell>
  )
}

export const DEVICE_MANAGEMENT_PATH = "/m/device-management"
