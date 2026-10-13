type Props = {
  categoryCount: number
  goodsTotal: number
  stackedTotal: number
  noStackTotal: number
}

/** 与 PC InboundFormSummaryBar 文案一致 */
export function InboundFormSummaryBarMobile({
  categoryCount,
  goodsTotal,
  stackedTotal,
  noStackTotal,
}: Props) {
  return (
    <div className="border-t border-sky-100 bg-sky-50 px-3 py-2 text-xs text-gray-800">
      <span className="font-medium">合计：</span>
      货品品类数：{categoryCount}
      <span className="mx-2 text-gray-300">|</span>
      货品总数量 {goodsTotal.toFixed(4)}
      <span className="mx-2 text-gray-300">|</span>
      理货堆放数：{stackedTotal.toFixed(4)}
      <span className="mx-2 text-gray-300">|</span>
      无需理货堆放数：{noStackTotal.toFixed(4)}
    </div>
  )
}
