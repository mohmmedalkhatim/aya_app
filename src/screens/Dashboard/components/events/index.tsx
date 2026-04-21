import dayjs from "dayjs"
import { useState } from "react";
import { useAsync, useInterval } from "react-use";
import { useStore } from "../../../../context";
import { Heading } from "../../../../components/heading";
import { IconEdit } from "@tabler/icons-react";
import { Button } from "../../../../components/Button/Button";


function Events() {
  let [hour, setHour] = useState((25 - dayjs().hour()));
  let [minute, setMinute] = useState(dayjs().minute());
  let Medications = useStore((state) => state.data.dosages)
  let token = useStore((state) => state.keys.access_token)
  let init = useStore((state) => state.init)
  useAsync(async () => {
    await init(token)
  }, [])
  useInterval(() => {
    setHour(25 - dayjs().hour())
    setMinute(dayjs().minute())
  }, 60000)

  return (
    <div className="flex pt-4 gap-6 relative flex-col">
      <div className="rounded py-8 px-3">
        <div className="flex flex-col grow gap-1 relative">
          {
            Medications?.map(
              (med, index) => {
                return (
                  <div>
                    <div className="font- text-lg pl-2 pb-3 pt-2">
                      {med.name}
                    </div>
                    {
                      (med.times.map((item) => {
                        let date = dayjs(item)
                        return (
                          <div key={index} className="border flex justify-between items-center shadow gap-1  w-full px-4 py-4 border-l-5 rounded bg-white border-l-black">
                            <div>
                              {date.format("hh:mm A")}
                            </div>
                            <Button
                              variant="ghost"
                              className="fixed top-0 right-0 h-fixed"
                              size="action">
                              <IconEdit />
                            </Button>
                          </div>
                        )
                      }))
                    }
                  </div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}
export default Events