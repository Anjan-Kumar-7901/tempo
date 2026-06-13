import Dexie from 'dexie'

export const db = new Dexie('tempoDatabase')

db.version(1).stores({
  periodLogs: 'id, startDate, endDate, createdAt',
  settings: 'id',
})

export const defaultSettings = {
  id: 'settings',
  averageCycleLength: 28,
  averagePeriodDuration: 5,
  pinHash: '',
  name: '',
  age: null,
  heightCm: null,
  weightKg: null,
  surveyAnswers: {},
  isOnboardingComplete: false,
  isSetupComplete: false,
  createdAt: '',
  updatedAt: '',
}

export const getSettings = async () => (await db.settings.get('settings')) || null
export const saveSettings = async (updates) => {
  const now = new Date().toISOString()
  const existing = await getSettings()
  const next = { ...defaultSettings, ...existing, ...updates, createdAt: existing?.createdAt || now, updatedAt: now }
  await db.settings.put(next)
  return next
}
export const getLogs = async () => db.periodLogs.orderBy('startDate').reverse().toArray()
export const saveLog = async (log) => db.periodLogs.put(log)
export const removeLog = async (id) => db.periodLogs.delete(id)
export const resetDatabase = async () => {
  await db.periodLogs.clear()
  await db.settings.clear()
}
