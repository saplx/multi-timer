import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import TimerCard from "./components/TimerCard";

export default function HomeScreen() {
  const [timers, setTimers] = useState([{ id: "1" }]);

  const addTimer = () => {
    setTimers((prev) => [...prev, { id: Date.now().toString() }]);
  };

  const deleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Мои таймеры</Text>

        {timers.map((t) => (
          <TimerCard key={t.id} id={t.id} onDelete={deleteTimer} />
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addTimer}>
          <Text style={styles.addBtnText}>+ Добавить таймер</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f8f8" },
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: "500", marginBottom: 16 },
  addBtn: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#aaa",
    alignItems: "center",
    marginTop: 4,
  },
  addBtnText: { color: "#888", fontSize: 15 },
});
