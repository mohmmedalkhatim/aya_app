import { create } from 'zustand';
import { storage } from '../main';
import { data } from 'react-router-dom';
import { EventModel } from '../components/event_form';

export type Data = {
  id: number;
  dosages: { list: EventModel[] };
  events: { list: EventModel[] };
  userId: number;
};

export type Keys = {
  access_token: string;
};
export interface medications_ui_state {
  data: Data | null;
  keys: Keys;
  setInfo: (keys: Keys) => void;
  add_med: (med: EventModel) => void;
  init: () => void;
  update_med: (med: EventModel) => void;
}

export let useStore = create<medications_ui_state>(set => ({
  data: null,
  keys: {
    access_token: '',
  },
  setInfo: keys => {
    set({ keys });
  },
  init: () => {
    storage.get<Data | undefined>('data').then(res => {
      if (res == null || res == undefined) {
        storage.set('data', []);
      }
      set({});
    });
  },
  add_med: med => {
    set(state => {
      if (state.data) {
        storage.set('data', {
          dosages: { list: [...state.data.dosages.list, med] },
          ...data,
        });
        return { ...state.data };
      } else {
        return {};
      }
    });
  },
  update_med: med => {
    set(state => {
      if (state.data) {
        let filterd = state.data.dosages.list.filter(
          item => item.id !== med.id
        );
        storage.set('data', {
          dosages: { list: [med, filterd] },
          ...data,
        });
        return { ...state.data };
      } else {
        return {};
      }
    });
  },

}));
