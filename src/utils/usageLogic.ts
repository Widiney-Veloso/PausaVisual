export const LIMITE_INCLINACAO = 0.3;
export const TEMPO_ALERTA = 30; //tempo máximo em uso
export const TEMPO_REPOUSO_RESET = 5; //tempo de repouso para resetar contador

export function estaEmUso(x: number, y: number): boolean {
  return Math.abs(x) > LIMITE_INCLINACAO || Math.abs(y) > LIMITE_INCLINACAO;
} //eixo x ou y inclinado, retorna true ou false
