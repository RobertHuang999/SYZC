import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MyUnlockApplyFiltersPanel } from "../components/MyUnlockApplyFilters"
import { MyUnlockApplyTable } from "../components/MyUnlockApplyTable"
import { WithdrawConfirmDialog } from "../components/WithdrawConfirmDialog"
import {
  DEFAULT_MY_UNLOCK_APPLY_FILTERS,
  MY_APPLY_LIST_PATH,
  PAGE_SIZE,
} from "../domain/constants"
import type { MyUnlockApplyFilters, UnlockApply } from "../domain/types"
import { filterMyUnlockApplies } from "../lib/my-list-utils"
import { paginateUnlockApplies } from "../lib/list-utils"
import { updateUnlockApply, useUnlockApplies } from "../lib/unlock-applies-store"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { myUnlockApplyListAnnotations } from "../annotations/my-unlock-apply-list.annotations"
import { unlockApplyDocuments } from "../documents/unlock-apply-documents"

const FILTER_CACHE_KEY = "SYZC_PC_MY_UNLOCK_APPLY_FILTERS"

type TabKey = "process" | "policy" | "unlock"

function parseTabParam(tab: string | null): TabKey {
  if (tab === "unlock" || tab === "unlock-applies") return "unlock"
  if (tab === "policy" || tab === "policy-news" || tab === "lease") return "policy"
  return "process"
}

function loadCachedFilters(): MyUnlockApplyFilters {
  try {
    const raw = sessionStorage.getItem(FILTER_CACHE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_MY_UNLOCK_APPLY_FILTERS
}

function saveCachedFilters(filters: MyUnlockApplyFilters) {
  try {
    sessionStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(filters))
  } catch {}
}

const tabs: { key: TabKey; label: string; ready: boolean }[] = [
  { key: "process", label: "我的流程申请", ready: true },
  { key: "policy", label: "我的政策资讯申请", ready: false },
  { key: "unlock", label: "我的开锁申请", ready: true },
]

export function MyApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialTab = parseTabParam(searchParams.get("tab"))
  const deepLinkApplyNo = searchParams.get("applyNo")

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab)
  const [draftFilters, setDraftFilters] = useState<MyUnlockApplyFilters>(loadCachedFilters)
  const [appliedFilters, setAppliedFilters] = useState<MyUnlockApplyFilters>(loadCachedFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [withdrawingApply, setWithdrawingApply] = useState<UnlockApply | null>(null)
  const items = useUnlockApplies()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    setActiveTab(parseTabParam(searchParams.get("tab")))
  }, [searchParams])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (deepLinkApplyNo && (tab === "unlock" || tab === "unlock-applies")) {
      navigate(
        `${MY_APPLY_LIST_PATH}/unlock-applies/${deepLinkApplyNo}${searchParams.get("return_route") ? `?return_route=${encodeURIComponent(searchParams.get("return_route")!)}` : ""}`,
        { replace: true }
      )
    }
  }, [deepLinkApplyNo, navigate, searchParams])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const filteredItems = useMemo(
    () => filterMyUnlockApplies(items, appliedFilters),
    [items, appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => paginateUnlockApplies(filteredItems, currentPage, pageSize),
    [filteredItems, currentPage, pageSize]
  )

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("tab", tab === "unlock" ? "unlock-applies" : tab)
      next.delete("applyNo")
      return next
    })
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    saveCachedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_MY_UNLOCK_APPLY_FILTERS)
    setAppliedFilters(DEFAULT_MY_UNLOCK_APPLY_FILTERS)
    saveCachedFilters(DEFAULT_MY_UNLOCK_APPLY_FILTERS)
    setPage(1)
  }

  const handleWithdraw = () => {
    if (!withdrawingApply) return
    if (withdrawingApply.status !== "PENDING" || !withdrawingApply.needsApproval) {
      showToast("撤回失败：申请状态已变更")
      setWithdrawingApply(null)
      return
    }
    updateUnlockApply(withdrawingApply.applyNo, (item) => ({
      ...item,
      status: "WITHDRAWN",
      finalConclusion: "撤回",
    }))
    setWithdrawingApply(null)
    showToast("撤回成功")
  }

  return (
    <PrototypeAnnotationProvider
      title="我的开锁申请 · 原型批注"
      annotations={activeTab === "unlock" ? myUnlockApplyListAnnotations : []}
      documents={unlockApplyDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["my-unlock-apply-page"]}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">我的申请管理</h1>
              <p className="text-sm text-muted-foreground">
                查看本人发起的流程申请与开锁申请进度
              </p>
            </div>
            <Link to="/工作中心/审批中心">
              <Button variant="outline">返回审批中心</Button>
            </Link>
          </div>
        </PrototypeAnnotationTarget>

        <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "process" && (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
          我的流程申请沿用线上交互，6.2 原型使用占位 Mock（非本模块范围）
        </div>
      )}

      {activeTab === "policy" && (
        <div className="rounded-xl border border-dashed bg-card p-10 text-center">
          <p className="text-sm font-medium text-muted-foreground">功能开发中</p>
          <p className="mt-2 text-xs text-muted-foreground">
            我的政策资讯申请将在后续版本接入
          </p>
        </div>
      )}

      {activeTab === "unlock" && (
        <>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSearch()
            }}
          >
            <PrototypeAnnotationTarget annotationIds={["my-unlock-apply-filter"]}>
              <MyUnlockApplyFiltersPanel
                value={draftFilters}
                onChange={setDraftFilters}
                onSearch={handleSearch}
                onReset={handleReset}
              />
            </PrototypeAnnotationTarget>
          </form>

          <div className="space-y-4">
            <PrototypeAnnotationTarget
              annotationIds={["my-unlock-apply-table", "my-unlock-apply-row-actions"]}
            >
              <MyUnlockApplyTable
                items={pageItems}
                startIndex={(currentPage - 1) * pageSize}
                onWithdraw={setWithdrawingApply}
              />
            </PrototypeAnnotationTarget>

            <PrototypeAnnotationTarget annotationIds={["my-unlock-apply-pagination"]}>
              <WarningListPagination
                page={currentPage}
                pageSize={pageSize}
                total={filteredItems.length}
                onPageChange={setPage}
                onPageSizeChange={(next) => {
                  setPageSize(next)
                  setPage(1)
                }}
              />
            </PrototypeAnnotationTarget>
          </div>
        </>
      )}

      <WithdrawConfirmDialog
        open={Boolean(withdrawingApply)}
        onOpenChange={(open) => {
          if (!open) setWithdrawingApply(null)
        }}
        onConfirm={handleWithdraw}
      />

      {toastMessage && (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
    </PrototypeAnnotationProvider>
  )
}
