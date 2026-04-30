import { create } from 'zustand';
import { storage } from '../main';
import { EventModel } from '../components/event_form';
import { fetch } from '@tauri-apps/plugin-http';
import crypto from 'crypto-js';
import { v7 } from 'uuid';
import { useKey } from 'react-use';
import { getPassword, setPassword } from 'tauri-plugin-keyring-api';
import soldium from 'libsodium-wrappers';
import { data } from 'react-router-dom';
import { decrypt } from './encryption_logic/decrypt_fun';
import { encrypt } from './encryption_logic/encrypt_fun';

export type Data = {
  dosages: EventModel[];
};

export type Keys = {
  access_token: string;
};
export interface medications_ui_state {
  data: Data;
  keys: Keys;
  medicationDialogState: boolean;
  setDialogState: (state: boolean) => void;
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
  medicationDialogState: false,
  keys: {
    access_token: '',
  },
  setDialogState: state => set({ medicationDialogState: state }),
  setData: data => set({ data }),
  setInfo: keys => {
    set({ keys });
  },

  init: async token => {
    let data = await storage.get<Data>('information');

    if (!data) {
      await storage.set('information', { dosages: [] });
    } else {
      let name = '';
      set(state => {
        name = state.user_info.name;
        return {
          data: data,
        };
      });
      try {
        let encrypted_text = await encrypt(data, name);
        let res = await apiCall({
          token,
          method: 'PUT',
          payload: encrypted_text,
        });
        let info = await decrypt(String(encrypted_text), name);
      } catch (err) {
      }
    }
  },
  add_med: async (payload, token) => {
    let data = await storage.get<Data>('information');
    let name = '';

    set(state => {
      storage.set('information', {
        dosages: [...state.data?.dosages, payload],
      });
      name = state.user_info.name;
      return {
        ...state,
        data: { dosages: [...state.data?.dosages, payload] },
      };
    });
    if (data) {
      let res = await apiCall({
        token,
        method: 'PUT',
        payload: await encrypt(data, name),
      });
      console.log(res);
      if (res?.hash && res?.name) {
        let info = await decrypt(res?.hash, res?.name);
      }
    }
  },
}));

async function apiCall ({
  method = 'GET',
  token,
  payload,
}: {
  method?: 'POST' | 'PUT' | 'GET';
  token: string;
  payload?: string;
}): Promise<{ hash: string; name: string } | undefined> {
  if (method == 'PUT' && payload == undefined) return undefined;

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
