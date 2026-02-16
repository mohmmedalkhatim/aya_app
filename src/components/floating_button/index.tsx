import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import Event_form from "../event_form"
import { Dialog } from "../Dialog"

function FloatingButton() {
  let [open, setOpen] = useState(false)

    return (
        <>
            <div className="fixed bottom-6 shadow-xl right-6 bg-white p-4 rounded-lg border" onClick={() => setOpen(true)}><IconPlus size={"1.8rem"} color="gray" /></div>
            <Dialog open={open} closeOnOverlayClick bodyClassName="top-24 w-full px-2 rounded-t-xl border fixed bg-white" onClose={() => setOpen(false)} children={<Event_form onCancel={()=>setOpen(false)} onSubmit={(form_data) => { console.log(form_data) }} />} />
        </>
    )
}
export default FloatingButton