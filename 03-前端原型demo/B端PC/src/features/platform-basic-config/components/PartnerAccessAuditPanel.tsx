import { ScrollTextIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PartnerAccessAuditRecord } from "../domain/types"

type PartnerAccessAuditPanelProps = {
  records: PartnerAccessAuditRecord[]
}

export function PartnerAccessAuditPanel({ records }: PartnerAccessAuditPanelProps) {
  if (records.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollTextIcon className="size-4 text-muted-foreground" />
            策略变更审计
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          降低风控要求（放宽必填或关闭防重复）并保存后，变更原因与时间将展示于此；完整流水可在「操作审批日志」中追溯。
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ScrollTextIcon className="size-4 text-muted-foreground" />
          策略变更审计
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          展示本页最近保存的放宽类变更；完整不可变审计流水保留 5 年以上。
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className="rounded-lg border bg-muted/20 px-4 py-3 text-sm space-y-2"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{record.changedAt}</span>
              <span>{record.operator}</span>
            </div>
            <p className="font-medium text-foreground">{record.changeSummary}</p>
            <p className="text-muted-foreground">
              <span className="text-foreground/80">变更原因：</span>
              {record.reason}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
