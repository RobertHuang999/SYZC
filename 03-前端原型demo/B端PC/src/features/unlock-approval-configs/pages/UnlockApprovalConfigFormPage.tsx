import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConfigConfirmDialog } from "@/features/device-warning-configs/components/ConfigConfirmDialog"
import { LIST_BASE_PATH } from "../domain/constants"
import type { ScopeType } from "../domain/types"
import { ApprovalNodeEditor } from "../components/ApprovalNodeEditor"
import { FieldLabelWithHelp } from "../components/FieldHelpTooltip"
import { ScopeCascadeSelector } from "../components/ScopeCascadeSelector"
import { TimeoutHoursInput } from "../components/TimeoutHoursInput"
import { UnlockDeviceSelectDialog } from "../components/UnlockDeviceSelectDialog"
import { getUnlockApprovalConfigByNo } from "../lib/detail-utils"
import { MOCK_DEVICES } from "../mock/reference-data.mock"
import {
  createEmptyFormValues,
  detailToFormValues,
  validateUnlockApprovalConfig,
} from "../lib/validation"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { unlockApprovalConfigFormAnnotations } from "../annotations/unlock-approval-config-form.annotations"
import { unlockApprovalConfigDocuments } from "../documents/unlock-approval-config-documents"

export function UnlockApprovalConfigFormPage() {
  const { configNo } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(configNo)

  const existing = useMemo(
    () => (isEdit ? getUnlockApprovalConfigByNo(configNo) : undefined),
    [configNo, isEdit]
  )

  const [form, setForm] = useState(() =>
    isEdit && configNo ? detailToFormValues(configNo) : createEmptyFormValues()
  )
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  if (isEdit && !existing) {
    return (
      <div className="space-y-4 p-6">
        <Link to={LIST_BASE_PATH}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的开锁审批配置
        </div>
      </div>
    )
  }

  if (isEdit && existing?.status === "已停用") {
    return (
      <div className="space-y-4 p-6">
        <Link to={LIST_BASE_PATH}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          已停用配置不可编辑，请启用后操作或新建配置
        </div>
      </div>
    )
  }

  const pageTitle = isEdit
    ? `编辑开锁审批配置 — ${form.configName}`
    : "新增开锁审批配置"

  const scopeType = form.scopeType
  const isGlobal = scopeType === "未绑定位置全局"
  const showDevices = scopeType === "指定设备"

  const selectedDevices = MOCK_DEVICES.filter((device) =>
    form.selectedDeviceIds.includes(device.id)
  )

  const handleSave = () => {
    const validationError = validateUnlockApprovalConfig(form, configNo)
    if (validationError) {
      setToastMessage(validationError)
      window.setTimeout(() => setToastMessage(null), 3000)
      return
    }
    setSaveConfirmOpen(true)
  }

  const confirmSave = () => {
    setSaveConfirmOpen(false)
    setToastMessage("保存成功")
    window.setTimeout(() => navigate(LIST_BASE_PATH), 800)
  }

  return (
    <PrototypeAnnotationProvider
      title={`${pageTitle} · 原型批注`}
      annotations={unlockApprovalConfigFormAnnotations}
      documents={unlockApprovalConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget
          annotationIds={[
            "unlock-approval-config-form-header",
            "unlock-approval-config-form-actions",
          ]}
        >
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
            <div className="flex flex-wrap gap-2">
              <Link to={LIST_BASE_PATH}>
                <Button variant="outline">
                  <ArrowLeftIcon />
                  取消
                </Button>
              </Link>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-form-scope"]}>
          <Card>
            <CardHeader>
              <CardTitle>基础识别与范围</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="configName">
                  <FieldLabelWithHelp required label="配置名称" />
                </Label>
                <Input
                  id="configName"
                  value={form.configName}
                  readOnly={isEdit}
                  placeholder="请输入配置名称"
                  maxLength={50}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, configName: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <FieldLabelWithHelp
                    required
                    label="适用范围类型"
                    help="选择后将联动展示范围选择区。编辑态不可修改。"
                  />
                </Label>
                {isEdit ? (
                  <Input value={form.scopeType} readOnly />
                ) : (
                  <Select
                    value={form.scopeType || "none"}
                    onValueChange={(value) => {
                      if (value === "none") return
                      setForm((current) => ({
                        ...current,
                        scopeType: value as ScopeType,
                        warehouseName: "",
                        storeroomNames: [],
                        zoneNames: [],
                        selectedDeviceIds: [],
                        warehouseFilter: "",
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择适用范围类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled>
                        请选择适用范围类型
                      </SelectItem>
                      <SelectItem value="仓库">仓库</SelectItem>
                      <SelectItem value="库房">库房</SelectItem>
                      <SelectItem value="分区">分区</SelectItem>
                      <SelectItem value="指定设备">指定设备</SelectItem>
                      <SelectItem value="未绑定位置全局">未绑定位置全局</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <ScopeCascadeSelector
                scopeType={scopeType}
                warehouseName={form.warehouseName}
                storeroomNames={form.storeroomNames}
                zoneNames={form.zoneNames}
                readOnly={isEdit}
                onChange={(patch) =>
                  setForm((current) => ({
                    ...current,
                    ...patch,
                    selectedDeviceIds:
                      patch.warehouseName !== undefined &&
                      patch.warehouseName !== current.warehouseName
                        ? []
                        : current.selectedDeviceIds,
                  }))
                }
              />

              {showDevices && (
                <PrototypeAnnotationTarget
                  annotationIds={["unlock-approval-config-form-device"]}
                >
                  <div className="md:col-span-2 space-y-2 rounded-lg border p-4">
                    <Label>
                      <FieldLabelWithHelp
                        required
                        label="适用设备"
                        help="点击按钮打开设备选择器，可按仓库筛选并搜索设备编码/名称，避免在长列表中逐条查找。"
                      />
                    </Label>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-muted-foreground">
                        {form.selectedDeviceIds.length > 0 ? (
                          <>
                            已选{" "}
                            <span className="font-medium text-foreground">
                              {form.selectedDeviceIds.length}
                            </span>{" "}
                            台
                            {selectedDevices.length > 0 && (
                              <span>
                                {" "}
                                · {selectedDevices.map((device) => device.code).join(" / ")}
                              </span>
                            )}
                          </>
                        ) : (
                          "尚未选择设备"
                        )}
                      </div>
                      {!isEdit && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDeviceDialogOpen(true)}
                        >
                          勾选/调整设备
                          <ChevronRightIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                    {isEdit && (
                      <Input readOnly value={`已选 ${form.selectedDeviceIds.length} 台`} />
                    )}
                  </div>
                </PrototypeAnnotationTarget>
              )}

              {isGlobal && (
                <PrototypeAnnotationTarget
                  annotationIds={["unlock-approval-config-form-global"]}
                >
                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      <FieldLabelWithHelp
                        required
                        label="未绑定位置设备全局审批开关"
                        help="关闭=未绑定具体位置设备走原有免审直发密码；开启=进入本配置的全局审批。租户内该类型仅允许 1 条已启用配置。"
                      />
                    </Label>
                    <div className="flex flex-wrap gap-4">
                      {(["关闭", "开启"] as const).map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="globalSwitch"
                            checked={form.globalSwitch === option}
                            onChange={() =>
                              setForm((current) => ({ ...current, globalSwitch: option }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      关闭：未绑定具体位置设备走原有免审直发密码。开启：进入本配置的全局审批，不得静默免审（C04）。租户内该类型仅允许 1 条已启用配置（R29）。
                    </p>
                  </div>
                </PrototypeAnnotationTarget>
              )}
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-form-strategy"]}>
          <Card>
            <CardHeader>
              <CardTitle>审批策略</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  <FieldLabelWithHelp required label="审批方式" />
                </Label>
                <div className="flex flex-wrap gap-4">
                  {(["任一人通过", "按顺序审批"] as const).map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="approvalMode"
                        checked={form.approvalMode === option}
                        onChange={() =>
                          setForm((current) => ({ ...current, approvalMode: option }))
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {form.approvalMode === "按顺序审批" && (
                  <p className="text-xs text-muted-foreground">
                    按顺序审批时，下方节点顺序即审批链激活顺序
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  <FieldLabelWithHelp required label="审批节点" />
                </Label>
                <ApprovalNodeEditor
                  nodes={form.approvalNodes}
                  onChange={(approvalNodes) =>
                    setForm((current) => ({ ...current, approvalNodes }))
                  }
                />
              </div>

              <TimeoutHoursInput
                value={form.timeoutHours}
                onChange={(timeoutHours) =>
                  setForm((current) => ({ ...current, timeoutHours }))
                }
              />
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        <UnlockDeviceSelectDialog
          open={deviceDialogOpen}
          warehouseContext={form.warehouseName}
          selectedIds={form.selectedDeviceIds}
          onOpenChange={setDeviceDialogOpen}
          onConfirm={(selectedDeviceIds) =>
            setForm((current) => ({ ...current, selectedDeviceIds }))
          }
        />

        <ConfigConfirmDialog
          open={saveConfirmOpen}
          title="确认保存"
          description={
            isEdit
              ? "修改将生成新版本，在途申请继续使用旧版本快照，确认保存？"
              : "保存后新申请将按本配置匹配，确认保存？"
          }
          confirmLabel="确认保存"
          onOpenChange={setSaveConfirmOpen}
          onConfirm={confirmSave}
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
