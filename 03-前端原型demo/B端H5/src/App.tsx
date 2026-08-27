import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "@/routes"
import { AppAnnotationWrapper } from "@/shared/annotations/AppAnnotationWrapper"

function App() {
  return (
    <BrowserRouter>
      <AppAnnotationWrapper>
        <AppRoutes />
      </AppAnnotationWrapper>
    </BrowserRouter>
  )
}

export default App

