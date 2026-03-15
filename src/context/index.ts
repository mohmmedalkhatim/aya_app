import { create } from 'zustand';
import { storage } from '../main';
import { data } from 'react-router-dom';
import { EventModel } from '../components/event_form';
import { fetch } from '@tauri-apps/plugin-http';

export type Data = {
  dosages: EventModel[];
};

export type Keys = {
  access_token: string;
};
export interface medications_ui_state {
  data: Data;
  keys: Keys;
  setInfo: (keys: Keys) => void;
  setData: (data: Data) => void;
  add_med: (med: EventModel, type: 'dosages' | 'events') => Promise<void>;
  init: (access: string) => Promise<void>;
  update_med: (med: EventModel, type: 'dosages' | 'events') => Promise<void>;
}

export let useStore = create<medications_ui_state>(set => ({
  data: {
    dosages: [],
  },
  keys: {
    access_token: '',
  },
  setData: data => {
    set({ data });
  },
  setInfo: keys => {
    set({ keys });
  },
  init: async token => {
    let data = await storage.get<Data>('information');
    console.log(data);
    if (data && data?.dosages) {
      set(state => ({
        data: { dosages: data?.dosages },
      }));
    } else {
      let body = await apiCall({ token });
      storage.set('information', { dosages: body.list });
      console.log(body.list);
      set(state => ({
        data: { dosages: body.list },
      }));
    }
  },
  add_med: async (payload, token) => {
    let body = await apiCall({ method: 'POST', token, payload });
  },
  update_med: async (med, token) => {},
}));

let apiCall = async ({
  method,
  token,
  payload,
}: {
  method?: 'POST' | 'PUT';
  token: string;
  payload?: EventModel;
}) => {
  let res = await fetch('http://localhost:4000/user_medicines', {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
    return (await res.json()) as { list: EventModel[] };
};
