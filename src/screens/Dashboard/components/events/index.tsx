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
]

function Events() {
  let today = dayjs().hour();
  return (
    <div className="flex pt-4 gap-3">
      <div className="flex translate-y-3">
        <div className="border translate-x-[5px]"></div>
        <div className="gap-20 flex flex-col z-10">
          {Array.from({ length: today }).map(item => (<div className="rounded-full w-2 h-2 bg-sky-500"></div>))}
        </div>
      </div>
      <div className="flex flex-col  gap-20 grow">
        {events.map((item, i) => (<div className="bg-sky-100 px-2 py-4 border border-l-5 rounded border-l-sky-500" >{item.title}</div>))}
      </div>
    </div>
  )
}
export default Events