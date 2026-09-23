import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MidLoanModelStrategyFieldsProps {
  params: Record<string, string>
  onChange: (patch: Record<string, string>) => void
}

const MODEL_OPTIONS = [
  { value: "仓单尽调产品-版本1", label: "仓单尽调产品-版本1" },
  { value: "智风控-大宗资信模型 V3", label: "智风控-大宗资信模型 V3" },
  { value: "智风控-供应链风险模型 V2", label: "智风控-供应链风险模型 V2" },
  { value: "智风控-司法涉诉模型 V1", label: "智风控-司法涉诉模型 V1" },
]

const OPERATOR_OPTIONS = [
  { value: "<", label: "< 小于" },
  { value: "<=", label: "<= 小于等于" },
  { value: ">", label: "> 大于" },
  { value: ">=", label: ">= 大于等于" },
  { value: "=", label: "= 等于" },
  { value: "between", label: "介于" },
]

export function MidLoanModelStrategyFields({
  params,
  onChange,
}: MidLoanModelStrategyFieldsProps) {
  const currentModel = params.modelName || "仓单尽调产品-版本1"

  return (
    <div className="space-y-4 md:col-span-2">
      {/* 顶部：模型选择 */}
      <div className="flex flex-wrap items-center gap-3">
        <Label className="flex items-center text-sm font-medium">
          <span className="text-destructive font-bold mr-1">*</span>
          风控模型：
        </Label>
        <div className="w-72">
          <Select
            value={currentModel}
            onValueChange={(value) => onChange({ modelName: value ?? "" })}
          >
            <SelectTrigger className="h-9 w-full bg-background">
              <SelectValue placeholder="请选择风控模型" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 左右两栏布局：输入项 / 输出项 */}
      <div className="grid grid-cols-1 gap-6 rounded-lg border bg-muted/10 p-4 md:grid-cols-2">
        {/* 左栏：输入项 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-l-2 border-orange-500 pl-2">
            <span className="text-sm font-semibold text-foreground">输入项</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* 个人姓名 */}
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-xs text-muted-foreground shrink-0">
                个人姓名
              </span>
              <Select
                value={params.inputPersonName || "person_legal"}
                onValueChange={(val) => onChange({ inputPersonName: val ?? "" })}
              >
                <SelectTrigger className="h-8 flex-1 bg-background text-xs">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person_legal">货主法定代表人姓名</SelectItem>
                  <SelectItem value="person_agent">经办人姓名</SelectItem>
                  <SelectItem value="person_contact">主要业务联系人</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 个人电话 */}
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-xs text-muted-foreground shrink-0">
                个人电话
              </span>
              <Select
                value={params.inputPersonPhone || "phone_legal"}
                onValueChange={(val) => onChange({ inputPersonPhone: val ?? "" })}
              >
                <SelectTrigger className="h-8 flex-1 bg-background text-xs">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone_legal">货主法定代表人手机号</SelectItem>
                  <SelectItem value="phone_agent">经办人手机号</SelectItem>
                  <SelectItem value="phone_contact">主要业务联系人电话</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 个人身份证号码 */}
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-xs text-muted-foreground shrink-0">
                个人身份证号码
              </span>
              <Select
                value={params.inputPersonIdCard || "idcard_legal"}
                onValueChange={(val) => onChange({ inputPersonIdCard: val ?? "" })}
              >
                <SelectTrigger className="h-8 flex-1 bg-background text-xs">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idcard_legal">货主法定代表人身份证号</SelectItem>
                  <SelectItem value="idcard_agent">经办人身份证号</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 企业名称 */}
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-xs text-muted-foreground shrink-0">
                企业名称
              </span>
              <Select
                value={params.inputEnterpriseName || "ent_owner"}
                onValueChange={(val) => onChange({ inputEnterpriseName: val ?? "" })}
              >
                <SelectTrigger className="h-8 flex-1 bg-background text-xs">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ent_owner">货主企业名称</SelectItem>
                  <SelectItem value="ent_warehouse">仓储企业名称</SelectItem>
                  <SelectItem value="ent_guarantor">保证人企业名称</SelectItem>
                  <SelectItem value="ent_core">核心企业名称</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 企业电话 */}
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-xs text-muted-foreground shrink-0">
                企业电话
              </span>
              <Select
                value={params.inputEnterprisePhone || "ent_phone_owner"}
                onValueChange={(val) => onChange({ inputEnterprisePhone: val ?? "" })}
              >
                <SelectTrigger className="h-8 flex-1 bg-background text-xs">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ent_phone_owner">货主企业联系电话</SelectItem>
                  <SelectItem value="ent_phone_warehouse">仓储企业联系电话</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 企业信用代码 */}
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-xs text-muted-foreground shrink-0">
                企业信用代码
              </span>
              <Select
                value={params.inputEnterpriseCreditCode || "ent_uscc_owner"}
                onValueChange={(val) =>
                  onChange({ inputEnterpriseCreditCode: val ?? "" })
                }
              >
                <SelectTrigger className="h-8 flex-1 bg-background text-xs">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ent_uscc_owner">货主统一社会信用代码</SelectItem>
                  <SelectItem value="ent_uscc_guarantor">保证人企业信用代码</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 右栏：输出项 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-l-2 border-orange-500 pl-2">
            <span className="text-sm font-semibold text-foreground">输出项</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* 产品评分 */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-right text-xs text-muted-foreground shrink-0">
                产品评分
              </span>
              <Input
                placeholder="请输入"
                value={params.outputScoreMin ?? ""}
                onChange={(e) => onChange({ outputScoreMin: e.target.value })}
                className="h-8 flex-1 bg-background text-xs"
              />
              <Select
                value={params.outputScoreOp || "<"}
                onValueChange={(val) => onChange({ outputScoreOp: val ?? "" })}
              >
                <SelectTrigger className="h-8 w-28 bg-background text-xs shrink-0">
                  <SelectValue placeholder="运算符" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="请输入"
                value={params.outputScoreMax ?? ""}
                onChange={(e) => onChange({ outputScoreMax: e.target.value })}
                className="h-8 flex-1 bg-background text-xs"
              />
            </div>

            {/* 产品额度 */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-right text-xs text-muted-foreground shrink-0">
                产品额度
              </span>
              <Input
                placeholder="请输入"
                value={params.outputQuotaMin ?? ""}
                onChange={(e) => onChange({ outputQuotaMin: e.target.value })}
                className="h-8 flex-1 bg-background text-xs"
              />
              <Select
                value={params.outputQuotaOp || "<="}
                onValueChange={(val) => onChange({ outputQuotaOp: val ?? "" })}
              >
                <SelectTrigger className="h-8 w-28 bg-background text-xs shrink-0">
                  <SelectValue placeholder="运算符" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="请输入"
                value={params.outputQuotaMax ?? ""}
                onChange={(e) => onChange({ outputQuotaMax: e.target.value })}
                className="h-8 flex-1 bg-background text-xs"
              />
            </div>

            {/* 结果 */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-right text-xs text-muted-foreground shrink-0">
                结果
              </span>
              <Select
                value={params.outputResult || "拒绝"}
                onValueChange={(val) => onChange({ outputResult: val ?? "" })}
              >
                <SelectTrigger className="h-8 w-44 bg-background text-xs">
                  <SelectValue placeholder="请选择结果" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="拒绝">拒绝</SelectItem>
                  <SelectItem value="人工复核">人工复核</SelectItem>
                  <SelectItem value="关注">关注</SelectItem>
                  <SelectItem value="通过">通过</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
