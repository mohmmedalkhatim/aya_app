import dayjs from "dayjs"
import { number } from "motion/react";
import { useEffect, useRef, useState } from "react"

interface TimePicker {
    onChange: (data: string) => void;
    placeholder?: string
    value:string
}

function TimePicker(props: TimePicker) {
    let [data, setData] = useState(dayjs().startOf("D").startOf("h").format("HH:MM"))
    let [intervel, setInterval] = useState<"PM" | "AM">("AM")
    let [hour, setHour] = useState<number | undefined>()
    let [Minent, setMinet] = useState<number | undefined>()
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

    },)
    useEffect(() => {
        props.onChange(dayjs().add(Number(hour), "h").add(Number(Minent), "h").format())
    }, [hour, Minent, intervel])
    return (
        <div className="relative">
            <div onClick={() => setIsOpen(true)} className="focus:border-sky-400 focus:border-2 border hover:border-2 cursor-pointer">
                {props.value}
            </div>
            {/* Timepicker */}
            {IsOpen &&
                <div className="rounded  translate-y-2 shadow flex flex-col gap-3  absolute w-full bg-white" ref={timePickerRef}>
                    <div className="border-b flex gap-2 py-2 items-center justify-center">
                        <div>
                            {data}
                        </div>
                        <div>
                            {intervel}
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="overflow-auto flex flex-col px-3 gap-1 h-80 grow" >
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div onClick={() => setHour(index + 1)} className="border rounded p-2">
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                        <div className="overflow-auto flex flex-col px-3 gap-1  h-80 grow">
                            {Array.from({ length: 60 }).map((_, index) => (
                                <div onClick={() => setMinet(index + 1)} className="border rounded p-2">
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default TimePicker
