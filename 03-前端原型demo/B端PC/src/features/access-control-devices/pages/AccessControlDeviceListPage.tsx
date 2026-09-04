import { useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  UnlockApplySubmitDialog,
  type UnlockApplySubmitContext,
} from "@/features/unlock-applies/components/UnlockApplySubmitDialog"
import { AccessControlDeviceFilters } from "../components/AccessControlDeviceFilters"
import { AccessControlDeviceTable } from "../components/AccessControlDeviceTable"
import { GetAccessPasswordDialog } from "../components/GetAccessPasswordDialog"
import { GetLockPasswordDialog } from "../components/GetLockPasswordDialog"
import {
  DEFAULT_ACCESS_DEVICE_FILTERS,
  PAGE_SIZE,
} from "../domain/constants"
import type {
  AccessDevice,
  AccessDeviceFilters,
  AccessDevicePasswordContext,
} from "../domain/types"
import { matchUnlockApprovalConfig } from "../lib/match-unlock-approval-config"
import {
  filterAccessDevices,
  paginateAccessDevices,
  toPasswordContext,
} from "../lib/list-utils"
import { accessDevicesMock } from "../mock/access-devices.mock"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { accessControlDeviceListAnnotations } from "../annotations/access-control-device-list.annotations"
import { accessControlDeviceDocuments } from "../documents/access-control-device-documents"

export function AccessControlDeviceListPage() {
  const [draftFilters, setDraftFilters] = useState<AccessDeviceFilters>(
    DEFAULT_ACCESS_DEVICE_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<AccessDeviceFilters>(
    DEFAULT_ACCESS_DEVICE_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [submitOpen, setSubmitOpen] = useState(false)
  const [submitContext, setSubmitContext] = useState<UnlockApplySubmitContext | null>(null)
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [lockContext, setLockContext] = useState<AccessDevicePasswordContext | null>(null)
  const [accessDialogOpen, setAccessDialogOpen] = useState(false)
  const [accessContext, setAccessContext] = useState<AccessDevicePasswordContext | null>(null)

  const filteredDevices = useMemo(
    () => filterAccessDevices(accessDevicesMock, appliedFilters),
    [appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredDevices.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageDevices = useMemo(
    () => paginateAccessDevices(filteredDevices, currentPage, pageSize),
    [filteredDevices, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_ACCESS_DEVICE_FILTERS)
    setAppliedFilters(DEFAULT_ACCESS_DEVICE_FILTERS)
    setPage(1)
  }

  const handleGetPassword = (device: AccessDevice) => {
    const { needApproval } = matchUnlockApprovalConfig(device)
    const context = toPasswordContext(device)

    if (needApproval) {
      setSubmitContext(context)
      setSubmitOpen(true)
      return
    }

    if (device.deviceType === "挂锁门禁") {
      setLockContext(context)
      setLockDialogOpen(true)
    } else {
      setAccessContext(context)
      setAccessDialogOpen(true)
    }
  }

  const handleOtherAction = (action: string, device: AccessDevice) => {
    showToast(`${action}（${device.displayName}）— 原型占位`)
  }

  return (
    <PrototypeAnnotationProvider
      title="门禁设备列表 · 原型批注"
      annotations={accessControlDeviceListAnnotations}
      documents={accessControlDeviceDocuments}
    >
      <div className="space-y-4 p-4 md:p-6">
        <PrototypeAnnotationTarget annotationIds={["access-control-device-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">门禁设备</h1>
            <p className="text-sm text-muted-foreground">
              挂锁/人脸门禁统一管理；获取密码按审批配置分流免审或发起申请
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["access-control-device-filter"]}>
          <AccessControlDeviceFilters
            value={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["access-control-device-table"]}>
          <AccessControlDeviceTable
            devices={pageDevices}
            page={currentPage}
            pageSize={pageSize}
            onGetPassword={handleGetPassword}
            onOtherAction={handleOtherAction}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["access-control-device-pagination"]}>
          <WarningListPagination
            page={currentPage}
            pageSize={pageSize}
            total={filteredDevices.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
            totalLabel="条设备"
          />
        </PrototypeAnnotationTarget>

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        )}

        <PrototypeAnnotationTarget annotationIds={["access-control-device-password-dialogs"]}>
          <UnlockApplySubmitDialog
            open={submitOpen}
            context={submitContext}
            onOpenChange={setSubmitOpen}
          />
          <GetLockPasswordDialog
            open={lockDialogOpen}
            context={lockContext}
            onOpenChange={setLockDialogOpen}
          />
          <GetAccessPasswordDialog
            open={accessDialogOpen}
            context={accessContext}
            onOpenChange={setAccessDialogOpen}
          />
        </PrototypeAnnotationTarget>
      </div>
    </PrototypeAnnotationProvider>
  )
}
