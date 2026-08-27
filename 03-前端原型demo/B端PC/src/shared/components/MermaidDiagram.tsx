import mermaid from "mermaid"
import { useEffect, useId, useRef, useState } from "react"
import { Maximize2Icon } from "lucide-react"

let isInitialized = false

function ensureMermaidInitialized() {
  if (isInitialized) {
    return
  }
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      darkMode: false,
      background: "#ffffff",
      primaryColor: "#f3f4f6",
      primaryTextColor: "#111827",
      primaryBorderColor: "#9ca3af",
      lineColor: "#38bdf8",
      secondaryColor: "#ffffff",
      tertiaryColor: "#f9fafb",
      clusterBkg: "#f8fafc",
      clusterBorder: "#cbd5e1",
      defaultLinkColor: "#38bdf8",
      titleColor: "#0f172a",
      edgeLabelBackground: "#ffffff",
      nodeBorder: "#9ca3af",
      mainBkg: "#f3f4f6",
      fontSize: "12px",
      fontFamily: "Geist, system-ui, -apple-system, sans-serif",
    },
    securityLevel: "loose",
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 12,
      useMaxWidth: true,
    },
  })
  isInitialized = true
}

export function isMermaidCode(text: string): boolean {
  if (!text) return false
  const trimmed = text.trim()
  if (trimmed.startsWith("```mermaid")) return true
  const lines = trimmed.split("\n")
  const firstLine = lines[0].trim()
  return (
    firstLine.startsWith("flowchart ") ||
    firstLine.startsWith("flowchart\n") ||
    firstLine.startsWith("graph ") ||
    firstLine.startsWith("sequenceDiagram") ||
    firstLine.startsWith("stateDiagram") ||
    firstLine.startsWith("classDiagram") ||
    firstLine.startsWith("erDiagram")
  )
}

export function cleanMermaidCode(text: string): string {
  let cleaned = text.trim()
  if (cleaned.startsWith("```mermaid")) {
    cleaned = cleaned.replace(/^```mermaid\s*/, "")
    cleaned = cleaned.replace(/\s*```$/, "")
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "")
    cleaned = cleaned.replace(/\s*```$/, "")
  }
  return cleaned.trim()
}

export function MermaidDiagram({
  chart,
  className,
}: {
  chart: string
  className?: string
}) {
  const rawId = useId()
  const diagramId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`
  const [svgHtml, setSvgHtml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const code = cleanMermaidCode(chart)

  useEffect(() => {
    let active = true
    ensureMermaidInitialized()

    const renderChart = async () => {
      try {
        const renderId = `${diagramId}-${Date.now()}`
        const { svg } = await mermaid.render(renderId, code)
        if (active) {
          setSvgHtml(svg)
          setError(null)
        }
      } catch (err: unknown) {
        if (active) {
          console.warn("Mermaid rendering failed:", err)
          setError(err instanceof Error ? err.message : String(err))
        }
      }
    }

    renderChart()

    return () => {
      active = false
    }
  }, [code, diagramId])

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 text-xs text-rose-800">
        <div className="font-semibold text-rose-700">流程图渲染异常</div>
        <pre className="mt-1 overflow-x-auto whitespace-pre font-mono text-[11px] text-muted-foreground">
          {code}
        </pre>
      </div>
    )
  }

  if (!svgHtml) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border bg-muted/20 text-xs text-muted-foreground">
        正在渲染流程图...
      </div>
    )
  }

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${className ?? ""}`}
      >
        <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border bg-white/90 px-2 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur hover:bg-muted hover:text-foreground"
            onClick={() => setIsModalOpen(true)}
            title="放大查看流程图"
          >
            <Maximize2Icon className="size-3.5" />
            <span>放大</span>
          </button>
        </div>
        <div
          ref={containerRef}
          className="flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative flex h-[min(90vh,48rem)] w-[min(90vw,72rem)] max-w-[90vw] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">流程图全景视图</h3>
              <button
                type="button"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div
              className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-8 [&_svg]:h-auto [&_svg]:max-h-[70vh] [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          </div>
        </div>
      )}
    </>
  )
}
