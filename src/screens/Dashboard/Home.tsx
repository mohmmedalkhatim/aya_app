import DashboardHeader from "./components/header"
import MedicationLog from "./components/MedicationLog"
import { useEffect, useState } from "react"
import ScanDialog from "./components/scan_dialog"
import { useAsync } from "react-use"
import { Channel, invoke } from "@tauri-apps/api/core"
import { MedicitionRecord, Record } from "../../medicition_tracker"
import dayjs from "dayjs"
import { Data, useStore } from "../../context"
import { time } from "@tensorflow/tfjs-core"
import { EventModel } from "../../components/event_form"


let generate_record = (info: Data, active: string): Record => {
  let list: MedicitionRecord[] = []
  info.dosages.map((med) => {
    list.push({ ...med, times: [...med.times.map(item => ({ time: item, taken: false }))] })
  })

  let data: Record = {
    date: active,
    medictions_records: {
      list
    },
    sugar_levels: {},
  }
  return data
}

export default function Dashboard() {
  let [open, setOpen] = useState(false)
  let [record, setRecord] = useState<Record | undefined>()
  let [active, setActive] = useState(dayjs().startOf("D").format())
  let info = useStore(state => state.data)
  useAsync(async () => {
    let channel = new Channel<Record>((model) => {
      setRecord(model)
    })
    let data = generate_record(info, active)
    await invoke("records_control", { channel, payload: { command: "get_one_by_date", date: active } }).then(err => {
    }).then(e => {
      console.log(e)
    }).catch((err) => {

      if (err == "couldn't find the function") {
        invoke("records_control", {
          channel, payload: {
            command: "create",
            data
          }
        }).then(res =>
          console.log(res)
        ).catch(err =>
          console.error(err)
        )
      }
    })
  }, [active])
  useAsync(async () => {
    let channel = new Channel<Record>((model) => {
      setRecord(model)
    })

    let data = generate_record(info, active)
    await invoke("records_control", { channel, payload: { command: "update_one", date: active, data } }).then(err => {
    }).then(e => {
      console.log(e)
    }).catch((err) => {
      if (err == "couldn't find the function") {
        invoke("records_control", {
          channel, payload: {
            command: "create",
            data
          }
        }).then(res =>
          console.log(res)
        ).catch(err =>
          console.error(err)
        )
      }
    })
  }, [info])
  useAsync(async () => {
    let channel = new Channel<Record>((model) => {
      console.log(model)
    })
    await invoke("records_control", { channel, payload: { command: "update_one", date: active, data:record } }).then(err => {
    }).then(e => {
    }).catch(err=>{
      console.error(err)
    })
  }, [record])

  if (record) {
    return (
      <>
        <main className="container">
          <DashboardHeader setActiveRecord={setActive} open_scan={() => setOpen(true)} />
          <MedicationLog record={record} setRecord={setRecord} />
          <ScanDialog open={open} onClose={() => setOpen(false)} />
        </main></>
    )
  }
}