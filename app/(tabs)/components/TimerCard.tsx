import { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  id: string;
  onDelete: (id: string) => void;
};

export default function TimerCard({ id, onDelete }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskName, setTaskName] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const format = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const reset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        placeholder="Название задачи"
        placeholderTextColor="#aaa"
        value={taskName}
        onChangeText={setTaskName}
      />

      <Text style={[styles.timer, !isRunning && styles.timerPaused]}>
        {format(seconds)}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, isRunning ? styles.btnPause : styles.btnStart]}
          onPress={() => setIsRunning((r) => !r)}
        >
          <Text style={styles.btnText}>
            {isRunning ? "⏸ Пауза" : "▶ Старт"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={reset}>
          <Text style={styles.btnText}>↺ Сброс</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnDelete]}
          onPress={() => onDelete(id)}
        >
          <Text style={[styles.btnText, { color: "#e05" }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingVertical: 4,
    fontSize: 15,
    color: "#000",
    marginBottom: 12,
  },
  timer: {
    fontSize: 40,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 2,
    color: "#000",
    marginVertical: 8,
  },
  timerPaused: {
    color: "#888",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    alignItems: "center",
  },
  btnStart: {
    backgroundColor: "#e8f4ff",
    borderColor: "#90c0f0",
  },
  btnPause: {
    backgroundColor: "#fff0f0",
    borderColor: "#f0a0a0",
  },
  btnDelete: {
    flex: 0,
    paddingHorizontal: 14,
  },
  btnText: {
    fontSize: 13,
    color: "#333",
  },
});
