/**
 * Tipos de jugada (typePlayId) según API list-play.
 * 1 = fijo, 2 = corrido, 3 = parle.
 */
export const TYPE_PLAY_ID = {
  FIJO: 1,
  CORRIDO: 2,
  PARLE: 3,
} as const;

export const TYPE_PLAY_LABELS: Record<number, string> = {
  [TYPE_PLAY_ID.FIJO]: 'Fijo',
  [TYPE_PLAY_ID.CORRIDO]: 'Corrido',
  [TYPE_PLAY_ID.PARLE]: 'Parle',
};

export type TypePlayId = (typeof TYPE_PLAY_ID)[keyof typeof TYPE_PLAY_ID];
