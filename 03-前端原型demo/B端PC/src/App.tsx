import { AppRoutes } from "@/routes"
import { HashRouter } from "react-router-dom"

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}

export default App
