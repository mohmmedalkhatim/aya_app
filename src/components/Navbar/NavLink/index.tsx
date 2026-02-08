import { JSX } from "react"
import { Link } from "react-router-dom"

type icon =  JSX.Element

function NavLink({ name, url, }: { name: icon, url: string }) {
  return (
    <Link to={url} className="nav_link " >
      {name }
    </Link>
  )
}
export default NavLink