import { useMemo, useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, SearchIcon, UsersIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type OrgDepartment = {
  id: string
  name: string
  users: Array<{
    id: string
    name: string
    title: string
    fullDisplay: string // e.g. "张主管(风控部)" or "张主管"
  }>
}

export const MOCK_ORG_DEPARTMENTS: OrgDepartment[] = [
  {
    id: "dept-risk",
    name: "风控管理部",
    users: [
      { id: "u-001", name: "张主管", title: "风控主管", fullDisplay: "张主管(风控部)" },
      { id: "u-002", name: "王总监", title: "风控总监", fullDisplay: "王总监(风控部)" },
      { id: "u-003", name: "赵风控", title: "贷中风控专员", fullDisplay: "赵风控(风控部)" },
    ],
  },
  {
    id: "dept-warehouse",
    name: "仓储监管部",
    users: [
      { id: "u-004", name: "李四", title: "高级仓管员", fullDisplay: "李四(仓管部)" },
      { id: "u-005", name: "孙巡检", title: "仓库巡检员", fullDisplay: "孙巡检(仓管部)" },
      { id: "u-006", name: "钱主管", title: "仓储监管主管", fullDisplay: "钱主管(仓管部)" },
    ],
  },
  {
    id: "dept-iot",
    name: "物联网设备部",
    users: [
      { id: "u-007", name: "李运维", title: "IoT设备运维专员", fullDisplay: "李运维(设备部)" },
      { id: "u-008", name: "周工程师", title: "智能硬件工程师", fullDisplay: "周工程师(设备部)" },
    ],
  },
  {
    id: "dept-ops",
    name: "业务运营部",
    users: [
      { id: "u-009", name: "陈客户经理", title: "供应链客户经理", fullDisplay: "陈客户经理(运营部)" },
      { id: "u-010", name: "吴运营", title: "业务运营专员", fullDisplay: "吴运营(运营部)" },
    ],
  },
]

type OrgUserSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function OrgUserSelect({
  value,
  onChange,
  placeholder = "请按组织架构选择用户",
  disabled = false,
  className,
}: OrgUserSelectProps) {
  const [open, setOpen] = useState(false)
  const [selectedDeptId, setSelectedDeptId] = useState<string>("all")
  const [searchKeyword, setSearchKeyword] = useState("")

  const filteredDepartments = useMemo(() => {
    return MOCK_ORG_DEPARTMENTS.map((dept) => {
      const matchDept = selectedDeptId === "all" || dept.id === selectedDeptId
      if (!matchDept) return null

      const matchedUsers = dept.users.filter((user) => {
        if (!searchKeyword.trim()) return true
        const kw = searchKeyword.toLowerCase()
        return (
          user.name.toLowerCase().includes(kw) ||
          user.fullDisplay.toLowerCase().includes(kw) ||
          user.title.toLowerCase().includes(kw) ||
          dept.name.toLowerCase().includes(kw)
        )
      })

      if (matchedUsers.length === 0) return null

      return {
        ...dept,
        users: matchedUsers,
      }
    }).filter(Boolean) as OrgDepartment[]
  }, [selectedDeptId, searchKeyword])

  const toggleUser = (userDisplay: string) => {
    if (disabled) return
    const isSelected = value.some((v) => v === userDisplay || userDisplay.includes(v) || v.includes(userDisplay.replace(/\(.*\)/, "")))
    if (isSelected) {
      onChange(value.filter((v) => v !== userDisplay && !userDisplay.includes(v) && !v.includes(userDisplay.replace(/\(.*\)/, ""))))
    } else {
      onChange([...value, userDisplay])
    }
  }

  const isUserSelected = (userDisplay: string) => {
    return value.some(
      (v) =>
        v === userDisplay ||
        userDisplay.includes(v) ||
        v.includes(userDisplay.replace(/\(.*\)/, ""))
    )
  }

  const toggleDepartment = (dept: OrgDepartment) => {
    if (disabled) return
    const allDeptUsersSelected = dept.users.every((u) => isUserSelected(u.fullDisplay))
    if (allDeptUsersSelected) {
      // Remove all users in this department
      const userDisplays = new Set(dept.users.map((u) => u.fullDisplay))
      const userNames = new Set(dept.users.map((u) => u.name))
      onChange(
        value.filter((v) => !userDisplays.has(v) && !userNames.has(v))
      )
    } else {
      // Add all missing users
      const newItems = dept.users
        .map((u) => u.fullDisplay)
        .filter((display) => !isUserSelected(display))
      onChange([...value, ...newItems])
    }
  }

  const removeTag = (display: string) => {
    if (disabled) return
    onChange(value.filter((v) => v !== display))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          disabled={disabled}
          className={cn(
            "flex min-h-[38px] w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background transition-colors hover:border-accent-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap items-center gap-1">
                <Badge variant="secondary" className="gap-1 font-medium text-xs">
                  <UsersIcon className="size-3" />
                  已选 {value.length} 人
                </Badge>
                {value.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground"
                  >
                    {item}
                  </span>
                ))}
                {value.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{value.length - 3} 更多
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground opacity-70" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[420px] p-0 shadow-xl border-border/80"
        >
          {/* Header & Search */}
          <div className="border-b p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">选择组织架构与人员</span>
              <span className="text-xs text-muted-foreground">
                已选中 <strong className="text-primary">{value.length}</strong> 人
              </span>
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="搜索部门或人员姓名..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            {/* Department Quick Tabs */}
            <div className="flex flex-wrap gap-1 pt-1">
              <button
                type="button"
                onClick={() => setSelectedDeptId("all")}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  selectedDeptId === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                全部部门
              </button>
              {MOCK_ORG_DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    selectedDeptId === dept.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {/* Department & User List */}
          <div className="max-h-64 overflow-y-auto p-2 space-y-3">
            {filteredDepartments.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                未找到匹配的人员或部门
              </div>
            ) : (
              filteredDepartments.map((dept) => {
                const allSelected = dept.users.every((u) => isUserSelected(u.fullDisplay))
                const someSelected =
                  !allSelected && dept.users.some((u) => isUserSelected(u.fullDisplay))

                return (
                  <div key={dept.id} className="rounded-lg border bg-card/50 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected
                          }}
                          onChange={() => toggleDepartment(dept)}
                          className="size-3.5 rounded border-gray-300 text-primary"
                        />
                        <span className="font-semibold text-xs text-foreground">
                          {dept.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleDepartment(dept)}
                        className="text-[11px] text-primary hover:underline"
                      >
                        {allSelected ? "取消全选" : "全选本部门"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pl-5">
                      {dept.users.map((user) => {
                        const checked = isUserSelected(user.fullDisplay)
                        return (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => toggleUser(user.fullDisplay)}
                            className={cn(
                              "flex items-center justify-between rounded-md border p-1.5 text-xs text-left transition-colors",
                              checked
                                ? "border-primary bg-primary/10 font-medium text-primary shadow-2xs"
                                : "border-border/60 bg-background text-foreground hover:bg-muted/60"
                            )}
                          >
                            <div className="truncate">
                              <div>{user.name}</div>
                              <div className="text-[10px] text-muted-foreground truncate">
                                {user.title}
                              </div>
                            </div>
                            {checked && <CheckIcon className="size-3.5 shrink-0 text-primary" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between border-t bg-muted/20 p-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              disabled={value.length === 0}
              className="h-7 text-xs"
            >
              清空已选
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-7 text-xs"
            >
              确定
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected tags preview */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((display) => (
            <span
              key={display}
              className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-foreground"
            >
              <span>{display}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(display)}
                  className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
