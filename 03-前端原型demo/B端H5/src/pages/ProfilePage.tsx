import { Construction } from "lucide-react"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"

export function ProfilePage() {
  return (
    <MobileShell>
      <header className="flex h-12 shrink-0 items-center justify-center border-b border-gray-200/90 bg-white/95 px-4 backdrop-blur-md">
        <h1 className="text-base font-bold text-gray-900">我的</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Construction className="size-8" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">页面构建中</p>
      </div>

      <BottomTabBar />
    </MobileShell>
  )
}
