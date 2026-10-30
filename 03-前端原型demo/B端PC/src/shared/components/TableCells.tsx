
import { DateTimeText } from "./DateTimeText"
import { formatDateTime } from "@/shared/lib/date-utils"

/** 标准表格日期时间单元格：默认分两行（mono）；plain 为单行正文；stackedPlain 为两行正文（列表日期列推荐）。 */
export function TableDateTimeCell({
  value,
  plain = false,
  stackedPlain = false,
}: {
  value?: string | null
  plain?: boolean
  stackedPlain?: boolean
}) {
  if (stackedPlain) {
    return <DateTimeText value={value} stacked plain />
  }
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

type PersonOrgTimeTextProps = {
  person?: string | null
  org?: string | null
  time?: string | null
  fallbackPerson?: string
}

const isEmptyValue = (value?: string | null) =>
  !value || value.trim() === "" || value === "—"

/**
 * 人员 + 组织 + 时间单元格（对齐《06-表格行与操作列规范》3.3 节 C 模板）：
 * - 有组织且有时间：三行 —— ① 人员 + 组织 ② 年月日 ③ 时分秒；
 * - 只有人员（无组织）：退化为两行 —— ① 人员 ② 日期时间；
 * - 组织缺失时整块不渲染组织；人员与时间都没有时显示「—」。
 * 每行独立单行省略，整格 title 给出完整内容。
 */
export function PersonOrgTimeText({
  person,
  org,
  time,
  fallbackPerson = "系统",
}: PersonOrgTimeTextProps) {
  const hasPerson = !isEmptyValue(person)
  const hasOrg = !isEmptyValue(org)
  const hasTime = !isEmptyValue(time)

  if (!hasPerson && !hasOrg && !hasTime) {
    return <span className="text-muted-foreground">—</span>
  }

  const personText = hasPerson ? (person as string).trim() : fallbackPerson
  const orgText = hasOrg ? (org as string).trim() : ""
  const formattedTime = hasTime ? formatDateTime(time) : "—"
  const [datePart, timePart] = formattedTime.split(/\s+/, 2)
  const fullTitle = [personText, orgText, hasTime ? formattedTime : ""]
    .filter(Boolean)
    .join(" ")

  const personLine = (
    <span className="flex min-w-0 items-baseline gap-1.5">
      <span className="shrink-0 truncate font-medium text-foreground">
        {personText}
      </span>
      {orgText ? (
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          {orgText}
        </span>
      ) : null}
    </span>
  )

  // 三行：人员 + 组织 / 年月日 / 时分秒
  if (hasOrg && hasTime && timePart) {
    return (
      <span
        className="flex min-w-0 flex-col gap-0.5 leading-snug"
        title={fullTitle}
      >
        {personLine}
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {datePart}
        </span>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {timePart}
        </span>
      </span>
    )
  }

  // 两行：人员（+ 组织）/ 日期时间
  return (
    <span
      className="flex min-w-0 flex-col gap-0.5 leading-snug"
      title={fullTitle}
    >
      {personLine}
      <span className="truncate text-xs text-muted-foreground tabular-nums">
        {formattedTime}
      </span>
    </span>
  )
}

/** 标准表格「人员 + 组织 + 时间」单元格（三行版，见 06 规范 3.3 节）。 */
export function TablePersonOrgTimeCell({
  person,
  org,
  time,
}: {
  person?: string | null
  org?: string | null
  time?: string | null
}) {
  return <PersonOrgTimeText person={person} org={org} time={time} />
}
