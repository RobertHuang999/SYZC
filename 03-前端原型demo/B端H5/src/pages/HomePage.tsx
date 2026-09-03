import { useState } from "react"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Layers,
  Maximize2,
  Package,
  Pause,
  Play,
  Video,
  Warehouse,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"
import { openMenuModule } from "@/lib/open-menu-module"

export function HomePage() {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedWarehouse, setSelectedWarehouse] = useState("水果仓库")
  const [selectedCamera, setSelectedCamera] = useState("摄像头001#")

  const openFeature = (nameOrId: string) => openMenuModule(navigate, nameOrId)

  return (
    <MobileShell>
      {/* 顶部标题区 */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-white shadow-xs">
            <Cloud className="size-4.5 fill-white" />
          </div>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">
            森云·可信供应链数字中枢
          </h1>
        </div>
        <p className="mt-1 text-[10px] text-gray-400">
          小程序仅供森云·可信供应链数字中枢内部(特定)人员使用
        </p>
      </div>

      {/* 页面主滚动区域 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-3 overscroll-contain">
        {/* 1. 数据看板 / 风控预警 / 设备状态卡片 */}
        <section className="rounded-2xl bg-white p-3 shadow-xs space-y-3">
          {/* 上半部分：数据看板 & 风控预警快捷入口 */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => openFeature("home-report")}
              className="flex items-center justify-between rounded-xl bg-[#f4f7fc] p-2.5 active:bg-blue-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#2563eb] text-white">
                  <BarChart3 className="size-4" />
                </div>
                <span className="text-xs font-semibold text-gray-800">报表</span>
              </div>
              <ChevronRight className="size-4 text-gray-300" />
            </div>

            <div
              onClick={() => navigate("/m/supervision/order-warnings")}
              className="flex items-center justify-between rounded-xl bg-[#fdf6ec] p-2.5 active:bg-amber-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#ea580c] text-white">
                  <AlertTriangle className="size-4" />
                </div>
                <span className="text-xs font-semibold text-gray-800">风控预警</span>
              </div>
              <ChevronRight className="size-4 text-gray-300" />
            </div>
          </div>

          {/* 下半部分：设备状态三列 */}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-2 text-[11px]">
            <div
              onClick={() => openFeature("home-digital-warehouse-monitor")}
              className="rounded-xl bg-[#f8fafc] p-2 cursor-pointer active:bg-gray-100"
            >
              <div className="flex items-center justify-between text-gray-500 font-medium">
                <span>监控设备</span>
                <ChevronRight className="size-3 text-gray-300" />
              </div>
              <div className="mt-1 space-y-0.5 text-[10px]">
                <div className="flex items-center gap-1 text-gray-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>在线 12</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="size-1.5 rounded-full bg-gray-300" />
                  <span>离线 1</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => openFeature("home-digital-warehouse-temp")}
              className="rounded-xl bg-[#f8fafc] p-2 cursor-pointer active:bg-gray-100"
            >
              <div className="flex items-center justify-between text-gray-500 font-medium">
                <span>温湿度设备</span>
                <ChevronRight className="size-3 text-gray-300" />
              </div>
              <div className="mt-1 space-y-0.5 text-[10px]">
                <div className="flex items-center gap-1 text-gray-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>在线 99+</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="size-1.5 rounded-full bg-gray-300" />
                  <span>离线 99+</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/m/iot/device-warning-events")}
              className="rounded-xl bg-[#f8fafc] p-2 cursor-pointer active:bg-gray-100"
            >
              <div className="flex items-center justify-between text-gray-500 font-medium">
                <span>离线预警设备</span>
                <ChevronRight className="size-3 text-gray-300" />
              </div>
              <div className="mt-1 space-y-0.5 text-[10px]">
                <div className="flex items-center gap-1 text-rose-600 font-semibold">
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  <span>已离线 99+</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 在线监控卡片 */}
        <section className="rounded-2xl bg-white p-3 shadow-xs space-y-2.5">
          {/* 标题 */}
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Video className="size-3.5" />
            </div>
            <h2 className="text-xs font-bold text-gray-900">在线监控</h2>
          </div>

          {/* 下拉选择仓库与设备 */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <span>仓库</span>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 focus:outline-hidden"
              >
                <option value="水果仓库">水果仓库</option>
                <option value="宝山1号金属仓">宝山1号金属仓</option>
                <option value="惠山保税立体仓">惠山保税立体仓</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-gray-500">
              <span>监控设备</span>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 focus:outline-hidden"
              >
                <option value="摄像头001#">摄像头001#</option>
                <option value="摄像头002#">摄像头002#</option>
                <option value="AI球机008#">AI球机008#</option>
              </select>
            </div>
          </div>

          {/* 视频监控播放器窗口 */}
          <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-video flex flex-col justify-between p-2 shadow-inner">
            {/* 模拟实景画面背景 */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-85"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* 顶部标签 */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-white">
              <span className="rounded bg-emerald-500/80 px-1.5 py-0.2 font-medium">
                ● LIVE 实时
              </span>
              <span className="font-mono text-slate-300">1080P · 25FPS</span>
            </div>

            {/* 居中播放/暂停按钮 */}
            <div className="relative z-10 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex size-11 items-center justify-center rounded-full bg-white/30 backdrop-blur-xs text-white hover:bg-white/40 active:scale-95 transition-all shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="size-5 fill-white" />
                ) : (
                  <Play className="size-5 fill-white ml-0.5" />
                )}
              </button>
            </div>

            {/* 底部控制栏 */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-white gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:text-cyan-300"
              >
                {isPlaying ? (
                  <Pause className="size-3.5" />
                ) : (
                  <Play className="size-3.5" />
                )}
              </button>

              <div className="flex-1 flex items-center gap-1.5">
                <div className="relative flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/2 rounded-full" />
                </div>
                <span className="font-mono text-[9px] text-slate-200">0:30 / 1:00</span>
              </div>

              <button
                type="button"
                onClick={() => openFeature("home-digital-warehouse-monitor")}
                className="p-1 hover:text-cyan-300"
              >
                <Maximize2 className="size-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 3. 数据指标多维看板网格 */}
        <section className="rounded-2xl bg-white p-3 shadow-xs space-y-2.5">
          {/* 第一行：客户总数 & 当前货值 */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100"
            >
              <div className="flex items-center text-xs font-semibold text-[#1875f0]">
                <span>客户总数</span>
                <ChevronRight className="size-3.5" />
              </div>
              <div className="mt-1 text-base font-bold text-gray-900">12,389</div>
            </div>

            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100"
            >
              <div className="text-xs text-gray-400">当前货值 (万元)</div>
              <div className="mt-1 text-base font-bold text-gray-900">8,967.95</div>
            </div>
          </div>

          {/* 第二行：仓库总数、品类总数、货物总类 */}
          <div className="grid grid-cols-3 gap-2">
            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2 text-center cursor-pointer active:bg-gray-100"
            >
              <div className="flex justify-center mb-1">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[#2563eb] text-white">
                  <Warehouse className="size-3.5" />
                </div>
              </div>
              <div className="text-[10px] text-gray-400">仓库总数</div>
              <div className="mt-0.5 text-sm font-bold text-gray-900">145</div>
            </div>

            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2 text-center cursor-pointer active:bg-gray-100"
            >
              <div className="flex justify-center mb-1">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[#e11d48] text-white">
                  <Layers className="size-3.5" />
                </div>
              </div>
              <div className="text-[10px] text-gray-400">品类总数</div>
              <div className="mt-0.5 text-sm font-bold text-gray-900">546</div>
            </div>

            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2 text-center cursor-pointer active:bg-gray-100"
            >
              <div className="flex justify-center mb-1">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[#ea580c] text-white">
                  <Package className="size-3.5" />
                </div>
              </div>
              <div className="text-[10px] text-gray-400">货物品类</div>
              <div className="mt-0.5 text-sm font-bold text-gray-900">1546</div>
            </div>
          </div>

          {/* 第三行：抵/质押中笔数、抵/质押完成数、风险预警数 */}
          <div className="grid grid-cols-3 gap-2">
            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2 cursor-pointer active:bg-gray-100"
            >
              <div className="text-[10px] text-gray-400">抵/质押中笔数</div>
              <div className="mt-0.5 flex items-center gap-1 text-sm font-bold text-gray-900">
                <span className="size-1.5 rounded-full bg-rose-500" />
                <span>456</span>
              </div>
            </div>

            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2 cursor-pointer active:bg-gray-100"
            >
              <div className="text-[10px] text-gray-400">抵/质押完成数</div>
              <div className="mt-0.5 flex items-center gap-1 text-sm font-bold text-gray-900">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>354</span>
              </div>
            </div>

            <div
              onClick={() => navigate("/m/supervision/order-warnings")}
              className="rounded-xl bg-[#f8fafc] p-2 cursor-pointer active:bg-gray-100"
            >
              <div className="text-[10px] text-gray-400">风险预警数</div>
              <div className="mt-0.5 flex items-center gap-1 text-sm font-bold text-rose-600">
                <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>1364</span>
              </div>
            </div>
          </div>

          {/* 第四行：意向融资金额 & 意向融资笔数 */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100"
            >
              <div className="text-[11px] text-gray-400">意向融资金额 (万元)</div>
              <div className="mt-0.5 text-sm font-bold text-gray-900">148455.00</div>
            </div>

            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100"
            >
              <div className="text-[11px] text-gray-400">意向融资笔数</div>
              <div className="mt-0.5 text-sm font-bold text-gray-900">1547</div>
            </div>
          </div>

          {/* 第五行：融资金额 & 融资笔数 */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100"
            >
              <div className="text-[11px] text-gray-400">融资金额 (万元)</div>
              <div className="mt-0.5 text-sm font-bold text-gray-900">48455.00</div>
            </div>

            <div
              onClick={() => openFeature("home-report")}
              className="rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100"
            >
              <div className="text-[11px] text-gray-400">融资笔数</div>
              <div className="mt-0.5 text-sm font-bold text-gray-900">481</div>
            </div>
          </div>
        </section>

        {/* 4. 待办事项卡片 */}
        <section className="rounded-2xl bg-white p-3 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex size-5 items-center justify-center rounded-md bg-[#2563eb] text-white">
                <CheckCircle2 className="size-3.5" />
              </div>
              <h2 className="text-xs font-bold text-gray-900">待办事项</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/m/tasks")}
              className="flex items-center text-[11px] text-gray-400 hover:text-gray-600"
            >
              <span>查看全部</span>
              <ChevronRight className="size-3" />
            </button>
          </div>

          {/* 待办单据卡片 */}
          <div
            onClick={() => navigate("/m/tasks")}
            className="rounded-xl border border-gray-100 bg-[#f8fafc] p-3 text-xs space-y-2 cursor-pointer active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>2025-11-05 10:44:22</span>
              <span>质押·发起抵/质押</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded bg-[#2563eb] text-[10px] font-bold text-white">
                  质
                </span>
                <span className="font-bold text-gray-900 text-xs">李勇</span>
                <span className="text-gray-500 font-mono text-[11px]">
                  15894102473
                </span>
              </div>
              <span className="rounded bg-[#e0edff] px-2 py-0.5 text-[10px] font-semibold text-[#1875f0]">
                处理中
              </span>
            </div>

            <div className="text-[11px] text-gray-500 space-y-0.5 pt-1">
              <div className="flex justify-between">
                <span className="text-gray-400">抵/质押货物</span>
                <span className="font-mono text-gray-700">
                  CD02025022701234504564
                </span>
              </div>
              <div className="flex justify-end">
                <span className="font-mono text-gray-700">
                  CD02025022701234505242
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-400">贷款金额</span>
                <span className="font-bold text-gray-900">¥500,000</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 底部导航栏 */}
      <BottomTabBar />
    </MobileShell>
  )
}
