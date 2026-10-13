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
import { MASKED_SECRET } from "../domain/constants"
import type { CredentialCardDef, CredentialCardState, CredentialValues } from "../domain/types"

type CredentialCardPanelProps = {
  defs: CredentialCardDef[]
  values: CredentialValues
  cards: Record<string, CredentialCardState>
  onEdit: (cardId: string) => void
  onCancelEdit: (cardId: string) => void
  onSave: (cardId: string) => void
  onDraftChange: (cardId: string, fieldKey: string, value: string) => void
}

export function CredentialCardPanel({
  defs,
  values,
  cards,
  onEdit,
  onCancelEdit,
  onSave,
  onDraftChange,
}: CredentialCardPanelProps) {
  return (
    <div className="space-y-4">
      {defs.map((def) => {
        const cardState = cards[def.id]
        const editing = cardState?.editing ?? false
        const configured = cardState?.configured ?? false

        return (
          <Card key={def.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">{def.title}</CardTitle>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onCancelEdit(def.id)}
                    >
                      取消
                    </Button>
                    <Button type="button" size="sm" onClick={() => onSave(def.id)}>
                      保存
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(def.id)}
                    >
                      编辑
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled
                      title="请先点击编辑并录入密钥"
                    >
                      保存
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {def.fields.map((field) => {
                const stored = values[def.id]?.[field.key]
                const displayValue =
                  editing || !configured
                    ? cardState?.draft[field.key] ?? ""
                    : field.type === "file"
                      ? stored
                        ? "已上传证书"
                        : ""
                      : MASKED_SECRET

                return (
                  <div key={field.key} className="space-y-2">
                    <Label>
                      <span className="text-destructive">* </span>
                      {field.label}
                    </Label>
                    {field.type === "select" ? (
                      <Select
                        disabled={!editing}
                        value={displayValue || undefined}
                        onValueChange={(v) => onDraftChange(def.id, field.key, v ?? "")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "file" ? (
                      editing ? (
                        <Input
                          type="file"
                          accept=".pfx,.p12,.pdf"
                          onChange={() => onDraftChange(def.id, field.key, "uploaded")}
                        />
                      ) : (
                        <Input readOnly value={displayValue || "未上传"} />
                      )
                    ) : (
                      <Input
                        readOnly={!editing}
                        type={editing ? "text" : "password"}
                        value={displayValue}
                        placeholder={editing ? "请重新输入完整密钥" : ""}
                        onChange={(event) =>
                          onDraftChange(def.id, field.key, event.target.value)
                        }
                      />
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
