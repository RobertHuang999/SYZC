import { Link } from "react-router-dom"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getPartnerArchiveRowActions,
  ROLE_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
  type PartnerArchiveRowAction,
} from "../domain/actions"
import {
  ROLE_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "../domain/types"
import { cn } from "@/lib/utils"

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
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 w-16 bg-card">序号</TableHead>
            <TableHead className="w-44">主体名称/身份标识</TableHead>
            <TableHead className="w-24">主体类型</TableHead>
            <TableHead className="w-24">主体状态</TableHead>
            <TableHead className="min-w-[220px]">业务角色</TableHead>
            <TableHead className="w-28">创建人</TableHead>
            <TableHead className="w-40">创建时间</TableHead>
            <TableHead className="sticky right-0 z-10 w-44 bg-card">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                暂无匹配的合作方档案，点击「+ 新增合作方」建档
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {
              const actions = getPartnerArchiveRowActions(item.status)
              const isFrozen = item.status === "FROZEN"

              return (
                <TableRow key={item.id} className={isFrozen ? "bg-muted/30" : undefined}>
                  <TableCell className="sticky left-0 z-[1] bg-card">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <HoverOverflowText
                        className="max-w-[180px]"
                        content={item.name}
                        ariaLabel={`主体名称：${item.name}`}
                      >
                        <Link
                          to={`/用户中心/合作方管理/合作方档案/详情/${item.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.name}
                        </Link>
                      </HoverOverflowText>
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.idNumberMasked}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{SUBJECT_TYPE_LABELS[item.subjectType]}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={SUBJECT_STATUS_BADGE_CLASS[item.status]}
                    >
                      {SUBJECT_STATUS_LABELS[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {item.roles.map((role, roleIndex) => (
                        <Badge
                          key={`${role.roleType}-${roleIndex}`}
                          variant="outline"
                          className={ROLE_STATUS_BADGE_CLASS[role.roleStatus]}
                        >
                          {ROLE_TYPE_LABELS[role.roleType]}·
                          {ROLE_STATUS_LABELS[role.roleStatus]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{item.createdBy}</TableCell>
                  <TableCell className="text-muted-foreground">{item.createTime}</TableCell>
                  <TableCell className="sticky right-0 z-[1] bg-card">
                    <div className="flex flex-wrap items-center gap-2">
                      {actions.includes("detail") && (
                        <Link
                          to={`/用户中心/合作方管理/合作方档案/详情/${item.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          详情
                        </Link>
                      )}
                      {actions.includes("edit") && (
                        <Link
                          to={`/用户中心/合作方管理/合作方档案/编辑/${item.id}`}
                          className={cn(
                            "text-sm hover:underline",
                            item.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
                              !item.certAddress.fullAddress
                              ? "font-medium text-amber-600"
                              : "text-primary"
                          )}
                        >
                          {item.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
                          !item.certAddress.fullAddress
                            ? "补全资料"
                            : "编辑"}
                        </Link>
                      )}
                      {actions.includes("appendRole") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => onAction("appendRole", item)}
                        >
                          追加角色
                        </Button>
                      )}
                      {actions.includes("freeze") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-destructive"
                          onClick={() => onAction("freeze", item)}
                        >
                          冻结
                        </Button>
                      )}
                      {actions.includes("unfreeze") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => onAction("unfreeze", item)}
                        >
                          解冻
                        </Button>
                      )}
                    </div>
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
