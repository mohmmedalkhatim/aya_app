import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import "./index.css"
import Navbar from "./components/Navbar"

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </>
  )
}
export default App