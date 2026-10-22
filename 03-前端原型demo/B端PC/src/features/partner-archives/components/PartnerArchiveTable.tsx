import { type CSSProperties } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  partnerArchiveBaseFromPathname,
  partnerArchiveDetailPath,
} from "@prototype/shared/partner-archives/partner-archive-routes"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { splitDateTime } from "@/features/inbound-records/lib/list-utils"
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_TOTAL_PX,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { ContactPhoneVerifyBadge } from "./ContactPhoneVerifyBadge"
import {
  getPartnerArchiveRowActions,
  isArchiveRequiredFieldsPending,
  partnerArchiveEditActionLabel,
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
  type PartnerArchiveRowAction,
} from "../domain/actions"
import { SUBJECT_TYPE_LABELS, type PartnerSubject } from "../domain/types"
import { maskLoginPhone } from "../lib/detail-utils"
import {
  canShowVerifyContactPhoneAction,
  resolveContactPhoneVerified,
} from "../lib/contact-phone-verify"
import { cn } from "@/lib/utils"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

const ACTION_COL_CLASS = "w-[var(--partner-action-col-w)] min-w-[var(--partner-action-col-w)] max-w-[var(--partner-action-col-w)]"

const COL = {
  index: "sticky left-0 z-10 w-16 min-w-16 bg-slate-100 dark:bg-slate-800",
  actions: ACTION_COL_CLASS,
} as const

const cellBase = "align-middle px-3 py-2.5"

const stickyIndexBodyClass = (isFrozen: boolean) =>
  cn(
    "sticky left-0 z-[1]",
    isFrozen
      ? "bg-muted/30 group-hover:bg-muted/30"
      : "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800"
  )

const actionCell = (isFrozen: boolean) =>
  cn(
    COL.actions,
    STICKY_ACTION_CLASS,
    "whitespace-normal align-middle px-2 py-2 text-center",
    isFrozen
      ? "bg-muted/30 group-hover:bg-muted/30"
      : "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors"
  )

function buildPartnerRowActions(
  item: PartnerSubject,
  actions: PartnerArchiveRowAction[],
  onAction: (action: PartnerArchiveRowAction, item: PartnerSubject) => void,
  listBasePath: string,
): TableRowActionItem[] {
  const list: TableRowActionItem[] = []

  if (actions.includes("detail")) {
    list.push({
      key: "detail",
      label: "详情",
      to: `${listBasePath}/详情/${item.id}`,
    })
  }
  if (canShowVerifyContactPhoneAction(item)) {
    list.push({
      key: "verifyContact",
      label: "验证",
      title: "验证联系手机",
      onClick: () => onAction("verifyContact", item),
    })
  }
  if (actions.includes("edit")) {
    list.push({
      key: "edit",
      label: partnerArchiveEditActionLabel(item),
      to: `${listBasePath}/编辑/${item.id}`,
    })
  }
  if (actions.includes("appendRole")) {
    list.push({
      key: "appendRole",
      label: "追加",
      title: "追加合作方档案",
      onClick: () => onAction("appendRole", item),
    })
  }
  if (actions.includes("freeze")) {
    list.push({
      key: "freeze",
      label: "冻结",
      tone: "danger",
      onClick: () => onAction("freeze", item),
    })
  }
  if (actions.includes("unfreeze")) {
    list.push({
      key: "unfreeze",
      label: "解冻",
      tone: "primary",
      onClick: () => onAction("unfreeze", item),
    })
  }

  return list
}

type PartnerArchiveTableProps = {
  data: PartnerSubject[]
  page: number
  pageSize: number
  onAction: (action: PartnerArchiveRowAction, item: PartnerSubject) => void
}

export function PartnerArchiveTable({
  data,
  page,
  pageSize,
  onAction,
}: PartnerArchiveTableProps) {
  const location = useLocation()
  const listBasePath = partnerArchiveBaseFromPathname(location.pathname)
  const showLinkedColumn = data.some(
    (item) => (item.linkedPartnerArchives?.length ?? 0) > 0,
  )
  const colSpan = 6 + (showLinkedColumn ? 1 : 0) + 1

  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table
        className={cn(
          "w-full table-fixed text-sm",
          showLinkedColumn ? "min-w-[1156px]" : "min-w-[996px]"
        )}
        style={
          {
            "--partner-action-col-w": `${TABLE_ROW_ACTION_COL_TOTAL_PX}px`,
          } as CSSProperties
        }
      >
        <colgroup>
          <col className="w-16" />
          <col className="w-[260px]" />
          <col className="w-[90px]" />
          <col className="w-[140px]" />
          <col className="w-[140px]" />
          {showLinkedColumn && <col className="w-[160px]" />}
          <col className="w-[160px]" />
          <col style={{ width: TABLE_ROW_ACTION_COL_TOTAL_PX }} />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn(COL.index, "text-center text-xs font-medium text-muted-foreground")}
            >
              序号
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">
              主体名称/身份标识
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">主体类型</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">主体状态</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">联系手机</TableHead>
            {showLinkedColumn && (
              <TableHead className="text-xs font-medium text-muted-foreground">
                其他合作档案
              </TableHead>
            )}
            <TableHead className="text-xs font-medium text-muted-foreground">
              创建人
            </TableHead>
            <TableHead
              className={cn(
                COL.actions,
                "text-center text-xs font-medium text-foreground/80 bg-slate-100 dark:bg-slate-800",
                STICKY_ACTION_CLASS
              )}
            >
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-32 text-center text-sm text-muted-foreground">
                暂无匹配的合作方档案，点击「+ 新增合作方」建档
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {
              const actions = getPartnerArchiveRowActions(item)
              const isFrozen = item.status === "FROZEN"
              const rowActions = buildPartnerRowActions(item, actions, onAction, listBasePath)
              const createdParts = splitDateTime(item.createTime)
              const linked = item.linkedPartnerArchives ?? []
              return (
                <TableRow
                  key={item.id}
                  className={cn(
                    "group align-middle hover:bg-muted/50 transition-colors",
                    isFrozen && "bg-muted/30"
                  )}
                >
                  <TableCell
                    className={cn(
                      cellBase,
                      stickyIndexBodyClass(isFrozen),
                      "text-center text-xs text-muted-foreground"
                    )}
                  >
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <HoverOverflowText
                        className="max-w-[240px]"
                        content={item.name}
                        ariaLabel={`主体名称：${item.name}`}
                      >
                        <Link
                          to={`${listBasePath}/详情/${item.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.name}
                        </Link>
                      </HoverOverflowText>
                      <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                        {item.idNumberMasked}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cellBase}>{SUBJECT_TYPE_LABELS[item.subjectType]}</TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-wrap items-center gap-1.5 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={cn("shrink-0", SUBJECT_STATUS_BADGE_CLASS[item.status])}
                      >
                        {SUBJECT_STATUS_LABELS[item.status]}
                      </Badge>
                      {isArchiveRequiredFieldsPending(item) && (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-sky-200 bg-sky-50 text-sky-700"
                        >
                          待补全
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-1 leading-snug">
                      <span className="whitespace-nowrap text-sm tabular-nums">
                        {item.contactPhone.length >= 11
                          ? maskLoginPhone(item.contactPhone)
                          : item.contactPhone || "——"}
                      </span>
                      <ContactPhoneVerifyBadge status={resolveContactPhoneVerified(item)} />
                    </div>
                  </TableCell>
                  {showLinkedColumn && (
                    <TableCell className={cellBase}>
                      {linked.length === 0 ? (
                        <span className="text-muted-foreground">——</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {linked.map((link) => (
                            <Link
                              key={`${link.targetMenu}-${link.partnerId}`}
                              to={partnerArchiveDetailPath(link.targetMenu, link.partnerId)}
                              className="text-xs text-primary hover:underline"
                            >
                              {link.targetMenu}
                            </Link>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-1 text-sm text-foreground">
                        {item.createdBy || "——"}
                      </span>
                      <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                        {[createdParts.date, createdParts.time].filter(Boolean).join(" ") || "——"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={actionCell(isFrozen)}>
                    <TableRowActionPanel actions={rowActions} fixedCols={3} />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
