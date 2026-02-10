import { useState } from "react"
import { storage } from "../../main"
import { useAsync } from "react-use"
import DashboardHeader from "./components/header"
import Events from "./components/events"

export function Home() {
  let [schoolName, setSchoolName] = useState<null | undefined | string>()
  useAsync(async () => {
    storage.get<string | undefined | null>("school").then((res) => {
      if (res == null || res == undefined) {
        storage.set('school', "hello write you school name here")
      }
      setSchoolName(res)
    })
  }, [])
  return (
    <main className="container">
      <DashboardHeader/>
      <Events/>
    </main>
  )
}