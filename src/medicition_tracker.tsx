import dayjs from "dayjs";
import { storage } from "./main";
import { Channel, invoke } from "@tauri-apps/api/core";
import { EventModel } from "./components/event_form";


export interface MedicitionRecord extends Omit<EventModel, "times"> {
    times: { time: string, taken: boolean }[]
}
export interface Record {
    date: string,
    medictions_records: {
        list: MedicitionRecord[]
    },
    sugar_levels: {

    },
}


export async function medicition_tracker() {
    let lastRecord = await storage.get<String>("last_record_date");
    let channel = new Channel(() => {

    })
    if (!lastRecord || lastRecord !== dayjs().startOf("D").format()) {
        let info = await storage.get<{ dosages: EventModel[] }>("information")
        if (info) {
            let list: MedicitionRecord[] = []
            info.dosages.map((med) => {
                list.push({ ...med, times: [...med.times.map(item => ({ time: item, taken: false }))] })
            })
            let data: Record = {
                date: dayjs().startOf("D").format(),
                medictions_records: {
                    list
                },
                sugar_levels: {},
            }
            await invoke("records_control", {
                channel, payload: {
                    command: "create",
                    data
                }
            }).then(res =>
                console.log(res)
            ).catch(err =>
                console.log(err)
            )
            storage.set("todays_record", data)
        }
    } else {

    }

    storage.set("last_record_date", dayjs().startOf("D").format())
}