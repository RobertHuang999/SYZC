import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  parsePartnerArchiveMenuFromPathname,
  partnerArchiveAddPath,
} from "@prototype/shared/partner-archives/partner-archive-routes"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { getPartnerArchiveDocuments } from "../documents/partner-archive-documents"
import { ARCHIVE_MENU_SHORT_LABEL } from "@prototype/shared/partner-archives/partner-archive-domain"
import { partnerArchiveListAnnotations } from "../annotations/partner-archive-list.annotations"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import { PartnerArchiveFiltersPanel } from "../components/PartnerArchiveFiltersPanel"
import { PartnerArchiveTable } from "../components/PartnerArchiveTable"
import { PartnerAppendRoleDialog } from "../components/PartnerAppendRoleDialog"
import { PartnerConfirmDialog } from "../components/PartnerConfirmDialog"
import { PartnerFreezeBlockedDialog } from "../components/PartnerFreezeBlockedDialog"
import { PartnerVerifyDialog } from "../components/PartnerVerifyDialog"
import {
  DEFAULT_PARTNER_ARCHIVE_FILTERS,
  PAGE_SIZE,
} from "../domain/constants"
import type {
  PartnerArchivePendingAction,
  PartnerArchiveRowAction,
} from "../domain/actions"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  type PartnerArchiveFilters,
  type PartnerSubject,
} from "../domain/types"
import { commitPartnerArchive } from "../lib/detail-utils"
import { filterPartnerArchives, paginatePartnerArchives } from "../lib/list-utils"
import {
  applyPartnerSubjectFreeze,
  applyPartnerSubjectUnfreeze,
} from "../lib/partner-subject-freeze-state"
import {
  enrichPartnerListForFreezeDemo,
  withPartnerFreezeDemoData,
} from "../mock/partner-freeze-demo-rehydrate"
import { appendLinkedPartnerMenus } from "../lib/linked-partner-archives"
import {
  checkPartnerSubjectFreezeEligibility,
  type FreezeBlockReason,
} from "../lib/partner-archive-rules"
import { markContactPhoneVerified } from "../lib/contact-phone-verify"
import {
  PARTNER_SUBJECT_FREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_DIALOG,
  formatPartnerSubjectStatusToast,
} from "../lib/partner-archive-ui-labels"

type PendingDialog = {
  action: PartnerArchivePendingAction
  partner: PartnerSubject
}

export function PartnerArchiveListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const archiveMenuLabel = parsePartnerArchiveMenuFromPathname(location.pathname)
  const archiveDocuments = useMemo(
    () => getPartnerArchiveDocuments(archiveMenuLabel),
    [archiveMenuLabel],
  )
  const [dataList, setDataList] = useState<PartnerSubject[]>(() =>
    enrichPartnerListForFreezeDemo([...partnerArchivesMock]),
  )
  const [draftFilters, setDraftFilters] = useState<PartnerArchiveFilters>(
    DEFAULT_PARTNER_ARCHIVE_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<PartnerArchiveFilters>(
    DEFAULT_PARTNER_ARCHIVE_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [pendingDialog, setPendingDialog] = useState<PendingDialog | null>(null)
  const [blockedDialog, setBlockedDialog] = useState<{
    partner: PartnerSubject
    blockInfo: FreezeBlockReason
  } | null>(null)
  const [appendRoleOpen, setAppendRoleOpen] = useState(false)
  const [activePartner, setActivePartner] = useState<PartnerSubject | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [verifyPartner, setVerifyPartner] = useState<PartnerSubject | null>(null)
  const ignoreRowActionsUntilRef = useRef(0)

  useEffect(() => {
    setDataList(enrichPartnerListForFreezeDemo([...partnerArchivesMock]))
  }, [location.pathname, location.key])

  const filteredData = useMemo(
    () => filterPartnerArchives(dataList, appliedFilters, archiveMenuLabel),
    [dataList, appliedFilters, archiveMenuLabel]
  )

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginatePartnerArchives(filteredData, currentPage, pageSize),
    [filteredData, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
    window.dispatchEvent(new Event("partner-archive-updated"))
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_PARTNER_ARCHIVE_FILTERS)
    setAppliedFilters(DEFAULT_PARTNER_ARCHIVE_FILTERS)
    setPage(1)
  }

  const handleRowAction = (action: PartnerArchiveRowAction, item: PartnerSubject) => {
    if (Date.now() < ignoreRowActionsUntilRef.current) {
      return
    }
    switch (action) {
      case "appendRole":
        setActivePartner(item)
        setAppendRoleOpen(true)
        return
      case "freeze": {
        const check = checkPartnerSubjectFreezeEligibility(withPartnerFreezeDemoData(item))
        if (!check.canFreeze) {
          setBlockedDialog({ partner: item, blockInfo: check })
          return
        }
        setPendingDialog({ action: "freeze", partner: item })
        return
      }
      case "unfreeze":
        setPendingDialog({ action: "unfreeze", partner: item })
        return
      case "verifyContact":
        setVerifyPartner(item)
        return
      default:
        return
    }
  }

  const completeVerifyContact = () => {
    if (!verifyPartner) {
      return
    }
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const next: PartnerSubject = {
      ...verifyPartner,
      updateTime: now,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          opTime: now,
          operator: "当前用户",
          actionType: "EDIT",
          actionName: "修改合作方档案",
          detail: "修改合作方档案：联系手机完成短信核验，状态变为已验证",
        },
        ...verifyPartner.auditLogs,
      ],
    }
    markContactPhoneVerified(next, now)
    commitPartnerArchive(next)
    setDataList((prev) => prev.map((item) => (item.id === verifyPartner.id ? next : item)))
    setVerifyPartner(null)
    showToast("联系手机验证成功")
  }

  const confirmPendingDialog = (reason: string) => {
    if (!pendingDialog) {
      return
    }

    const { action, partner } = pendingDialog

    if (action === "freeze") {
      const next = applyPartnerSubjectFreeze(partner, reason)
      commitPartnerArchive(next)
      setDataList((prev) => prev.map((item) => (item.id === partner.id ? next : item)))
      showToast(formatPartnerSubjectStatusToast(partner.name, "freeze"))
    }

    if (action === "unfreeze") {
      const next = applyPartnerSubjectUnfreeze(partner, reason)
      commitPartnerArchive(next)
      setDataList((prev) => prev.map((item) => (item.id === partner.id ? next : item)))
      showToast(formatPartnerSubjectStatusToast(partner.name, "unfreeze"))
    }

    ignoreRowActionsUntilRef.current = Date.now() + 300
    setPendingDialog(null)
  }

  const handleAppendRoleConfirm = (targetMenus: PartnerArchiveMenuLabel[]) => {
    if (!activePartner || targetMenus.length === 0) {
      return
    }
    const detail = targetMenus
      .map((menu) => `在【${menu}】创建独立主档或关联已有主档`)
      .join("；")
    const next = appendLinkedPartnerMenus(activePartner, targetMenus, detail)
    commitPartnerArchive(next)
    setDataList((prev) => prev.map((item) => (item.id === activePartner.id ? next : item)))
    showToast(`已为【${activePartner.name}】追加合作方档案角色`)
    setActivePartner(null)
  }

  return (
    <PrototypeAnnotationProvider
      annotations={partnerArchiveListAnnotations}
      documents={archiveDocuments}
      title="合作方档案列表 · 原型批注"
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["partner-archive-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">{archiveMenuLabel}</h1>
          <p className="text-sm text-muted-foreground">
            维护当前子菜单合作身份主档、证件地址与主体状态；跨菜单身份通过「其他合作档案」关联
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["partner-archive-filter"]}>
            <PartnerArchiveFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate(partnerArchiveAddPath(archiveMenuLabel))}
              addLabel={`新增${ARCHIVE_MENU_SHORT_LABEL[archiveMenuLabel]}`}
              archiveMenu={archiveMenuLabel}
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget
            annotationIds={["partner-archive-table", "partner-archive-row-actions"]}
          >
            <PartnerArchiveTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
            />
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["partner-archive-pagination"]}>
            <WarningListPagination
              total={filteredData.length}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          </PrototypeAnnotationTarget>
        </div>

        <PartnerConfirmDialog
          open={pendingDialog?.action === "freeze"}
          title={PARTNER_SUBJECT_FREEZE_DIALOG.title}
          description={PARTNER_SUBJECT_FREEZE_DIALOG.description}
          confirmLabel={PARTNER_SUBJECT_FREEZE_DIALOG.confirmLabel}
          destructive={PARTNER_SUBJECT_FREEZE_DIALOG.destructive}
          reasonRequired
          reasonLabel={PARTNER_SUBJECT_FREEZE_DIALOG.reasonLabel}
          reasonPlaceholder={PARTNER_SUBJECT_FREEZE_DIALOG.reasonPlaceholder}
          onOpenChange={(open) => {
            if (!open) {
              setPendingDialog(null)
            }
          }}
          onConfirm={confirmPendingDialog}
        />

        <PartnerFreezeBlockedDialog
          open={Boolean(blockedDialog)}
          onOpenChange={(open) => {
            if (!open) {
              setBlockedDialog(null)
            }
          }}
          partner={blockedDialog?.partner ?? null}
          blockInfo={blockedDialog?.blockInfo ?? null}
        />

        <PartnerConfirmDialog
          open={pendingDialog?.action === "unfreeze"}
          title={PARTNER_SUBJECT_UNFREEZE_DIALOG.title}
          description={PARTNER_SUBJECT_UNFREEZE_DIALOG.description}
          confirmLabel={PARTNER_SUBJECT_UNFREEZE_DIALOG.confirmLabel}
          reasonRequired
          reasonLabel={PARTNER_SUBJECT_UNFREEZE_DIALOG.reasonLabel}
          reasonPlaceholder={PARTNER_SUBJECT_UNFREEZE_DIALOG.reasonPlaceholder}
          onOpenChange={(open) => {
            if (!open) {
              setPendingDialog(null)
            }
          }}
          onConfirm={confirmPendingDialog}
        />

        <PartnerAppendRoleDialog
          partner={activePartner}
          open={appendRoleOpen}
          onOpenChange={(open) => {
            setAppendRoleOpen(open)
            if (!open) {
              setActivePartner(null)
            }
          }}
          onConfirm={handleAppendRoleConfirm}
        />

        {verifyPartner ? (
          <PartnerVerifyDialog
            open
            mode="VERIFY_CONTACT"
            verifyContext="DETAIL_VERIFY"
            subjectType={verifyPartner.subjectType}
            name={verifyPartner.name}
            idNumber={verifyPartner.idNumber}
            contactPhone={verifyPartner.contactPhone}
            fullAddress={verifyPartner.certAddress.fullAddress}
            roles={verifyPartner.roles.map((role) => role.roleType)}
            agentName={verifyPartner.agentName}
            onOpenChange={(open) => {
              if (!open) {
                setVerifyPartner(null)
              }
            }}
            onConfirm={completeVerifyContact}
          />
        ) : null}

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
