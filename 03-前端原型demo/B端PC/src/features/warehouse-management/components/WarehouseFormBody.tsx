import type { ReactNode } from "react"
import { InfoIcon } from "lucide-react"
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
import { OrgUserSelect } from "@/shared/components/OrgUserSelect"
import { cn } from "@/lib/utils"
import {
  WAREHOUSE_REGION_OPTIONS,
  WAREHOUSE_ROLE_OPTIONS,
  WAREHOUSE_TYPE_OPTIONS,
} from "../domain/form-constants"
import type { WarehouseFormState } from "../lib/warehouse-form-state"

type WarehouseFormBodyProps = {
  form: WarehouseFormState
  onChange: (next: WarehouseFormState) => void
  zhongdengDisabled: boolean
}

function FormItem({
  label,
  required,
  children,
  hint,
  className,
}: {
  label: string
  required?: boolean
  children: ReactNode
  hint?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {required ? <span className="mr-1 font-bold text-destructive">*</span> : null}
        {label}
      </Label>
      {children}
      {hint ? (
        typeof hint === "string" ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : (
          hint
        )
      ) : null}
    </div>
  )
}

function RadioInline({
  name,
  value,
  current,
  label,
  onChange,
  disabled,
}: {
  name: string
  value: string
  current: string
  label: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        type="radio"
        name={name}
        className="size-4 accent-primary"
        checked={current === value}
        disabled={disabled}
        onChange={() => onChange(value)}
      />
      {label}
    </label>
  )
}

function PersonnelPanel({
  title,
  modeName,
  mode,
  onModeChange,
  children,
}: {
  title: string
  modeName: string
  mode: "PERSON" | "ROLE"
  onModeChange: (mode: "PERSON" | "ROLE") => void
  children: ReactNode
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4">
      <FormItem label={`${title}类型`} required>
        <div className="flex flex-wrap gap-6">
          <RadioInline
            name={modeName}
            value="PERSON"
            current={mode}
            label="按人"
            onChange={() => onModeChange("PERSON")}
          />
          <RadioInline
            name={modeName}
            value="ROLE"
            current={mode}
            label="按角色"
            onChange={() => onModeChange("ROLE")}
          />
        </div>
      </FormItem>
      <FormItem label={title} hint="已停用的账号不可选取，可选取多个管理员">
        {children}
      </FormItem>
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

  const regionOptions = WAREHOUSE_REGION_OPTIONS.map((item) => ({
    key: `${item.province}|${item.city}|${item.district}`,
    label: `${item.province} / ${item.city} / ${item.district}`,
  }))

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
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <div className="flex gap-3">
          <InfoIcon className="mt-0.5 size-4 shrink-0 opacity-80" />
          <p>
            若该仓库为中仓登准入仓库，请事先在仓库管理列表页下载「仓库信息登记表」，完成填写并盖章后再维护准入材料。
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>仓库基础信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormItem label="仓库名称" required>
            <Input
              className="w-full"
              placeholder="请输入仓库名称"
              value={form.name}
              onChange={(event) => patch({ name: event.target.value })}
            />
          </FormItem>

          <FormItem label="仓库面积" required>
            <div className="flex items-center gap-2">
              <Input
                className="w-full"
                placeholder="请输入仓库面积"
                value={form.area}
                onChange={(event) => patch({ area: event.target.value })}
              />
              <span className="shrink-0 text-sm text-muted-foreground">㎡</span>
            </div>
          </FormItem>

          <FormItem
            label="仓库地址"
            required
            className="md:col-span-2"
            hint={
              <p className="text-xs text-amber-800/90">
                中仓登已准入时，地址须与线下提交资料完全一致
              </p>
            }
          >
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
              <Select
                value={form.regionKey}
                onValueChange={(value) => {
                  if (value) patch({ regionKey: value })
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="w-full shrink-0 sm:w-[min(100%,240px)]"
                >
                  <SelectValue placeholder="请选择省市区" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="min-w-0 flex-1"
                placeholder="请输入仓库详细地址"
                value={form.addressDetail}
                onChange={(event) => patch({ addressDetail: event.target.value })}
              />
            </div>
          </FormItem>

          <FormItem
            label="仓库类型"
            required
            className="md:col-span-2"
            hint="「储罐」与「筒仓」不可同时勾选"
          >
            <div className="flex flex-wrap gap-2 pt-0.5">
              {WAREHOUSE_TYPE_OPTIONS.map((type) => {
                const isSelected = form.warehouseTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleWarehouseType(type)}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 font-medium text-primary shadow-xs"
                        : "border-input bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="pointer-events-none size-3.5 rounded border-gray-300 text-primary"
                    />
                    {type}
                  </button>
                )
              })}
            </div>
            {form.warehouseTypes.includes("其他") ? (
              <Input
                className="mt-2 w-full md:max-w-md"
                placeholder="请输入其他仓库类型名称"
                value={form.otherTypeName}
                onChange={(event) => patch({ otherTypeName: event.target.value })}
              />
            ) : null}
          </FormItem>

          <div className="grid gap-4 md:col-span-2 lg:grid-cols-2">
            <PersonnelPanel
              title="仓库监管员"
              modeName="supervisorMode"
              mode={form.supervisorMode}
              onModeChange={(mode) => patch({ supervisorMode: mode })}
            >
              {form.supervisorMode === "PERSON" ? (
                <OrgUserSelect
                  value={form.supervisorPersonIds}
                  onChange={(ids) => patch({ supervisorPersonIds: ids })}
                  placeholder="请选择监管员"
                />
              ) : (
                <Select
                  value={form.supervisorRoleNames[0] ?? ""}
                  onValueChange={(value) =>
                    patch({ supervisorRoleNames: value ? [value] : [] })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {WAREHOUSE_ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </PersonnelPanel>

            <PersonnelPanel
              title="片区经理"
              modeName="regionalManagerMode"
              mode={form.regionalManagerMode}
              onModeChange={(mode) => patch({ regionalManagerMode: mode })}
            >
              {form.regionalManagerMode === "PERSON" ? (
                <OrgUserSelect
                  value={form.regionalManagerPersonIds}
                  onChange={(ids) => patch({ regionalManagerPersonIds: ids })}
                  placeholder="请选择片区经理"
                />
              ) : (
                <Select
                  value={form.regionalManagerRoleNames[0] ?? ""}
                  onValueChange={(value) =>
                    patch({ regionalManagerRoleNames: value ? [value] : [] })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {WAREHOUSE_ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </PersonnelPanel>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>管理方信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormItem label="管理方类型" required className="md:col-span-2">
            <div className="flex flex-wrap gap-6">
              <RadioInline
                name="managerType"
                value="ENTERPRISE"
                current={form.managerType}
                label="企业"
                onChange={() =>
                  patch({ managerType: "ENTERPRISE", zhongdengAccess: "NO" })
                }
              />
              <RadioInline
                name="managerType"
                value="INDIVIDUAL"
                current={form.managerType}
                label="个人"
                onChange={() =>
                  patch({ managerType: "INDIVIDUAL", zhongdengAccess: "NO" })
                }
              />
            </div>
          </FormItem>

          <FormItem label="管理企业名称/姓名" required>
            <Input
              className="w-full"
              placeholder="请输入管理企业名称/姓名"
              value={form.managerName}
              onChange={(event) => patch({ managerName: event.target.value })}
            />
          </FormItem>

          <FormItem label="管理方联系电话">
            <div className="relative w-full">
              <Input
                className="w-full pr-12"
                placeholder="请输入管理方联系电话"
                maxLength={11}
                value={form.managerPhone}
                onChange={(event) => patch({ managerPhone: event.target.value })}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs tabular-nums text-muted-foreground">
                {form.managerPhone.length}/11
              </span>
            </div>
          </FormItem>

          <FormItem label="统一社会信用代码/身份证号" required>
            <Input
              className="w-full"
              placeholder="请输入统一社会信用代码/身份证号"
              value={form.managerIdNumber}
              onChange={(event) => patch({ managerIdNumber: event.target.value })}
            />
          </FormItem>

          <FormItem label="仓库与管理方的权属关系" required>
            <div className="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
              {(
                [
                  ["OWNED", "自有"],
                  ["LEASED", "租赁"],
                  ["OTHER", "其他"],
                ] as const
              ).map(([value, label]) => (
                <RadioInline
                  key={value}
                  name="ownership"
                  value={value}
                  current={form.ownership}
                  label={label}
                  onChange={() => patch({ ownership: value })}
                />
              ))}
            </div>
          </FormItem>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>中仓登准入</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormItem
            label="是否中仓登准入"
            className="md:col-span-2"
            hint={
              zhongdengDisabled
                ? "管理方为个人时不可开启中仓登准入（F04）"
                : undefined
            }
          >
            <div className="flex flex-wrap gap-6">
              <RadioInline
                name="zhongdeng"
                value="YES"
                current={form.zhongdengAccess}
                label="已准入"
                disabled={zhongdengDisabled}
                onChange={() => patch({ zhongdengAccess: "YES" })}
              />
              <RadioInline
                name="zhongdeng"
                value="NO"
                current={form.zhongdengAccess}
                label="未准入"
                disabled={zhongdengDisabled}
                onChange={() =>
                  patch({
                    zhongdengAccess: "NO",
                    zhongdengId: "",
                    hasSiteMap: false,
                    hasRegistrationPdf: false,
                    warehousePhotoCount: 0,
                  })
                }
              />
            </div>
          </FormItem>

          {showZhongdengFields ? (
            <>
              <div className="md:col-span-2">
                <p className="flex items-start gap-1.5 rounded-md border border-amber-200/80 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-800">
                  <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    请确保此处填写的仓库信息与提交给中仓登的资料一致，且中仓登仓库 ID
                    准确；ID 错误将导致系统报错。
                  </span>
                </p>
              </div>

              <FormItem
                label="中仓登仓库 ID 号"
                required
                hint="线下签约后由中仓登官方提供"
              >
                <Input
                  className="w-full"
                  placeholder="请输入中仓登仓库 ID 号"
                  value={form.zhongdengId}
                  onChange={(event) => patch({ zhongdengId: event.target.value })}
                />
              </FormItem>

              <FormItem
                label="仓库库区图或库位图"
                required
                hint="jpg / png / jpeg，不超过 5MB，最多 1 个文件"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => patch({ hasSiteMap: true })}
                >
                  {form.hasSiteMap ? "已上传 1 张图片" : "上传图片"}
                </Button>
              </FormItem>

              <FormItem
                label="仓库信息登记表"
                required
                hint="仅 PDF，不超过 20MB；须完成双公章盖章，模版在列表页下载"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => patch({ hasRegistrationPdf: true })}
                >
                  {form.hasRegistrationPdf ? "已上传 PDF" : "上传 PDF"}
                </Button>
              </FormItem>

              <FormItem
                label="仓库图片"
                required
                hint="jpg / png / jpeg，不超过 5MB，最多 8 张，建议尺寸 600×300"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() =>
                    patch({
                      warehousePhotoCount: Math.min(8, form.warehousePhotoCount + 1),
                    })
                  }
                >
                  {form.warehousePhotoCount > 0
                    ? `已上传 ${form.warehousePhotoCount} 张`
                    : "请上传图片"}
                </Button>
              </FormItem>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
