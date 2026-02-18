import dayjs from "dayjs"
import { useState } from "react";
import { useAsync, useInterval } from "react-use";
import { useStore } from "../../../../context";


function Events() {
  let [hour, setHour] = useState((25 - dayjs().hour()));
  let [minute, setMinute] = useState(dayjs().minute());
  let Medications = useStore((state) => state.list)
  let init = useStore((state) => state.init)
  useAsync(async () => {
    init()
  }, [])
  useInterval(() => {
    setHour(25 - dayjs().hour())
    setMinute(dayjs().minute())

  }, 60000)

  return (
    <div className="flex pt-4 gap-6 relative">
      <div className="absolute h-[89px] w-[96%]  flex items-center justify-center top-[19px] pl-4" >
        <div className="absolute bg-sky-500 w-2 h-2 left-[15px] rounded  z-14" style={{ top: `${(minute / 60) * 100}%` }}></div>
        <div className="w-full absolute border left-[17px]" style={{ top: `calc(${((minute) / 60) * 100}% + 3px)` }}>
        </div>
      </div>
      <div className="flex w-9 justify-center relative ">
        <div className="border translate-x-[5px]"></div>
        <div className="gap-20 flex flex-col z-10">
          {Array.from({ length: hour }).map((_, index) => (
            <div className="relative">
              <div className="absolute -translate-x-3  translate-y-4 text-xs bg-white z-10" style={{ letterSpacing: "1px" }}>{dayjs().add(index, "h").format("HH:00")}</div>
              <div className="rounded-full w-2 h-2 bg-sky-500"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col grow relative">
        {
          Medications?.map(
            (item, index) => {
              let date = dayjs(item.time)
              if (date.hour() < dayjs().hour()) return ""
              return (<div style={{ top: `${((date.hour() - dayjs().hour() )) * 89}px`, translate:`0 calc(89px/60*${date.minute()})`,zIndex:String(-index) }} className="bg-sky-400 absolute  w-full text-sky-50 px-2 py-4 border border-l-5 rounded border-l-sky-200" >
                {item.time}
              </div>)
            })
        }
      </div>
    </div>
  )
}
export default Events