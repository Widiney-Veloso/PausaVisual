import { Text, StyleSheet } from "react-native";

interface Props {
  tempo: number;
}

export default function TimerDisplay({ tempo }: Props) {
  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;

  return (
    <Text style={styles.text}>
      Tempo de uso: {minutos}:{segundos < 10 ? "0" : ""}
      {segundos}
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
