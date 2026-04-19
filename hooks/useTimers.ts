import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export type TimerData = {
  id: string;
  taskName: string;
  seconds: number; // накопленное время до паузы
  startedAt: number | null; // timestamp последнего запуска (null = на паузе)
};

const STORAGE_KEY = "timers_v1";

export function useTimers() {
  const [timers, setTimers] = useState<TimerData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setTimers(JSON.parse(raw));
      else setTimers([{ id: "1", taskName: "", seconds: 0, startedAt: null }]);
      setLoaded(true);
    });
  }, []);

  // Сохраняем при уходе в фон
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;

      // Приложение ушло в фон или закрылось
      if (prev === "active" && next !== "active") {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
      }
    });
    return () => sub.remove();
  }, [timers]);

  // Обычное сохранение при изменениях (пока активно)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  }, [timers, loaded]);

  const addTimer = () => {
    setTimers((prev) => [
      ...prev,
      { id: Date.now().toString(), taskName: "", seconds: 0, startedAt: null },
    ]);
  };

  const deleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTimer = (id: string, patch: Partial<TimerData>) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );
  };

  return { timers, loaded, addTimer, deleteTimer, updateTimer };
}
