import { Outlet, useNavigate, useNavigation } from "react-router-dom"
import SignIn from "./screens/sign_in"
import { useStore } from "../../context"
import { useEffect } from "react"

function Auth() {
  return (
    <Outlet />
  )
}
export default Auth