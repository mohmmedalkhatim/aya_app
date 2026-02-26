import { Outlet, useNavigate } from "react-router-dom"
import Header from "./components/Header"
// @ts-ignore
import "./index.css"
import FloatingButton from "./components/floating_button"
import { useStore } from "./context"
import { useEffect } from "react"


function App() {
  let info = useStore(state => state.info)
  let nevigate = useNavigate()
  useEffect(() => {
    nevigate("/")
  }, [info.access_token])
  return (
    <>
      <Header />
      <Outlet />
      <FloatingButton />
    </>
  )
}
export default App