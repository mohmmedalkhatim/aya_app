import { IconChevronLeft, IconChevronRight, IconDropletFilled, IconScan } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useState } from "react"
import { Button } from "../../../../components/Button/Button"

let days = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"]

function DashboardHeader({ open_scan }: { open_scan: () => void }) {
    let [suger, setSuger] = useState(69)
    let [date, setDate] = useState(dayjs())
    return (
        <div className="flex  w-full top-40  rounded py-4 justify-between px-4 border">
            <Button variant="ghost" size="action" ><IconChevronLeft /></Button>
            <div className="flex justify-between grow gap-1 ">
                {days.map((name, index) => (
                    <div className={`${index == dayjs().day() && "bg-sky-400"} leading-4 text-gray-700 py-2  w-1/7 hover:bg-gray-300 cursor-pointer rounded  items-center flex flex-col`}>
                        <div className="text-lg font-semibold " >{date.startOf("week").add(index, "day").date()}</div>
                        <div className="text-[13px] ">
                            {name}
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="ghost" size="action"><IconChevronRight /></Button>
        </div>
    )
}
export default DashboardHeader