// utils/settingUtils.ts
export const DIALOG = {
  INSPECTION_CONDITION: 'inspection_condition',
  GENRE_SETTING: 'genre_setting',
  KEYWORD_SETTING: 'keyword_setting'
}

export function filterArrayValue<T>(array: T[], valueToRemove: T): T[] {
  return array.filter(item => item !== valueToRemove)
}

export function deepCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
