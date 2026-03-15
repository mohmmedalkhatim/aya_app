import DashboardHeader from "./components/header"
import Events from "./components/events"
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react"
import { fetch } from "@tauri-apps/plugin-http"
import { Data, useStore } from "../../context"
import { storage } from "../../main"
import { IconCloudCheck, IconCloudDataConnection, IconCloudOff } from "@tabler/icons-react"



let dataFetch = (access_token: String, setData: (data:Data) => void, setLoading: Dispatch<SetStateAction<boolean>>, setError: Dispatch<SetStateAction<string>>) => {
  return () => {
    setLoading(true)
    fetch("http://localhost:4000", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${access_token}`
      },
    }).then((data) => {
      if (data) {
        data.json().then((data: Data) => {
          storage.set("data", data)
          setData(data)
        })
      }
    }).catch(err => {
      setError(err)
    }).finally(() => {
      setLoading(false)
    })
  }
}

export function Home() {
  let access_token = useStore(state => state.keys.access_token)
  let [loading, setLoading] = useState(false)
  let [Error, setError] = useState("")
  let setData = useStore(state => state.setData)
  useEffect(dataFetch(access_token, setData, setLoading, setError), [])

  return (
    <main className="container">
      <div className="fixed top-8 right-20 z-60">
        {loading ? <IconCloudDataConnection /> : Error !== "" ? <IconCloudOff /> : <IconCloudCheck />}
      </div>
      <DashboardHeader />
      <Events />
    </main>
  )
}