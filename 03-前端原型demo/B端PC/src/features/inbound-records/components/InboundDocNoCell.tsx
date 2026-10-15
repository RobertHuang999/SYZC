import { useState } from "react"
import { Copy } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

type Props = {
  docNo: string
  linkTo?: string
  className?: string
}

/** 业务单号单元格：break-all 多行展示 + hover 复制（对齐入库记录列表） */
export function InboundDocNoCell({ docNo, linkTo, className }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    void navigator.clipboard.writeText(docNo)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const textClass = cn("line-clamp-2 min-w-0 break-all text-sm leading-snug", className)

  return (
    <div className="group/item flex items-start gap-1">
      {linkTo ? (
        <Link to={linkTo} className={cn(textClass, "text-primary hover:underline")} title={docNo}>
          {docNo}
        </Link>
      ) : (
        <span className={cn(textClass, "text-foreground")} title={docNo}>
          {docNo}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100 hover:text-foreground"
        title="复制单号"
      >
        {copied ? (
          <span className="text-xs leading-none text-emerald-600">✓</span>
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  )
}
