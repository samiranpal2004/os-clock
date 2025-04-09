import { createRoot } from "react-dom/client"
import Clock from "../components/Clock"
import "../app/globals.css"

// For Chrome extension popup
const container = document.getElementById("root")
if (container) {
  const root = createRoot(container)
  root.render(<Clock />)
}
