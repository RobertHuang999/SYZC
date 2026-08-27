type SeverityLevelDisplayProps = {
  severityCode: string
  severityName: string
  severityColor: string
}

export function SeverityLevelDisplay({
  severityCode,
  severityName,
  severityColor,
}: SeverityLevelDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-2.5 rounded-full"
        style={{ backgroundColor: severityColor }}
      />
      <span>
        {severityCode} {severityName}
      </span>
    </div>
  )
}
