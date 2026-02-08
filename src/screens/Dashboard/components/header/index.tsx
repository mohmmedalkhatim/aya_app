import { IconDropletFilled, IconScan } from "@tabler/icons-react"

function DashboardHeader() {
    return (
        <div className="flex items-center justify-between w-full p-4 border">
            <div className="flex items-center">
                <IconDropletFilled />
                <div className=" text-xl ">
                    69
                </div>
            </div>
            <IconScan />
        </div>
    )
}
export default DashboardHeader