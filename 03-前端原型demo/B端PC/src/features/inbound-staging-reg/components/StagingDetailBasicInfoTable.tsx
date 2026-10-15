import { Link } from "react-router-dom"
import { DetailSection, formatEmptyValue } from "@/shared/components/DetailSection"
import type { InboundStagingReg } from "../domain/types"

type Props = {
  reg: InboundStagingReg
  /** 嵌入入库记录同款 header Card 内，不重复 DetailSection 标题 */
  embedded?: boolean
  formalDetailPath?: string | null
}

const thClass =
  "w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r align-top"
const tdClass = "p-2.5 text-foreground align-top border-r last:border-r-0"

function BasicInfoTable({
  reg,
  formalDetailPath,
}: {
  reg: InboundStagingReg
  formalDetailPath?: string | null
}) {
  return (
    <div className="overflow-hidden rounded-md border text-xs">
      <table className="w-full border-collapse text-left">
        <tbody>
          <tr className="border-b">
            <th className={thClass}>登记人：</th>
            <td className={`${tdClass} w-[35%] font-medium`}>{reg.registrant}</td>
            <th className={thClass}>登记时间：</th>
            <td className={tdClass}>{reg.registeredAt}</td>
          </tr>
          <tr className="border-b">
            <th className={thClass}>入库日期：</th>
            <td className={`${tdClass} font-medium`}>{reg.inboundDate}</td>
            <th className={thClass}>入库仓库：</th>
            <td className={tdClass}>{reg.warehouseName}</td>
          </tr>
            <tr className="border-b">
              <th className={thClass}>入库类型：</th>
              <td className={`${tdClass} font-medium`}>{reg.inboundType}</td>
              <th className={thClass}>关联单号：</th>
              <td className={tdClass}>{formatEmptyValue(reg.relatedOrderNo)}</td>
            </tr>
            <tr className="border-b">
              <th className={thClass}>货主/送货说明：</th>
              <td className={`${tdClass} font-medium`}>
                {reg.ownerDisplay}
                {reg.ownerTag ? (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    [{reg.ownerTag}]
                  </span>
                ) : null}
              </td>
              <th className={thClass}>入库库房：</th>
              <td className={tdClass}>{formatEmptyValue(reg.storeroomName)}</td>
            </tr>
            {reg.locationHint ? (
              <tr className="border-b">
                <th className={thClass}>库位提示：</th>
                <td colSpan={3} className={tdClass}>
                  {reg.locationHint}
                </td>
              </tr>
            ) : null}
            <tr className="border-b">
              <th className={thClass}>关联正式单号：</th>
              <td colSpan={3} className={tdClass}>
                {reg.relatedFormalNo ? (
                  formalDetailPath ? (
                    <Link to={formalDetailPath} className="text-primary hover:underline">
                      {reg.relatedFormalNo}
                    </Link>
                  ) : (
                    reg.relatedFormalNo
                  )
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
            <tr className={reg.status === "已作废" ? "border-b" : undefined}>
              <th className={thClass}>备注：</th>
              <td colSpan={3} className="p-2.5 text-foreground leading-relaxed">
                {formatEmptyValue(reg.remark)}
              </td>
            </tr>
            {reg.status === "已作废" ? (
              <tr>
                <th className={thClass}>作废原因：</th>
                <td colSpan={3} className="p-2.5 text-foreground leading-relaxed">
                  {formatEmptyValue(reg.voidReason)}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
  )
}

/** 对齐入库记录详情 header 内 detailTable 两行四列排版 */
export function StagingDetailBasicInfoTable({
  reg,
  embedded = false,
  formalDetailPath,
}: Props) {
  if (embedded) {
    return (
      <div className="mt-4">
        <BasicInfoTable reg={reg} formalDetailPath={formalDetailPath} />
      </div>
    )
  }

  return (
    <DetailSection title="基础信息">
      <div className="col-span-full">
        <BasicInfoTable reg={reg} formalDetailPath={formalDetailPath} />
      </div>
    </DetailSection>
  )
}
