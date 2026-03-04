import { createMMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const appStorage = createMMKV({ id: "socrates-app" });

export const appZustandStorage: StateStorage = {
  getItem: (key: string): string | null => {
    const value = appStorage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string): void => {
    appStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    appStorage.remove(key);
  },
};
