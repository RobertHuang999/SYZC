type TabUnderConstructionPanelProps = {
  pcTabLabel: string
}

export function TabUnderConstructionPanel({ pcTabLabel }: TabUnderConstructionPanelProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <div className="flex flex-1 items-center justify-center px-3.5 py-3">
        <p className="max-w-[280px] text-center text-sm leading-relaxed text-gray-500">
          功能将在后续版本接入，与 PC 端「{pcTabLabel}」Tab 保持一致
        </p>
      </div>
    </div>
  )
}
