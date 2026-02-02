import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { useAccelerometer } from "..//hooks/useAceclerometer";
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
  const [alerta, setAlerta] = useState(false);
  const [repousoTempo, setRepousoTempo] = useState(0);

  const { x, y } = useAccelerometer(monitorando);

  useEffect(() => {
    if (!monitorando) return;

    if (estaEmUso(x, y)) {
      setEmUso(true);
      setRepousoTempo(0);
      setTempoUso((prev) => prev + 1);
    } else {
      setEmUso(false);
      setRepousoTempo((prev) => prev + 1);

      if (repousoTempo >= TEMPO_REPOUSO_RESET) {
        setTempoUso(0);
        setAlerta(false);
      }
    }

    if (tempoUso >= TEMPO_ALERTA) {
      setAlerta(true);
    }
  }, [x, y]);

  return (
    <View style={[styles.container, alerta && styles.alerta]}>
      <Text style={styles.title}>Pausa Visual</Text>

      <StatusIndicator emUso={emUso} />

      <TimerDisplay tempo={tempoUso} />

      {alerta && (
        <Text style={styles.alertaText}>
          Hora de descansar os olhos 👀
        </Text>
      )}

      <Button
        title={monitorando ? "Parar Monitoramento" : "Iniciar Monitoramento"}
        onPress={() => {
          setMonitorando(!monitorando);
          setTempoUso(0);
          setAlerta(false);
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
  },
});
