import { Text, StyleSheet } from "react-native";

interface Props {
  tempo: number;
}

export default function TimerDisplay({ tempo }: Props) {
  const minutos = String(Math.floor(tempo / 60)).padStart(2, "0");
  const segundos = String(tempo % 60).padStart(2, "0");

  return (
    <Text style={styles.text}>
      Tempo de uso: {minutos}:{segundos}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
});
