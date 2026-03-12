import { IconPlus, IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Event_form from "../event_form"
import dayjs from "dayjs"
import { useStore } from "../../context"
import Input from "../Input"
import { Link } from "react-router-dom"


let create_formated_date = (str?: string) => {
    let arr = str?.split(":") || [];
    return dayjs().startOf("day").add(Number(arr[0]), "h").add(Number(arr[1]), "m")
}

function FloatingButton() {
    let [open, setOpen] = useState(false)
    let add_mediaction = useStore(state => state.add_med)
    let [search, setSearch] = useState("")
    return (
        <>
            <div className="fixed bottom-0 gap-3 z-50 mx-5 flex w-full rounded-t-2xl border p-4 items-center bg-white ">
                <div className="grow">
                    <Input onChange={(e) => setSearch(String(e))} className="bg-white placeholder:text-[16px] text-[16px] placeholder:capitalize" rightSection={<Link to={`/medicine/search/${search}`}><IconSearch size={"1.2rem"} color="gray" /></Link>} size="xl" placeholder={"search for medicen side effcet"} />
                </div>
                <div className=" bg-sky-400 p-3.5 rounded-lg border" onClick={() => setOpen(true)}><IconPlus size={"1.8rem"} color="white" /></div>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 w-full top-20 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0, translateY: "2rem" }} animate={{ opacity: 1, translateY: "0rem" }} exit={{ opacity: 0 }}>
                        <Event_form onCancel={() =>
                            setOpen(false)} onSubmit={async (form) => {
                                let date = create_formated_date(form.time);
                                add_mediaction({ ...form, time: date.format() })
                            }} />
                    </motion.dialog>
                )}
            </AnimatePresence>
        </>
    )
}
export default FloatingButton