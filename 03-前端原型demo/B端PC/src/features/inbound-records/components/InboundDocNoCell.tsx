import { useState } from "react"
import { Copy } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

type Props = {
  docNo: string
  linkTo?: string
  className?: string
  /** 超长单号（17 位以上）允许折成两行，保持完整展示、不出现省略号 */
  wrap?: boolean
}

/** 业务单号单元格：完整展示 + hover 轻量复制（超长单号可折两行，见《06-表格行与操作列规范》3.2 节） */
export function InboundDocNoCell({ docNo, linkTo, className, wrap = false }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    void navigator.clipboard.writeText(docNo)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const textClass = cn(
    "font-medium text-sm",
    wrap ? "whitespace-normal break-all line-clamp-2 leading-snug" : "whitespace-nowrap leading-normal",
    className
  )

  return (
    <div
      className={cn(
        "group/item inline-flex max-w-full gap-1.5",
        wrap ? "items-start" : "items-center"
      )}
    >
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
        className={cn(
          "shrink-0 p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100 hover:text-foreground cursor-pointer",
          wrap && "mt-0.5"
        )}
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
