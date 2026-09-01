import { HashRouter } from "react-router-dom"
import { AppRoutes } from "@/routes"
import { AppAnnotationWrapper } from "@/shared/annotations/AppAnnotationWrapper"

function App() {
  return (
    <HashRouter>
      <AppAnnotationWrapper>
        <AppRoutes />
      </AppAnnotationWrapper>
    </HashRouter>
  )
}

export default App
