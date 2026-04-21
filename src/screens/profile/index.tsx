import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../../context"
import { Button } from "../../components/Button/Button"
import { IconUser } from "@tabler/icons-react"
import { Heading } from "../../components/heading"
import { storage } from "../../main"
import { deleteSecret } from "tauri-plugin-keyring-api"
import { hostname } from "@tauri-apps/plugin-os"

function Profile() {
  let info = useStore(state => state.user_info)
  let setInfo = useStore(state => state.setInfo)
  let navigate = useNavigate()
  let logout = async () => {
    navigate("/login", { viewTransition: true, replace: true })
    let name = await hostname();
    storage.clear()
    await deleteSecret("aya.app", name as string)
    setInfo({ access_token: "" })
  }
  return (
    <main className="container flex flex-col gap-10 px-8">
      <div className="flex items-center gap-5">
        <div className=" rounded-full p-5 bg-sky-500">
          <IconUser size={"3rem"} color="white" />
        </div>
        <div>
          <Heading level={1}>
            {info.name}
          </Heading>
          <p className="text-gray-500/90 text-sm">
            {info.email}
          </p>
        </div>
      </div>
      <div className="px-4">
        <Button onClick={logout} className="w-full" variant="danger">
          logout
        </Button>
      </div>
    </main>
  )
}
export default Profile