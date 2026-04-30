import { IconChevronLeft, IconChevronRight, IconDropletFilled, IconScan } from "@tabler/icons-react"
import dayjs from "dayjs"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Button } from "../../../../components/Button/Button"

let days = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"]

function DashboardHeader({ open_scan, setActiveRecord }: { open_scan: () => void, setActiveRecord: Dispatch<SetStateAction<string>> }) {
    let [suger, setSuger] = useState(69)
    let [date, setDate] = useState(dayjs())
    useEffect(() => { }, [])
    return (
        <div className="flex  w-full top-40  rounded py-4 justify-between px-4 border">
            <Button variant="ghost" size="action" ><IconChevronLeft /></Button>
            <div className="flex justify-between grow gap-1 ">
                {days.map((name, index) => (
                    <Button key={index} onClick={()=>setActiveRecord(date.startOf("week").add(index, "day").format())} style={{ borderRadius: "none" }} variant={`${index == dayjs().day() ? "primary" : "ghost"}`} size="action" className={`h-full  leading-4 text-gray-700 w-1/7 hover:bg-gray-300 cursor-pointer rounded  `}>
                        <div className="flex flex-col text-xs">
                            <div className="text-[16px] font-semibold " >{date.startOf("week").add(index, "day").date()}</div>
                            <div className="text-[10px] ">
                                {name}
                            </div>
                        </div>
                    </Button>
                ))}
            </div>
            <Button variant="ghost" size="action"><IconChevronRight /></Button>
        </div>
    )
}
export default DashboardHeader