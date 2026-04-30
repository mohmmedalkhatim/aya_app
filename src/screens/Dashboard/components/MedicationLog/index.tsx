import dayjs from "dayjs"
import { useState } from "react";
import { useAsync, useInterval } from "react-use";
import { useStore } from "../../../../context";
import { Heading } from "../../../../components/heading";
import { IconEdit, IconSwitch } from "@tabler/icons-react";
import { Button } from "../../../../components/Button/Button";
import { div } from "@tensorflow/tfjs-core";
import { Record } from "../../../../medicition_tracker";


function MedicationLog({ record }: { record: Record }) {
  let [hour, setHour] = useState((25 - dayjs().hour()));
  let [minute, setMinute] = useState(dayjs().minute());
  let setOpen = useStore(state => state.setDialogState)
  let Medications = useStore((state) => state.data.dosages)
  let token = useStore((state) => state.keys.access_token)
  let init = useStore((state) => state.init)
  useAsync(async () => {
    
    console.log(record)
    await init(token)
  }, [])
  useInterval(() => {
    setHour(25 - dayjs().hour())
    setMinute(dayjs().minute())
  }, 60000)

  if (Medications) {
    return (
      <div className="flex  gap-6 relative flex-col">
        <div className="rounded py-4 px-3">
          <div className="flex flex-col grow gap-1 relative">
            {Medications.length === 0 &&
              <div className="w-full border p-3 flex flex-col gap-5">
                <div className="p-3" >
                  <center>
                    <Heading>
                      Hello, you didn't add any medication yet
                    </Heading>
                  </center>
                </div>
                <Button className="w-full m-3" onClick={() => setOpen(true)}>
                  click to add a medication
                </Button>
              </div>}
            {
              Medications?.map(
                (med) => {
                  return (
                    <div className="border flex justify-between items-center flex-col shadow gap-1  w-full px-4 py-4 border-l-5 rounded bg-white border-l-black">
                      <div className="flex justify-between items-center w-full px-2 py-2 ">
                        <div>
                          {med.name}
                        </div>
                        <Button
                          variant="ghost"
                          className="fixed top-0 right-0 h-fixed"
                          size="action">
                          <IconEdit />
                        </Button>
                      </div>
                      {
                        (med.times.map((item, index) => {
                          let date = dayjs(item)
                          return (
                            <div key={med.name + item + index} className="flex justify-between items-center w-full px-2 py-2 ">
                              <div>
                                {date.format("hh:mm A")}
                              </div>
                              <Button
                                variant="ghost"
                                className="fixed top-0 right-0 h-fixed"
                                size="action">
                                <IconSwitch />
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
}
export default MedicationLog