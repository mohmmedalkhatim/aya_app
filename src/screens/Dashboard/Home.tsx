import DashboardHeader from "./components/header"
import Events from "./components/events"
import { useState } from "react"
import ScanDialog from "./components/scan_dialog"


export function Home() {
  let [open, setOpen] = useState(false)

  return (
    <>
      <main className="container">
        <DashboardHeader open_scan={() => setOpen(true)} />
        <Events />
        <ScanDialog open={open} onClose={() => setOpen(false)} />
      </main></>
  )
}