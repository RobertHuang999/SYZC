import { formatGoodsNamesForList } from "../../../../../shared/inbound/inbound-list-format"

type Props = {
  open: boolean
  orderNo: string
  goodsNames: string[]
  onClose: () => void
}

/** H5 对齐 PC R15：多货品完整清单 */
export function MobileGoodsNamesSheet({ open, orderNo, goodsNames, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <button type="button" className="min-h-0 flex-1" aria-label="关闭" onClick={onClose} />
      <div className="rounded-t-2xl bg-white px-4 pb-safe pt-3">
        <p className="text-center text-sm font-medium text-[#232D39]">入库货品清单</p>
        <p className="mt-1 text-center text-[11px] text-[#232D39]/50">{orderNo}</p>
        <ul className="mt-3 max-h-[50vh] space-y-2 overflow-y-auto pb-4 text-sm text-[#232D39]">
          {goodsNames.map((name) => (
            <li key={name} className="rounded-lg border border-[#232D39]/10 px-3 py-2">
              {name}
            </li>
          ))}
        </ul>
        <p className="pb-3 text-center text-[11px] text-[#232D39]/45">
          共 {goodsNames.length} 种 · {formatGoodsNamesForList(goodsNames)}
        </p>
      </div>
    </div>
  )
}
