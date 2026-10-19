import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ToggleSwitch } from "./ToggleSwitch"
import { YesNoRadio } from "./YesNoRadio"
import type { PartnerSubjectAccessPolicy, YesNo } from "../domain/types"

type PartnerSubjectPolicyCardProps = {
  title: string
  certHint: string
  duplicateHint: string
  duplicateWarning: string
  policy: PartnerSubjectAccessPolicy
  onChange: (patch: Partial<PartnerSubjectAccessPolicy>) => void
  onScanDuplicates?: () => void
  footnote?: string
  certSpecNote?: string
  duplicateSpecNote?: string
  footnoteSpecNote?: string
}

export function PartnerSubjectPolicyCard({
  title,
  certHint,
  duplicateHint,
  duplicateWarning,
  policy,
  onChange,
  onScanDuplicates,
  footnote,
  certSpecNote,
  duplicateSpecNote,
  footnoteSpecNote,
}: PartnerSubjectPolicyCardProps) {
  const namePrefix = title.includes("个人") ? "personal" : "enterprise"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {footnote ? <ProductFieldHint>{footnote}</ProductFieldHint> : null}
        {footnoteSpecNote ? <PrototypeSpecCallout>{footnoteSpecNote}</PrototypeSpecCallout> : null}
      </CardHeader>
      <CardContent className="space-y-6">
        <YesNoRadio
          name={`${namePrefix}-cert-required`}
          label="证件地址是否必填"
          required
          value={policy.certAddressRequired}
          onChange={(v: YesNo) => onChange({ certAddressRequired: v })}
          hint={certHint}
          specHint={certSpecNote}
        />
        <div className="space-y-3">
          <Label>
            <span className="text-destructive">* </span>
            证件地址防重复
          </Label>
          <div className="flex flex-wrap items-center gap-3">
            <ToggleSwitch
              checked={policy.addressDuplicatePrevent}
              onCheckedChange={(checked) =>
                onChange({ addressDuplicatePrevent: checked })
              }
            />
            <span className="text-sm">
              {policy.addressDuplicatePrevent ? "开启" : "关闭"}
            </span>
            {policy.addressDuplicatePrevent && onScanDuplicates && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onScanDuplicates}
              >
                <SearchIcon className="size-4" />
                排查历史重复地址
              </Button>
            )}
          </div>
          <ProductFieldHint className="text-amber-800 dark:text-amber-300">
            {duplicateWarning}
          </ProductFieldHint>
          <ProductFieldHint>{duplicateHint}</ProductFieldHint>
          {duplicateSpecNote ? <PrototypeSpecCallout>{duplicateSpecNote}</PrototypeSpecCallout> : null}
        </div>
      </CardContent>
    </Card>
  )
}
