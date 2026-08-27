import { BrowserRouter, HashRouter } from "react-router-dom"
import { AppRoutes } from "@/routes"
import { AppAnnotationWrapper } from "@/shared/annotations/AppAnnotationWrapper"

const Router =
  typeof window !== "undefined" && window.location.protocol === "file:"
    ? HashRouter
    : BrowserRouter

function App() {
  return (
    <Router>
      <AppAnnotationWrapper>
        <AppRoutes />
      </AppAnnotationWrapper>
    </Router>
  )
}

export default App

