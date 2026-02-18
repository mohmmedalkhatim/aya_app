import { create } from 'zustand';
import { EventModel } from '../components/event_form';
import { storage } from '../main';

export interface medications_ui_state {
  list: EventModel[];
  add_med: (med: EventModel) => void;
  init: () => void;
  update_med: (med: EventModel) => void;
}
interface medsStorage {
  list?: EventModel[];
}

export let useStore = create<medications_ui_state>(set => ({
  list: [],
  init: () => {
    storage.get<EventModel[] | undefined>('medications').then(res => {
      if (res == null || res == undefined) {
        storage.set('medications', []);
      }
      set({ list: res });
    });
  },
  add_med: med => {
    set(state => {
      storage.set('medications', [...state.list, med]);
      return {
        list: [...state.list, med],
      };
    });
  },
  update_med: med => {
    set(state => {
      let filterd = state.list.filter(item => item.id != med.id);
      storage.set('medications', [...state.list, med]);
      return {
        list: [...filterd, med],
      };
    });
  },
}));
