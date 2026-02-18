import DashboardHeader from "./components/header"
import Events from "./components/events"

export function Home() {

  return (
    <main className="container">
      <DashboardHeader/>
      <Events/>
    </main>
  )
}