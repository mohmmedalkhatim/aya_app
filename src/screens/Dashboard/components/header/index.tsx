import { IconDropletFilled, IconScan } from "@tabler/icons-react"
import { useState } from "react"

function DashboardHeader() {
    let [suger, setSuger] = useState(69)
    return (
        <div className="flex items-center justify-between w-full rounded p-4 border">
            <div className="flex items-center gap-2">
                <IconDropletFilled size={"1.2rem"} color="red" />
                <div className=" text-xl ">
                    {suger}
                </div>
            </div>
            <button className="hover:bg-gray-400/20 p-1 cursor-pointer rounded">
                <IconScan />
            </button>
        </div>
    )
}
export default DashboardHeader