import { create } from 'zustand'
import { getLogs, getSettings, removeLog, resetDatabase, saveLog, saveSettings } from '../db/tempoDb'
import { hashPin, verifyPin } from '../utils/pinCrypto'

export const useAppStore = create((set, get) => ({
  ready: false, settings: null, logs: [], unlocked: false,
  boot: async () => set({ settings: await getSettings(), logs: await getLogs(), ready: true, unlocked: false }),
  createPin: async (pin) => {
    const settings = await saveSettings({ pinHash: await hashPin(pin) })
    set({ settings, unlocked: true })
  },
  unlock: async (pin) => {
    const valid = await verifyPin(pin, get().settings.pinHash)
    if (valid) set({ unlocked: true })
    return valid
  },
  lock: () => set({ unlocked: false }),
  updateSettings: async (updates) => {
    const settings = await saveSettings(updates)
    set({ settings })
  },
  changePin: async (pin) => {
    const settings = await saveSettings({ pinHash: await hashPin(pin) })
    set({ settings })
  },
  upsertLog: async (input) => {
    const now = new Date().toISOString()
    const existing = get().logs.find((log) => log.id === input.id)
    await saveLog({ ...input, id: input.id || crypto.randomUUID(), createdAt: existing?.createdAt || now, updatedAt: now })
    set({ logs: await getLogs() })
  },
  deleteLog: async (id) => { await removeLog(id); set({ logs: await getLogs() }) },
  resetAll: async () => { await resetDatabase(); set({ settings: null, logs: [], unlocked: false }) },
}))
