import dayjs from "dayjs"
import day from "dayjs"
let events = [
  {
    title: "math exam",
    date: "2024-06-20"
  },
  {
    title: "english exam",
    date: "2024-06-21"
  },

  {
    title: "english exam",
    date: "2024-06-22"
  },

  {
    title: "english exam",
    date: "2024-06-23"
  },

  {
    title: "english exam",
    date: "2024-06-23"
  },

  {
    title: "english exam",
    date: "2024-06-23"
  },

  {
    title: "english exam",
    date: "2024-06-23"
  },

]

function Events() {
  let today = (25 - dayjs().hour());
  let minute = day().minute();
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
          {Array.from({ length: today }).map((_, index) => (
            <div className="relative">
              <div className="absolute -translate-x-3  translate-y-4 text-xs bg-white z-10" style={{ letterSpacing: "1px" }}>{dayjs().add(index, "h").format("HH:00")}</div>
              <div className="rounded-full w-2 h-2 bg-sky-500"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col grow ">
        {
          events.map(
            (item, _) => (
              <div className="border-b relative h-[89px]">
                <div className="bg-sky-400 absolute w-full text-sky-50 px-2 py-4 border border-l-5 rounded border-l-sky-200" >
                  {item.title}
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}
export default Events