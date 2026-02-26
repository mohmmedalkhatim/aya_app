import { Outlet } from "react-router-dom"
import Header from "./components/Header"
// @ts-ignore
import "./index.css"
import FloatingButton from "./components/floating_button"


function App() {
  return (
    <>
      <Header />
      <Outlet />
      <FloatingButton/>
    </>
  )
}
export default App