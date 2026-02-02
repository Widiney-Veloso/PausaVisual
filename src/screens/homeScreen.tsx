import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { useAccelerometer } from "../hooks/useAcelerometer";
import {
  estaEmUso,
  TEMPO_ALERTA,
  TEMPO_REPOUSO_RESET,
} from "../utils/usageLogic";

import TimerDisplay from "../components/timerDisplay";
import StatusIndicator from "../components/statusIndicator";

export default function HomeScreen() {
  const [monitorando, setMonitorando] = useState(false);
  const [tempoUso, setTempoUso] = useState(0);
  const [emUso, setEmUso] = useState(false);
  const [tempoEmPausa, setTempoEmPausa] = useState(0);

  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  const { x, y } = useAccelerometer(monitorando);

  // 🚨 alerta DERIVADO (sem bug)
  const alerta = monitorando && tempoUso >= TEMPO_ALERTA;

  // 1️⃣ Detecta uso / pausa (sensor NÃO conta tempo)
  useEffect(() => {
    if (!monitorando) return;

    const usando = estaEmUso(x, y);
    setEmUso(usando);
  }, [x, y, monitorando]);

  // 2️⃣ Relógio REAL (1 segundo)
  useEffect(() => {
    if (!monitorando) return;

    intervaloRef.current = setInterval(() => {
      if (emUso) {
        setTempoUso((prev) => prev + 1);
        setTempoEmPausa(0);
      } else {
        setTempoEmPausa((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [monitorando, emUso]);

  // 3️⃣ Carência anti-burla
  useEffect(() => {
    if (tempoEmPausa >= TEMPO_REPOUSO_RESET) {
      setTempoUso(0);
      setTempoEmPausa(0);
    }
  }, [tempoEmPausa]);

  return (
    <View style={[styles.container, alerta && styles.alerta]}>
      <Text style={styles.title}>Pausa Visual</Text>

      <StatusIndicator emUso={emUso} />

      <TimerDisplay tempo={tempoUso} />

      <Text style={styles.sensorText}>
        Inclinação X: {x.toFixed(2)} | Y: {y.toFixed(2)}
      </Text>

      {alerta && (
        <Text style={styles.alertaText}>
          Hora de descansar os olhos 👀
        </Text>
      )}

      <Button
        title={monitorando ? "Parar Monitoramento" : "Iniciar Monitoramento"}
        onPress={() => {
          setMonitorando((prev) => !prev);
          setTempoUso(0);
          setTempoEmPausa(0);
          setEmUso(false);

          if (intervaloRef.current) {
            clearInterval(intervaloRef.current);
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  alerta: {
    backgroundColor: "#ffcccc",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  alertaText: {
    fontSize: 18,
    color: "#b00000",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sensorText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
});
