import { create } from 'zustand';
import { storage } from '../main';
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
  user_info: { name: string; email: string };
  onLine: boolean;
  setInfo: (keys: Keys) => void;
  setData: (data: Data) => void;
  add_med: (med: EventModel, type: string) => Promise<void>;
  init: (access: string) => Promise<void>;
  update_med: (med: EventModel, type: 'dosages' | 'events') => Promise<void>;
}

export let useStore = create<medications_ui_state>(set => ({
  onLine: false,
  data: {
    dosages: [],
  },
  user_info: {
    email: '',
    name: '',
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
    if (data && data?.dosages) {
      set(state => ({
        data: data,
      }));
    } else {
      let res = await apiCall({ token });
      console.log(res.status);
      if (res.ok) {
        let body = await res.json();
        storage.set('information', { dosages: body.list });
        console.log(body.list);
        set(state => ({
          ...state,
          data: { dosages: body.list },
        }));
      }
    }
  },
  add_med: async (payload, token) => {
    let res = await apiCall({ method: 'POST', token, payload });
    console.log(res);
    if (res.ok) {
      let body = await res.json();
      storage.set('information', { dosages: body.list });
      console.log(body.list);
      set(state => ({
        ...state,
        data: { dosages: [...state.data?.dosages, ...body.list] },
      }));
    }
  },
  update_med: async (payload, token) => {
    let res = await apiCall({ method: 'POST', token, payload });
    console.log(res);
    if (res.ok) {
      let body = await res.json();
      storage.set('information', { dosages: body.list });
      console.log(body.list);
      set(state => ({
        ...state,
        data: { dosages: [...state.data?.dosages, ...body.list] },
      }));
    }
  },
}));

let apiCall = async ({
  method = 'GET',
  token,
  payload,
}: {
  method?: 'POST' | 'PUT' | 'GET';
  token: string;
  payload?: EventModel;
}) => {
  console.log(token);
  let res = await fetch('http://localhost:4000/user_medicines', {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  return res;
};
