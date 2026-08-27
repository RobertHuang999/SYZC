import {
  Building,
  KeyRound,
  ShieldCheck,
  Warehouse,
} from "lucide-react"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"

export function ProfilePage() {
  const warehouses = [
    {
      name: "上海宝山1号智能立体仓",
      code: "WH-SH-001",
      role: "全权监管与作业准入",
      status: "正常运行",
      iotCount: "12台监控 / 6路温湿度 / 2台门禁",
    },
    {
      name: "无锡惠山大宗金属保税仓",
      code: "WH-WX-002",
      role: "全权监管与作业准入",
      status: "正常运行",
      iotCount: "8台监控 / 4路温湿度 / 1台地磅",
    },
    {
      name: "宁波北仑港保税监管仓",
      code: "WH-NB-003",
      role: "只读监管与巡检查验",
      status: "正常运行",
      iotCount: "16台监控 / 4台GPS追踪",
    },
  ]

  return (
    <MobileShell>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b border-gray-200/90 bg-white/95 px-4 backdrop-blur-md">
        <h1 className="text-base font-bold text-gray-900">机构与数据权限</h1>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
          ● 已鉴权接入
        </span>
      </header>

      {/* 主滚动体 */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {/* 1. 用户信息卡片 */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-4 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-400/30 text-lg font-bold text-blue-300">
              李
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">李监管员</span>
                <span className="rounded bg-blue-500/30 px-1.5 py-0.2 text-[10px] text-blue-200 border border-blue-400/30">
                  高级风控监管员
                </span>
              </div>
              <div className="mt-0.5 text-xs text-slate-300">
                工号：SYZC-2026-088 · 机构代码：SY-EAST-01
              </div>
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[11px]">
            <div>
              <span className="text-slate-400">归属机构：</span>
              <span className="font-medium text-slate-200">森云科技华东运营中心</span>
            </div>
            <div>
              <span className="text-slate-400">顶级机构：</span>
              <span className="font-medium text-slate-200">森云科技控股有限公司</span>
            </div>
          </div>
        </section>

        {/* 2. 仓库数据权限列表 */}
        <section className="rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Warehouse className="size-4" />
              </div>
              <h2 className="text-xs font-bold text-gray-900">
                授权管辖物理仓库 (3)
              </h2>
            </div>
            <span className="text-[10px] text-gray-400">数据权限决定范围</span>
          </div>

          <div className="mt-3 space-y-2">
            {warehouses.map((wh) => (
              <div
                key={wh.code}
                className="rounded-xl border border-gray-100 bg-slate-50/80 p-2.5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{wh.name}</span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700">
                    {wh.status}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500">
                  <span className="font-mono text-gray-400">{wh.code}</span> · {wh.role}
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">
                  IoT 基建：{wh.iotCount}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 三维权限机制规范说明 */}
        <section className="rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs text-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <ShieldCheck className="size-4" />
            </div>
            <h2 className="text-xs font-bold text-gray-900">SYZC 三维权限矩阵规范</h2>
          </div>

          <div className="space-y-2 text-[11px] text-gray-600">
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="font-semibold text-gray-800 flex items-center gap-1">
                <KeyRound className="size-3 text-blue-600" />
                1. 功能与操作权限
              </div>
              <p className="mt-0.5 text-gray-500 leading-snug">
                控制各模块中“查看、入库、出库、移库、平仓、核销、审批”等按钮的显隐与执行许可。
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="font-semibold text-gray-800 flex items-center gap-1">
                <Warehouse className="size-3 text-emerald-600" />
                2. 仓库数据权限 (物理防线)
              </div>
              <p className="mt-0.5 text-gray-500 leading-snug">
                实物台账、盘点扫码、IoT设备监控及门禁记录严格由账号绑定的仓库权限决定；未绑定位置设备全局可见。
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="font-semibold text-gray-800 flex items-center gap-1">
                <Building className="size-3 text-purple-600" />
                3. 机构与订单数据权限 (金融防线)
              </div>
              <p className="mt-0.5 text-gray-500 leading-snug">
                质押融资订单、审批流、尽调线索按顶级机构与子机构做纵向数据隔离，经办人与发起人全程追踪。
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 底部导航栏 */}
      <BottomTabBar />
    </MobileShell>
  )
}
