import { useMemo, useState, type ReactNode } from "react"
import { ChevronRight, Info } from "lucide-react"
import {
  MOCK_ORG_USERS,
  WAREHOUSE_REGION_OPTIONS,
  WAREHOUSE_ROLE_OPTIONS,
  WAREHOUSE_TYPE_OPTIONS,
} from "../domain/form-constants"
import type { WarehouseFormState } from "../lib/warehouse-form-state"
import { BottomSheet } from "./BottomSheet"

type WarehouseFormBodyProps = {
  form: WarehouseFormState
  onChange: (next: WarehouseFormState) => void
  zhongdengDisabled: boolean
}

function FieldLabel({
  children,
  required,
}: {
  children: ReactNode
  required?: boolean
}) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-gray-700">
      {required ? <span className="text-red-500">* </span> : null}
      {children}
    </label>
  )
}

function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{children}</p>
}

function textInputClassName() {
  return "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
}

function Segmented({
  options,
  value,
  onChange,
  disabled,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-2 text-sm ${
              active
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            } ${disabled ? "opacity-50" : ""}`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function OrgUserPicker({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (ids: string[]) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const labels = useMemo(
    () =>
      value
        .map((id) => MOCK_ORG_USERS.find((u) => u.id === id)?.name)
        .filter(Boolean)
        .join("、"),
    [value]
  )

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left text-sm text-gray-800"
        onClick={() => setOpen(true)}
      >
        <span className={labels ? "" : "text-gray-400"}>
          {labels || placeholder}
        </span>
        <ChevronRight className="size-4 shrink-0 text-gray-400" />
      </button>
      <BottomSheet open={open} title="选择人员" onClose={() => setOpen(false)}>
        <ul className="space-y-1">
          {MOCK_ORG_USERS.map((user) => {
            const checked = value.includes(user.id)
            return (
              <li key={user.id}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    checked ? "bg-orange-50 text-orange-800" : "bg-gray-50"
                  }`}
                  onClick={() => toggle(user.id)}
                >
                  <span>
                    {user.name}
                    <span className="ml-2 text-xs text-gray-500">{user.dept}</span>
                  </span>
                  {checked ? <span className="text-orange-600">已选</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white"
          onClick={() => setOpen(false)}
        >
          确定
        </button>
      </BottomSheet>
    </>
  )
}

function PersonnelPanel({
  title,
  mode,
  onModeChange,
  children,
}: {
  title: string
  mode: "PERSON" | "ROLE"
  onModeChange: (mode: "PERSON" | "ROLE") => void
  children: ReactNode
}) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3">
      <div>
        <FieldLabel required>{title}类型</FieldLabel>
        <Segmented
          options={[
            { value: "PERSON", label: "按人" },
            { value: "ROLE", label: "按角色" },
          ]}
          value={mode}
          onChange={(value) => onModeChange(value as "PERSON" | "ROLE")}
        />
      </div>
      <div>
        <FieldLabel>{title}</FieldLabel>
        {children}
        <FieldHint>已停用的账号不可选取，可选取多个管理员</FieldHint>
      </div>
    </div>
  )
}

export function WarehouseFormBody({
  form,
  onChange,
  zhongdengDisabled,
}: WarehouseFormBodyProps) {
  const patch = (partial: Partial<WarehouseFormState>) =>
    onChange({ ...form, ...partial })

  const [regionOpen, setRegionOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  const [ownershipOpen, setOwnershipOpen] = useState(false)
  const [supervisorRoleOpen, setSupervisorRoleOpen] = useState(false)
  const [managerRoleOpen, setManagerRoleOpen] = useState(false)

  const regionOptions = WAREHOUSE_REGION_OPTIONS.map((item) => ({
    key: `${item.province}|${item.city}|${item.district}`,
    label: `${item.province} / ${item.city} / ${item.district}`,
  }))

  const regionLabel =
    regionOptions.find((item) => item.key === form.regionKey)?.label ?? ""

  const typeSummary =
    form.warehouseTypes.length > 0 ? form.warehouseTypes.join("、") : ""

  const ownershipLabels: Record<string, string> = {
    OWNED: "自有",
    LEASED: "租赁",
    OTHER: "其他",
  }

  const toggleWarehouseType = (type: string) => {
    let next = [...form.warehouseTypes]
    if (next.includes(type)) {
      next = next.filter((item) => item !== type)
    } else {
      if (type === "储罐") next = next.filter((item) => item !== "筒仓")
      if (type === "筒仓") next = next.filter((item) => item !== "储罐")
      next.push(type)
    }
    patch({ warehouseTypes: next })
  }

  const showZhongdengFields = form.zhongdengAccess === "YES" && !zhongdengDisabled

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-600">
        <div className="flex gap-2">
          <Info className="mt-0.5 size-4 shrink-0 text-gray-500" />
          <p>
            若该仓库为中仓登准入仓库，请事先在仓库管理列表页下载「仓库信息登记表」，完成填写并盖章后再维护准入材料。
          </p>
        </div>
      </div>

      <section className="rounded-xl bg-white p-3 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">仓库基础信息</h2>

        <FieldLabel required>仓库名称</FieldLabel>
        <input
          className={`${textInputClassName()} mb-3`}
          placeholder="请输入仓库名称"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
        />

        <FieldLabel required>仓库面积</FieldLabel>
        <div className="mb-3 flex items-center gap-2">
          <input
            className={textInputClassName()}
            placeholder="请输入仓库面积"
            value={form.area}
            onChange={(e) => patch({ area: e.target.value })}
          />
          <span className="shrink-0 text-sm text-gray-500">㎡</span>
        </div>

        <FieldLabel required>仓库地址</FieldLabel>
        <div className="mb-1 space-y-2">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left text-sm text-gray-800"
            onClick={() => setRegionOpen(true)}
          >
            <span className={regionLabel ? "" : "text-gray-400"}>
              {regionLabel || "请选择省市区"}
            </span>
            <ChevronRight className="size-4 shrink-0 text-gray-400" />
          </button>
          <input
            className={textInputClassName()}
            placeholder="请输入仓库详细地址"
            value={form.addressDetail}
            onChange={(e) => patch({ addressDetail: e.target.value })}
          />
        </div>
        <p className="mb-3 text-[11px] text-amber-800/90">
          中仓登已准入时，地址须与线下提交资料完全一致
        </p>

        <FieldLabel required>仓库类型</FieldLabel>
        <button
          type="button"
          className="mb-1 flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
          onClick={() => setTypeOpen(true)}
        >
          <span className={typeSummary ? "text-gray-800" : "text-gray-400"}>
            {typeSummary || "请选择仓库类型"}
          </span>
          <ChevronRight className="size-4 text-gray-400" />
        </button>
        <div className="mb-3">
          <FieldHint>「储罐」与「筒仓」不可同时勾选</FieldHint>
        </div>

        <div className="space-y-3">
          <PersonnelPanel
            title="仓库监管员"
            mode={form.supervisorMode}
            onModeChange={(mode) => patch({ supervisorMode: mode })}
          >
            {form.supervisorMode === "PERSON" ? (
              <OrgUserPicker
                value={form.supervisorPersonIds}
                onChange={(ids) => patch({ supervisorPersonIds: ids })}
                placeholder="请选择监管员"
              />
            ) : (
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onClick={() => setSupervisorRoleOpen(true)}
              >
                <span
                  className={
                    form.supervisorRoleNames[0] ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {form.supervisorRoleNames[0] || "请选择角色"}
                </span>
                <ChevronRight className="size-4 text-gray-400" />
              </button>
            )}
          </PersonnelPanel>

          <PersonnelPanel
            title="片区经理"
            mode={form.regionalManagerMode}
            onModeChange={(mode) => patch({ regionalManagerMode: mode })}
          >
            {form.regionalManagerMode === "PERSON" ? (
              <OrgUserPicker
                value={form.regionalManagerPersonIds}
                onChange={(ids) => patch({ regionalManagerPersonIds: ids })}
                placeholder="请选择片区经理"
              />
            ) : (
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                onClick={() => setManagerRoleOpen(true)}
              >
                <span
                  className={
                    form.regionalManagerRoleNames[0]
                      ? "text-gray-800"
                      : "text-gray-400"
                  }
                >
                  {form.regionalManagerRoleNames[0] || "请选择角色"}
                </span>
                <ChevronRight className="size-4 text-gray-400" />
              </button>
            )}
          </PersonnelPanel>
        </div>
      </section>

      <section className="rounded-xl bg-white p-3 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">管理方信息</h2>

        <FieldLabel required>管理方类型</FieldLabel>
        <div className="mb-3">
          <Segmented
            options={[
              { value: "ENTERPRISE", label: "企业" },
              { value: "INDIVIDUAL", label: "个人" },
            ]}
            value={form.managerType}
            onChange={(value) =>
              patch({
                managerType: value as WarehouseFormState["managerType"],
                zhongdengAccess: "NO",
              })
            }
          />
        </div>

        <FieldLabel required>管理企业名称/姓名</FieldLabel>
        <input
          className={`${textInputClassName()} mb-3`}
          placeholder="请输入管理企业名称/姓名"
          value={form.managerName}
          onChange={(e) => patch({ managerName: e.target.value })}
        />

        <FieldLabel>管理方联系电话</FieldLabel>
        <div className="relative mb-3">
          <input
            className={textInputClassName()}
            placeholder="请输入管理方联系电话"
            maxLength={11}
            value={form.managerPhone}
            onChange={(e) => patch({ managerPhone: e.target.value })}
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] tabular-nums text-gray-400">
            {form.managerPhone.length}/11
          </span>
        </div>

        <FieldLabel required>统一社会信用代码/身份证号</FieldLabel>
        <input
          className={`${textInputClassName()} mb-3`}
          placeholder="请输入统一社会信用代码/身份证号"
          value={form.managerIdNumber}
          onChange={(e) => patch({ managerIdNumber: e.target.value })}
        />

        <FieldLabel required>仓库与管理方的权属关系</FieldLabel>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
          onClick={() => setOwnershipOpen(true)}
        >
          <span className="text-gray-800">
            {ownershipLabels[form.ownership] ?? "请选择"}
          </span>
          <ChevronRight className="size-4 text-gray-400" />
        </button>
      </section>

      <section className="rounded-xl bg-white p-3 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">中仓登准入</h2>

        <FieldLabel>是否中仓登准入</FieldLabel>
        <div className="mb-2">
          <Segmented
            options={[
              { value: "YES", label: "已准入" },
              { value: "NO", label: "未准入" },
            ]}
            value={form.zhongdengAccess}
            disabled={zhongdengDisabled}
            onChange={(value) => {
              if (value === "NO") {
                patch({
                  zhongdengAccess: "NO",
                  zhongdengId: "",
                  hasSiteMap: false,
                  hasRegistrationPdf: false,
                  warehousePhotoCount: 0,
                })
              } else {
                patch({ zhongdengAccess: "YES" })
              }
            }}
          />
        </div>
        {zhongdengDisabled ? (
          <FieldHint>管理方为个人时不可开启中仓登准入（F04）</FieldHint>
        ) : null}

        {showZhongdengFields ? (
          <>
            <p className="mb-3 mt-2 flex gap-1.5 rounded-md border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                请确保此处填写的仓库信息与提交给中仓登的资料一致，且中仓登仓库 ID
                准确；ID 错误将导致系统报错。
              </span>
            </p>

            <FieldLabel required>中仓登仓库 ID 号</FieldLabel>
            <input
              className={`${textInputClassName()} mb-1`}
              placeholder="请输入中仓登仓库 ID 号"
              value={form.zhongdengId}
              onChange={(e) => patch({ zhongdengId: e.target.value })}
            />
            <FieldHint>线下签约后由中仓登官方提供</FieldHint>

            <FieldLabel required>仓库库区图或库位图</FieldLabel>
            <button
              type="button"
              className="mb-1 w-full rounded-lg border border-dashed border-gray-300 py-3 text-sm text-gray-700"
              onClick={() => patch({ hasSiteMap: true })}
            >
              {form.hasSiteMap ? "已上传 1 张图片" : "上传图片"}
            </button>
            <FieldHint>jpg / png / jpeg，不超过 5MB，最多 1 个文件</FieldHint>

            <FieldLabel required>仓库信息登记表</FieldLabel>
            <button
              type="button"
              className="mb-1 w-full rounded-lg border border-dashed border-gray-300 py-3 text-sm text-gray-700"
              onClick={() => patch({ hasRegistrationPdf: true })}
            >
              {form.hasRegistrationPdf ? "已上传 PDF" : "上传 PDF"}
            </button>
            <FieldHint>
              仅 PDF，不超过 20MB；须完成双公章盖章，模版在列表页下载
            </FieldHint>

            <FieldLabel required>仓库图片</FieldLabel>
            <button
              type="button"
              className="mb-1 w-full rounded-lg border border-dashed border-gray-300 py-3 text-sm text-gray-700"
              onClick={() =>
                patch({
                  warehousePhotoCount: Math.min(8, form.warehousePhotoCount + 1),
                })
              }
            >
              {form.warehousePhotoCount > 0
                ? `已上传 ${form.warehousePhotoCount} 张`
                : "请上传图片"}
            </button>
            <FieldHint>
              jpg / png / jpeg，不超过 5MB，最多 8 张，建议尺寸 600×300
            </FieldHint>
          </>
        ) : null}
      </section>

      <BottomSheet open={regionOpen} title="选择省市区" onClose={() => setRegionOpen(false)}>
        <ul className="space-y-1">
          {regionOptions.map((option) => (
            <li key={option.key}>
              <button
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  form.regionKey === option.key
                    ? "bg-orange-50 text-orange-800"
                    : "bg-gray-50"
                }`}
                onClick={() => {
                  patch({ regionKey: option.key })
                  setRegionOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet open={typeOpen} title="仓库类型" onClose={() => setTypeOpen(false)}>
        <ul className="space-y-2">
          {WAREHOUSE_TYPE_OPTIONS.map((type) => (
            <li key={type}>
              <label className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-orange-600"
                  checked={form.warehouseTypes.includes(type)}
                  onChange={() => toggleWarehouseType(type)}
                />
                {type}
              </label>
            </li>
          ))}
        </ul>
        {form.warehouseTypes.includes("其他") ? (
          <input
            className={`${textInputClassName()} mt-3`}
            placeholder="请输入其他仓库类型名称"
            value={form.otherTypeName}
            onChange={(e) => patch({ otherTypeName: e.target.value })}
          />
        ) : null}
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white"
          onClick={() => setTypeOpen(false)}
        >
          确定
        </button>
      </BottomSheet>

      <BottomSheet
        open={ownershipOpen}
        title="权属关系"
        onClose={() => setOwnershipOpen(false)}
      >
        <ul className="space-y-1">
          {(
            [
              ["OWNED", "自有"],
              ["LEASED", "租赁"],
              ["OTHER", "其他"],
            ] as const
          ).map(([value, label]) => (
            <li key={value}>
              <button
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  form.ownership === value
                    ? "bg-orange-50 text-orange-800"
                    : "bg-gray-50"
                }`}
                onClick={() => {
                  patch({ ownership: value })
                  setOwnershipOpen(false)
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        open={supervisorRoleOpen}
        title="仓库监管员角色"
        onClose={() => setSupervisorRoleOpen(false)}
      >
        <ul className="space-y-1">
          {WAREHOUSE_ROLE_OPTIONS.map((role) => (
            <li key={role}>
              <button
                type="button"
                className="w-full rounded-lg bg-gray-50 px-3 py-2 text-left text-sm"
                onClick={() => {
                  patch({ supervisorRoleNames: [role] })
                  setSupervisorRoleOpen(false)
                }}
              >
                {role}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        open={managerRoleOpen}
        title="片区经理角色"
        onClose={() => setManagerRoleOpen(false)}
      >
        <ul className="space-y-1">
          {WAREHOUSE_ROLE_OPTIONS.map((role) => (
            <li key={role}>
              <button
                type="button"
                className="w-full rounded-lg bg-gray-50 px-3 py-2 text-left text-sm"
                onClick={() => {
                  patch({ regionalManagerRoleNames: [role] })
                  setManagerRoleOpen(false)
                }}
              >
                {role}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  )
}
