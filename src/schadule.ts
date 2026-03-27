import {
  ScheduleEvery,
  sendNotification,
  isPermissionGranted,
  requestPermission,
  Schedule,
} from '@choochmeque/tauri-plugin-notifications-api';
import dayjs from 'dayjs';
import { storage } from './main';
import { EventModel } from './components/event_form';


export async function schadule () {
  try {
    let permission = await isPermissionGranted();

    if (!permission) {
      let state = await requestPermission();
      permission = state === 'granted';
    }
    let medictions = await storage.get<{ dosages: EventModel[] }>(
      'information'
    );
    console.log(medictions);
    if (medictions?.dosages) {
      medictions.dosages.map(med => {
        sendNotification({
          title: `it's time to take the mediction`,
          body: `name:${med.name} \ndosage:${med.dosage}`,
          schedule: Schedule.at(dayjs(med.time).toDate(),false,true),
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
}
