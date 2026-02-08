import { IconCalculator, IconCalendar, IconCalendarEvent, IconDashboard, IconHome, IconUser } from "@tabler/icons-react"
import NavLink from "./NavLink/index"
import { useState } from "react"

let list = [
  { name: <IconDashboard size={"1.8rem"} />, url: "/" },
  { name: <IconCalendarEvent size={"1.8rem"} />, url: "/calendar" },
  { name: <IconCalculator size={"1.8rem"} />, url: "/calculator" },
  { name: <IconUser size={"1.8rem"} />, url: "/profile" },
]


function Navbar() {
  let [active, setActive] = useState("/")
  return (
    <div className="py-4 fixed z-40 bg-white bottom-0  left-0 border-t justify-around gap-1 w-screen px-3 flex ">
      {list.map(item => (<div className="h-full rounded flex items-center justify-center" onClick={()=>setActive(item.url)} style={{background:item.url === active?"#20202020":""}}>
        <NavLink  name={item.name} url={item.url} />
      </div>))}
    </div>
  )
}
export default Navbar