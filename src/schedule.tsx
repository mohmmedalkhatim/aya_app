import {
  ScheduleEvery,
  sendNotification,
  isPermissionGranted,
  requestPermission,
  Schedule,
  registerActionTypes,
  onNotificationReceived,
  onAction,
  cancelAll,
} from '@choochmeque/tauri-plugin-notifications-api';
import dayjs from 'dayjs';
import { storage } from './main';
import { EventModel } from './components/event_form';


export async function schedule() {
  try {
    let permission = await isPermissionGranted();

    if (!permission) {
      let state = await requestPermission();
      permission = state === 'granted';
    }
    let medictions = await storage.get<{ dosages: EventModel[] }>(
      'information'
    );
    let notification = await storage.get<String[]>('notification');
    if (!notification) {
      await storage.set("notification", [])
    }
    if (medictions?.dosages && notification) {
      medictions.dosages.map((med, index) => {
        med.times.map((text) => {
          let date = dayjs(text)
            .set('date', dayjs().date())
            .set('month', dayjs().month())
            .set('year', dayjs().year());

          if (!notification.includes(text)) {
            sendNotification({
              id: index,
              title: `it's time to take the mediction`,
              icon: "./",
              body: `name:${med.name} \ndosage:${med.dosage}`,
              schedule: Schedule.at(date.toDate()),
            });
            storage.set("notification", [...notification, text])
          }
          onNotificationReceived(() => {
            storage.set("notification", notification.filter(item => item !== text))
          })

        })
      });
    }
  } catch (err) {
    console.log(err);
  }
}
