import { Construction } from "lucide-react"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"

export function ProfilePage() {
  return (
    <MobileShell>
      <NavBar title="我的" showBack={false} />

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
