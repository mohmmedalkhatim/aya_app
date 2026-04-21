import { create } from 'zustand';
import { storage } from '../main';
import { EventModel } from '../components/event_form';
import { fetch } from '@tauri-apps/plugin-http';
import bcrypt from 'crypto-js';
import { v7 } from 'uuid';
import { useKey } from 'react-use';
import {
  getPassword,
  getSecret,
  setPassword,
  setSecret,
} from 'tauri-plugin-keyring-api';
import { data } from 'react-router-dom';

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
    if (data) {
      set(state => ({
        data: data,
      }));
    }

    let res = await apiCall({ token });
    if (res) {
      let payload = await dencrpyt(res.hash);
      storage.set('information', payload);
      set(state => {
        if (state.onLine) {
          encrpyt(state.data).then(res => {
            apiCall({ method: 'POST', token, payload: res });
          });
        }
        return {
          data: payload,
        };
      });
    }
  },
  add_med: async (payload, token) => {
    let data = await storage.get<Data>('information');
    set(state => {
      storage.set('information', {
        dosages: [...state.data?.dosages, payload],
      });
      return {
        ...state,
        data: { dosages: [...state.data?.dosages, payload] },
      };
    });
  },
}));
let dencrpyt = async (payload: String): Promise<Data> => {
  let name = useStore.getState().user_info.name;
  let stored_key = await getPassword('encryption_key', name);
  let key = '';
  if (stored_key) {
    key = stored_key.toString();
  } else {
    let uuid = v7();
    setPassword('encryption_key', name, uuid);
  }
  return JSON.parse(
    bcrypt.AES.decrypt(JSON.stringify(payload), key).toString()
  );
};
let encrpyt = async (payload: Data) => {
  let name = useStore.getState().user_info.name;
  let stored_key = await getPassword('encryption_key', name);
  if (stored_key) {
    return JSON.stringify({
      hash: bcrypt.AES.encrypt(JSON.stringify(payload), stored_key).toString(),
    });
  }
};

async function apiCall ({
  method = 'GET',
  token,
  payload,
}: {
  method?: 'POST' | 'PUT' | 'GET';
  token: string;
  payload?: string;
}): Promise<{ hash: string } | undefined> {
  let res = await fetch('http://localhost:4000/user_medicines', {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: payload ? payload : undefined,
  });
  if (res.ok) {
    return res.json();
  }
}
