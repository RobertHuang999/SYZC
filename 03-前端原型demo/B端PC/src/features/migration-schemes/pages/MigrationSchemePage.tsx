import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  BookOpenIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CopyIcon,
  FileCodeIcon,
  FileTextIcon,
  FolderGit2Icon,
  LayersIcon,
  ListTreeIcon,
  SparklesIcon,
  UserCheckIcon,
} from "lucide-react"
import {
  type MigrationDocumentItem,
  migrationDocuments,
  migrationDocumentByPathMap,
  migrationDocumentMap,
} from "../data/migration-documents"
import { MermaidDiagram } from "@/shared/components/MermaidDiagram"

interface TocItem {
  id: string
  text: string
  level: number
}

export function MigrationSchemePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [copied, setCopied] = useState(false)
  const [activeHeadingId, setActiveHeadingId] = useState<string>("")

  // 根据当前路由或参数匹配当前激活文档
  const currentDoc: MigrationDocumentItem = useMemo(() => {
    // 1. 先通过 URL 完整路径匹配
    const decodedPath = decodeURIComponent(location.pathname).replace(/\/$/, "")
    const matchedByPath = migrationDocumentByPathMap.get(decodedPath)
    if (matchedByPath) return matchedByPath

    // 2. 如果存在路由参数 id
    if (params.id && migrationDocumentMap.has(params.id)) {
      return migrationDocumentMap.get(params.id)!
    }

    // 3. 模糊匹配子路径
    const found = migrationDocuments.find(
      (doc) => decodedPath.includes(doc.id) || decodedPath.includes(encodeURIComponent(doc.shortTitle))
    )
    if (found) return found

    // 默认展示第一篇（或三旧模块说明）
    return migrationDocuments[0]
  }, [location.pathname, params.id])

  // 当前文档在列表中的索引与上下篇
  const currentIndex = useMemo(() => {
    return migrationDocuments.findIndex((d) => d.id === currentDoc.id)
  }, [currentDoc])

  const prevDoc = currentIndex > 0 ? migrationDocuments[currentIndex - 1] : null
  const nextDoc = currentIndex < migrationDocuments.length - 1 ? migrationDocuments[currentIndex + 1] : null

  // 提取 Markdown 中的目录大纲（TOC）
  const tocList: TocItem[] = useMemo(() => {
    if (!currentDoc.content) return []
    const lines = currentDoc.content.split("\n")
    const headings: TocItem[] = []

    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const rawText = match[2].trim().replace(/[*`_]/g, "")
        // 过滤部分非正文标题
        const cleanId = `heading-${rawText.replace(/[^\w\u4e00-\u9fa5]/g, "-").toLowerCase()}`
        headings.push({
          id: cleanId,
          text: rawText,
          level,
        })
      }
    })
    return headings
  }, [currentDoc.content])

  // 监听滚动更新当前目录高亮
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = tocList
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[]

      const scrollPosition = window.scrollY + 140

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i]
        if (el.offsetTop <= scrollPosition) {
          setActiveHeadingId(el.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [tocList])

  const handleCopyMarkdown = () => {
    if (currentDoc?.content) {
      navigator.clipboard.writeText(currentDoc.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveHeadingId(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* 顶部方案总览与快捷切换 Header */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <FolderGit2Icon className="size-3.5" />
                6.2 版本割接总控方案
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                <SparklesIcon className="size-3" />
                {currentDoc.badge}
              </span>
              <span className="rounded-md border bg-muted/60 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                {currentDoc.version}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpenIcon className="size-5 text-primary" />
              {currentDoc.title}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentDoc.description}
            </p>
          </div>

          {/* 右侧操作栏 */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">已复制 Markdown 源码</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5" />
                  <span>复制 Markdown 源码</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 方案文档快捷切换 Tab Strip */}
        <div className="mt-4 border-t pt-3.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-xs font-medium text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
              <FileCodeIcon className="size-3.5" /> 方案导航:
            </span>
            {migrationDocuments.map((doc, idx) => {
              const isActive = doc.id === currentDoc.id
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => navigate(doc.routePath)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="font-mono opacity-70">0{idx + 1}.</span>
                  <span>{doc.shortTitle}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 主体两栏布局：左侧 Markdown 渲染区，右侧 TOC 目录导航 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* 左侧文档阅读器 (9列) */}
        <div className="space-y-6 lg:col-span-9">
          <div className="rounded-xl border bg-card p-6 lg:p-8 shadow-sm">
            {/* 文档元信息条 */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1">
                  <UserCheckIcon className="size-3.5 text-primary/70" />
                  <span>责任人：{currentDoc.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="size-3.5 text-primary/70" />
                  <span>编制日期：{currentDoc.updatedAt}</span>
                </span>
                <span className="flex items-center gap-1">
                  <LayersIcon className="size-3.5 text-primary/70" />
                  <span>分类：{currentDoc.category}</span>
                </span>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground/80">
                源文件：{currentDoc.filePath}
              </div>
            </div>

            {/* Markdown 正文渲染 */}
            <article className="prose prose-slate max-w-none text-sm leading-relaxed dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    const isMermaid = match && match[1] === "mermaid"
                    if (isMermaid) {
                      return (
                        <div className="my-5 not-prose">
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
                    return <thead className="bg-muted/70 border-b">{children}</thead>
                  },
                  th({ children }) {
                    return <th className="p-2.5 font-semibold text-foreground">{children}</th>
                  },
                  td({ children }) {
                    return <td className="p-2.5 border-b text-muted-foreground">{children}</td>
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="my-4 border-l-4 border-primary/60 bg-muted/30 py-2.5 px-4 text-xs italic text-muted-foreground rounded-r-lg">
                        {children}
                      </blockquote>
                    )
                  },
                  h1({ children }) {
                    const text = String(children).replace(/[*`_]/g, "")
                    const id = `heading-${text.replace(/[^\w\u4e00-\u9fa5]/g, "-").toLowerCase()}`
                    return (
                      <h1
                        id={id}
                        className="mt-8 mb-4 scroll-mt-20 text-xl font-bold text-foreground border-b pb-2.5 flex items-center gap-2"
                      >
                        <span className="h-4 w-1 bg-primary rounded-full inline-block"></span>
                        {children}
                      </h1>
                    )
                  },
                  h2({ children }) {
                    const text = String(children).replace(/[*`_]/g, "")
                    const id = `heading-${text.replace(/[^\w\u4e00-\u9fa5]/g, "-").toLowerCase()}`
                    return (
                      <h2
                        id={id}
                        className="mt-6 mb-3 scroll-mt-20 text-base font-bold text-foreground flex items-center gap-2"
                      >
                        {children}
                      </h2>
                    )
                  },
                  h3({ children }) {
                    const text = String(children).replace(/[*`_]/g, "")
                    const id = `heading-${text.replace(/[^\w\u4e00-\u9fa5]/g, "-").toLowerCase()}`
                    return (
                      <h3
                        id={id}
                        className="mt-5 mb-2 scroll-mt-20 text-sm font-semibold text-foreground"
                      >
                        {children}
                      </h3>
                    )
                  },
                  ul({ children }) {
                    return <ul className="my-2.5 list-disc pl-5 space-y-1.5 text-muted-foreground text-xs">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="my-2.5 list-decimal pl-5 space-y-1.5 text-muted-foreground text-xs">{children}</ol>
                  },
                  li({ children }) {
                    return <li className="leading-6">{children}</li>
                  },
                  p({ children }) {
                    return <p className="my-2.5 text-muted-foreground text-xs leading-6">{children}</p>
                  },
                  hr() {
                    return <hr className="my-6 border-border" />
                  },
                }}
              >
                {currentDoc.content}
              </ReactMarkdown>
            </article>

            {/* 底部翻页控制器 */}
            <div className="mt-10 flex items-center justify-between border-t pt-5">
              {prevDoc ? (
                <button
                  type="button"
                  onClick={() => navigate(prevDoc.routePath)}
                  className="flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-primary cursor-pointer"
                >
                  <ChevronLeftIcon className="size-4" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted-foreground/70">上一篇</div>
                    <div className="font-semibold text-foreground">{prevDoc.shortTitle}</div>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextDoc ? (
                <button
                  type="button"
                  onClick={() => navigate(nextDoc.routePath)}
                  className="flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-primary cursor-pointer"
                >
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground/70">下一篇</div>
                    <div className="font-semibold text-foreground">{nextDoc.shortTitle}</div>
                  </div>
                  <ChevronRightIcon className="size-4" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        {/* 右侧目录大纲 TOC (3列，粘性吸顶) */}
        <div className="space-y-4 lg:col-span-3 sticky top-6">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-3 font-semibold text-xs text-foreground">
              <ListTreeIcon className="size-4 text-primary" />
              <span>本页大纲目录 (TOC)</span>
            </div>

            <div className="mt-3 max-h-[calc(100vh-14rem)] overflow-y-auto space-y-1 pr-1 text-xs">
              {tocList.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  暂无多级标题
                </div>
              ) : (
                tocList.map((item) => {
                  const isActive = activeHeadingId === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      className={`block w-full text-left truncate rounded-md py-1.5 transition-colors cursor-pointer ${
                        item.level === 1
                          ? "px-2 font-semibold text-foreground text-xs"
                          : item.level === 2
                          ? "pl-4 pr-2 font-normal text-muted-foreground text-[11px]"
                          : "pl-6 pr-2 font-normal text-muted-foreground/80 text-[11px]"
                      } ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                          : "hover:bg-muted hover:text-foreground"
                      }`}
                      title={item.text}
                    >
                      {item.text}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* 方案版本与状态卡片 */}
          <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-xs space-y-2">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <FileTextIcon className="size-3.5 text-primary" />
              <span>6.2 迁移割接说明</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              本文档由森云科技 AI PM 工作流沉淀，已通过 6.2 架构双引擎与动态等级评审，可直接供产研与测试作为割接基准。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
