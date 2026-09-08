
import { DateTimeText } from "./DateTimeText"
import { formatDateTime } from "@/shared/lib/date-utils"

/** 标准表格日期时间单元格：默认分两行展示，plain 模式与预警等级使用同款正文。 */
export function TableDateTimeCell({
  value,
  plain = false,
}: {
  value?: string | null
  plain?: boolean
}) {
  return <DateTimeText value={value} stacked={!plain} plain={plain} />
}

type PersonTimeTextProps = {
  person?: string | null
  time?: string | null
  fallbackPerson?: string
}

/** 与预警等级表格一致的人员/时间正文样式，按名称、时间上下分行。 */
export function PersonTimeText({
  person,
  time,
  fallbackPerson = "系统",
}: PersonTimeTextProps) {
  const hasPerson = Boolean(person && person !== "—")
  const hasTime = Boolean(time && time !== "—")

  if (!hasPerson && !hasTime) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <span className="flex min-w-0 flex-col leading-tight">
      <span className="truncate" title={hasPerson ? person ?? undefined : fallbackPerson}>
        {hasPerson ? person : fallbackPerson}
      </span>
      <span>{hasTime ? formatDateTime(time) : "—"}</span>
    </span>
  )
}

/**
 * 标准表格处理人与处理时间合并单元格组件
 * 未处置：展示 —
 * 已处置：上行展示处理人，下行展示处理时间 (YYYY-MM-DD HH:mm:ss)
 */
export function TableProcessedInfoCell({
  processedBy,
  processedTime,
}: {
  processedBy?: string | null
  processedTime?: string | null
}) {
  const hasBy = Boolean(processedBy && processedBy !== "—")
  const hasTime = Boolean(processedTime && processedTime !== "—")

  if (!hasBy && !hasTime) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <PersonTimeText
      person={processedBy}
      time={processedTime}
      fallbackPerson="系统自动处理"
    />
  )
}

/** 标准表格创建/更新人及时间单元格。 */
export function TablePersonTimeCell({
  person,
  time,
}: {
  person?: string | null
  time?: string | null
}) {
  return <PersonTimeText person={person} time={time} />
}
