import { Outlet, useNavigate } from "react-router-dom"
import Header from "./components/Header"
// @ts-ignore
import "./index.css"
import FloatingButton from "./components/floating_button"
import { useStore } from "./context"
import { useEffect } from "react"


function App() {
  let access_token = useStore(state => state.keys.access_token)
  let login = access_token !== "";
  let navigate = useNavigate()
  useEffect(() => {
    if (login) {
      navigate("/")
    } else {
      navigate("/sign_in")
    }
  }, [access_token])
  return login ? (
    <>
      <Header />
      <Outlet />
      <FloatingButton />
    </>
  ) : <Outlet />
}
export default App