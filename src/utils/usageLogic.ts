export const LIMITE_INCLINACAO = 0.3;
export const TEMPO_ALERTA = 30; // segundos (demo)
export const TEMPO_REPOUSO_RESET = 5; // segundos

export function estaEmUso(x: number, y: number): boolean {
  return Math.abs(x) > LIMITE_INCLINACAO || Math.abs(y) > LIMITE_INCLINACAO;
}
