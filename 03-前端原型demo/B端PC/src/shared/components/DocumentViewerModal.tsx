import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookOpenIcon, CheckIcon, CopyIcon, FileTextIcon, LayersIcon, XIcon } from "lucide-react"
import { MermaidDiagram } from "./MermaidDiagram"

export type PrototypeDocument = {
  id: string
  title: string
  content: string
  category?: string
}

export function DocumentViewerModal({
  documents,
  activeDocumentId,
  open,
  onClose,
  onSelectDocument,
}: {
  documents: PrototypeDocument[]
  activeDocumentId: string | null
  open: boolean
  onClose: () => void
  onSelectDocument: (id: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const activeDoc = documents.find((doc) => doc.id === activeDocumentId) ?? documents[0]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open || !activeDoc) {
    return null
  }

  const handleCopy = () => {
    if (activeDoc?.content) {
      navigator.clipboard.writeText(activeDoc.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="relative flex h-[88vh] w-[min(72rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header with document tabs */}
        <div className="flex flex-wrap items-center justify-between border-b bg-muted/40 px-6 py-3.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <BookOpenIcon className="size-5 text-primary" />
              <span>需求与设计参考文档</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-background/80 p-1 shadow-sm">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    doc.id === activeDoc.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => onSelectDocument(doc.id)}
                >
                  <FileTextIcon className="size-3.5" />
                  <span>{doc.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              onClick={handleCopy}
              title="复制完整的 Markdown 文档内容"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">已复制文档内容</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5" />
                  <span>复制文档内容</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={onClose}
              title="关闭文档查看器 (Esc)"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Markdown Content Body */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="border-b pb-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                <LayersIcon className="size-3" />
                <span>实时挂载源文件</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {activeDoc.title}
              </h1>
            </div>

            <article className="prose prose-slate max-w-none text-sm leading-relaxed dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    const isMermaid = match && match[1] === "mermaid"
                    if (isMermaid) {
                      return (
                        <div className="my-4 not-prose">
                          <MermaidDiagram chart={String(children).replace(/\n$/, "")} />
                        </div>
                      )
                    }
                    return (
                      <code
                        className={`rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground ${className ?? ""}`}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  pre({ children }) {
                    return <div className="not-prose my-3">{children}</div>
                  },
                  table({ children }) {
                    return (
                      <div className="my-4 overflow-x-auto rounded-lg border">
                        <table className="w-full text-left text-xs border-collapse">
                          {children}
                        </table>
                      </div>
                    )
                  },
                  thead({ children }) {
                    return <thead className="bg-muted/60 border-b">{children}</thead>
                  },
                  th({ children }) {
                    return <th className="p-2.5 font-semibold text-foreground">{children}</th>
                  },
                  td({ children }) {
                    return <td className="p-2.5 border-b text-muted-foreground">{children}</td>
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="my-3 border-l-4 border-primary/40 bg-muted/20 py-2 px-4 italic text-muted-foreground rounded-r-lg">
                        {children}
                      </blockquote>
                    )
                  },
                  h1({ children }) {
                    return <h1 className="mt-6 mb-3 text-xl font-bold text-foreground border-b pb-2">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="mt-5 mb-2.5 text-lg font-semibold text-foreground">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="mt-4 mb-2 text-base font-semibold text-foreground">{children}</h3>
                  },
                  ul({ children }) {
                    return <ul className="my-2 list-disc pl-5 space-y-1 text-muted-foreground">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="my-2 list-decimal pl-5 space-y-1 text-muted-foreground">{children}</ol>
                  },
                  li({ children }) {
                    return <li className="leading-6">{children}</li>
                  },
                  p({ children }) {
                    return <p className="my-2 text-muted-foreground leading-6">{children}</p>
                  },
                  hr() {
                    return <hr className="my-6 border-border" />
                  },
                }}
              >
                {activeDoc.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
