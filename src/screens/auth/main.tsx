import { Outlet, useNavigate, useNavigation } from "react-router-dom"
import SignIn from "./screens/sign_in"
import { useStore } from "../../context"
import { useEffect } from "react"

function Auth() {
  let info = useStore(state => state.info)
  let nevigate = useNavigate()
  useEffect(() => {
    nevigate("/")
  }, [info.access_token])

  return (
    <Outlet />
  )
}
export default Auth