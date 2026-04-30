import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Header from "./components/Header"
// @ts-ignore
import "./index.css"
import FloatingButton from "./components/floating_button"
import { useStore } from "./context"
import { useEffect, useState } from "react"


function App() {
  let access_token = useStore(state => state.keys.access_token)
  let navigate = useNavigate()
  let location = useLocation()
  useEffect(() => {
    const isAuthPage = location.pathname === "/sign_in"
    if (access_token == "" && !isAuthPage ) {
      navigate("/sign_in", { replace: true, viewTransition: true })
    } else if (access_token !== "" && isAuthPage) {
      navigate("/", { replace: true, viewTransition: true })
    }
  }, [access_token])
  return (<>
    <Header />
    <Outlet />
    <FloatingButton />
  </>)
}
export default App