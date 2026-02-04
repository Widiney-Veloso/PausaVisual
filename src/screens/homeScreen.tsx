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
  const [monitorando, setMonitorando] = useState(false); //inicia sem monitoramento
  const [tempoUso, setTempoUso] = useState(0); // tempo de uso zerado (inicio)
  const [emUso, setEmUso] = useState(false); //sem uso do acelerometro
  const [tempoEmPausa, setTempoEmPausa] = useState(0); //tempo de pausa zerado (inicio)

  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  const { x, y } = useAccelerometer(monitorando); //conexão com o sensor

  const alerta = monitorando && tempoUso >= TEMPO_ALERTA;



  // Detecta se celular está em uso / pausa
  useEffect(() => {
    if (!monitorando) return;
    
    //esse bloco verifica se o celular está em uso ou não

    const usando = estaEmUso(x, y);
    setEmUso(usando);
  }, [x, y, monitorando]); //é acionado por isso <-




  // Relógio REAL (1 segundo)
  useEffect(() => {
    if (!monitorando) return;

    intervaloRef.current = setInterval(() => { //cria um intervalo
      if (emUso) {
        setTempoUso((prev) => prev + 1); //se tiver em uso, conta o tempo em uso
        setTempoEmPausa(0);
      } else {
        setTempoEmPausa((prev) => prev + 1); //se não tiver, conta o tempo em pausa
      }
    }, 1000 /*milissegundos*/);

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current); //limpa o intervalo anterior e evita criar mais de um intervalo
      }
    };
  }, [monitorando, emUso]); //acionado por isso <-




  // Carência anti-burla, faz a verificação de tempo de pausa e reseta
  useEffect(() => {
    if (tempoEmPausa >= TEMPO_REPOUSO_RESET) {
      setTempoUso(0);
      setTempoEmPausa(0);
    }
  }, [tempoEmPausa]); //acionado por isso <-





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
