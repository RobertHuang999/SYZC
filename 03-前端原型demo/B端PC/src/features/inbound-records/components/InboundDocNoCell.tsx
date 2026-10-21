import { useState } from "react"
import { Copy } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

type Props = {
  docNo: string
  linkTo?: string
  className?: string
}

/** 业务单号单元格：单行完整展示 + hover 轻量复制（对齐 AGENTS.md 规范与货主档案设计） */
export function InboundDocNoCell({ docNo, linkTo, className }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    void navigator.clipboard.writeText(docNo)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const textClass = cn(
    "whitespace-nowrap font-medium text-sm leading-normal",
    className
  )

  return (
    <div className="group/item inline-flex items-center gap-1.5 max-w-full">
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
        className="shrink-0 p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100 hover:text-foreground cursor-pointer"
        title="复制单号"
      >
        {copied ? (
          <span className="text-xs leading-none text-emerald-600 font-bold">✓</span>
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  )
}
