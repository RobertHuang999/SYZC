import { AppRoutes } from "@/routes"
import { HashRouter } from "react-router-dom"
import { IterationHighlightProvider } from "@/shared/components/IterationHighlight"

function App() {
  return (
    <HashRouter>
      <IterationHighlightProvider defaultVersion="6.3">
        <AppRoutes />
      </IterationHighlightProvider>
    </HashRouter>
  )
}

export default App
