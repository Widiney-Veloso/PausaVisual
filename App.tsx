import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/homeScreen";

export default function App() {
  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}
