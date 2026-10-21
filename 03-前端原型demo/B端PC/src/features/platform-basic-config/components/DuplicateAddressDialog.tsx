import { Fragment, useEffect, useMemo, useState } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  duplicateAddressConflictsMock,
} from "../mock/platform-basic-config.mock"
import type { DuplicateAddressConflict } from "../domain/types"

type DuplicateAddressDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function conflictRowKey(row: DuplicateAddressConflict) {
  return `${row.ownerPool}:${row.address}`
}

export function DuplicateAddressDialog({
  open,
  onOpenChange,
}: DuplicateAddressDialogProps) {
  const conflicts = duplicateAddressConflictsMock
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set())

  const { personalGroupCount, enterpriseGroupCount } = useMemo(() => {
    let personal = 0
    let enterprise = 0
    for (const row of conflicts) {
      if (row.ownerPool === "personal") personal += 1
      else enterprise += 1
    }
    return { personalGroupCount: personal, enterpriseGroupCount: enterprise }
  }, [conflicts])

  useEffect(() => {
    if (open && conflicts.length > 0) {
      setExpandedKeys(new Set([conflictRowKey(conflicts[0])]))
    }
  }, [open, conflicts])

  const toggleExpanded = (key: string) => {
    setExpandedKeys((current) => {
      const next = new Set(current)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const summaryParts: string[] = []
  if (personalGroupCount > 0) {
    summaryParts.push(`${personalGroupCount} 组个人货主`)
  }
  if (enterpriseGroupCount > 0) {
    summaryParts.push(`${enterpriseGroupCount} 组企业货主`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>历史重复证件地址排查结果</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          系统中已存在 {summaryParts.join("、")}
          的地址重复（个人与企业分池统计，互不混比）。若开启一人一址校验，以下主体在档案绑货主或快捷建档时将可能被拦截：
        </p>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="w-8 border-b px-2 py-2" aria-hidden />
                <th className="border-b px-3 py-2 font-medium">冲突地址</th>
                <th className="border-b px-3 py-2 font-medium whitespace-nowrap">
                  冲突主体数
                </th>
              </tr>
            </thead>
            <tbody>
              {conflicts.map((row) => {
                const rowKey = conflictRowKey(row)
                const isExpanded = expandedKeys.has(rowKey)
                const subjectCount = row.subjects.length

                return (
                  <Fragment key={rowKey}>
                    <tr className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-2 py-3 align-top">
                        <button
                          type="button"
                          className="text-muted-foreground"
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded
                              ? `收起 ${row.address} 的冲突主体`
                              : `展开 ${row.address} 的冲突主体`
                          }
                          onClick={() => toggleExpanded(rowKey)}
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="size-4" />
                          ) : (
                            <ChevronRightIcon className="size-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-3 align-top">{row.address}</td>
                      <td className="px-3 py-3 align-top whitespace-nowrap">
                        共 {subjectCount} 个主体
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr className="border-b last:border-0 bg-muted/20">
                        <td colSpan={3} className="px-3 py-3">
                          <p className="mb-2 font-medium text-muted-foreground">
                            冲突主体
                          </p>
                          <ul className="space-y-1.5 pl-1">
                            {row.subjects.map((subject) => (
                              <li key={subject.id}>{subject.displayLine}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          建议：请先前往「用户中心 → 合作方档案 → 货主信息」核实修正重复地址后再开启一人一址校验。
        </p>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
