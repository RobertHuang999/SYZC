import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { FileTextIcon } from "lucide-react"
import { Link } from "react-router-dom"
import synergySpecMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md?raw"
import { MermaidDiagram } from "@/shared/components/MermaidDiagram"

/** 用户中心 · 业务协同 · 存量业务单据协同（挂载 05 协同规格 MD） */
export function PartnerStockSynergySpecPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <header className="mb-6 space-y-2 border-b pb-4">
        <div className="flex items-center gap-2 text-primary">
          <FileTextIcon className="h-5 w-5" aria-hidden />
          <h1 className="text-lg font-semibold text-foreground">存量业务单据协同规格</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          研发请先读{" "}
          <Link
            to="/用户中心/业务协同/合作方档案存量改造地图"
            className="font-medium text-primary hover:underline"
          >
            合作方档案存量改造地图
          </Link>
          。全文真源{" "}
          <code className="rounded bg-muted px-1 text-xs">05-存量改造…/合作方改造-存量业务单据协同规格.md</code>
          ；迁移见{" "}
          <Link
            to="/历史迁移与割接/合作方主数据迁移"
            className="font-medium text-primary hover:underline"
          >
            合作方主数据迁移（6.3）
          </Link>
          。
        </p>
      </header>

      <article className="prose prose-slate max-w-none text-sm leading-relaxed dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              if (match?.[1] === "mermaid") {
                return (
                  <div className="my-5 not-prose">
                    <MermaidDiagram chart={String(children).replace(/\n$/, "")} />
                  </div>
                )
              }
              return (
                <code
                  className={`rounded bg-muted px-1.5 py-0.5 text-xs text-foreground ${className ?? ""}`}
                  {...props}
                >
                  {children}
                </code>
              )
            },
            pre({ children }) {
              return <div className="not-prose my-3">{children}</div>
            },
          }}
        >
          {synergySpecMarkdown}
        </ReactMarkdown>
      </article>
    </div>
  )
}
