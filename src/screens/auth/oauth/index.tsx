import { listen } from "@tauri-apps/api/event"
import { useEffect } from "react"
import { storage } from "../../../main"
import { useNavigate } from "react-router-dom"

function Oauth() {
  let navgiate = useNavigate()
  useEffect(() => {
    listen("token", (e) => {
      storage.set("keys", { access_token: e.payload })
    }).then(() => {
      navgiate("/")
    })
  })
  return (
    <div>Oauth</div>
  )
}
export default Oauth