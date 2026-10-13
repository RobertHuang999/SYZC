import { Link } from "react-router-dom"
import { XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ROLE_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
} from "../domain/actions"
import { PARTNER_ARCHIVE_LIST_PATH } from "../domain/constants"
import {
  ROLE_TYPE_LABELS,
  ROLE_STATUS_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "../domain/types"
import { maskLoginPhone } from "../lib/detail-utils"

interface Props {
  partner: PartnerSubject | null
  isOpen: boolean
  onClose: () => void
}

/** 字段清单 §5.1「查看货主」弹窗展示项 */
export function PartnerViewDrawer({ partner, isOpen, onClose }: Props) {
  if (!isOpen || !partner) {
    return null
  }

  const needsCompletion =
    partner.roles.some((role) => role.roleStatus === "PENDING_COMPLETION") ||
    !partner.certAddress.fullAddress
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-lg flex-col border-l border-border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold">查看货主</h3>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose}>
            <XIcon className="size-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6 text-sm">
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-3.5">
            <div>
              <span className="text-xs text-muted-foreground">主体类型</span>
              <p className="font-medium">{SUBJECT_TYPE_LABELS[partner.subjectType]}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">主体名称</span>
              <p className="font-medium">{partner.name}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">身份标识</span>
              <p className="font-mono font-medium">{partner.idNumberMasked}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">联系电话</span>
              <p className="font-medium">
                {partner.contactPhone.length >= 11
                  ? maskLoginPhone(partner.contactPhone)
                  : partner.contactPhone || "——"}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">证件地址</span>
              {partner.certAddress.fullAddress ? (
                <p className="font-medium leading-relaxed">{partner.certAddress.fullAddress}</p>
              ) : (
                <p className="font-medium text-amber-600">待补全（未录入证件登记地址）</p>
              )}
            </div>
            <div>
              <span className="text-xs text-muted-foreground">业务角色</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {partner.roles.map((role, index) => (
                  <Badge
                    key={`${role.roleType}-${index}`}
                    variant="outline"
                    className={ROLE_STATUS_BADGE_CLASS[role.roleStatus]}
                  >
                    {ROLE_TYPE_LABELS[role.roleType]}·{ROLE_STATUS_LABELS[role.roleStatus]}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">主体状态</span>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={SUBJECT_STATUS_BADGE_CLASS[partner.status]}
                >
                  {SUBJECT_STATUS_LABELS[partner.status]}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-6 py-3.5">
          {needsCompletion && (
            <Link to={`${PARTNER_ARCHIVE_LIST_PATH}/编辑/${partner.id}`}>
              <Button
                type="button"
                size="sm"
                className="bg-amber-500 text-white hover:bg-amber-600"
                onClick={onClose}
              >
                去补全
              </Button>
            </Link>
          )}
          <Link to={`${PARTNER_ARCHIVE_LIST_PATH}/详情/${partner.id}`}>
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              查看详情
            </Button>
          </Link>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  )
}
