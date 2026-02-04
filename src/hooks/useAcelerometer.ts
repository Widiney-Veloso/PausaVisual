import { useEffect, useState } from "react";
import { Accelerometer } from "expo-sensors"; //importa o sensor

export function useAccelerometer(ativo: boolean) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 }); //determinação dos eixos

  useEffect(() => {
    let subscription: any;

    if (ativo) {
      Accelerometer.setUpdateInterval(1000); // 1 segundo
      subscription = Accelerometer.addListener(setData);
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [ativo]);

  return data;
}
