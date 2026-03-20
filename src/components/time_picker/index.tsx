import dayjs from "dayjs"
import { number } from "motion/react";
import { useEffect, useRef, useState } from "react"

interface TimePicker {
    onChange: (date: string) => void;
    placeholder?: string
    label?: string
    value: string
}

function TimePicker(props: TimePicker) {
    let [date, setDate] = useState(dayjs().startOf("D").format("HH:MM"))
    let [intervel, setInterval] = useState<"PM" | "AM">("AM")
    let [hour, setHour] = useState<number | undefined>(0)
    let [Minent, setMinet] = useState<number | undefined>(0)
    let [IsOpen, setIsOpen] = useState(false)
    let timePickerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let temp = dayjs().startOf("D").add(Number(hour), "h").add(Number(Minent), "m").add(intervel == "PM" ? 12 : 0, "h")
        setDate(temp.format("HH:mm"))
        console.log(temp.format())
        props.onChange(temp.format())
    }, [hour, Minent, intervel])
    return (
        <div className="relative">
            {props.label && (
                <label className="text-sm flex 0 -translate-y-1 translate-x-2 font-medium relative">

                    {props.label}
                </label>
            )}
            <div onClick={() => setIsOpen(true)} className="focus:border-sky-400 p-3 focus:border-2 border rounded-md cursor-pointer">
                {date + " " + intervel}
            </div>
            {/* Timepicker */}
            {IsOpen &&
                <div className="rounded  translate-y-2 shadow flex flex-col gap-3  absolute w-full bg-white" ref={timePickerRef}>
                    <div className="border-b flex gap-2 py-2 items-center justify-center">
                        <div>
                            {date}
                        </div>
                        <div>
                            {intervel}
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="overflow-auto flex flex-col px-3 gap-1 h-50 grow" >
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div onClick={() => setHour(index + 1)} className="border rounded p-2">
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                        <div className="overflow-auto flex flex-col px-3 gap-1  h-50 grow">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div onClick={() => setMinet(((index) * 5))} className="border rounded p-2">
                                    {(index * 5)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center p-3 gap-2  ">
                        <div className="flex grow p-2 items-center rounded transition-colors duration-200 justify-center bg-sky-400 border" style={{ background: intervel == "PM" ? "oklch(74.6% 0.16 232.661)" : "white", color: intervel == "PM" ? "white" : "black" }} onClick={() => setInterval("PM")}>PM</div>
                        <div className="flex grow p-2 items-center rounded transition-colors duration-200 justify-center bg-sky-400 border" style={{ background: intervel == "AM" ? "oklch(74.6% 0.16 232.661)" : "white", color: intervel == "AM" ? "white" : "black" }} onClick={() => setInterval("AM")}>AM</div>
                    </div>
                </div>
            }
        </div>
    )
}
export default TimePicker
