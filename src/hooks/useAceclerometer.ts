import { useEffect, useState } from "react";
import { Accelerometer } from "expo-sensors";

export function useAccelerometer(active: boolean) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let subscription: any;

    if (active) {
      Accelerometer.setUpdateInterval(1000); // 1 segundo
      subscription = Accelerometer.addListener(setData);
    }

    return () => {
      subscription && subscription.remove();
    };
  }, [active]);

  return data;
}
