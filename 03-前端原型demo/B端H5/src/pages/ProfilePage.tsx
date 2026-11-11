import { useState } from "react"
import {
  ChevronRight,
  FileLock2,
  Power,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CURRENT_USER_MOCK } from "@/features/profile/mock/current-user.mock"
import { maskPhone } from "@/lib/mask-phone"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"
import { H5_PRIMARY } from "@/shared/h5-ui-theme"

type ProfileMenuItem = {
  key: string
  label: string
  icon: typeof ShieldCheck
  trailing?: string
  danger?: boolean
  path?: string
  onClick?: () => void
}

function ProfileMenuRow({
  item,
  onPress,
}: {
  item: ProfileMenuItem
  onPress: () => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50/80"
    >
      <span className="flex size-6 shrink-0 items-center justify-center text-gray-800">
        <Icon className="size-[22px] stroke-[1.6]" />
      </span>
      <span
        className={`min-w-0 flex-1 text-[15px] font-medium ${
          item.danger ? "text-gray-900" : "text-gray-900"
        }`}
      >
        {item.label}
      </span>
      {item.trailing ? (
        <span className="shrink-0 text-sm text-gray-400 tabular-nums">{item.trailing}</span>
      ) : null}
      <ChevronRight className="size-4 shrink-0 text-gray-300" strokeWidth={2} />
    </button>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)
  const maskedMobile = maskPhone(CURRENT_USER_MOCK.mobile)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  const menuItems: ProfileMenuItem[] = [
    {
      key: "auth",
      label: "授权管理",
      icon: ShieldCheck,
      path: "/m/profile/authorization",
    },
    {
      key: "phone",
      label: "手机号",
      icon: Smartphone,
      trailing: maskedMobile,
      path: "/m/profile/phone",
    },
    {
      key: "privacy",
      label: "隐私协议",
      icon: FileLock2,
      path: "/m/profile/privacy",
    },
    {
      key: "logout",
      label: "退出登录",
      icon: Power,
      onClick: () => {
        const confirmed = window.confirm("确定退出当前账号？（原型仅演示，不会真正登出）")
        if (confirmed) showToast("已退出登录（原型演示）")
      },
    },
  ]

  const handleMenuPress = (item: ProfileMenuItem) => {
    if (item.onClick) {
      item.onClick()
      return
    }
    if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* 顶区：品牌蓝渐变 + 登录人信息（Tab 页无 NavBar） */}
        <header className="shrink-0 bg-gradient-to-b from-[#e8f3ff] via-blue-50/90 to-[#edf2f8] px-4 pb-6 pt-[max(env(safe-area-inset-top),14px)]">
          <div className="flex items-center gap-3.5 pt-2">
            <div className="size-[54px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-200/90 shadow-xs ring-1 ring-[#bedaff]/80">
              {CURRENT_USER_MOCK.avatarUrl ? (
                <img
                  src={CURRENT_USER_MOCK.avatarUrl}
                  alt={`${CURRENT_USER_MOCK.displayName} 头像`}
                  className="size-full object-cover"
                />
              ) : (
                <div
                  className={`flex size-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-lg font-bold ${H5_PRIMARY.text}`}
                >
                  {CURRENT_USER_MOCK.displayName.slice(0, 2)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                {CURRENT_USER_MOCK.displayName}
              </h1>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-500">
                {CURRENT_USER_MOCK.companyName}
              </p>
              <span
                className={`mt-2 inline-flex max-w-full items-center rounded-md px-2 py-0.5 text-[10px] font-medium leading-snug ${H5_PRIMARY.pillActive}`}
              >
                {CURRENT_USER_MOCK.roleLabel}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-3 -mt-2">
          <section className="overflow-hidden rounded-2xl bg-white shadow-xs">
            {menuItems.map((item, index) => (
              <div key={item.key}>
                {index > 0 ? <div className="ml-[52px] h-px bg-gray-100" /> : null}
                <ProfileMenuRow item={item} onPress={() => handleMenuPress(item)} />
              </div>
            ))}
          </section>

          <p className="mt-8 pb-2 text-center text-sm text-gray-400">
            系统版本号：{CURRENT_USER_MOCK.systemVersion}
          </p>
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none absolute bottom-[calc(50px+env(safe-area-inset-bottom)+12px)] left-0 right-0 z-40 flex justify-center px-6">
          <div className="rounded-full bg-gray-900/88 px-4 py-2 text-xs font-medium text-white shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}

      <BottomTabBar />
    </MobileShell>
  )
}
