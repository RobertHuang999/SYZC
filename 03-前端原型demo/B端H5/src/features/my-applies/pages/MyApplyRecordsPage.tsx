import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  MY_APPLY_TABS,
  myApplyTabSearchParam,
  parseMyApplyTabParam,
  type MyApplyTabKey,
} from "../domain/constants"
import { ProcessApplyTabPanel } from "../components/ProcessApplyTabPanel"
import { PolicyApplyTabPanel } from "../components/PolicyApplyTabPanel"
import { UnlockApplyTabPanel } from "../components/UnlockApplyTabPanel"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

export function MyApplyRecordsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = parseMyApplyTabParam(searchParams.get("tab"))
  const [activeTab, setActiveTab] = useState<MyApplyTabKey>(initialTab)

  useEffect(() => {
    setActiveTab(parseMyApplyTabParam(searchParams.get("tab")))
  }, [searchParams])

  const handleTabChange = (tab: MyApplyTabKey) => {
    setActiveTab(tab)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("tab", myApplyTabSearchParam(tab))
      return next
    })
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["my-apply-records-page"]}>
        <NavBar title="我的申请记录" backTo="/m/tasks" />
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["my-apply-records-tabs"]}>
        <div className="shrink-0 border-b border-gray-100 bg-white shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 no-scrollbar">
            {MY_APPLY_TABS.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex shrink-0 items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/70"
                  }`}
                >
                  <span>{tab.label}</span>
                  {!tab.ready && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      待接入
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </PrototypeAnnotationTarget>

      <div className="flex flex-1 flex-col min-h-0">
        <PrototypeAnnotationTarget annotationIds={["my-apply-records-filter", "my-apply-records-cards"]}>
          {activeTab === "process" && <ProcessApplyTabPanel />}
          {activeTab === "policy" && <PolicyApplyTabPanel />}
          {activeTab === "unlock" && <UnlockApplyTabPanel />}
        </PrototypeAnnotationTarget>
      </div>
    </MobileShell>
  )
}
