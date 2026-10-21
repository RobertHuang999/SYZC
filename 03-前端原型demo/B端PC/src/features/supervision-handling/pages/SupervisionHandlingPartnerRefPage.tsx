import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { PartnerArchiveEmbeddedPicker } from "@/features/partner-archives/components/PartnerArchiveEmbeddedPicker"
import type { PartnerSelectorValue } from "@/features/partner-archives/components/PartnerArchiveSelector"
import {
  SUPERVISION_DOC_KIND_OPTIONS,
  SUPERVISION_OWNER_ARCHIVE_MENU,
  holderArchiveMenuForDocKind,
  type SupervisionDocKind,
} from "@prototype/shared/partner-archives/supervision-partner-reference"
import { supervisionHandlingDocuments } from "../documents/supervision-handling-documents"
import { supervisionHandlingPartnerRefAnnotations } from "../annotations/supervision-handling-partner-ref.annotations"

export function SupervisionHandlingPartnerRefPage() {
  const [docKind, setDocKind] = useState<SupervisionDocKind>("PLEDGE")
  const [ownerId, setOwnerId] = useState<string | undefined>()
  const [ownerSelection, setOwnerSelection] = useState<PartnerSelectorValue | null>(null)
  const [holderId, setHolderId] = useState<string | undefined>()
  const [holderSelection, setHolderSelection] = useState<PartnerSelectorValue | null>(null)

  const holderMeta = useMemo(
    () => SUPERVISION_DOC_KIND_OPTIONS.find((row) => row.value === docKind)!,
    [docKind],
  )
  const holderArchiveMenu = holderArchiveMenuForDocKind(docKind)

  const resetHolderOnKindChange = (next: SupervisionDocKind) => {
    setDocKind(next)
    setHolderId(undefined)
    setHolderSelection(null)
  }

  return (
    <PrototypeAnnotationProvider
      documents={supervisionHandlingDocuments}
      annotations={supervisionHandlingPartnerRefAnnotations}
    >
      <div className="mx-auto max-w-4xl space-y-4 p-4 pb-10">
        <PrototypeAnnotationTarget annotationIds={["supervision-handling-page"]}>
          <div id="supervision-handling-page">
            <h1 className="text-lg font-semibold tracking-tight">监管办理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              6.3 原型切片：货主与权人/质权人合作方嵌入式选择器（完整抵质押办理流程见后续迭代）。
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">单据类型</CardTitle>
            <CardDescription>切换类型将清空已选权人/质权人，货主选择保留。</CardDescription>
          </CardHeader>
          <CardContent className="max-w-sm space-y-1.5">
            <Label>单据类型</Label>
            <Select
              value={docKind}
              onValueChange={(v) => {
                if (v) resetHolderOnKindChange(v as SupervisionDocKind)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择单据类型" />
              </SelectTrigger>
              <SelectContent>
                {SUPERVISION_DOC_KIND_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">主体与权人</CardTitle>
            <CardDescription>
              货主引用货主信息域；{holderMeta.label} 的 {holderMeta.holderFieldLabel} 引用{" "}
              {holderArchiveMenu} 域。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <PartnerArchiveEmbeddedPicker
              archiveMenu={SUPERVISION_OWNER_ARCHIVE_MENU}
              fieldLabel="货主"
              required
              value={ownerId}
              selection={ownerSelection}
              onChange={(payload) => {
                setOwnerSelection(payload)
                setOwnerId(payload?.partnerId)
              }}
            />

            <PrototypeAnnotationTarget annotationIds={["supervision-handling-holder-picker"]}>
              <div id="supervision-handling-holder-picker">
              <PartnerArchiveEmbeddedPicker
                archiveMenu={holderArchiveMenu}
                fieldLabel={holderMeta.holderFieldLabel}
                required
                value={holderId}
                selection={holderSelection}
                onChange={(payload) => {
                  setHolderSelection(payload)
                  setHolderId(payload?.partnerId)
                }}
              />
              </div>
            </PrototypeAnnotationTarget>
          </CardContent>
        </Card>
      </div>
    </PrototypeAnnotationProvider>
  )
}
