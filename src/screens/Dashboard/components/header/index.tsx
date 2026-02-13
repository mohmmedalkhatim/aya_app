import { IconDropletFilled, IconScan } from "@tabler/icons-react"
import { useState } from "react"

function DashboardHeader() {
    let [suger,setSuger] = useState(69)
    return (
        <div className="flex items-center justify-between w-full p-4 border">
            <div className="flex items-center gap-2">
                <IconDropletFilled size={"1.2rem"} color="red" />
                <div className=" text-xl ">
                    {suger}
                </div>
            </div>
            <IconScan />
        </div>
    )
}
export default DashboardHeader