import { create } from 'zustand';

interface Aside {
  state: boolean;
  toggle: () => void;
}

export let useAside = create<Aside>((set) => ({
  state: false,
  toggle: () => {
    set((state) => ({ state: !state.state }));
  },
}));
