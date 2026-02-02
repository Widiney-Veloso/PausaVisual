import { Text, StyleSheet } from "react-native";

interface Props {
  emUso: boolean;
}

export default function StatusIndicator({ emUso }: Props) {
  return (
    <Text style={styles.text}>
      Status: {emUso ? "📱 Em uso" : "⏸ Em pausa"}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
