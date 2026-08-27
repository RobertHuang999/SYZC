import { AppRoutes } from "@/routes"
import { BrowserRouter, HashRouter } from "react-router-dom"

const Router =
  typeof window !== "undefined" && window.location.protocol === "file:"
    ? HashRouter
    : BrowserRouter

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
