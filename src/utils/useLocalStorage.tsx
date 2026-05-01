import { Accessor, createSignal, Setter } from "solid-js";

export default function useLocalStorage<T extends object>({
  key,
  storageType = "local",
  defaultValue,
}: {
  key: string;
  storageType?: "local" | "session";
  defaultValue: T;
}): [Accessor<T>, Setter<T>] {
  const storage = storageType === "local" ? window.localStorage : window.sessionStorage;
  const initialValue: T | undefined = JSON.parse(storage.getItem(key) ?? "{}").value;

  const [value, setValue] = createSignal<T>(initialValue ?? defaultValue);

  const newSetValue = (newValue: T | ((v: T) => T)): T => {
    const _val: T = typeof newValue === "function" ? newValue(value()) : newValue;

    setValue(_val as any);
    storage.setItem(key, JSON.stringify({ value: _val }));

    return _val;
  };

  return [value, newSetValue as Setter<T>];
}
