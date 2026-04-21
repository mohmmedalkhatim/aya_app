import { AnimatePresence, motion } from "motion/react"
import { Button } from "../../../../components/Button/Button"
import { IconCancel, IconX } from "@tabler/icons-react"
import { Heading } from "../../../../components/heading";


function ScanDialog({ open, onClose }: { open: boolean, onClose: () => void }) {

    return (
        <AnimatePresence>
            {open &&
                <motion.dialog open={open} onClose={onClose} className="fixed  inset-0 w-full h-[40rem]  top-20 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0, translateY: "2rem" }} animate={{ opacity: 1, translateY: "0rem" }} exit={{ opacity: 0 }}>
                    <header className="flex w-full justify-between items-center bg-[#fff]  py-4 px-6">
                        <Heading>
                            scan your medicne
                        </Heading>
                        <Button onClick={onClose} variant="ghost" size="action" >
                            <IconX />
                        </Button>
                    </header>
                </motion.dialog>
            }
        </AnimatePresence>
    )
}
export default ScanDialog