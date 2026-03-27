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
    let [open, setOpen] = useState({
        medication_dialog: false,

    })
    let add_mediaction = useStore(state => state.add_med)
    let token = useStore(state => state.keys).access_token
    let [search, setSearch] = useState("")
    return (
        <>
            <div className="fixed bottom-0  gap-3 z-50 mx-5 flex w-full rounded-t-2xl border p-4 items-center bg-white ">
                <div className="grow">
                    <Input onChange={(e) => setSearch(e.target.value)} className="bg-white placeholder:text-[16px] text-[16px] placeholder:capitalize" rightSection={<Link to={`/medicine/search/${search}`}><IconSearch size={"1.2rem"} color="gray" /></Link>} size="xl" placeholder={"search for medicen side effcet"} />
                </div>
                <div>
                    <div className="bg-sky-400 p-3 rounded-md border cursor-pointer hover:ring-2 ring-gray-400"
                        onClick={() => setOpen((prv) => ({
                            ...prv,
                            medication_dialog: true,
                        }))}>
                        <IconPlus size={"1.5rem"} color="white" />
                    </div>

                </div>
            </div>
            <AnimatePresence>
                {open.medication_dialog && (
                    <motion.dialog open={open.medication_dialog} onClose={() => setOpen((prv) => ({
                        ...prv,
                        medication_dialog: true,
                    }))} className="fixed inset-0 w-full top-20 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0, translateY: "2rem" }} animate={{ opacity: 1, translateY: "0rem" }} exit={{ opacity: 0 }}>
                        <Event_form onCancel={() =>
                            setOpen((prv) => ({
                                ...prv,
                                medication_dialog: false,
                            }))} onSubmit={async (form) => {
                                add_mediaction({ ...form }, token)
                            }} />
                    </motion.dialog>
                )}
            </AnimatePresence>
        </>
    )
}
export default FloatingButton