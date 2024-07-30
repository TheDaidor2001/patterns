const CardEvent = {
  CREATE: 'card:create',
  REORDER: 'card:reorder',
  RENAME: 'card:rename',
  CHANGE_DESCRIPTION: 'card:change-description',
  DELETE: 'card:delete',
  DUPLICATE: 'card:duplicate',
  UNDO: 'card:undo',
  REDO: 'card:redo',
} as const;

export { CardEvent };
