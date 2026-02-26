import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Event_form from "../event_form"
import dayjs from "dayjs"
import { useStore } from "../../context"
let create_formated_date = (str?: string) => {
    let arr = str?.split(":") || [];
    return dayjs().startOf("day").add(Number(arr[0]), "h").add(Number(arr[1]), "m")
}

function FloatingButton() {
    let [open, setOpen] = useState(false)
    let add_mediaction = useStore(state => state.add_med)
    return (
        <>
            <div className="fixed bottom-6 shadow-xl right-6 bg-sky-400 p-4 rounded-lg border" onClick={() => setOpen(true)}><IconPlus size={"1.8rem"} color="white" /></div>
            <AnimatePresence>
                {open && (
                    <motion.dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 w-full top-20 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Event_form onCancel={() => setOpen(false)} onSubmit={async (form) => {
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