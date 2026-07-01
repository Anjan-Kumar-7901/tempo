import {
  addDays, differenceInCalendarDays, eachDayOfInterval, format, isAfter,
  isBefore, isEqual, parseISO, subDays,
} from 'date-fns'

export const periodDuration = (log) => differenceInCalendarDays(parseISO(log.endDate), parseISO(log.startDate)) + 1
export const sortOldest = (logs) => [...logs].sort((a, b) => a.startDate.localeCompare(b.startDate))
export const cycleLengths = (logs) => {
  const sorted = sortOldest(logs)
  return sorted.slice(1).map((log, index) => differenceInCalendarDays(parseISO(log.startDate), parseISO(sorted[index].startDate)))
}
export const average = (values, fallback = 0) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : fallback
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
export const regularityScore = (cycles) => {
  if (cycles.length < 2) return null
  const mean = cycles.reduce((sum, value) => sum + value, 0) / cycles.length
  const variance = cycles.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / cycles.length
  const spread = Math.sqrt(variance)
  return clamp(Math.round(100 - (spread * 8)), 35, 100)
}
export const fertileConfidence = (cycles) => {
  if (cycles.length < 2) return { label: 'Low', detail: 'More cycle history needed' }
  const score = regularityScore(cycles)
  if (cycles.length >= 4 && score >= 82) return { label: 'High', detail: 'Based on consistent logged cycles' }
  if (score >= 65) return { label: 'Medium', detail: 'Based on a moderately consistent pattern' }
  return { label: 'Low', detail: 'Cycle length varies, so this window may shift' }
}
export const getStats = (logs, settings) => {
  const cycles = cycleLengths(logs)
  const durations = logs.map(periodDuration)
  const averageCycleLength = average(cycles, settings?.averageCycleLength || 28)
  const averagePeriodDuration = average(durations, settings?.averagePeriodDuration || 5)
  const sorted = sortOldest(logs)
  const lastLog = sorted.at(-1)
  const nextStart = lastLog ? addDays(parseISO(lastLog.startDate), averageCycleLength) : null
  const nextEnd = nextStart ? addDays(nextStart, averagePeriodDuration - 1) : null
  const today = new Date()
  const daysUntil = nextStart ? differenceInCalendarDays(nextStart, today) : null
  const currentCycleDay = lastLog ? Math.max(1, differenceInCalendarDays(today, parseISO(lastLog.startDate)) + 1) : null
  const ovulation = nextStart ? subDays(nextStart, 14) : null
  const score = regularityScore(cycles)
  return {
    cycles, durations, averageCycleLength, averagePeriodDuration, lastLog, nextStart, nextEnd,
    daysUntil, currentCycleDay, ovulation, fertileStart: ovulation ? subDays(ovulation, 5) : null,
    fertileEnd: ovulation,
    pmsStart: nextStart ? subDays(nextStart, 7) : null,
    pmsEnd: nextStart ? subDays(nextStart, 1) : null,
    fertileConfidence: fertileConfidence(cycles),
    regularityScore: score,
    shortest: cycles.length ? Math.min(...cycles) : null,
    longest: cycles.length ? Math.max(...cycles) : null,
    regularity: score === null ? 'More data needed' : score >= 82 ? 'Very regular' : score >= 65 ? 'Mostly regular' : 'Variable',
  }
}
export const getCyclePhase = (date, logs, settings) => {
  const stats = getStats(logs, settings)
  const loggedPeriod = logs.find((log) => isWithin(date, parseISO(log.startDate), parseISO(log.endDate)))
  if (loggedPeriod) return { key: 'period', label: 'Logged period', source: 'logged' }
  if (isWithin(date, stats.nextStart, stats.nextEnd)) return { key: 'period', label: 'Predicted period', source: 'predicted' }
  if (stats.ovulation && isEqual(date, stats.ovulation)) return { key: 'ovulation', label: 'Estimated ovulation', source: 'predicted' }
  if (stats.ovulation && isWithin(date, subDays(stats.ovulation, 2), addDays(stats.ovulation, 2))) return { key: 'ovulation-window', label: 'Ovulation window', source: 'predicted' }
  if (isWithin(date, stats.fertileStart, stats.fertileEnd)) return { key: 'fertile', label: 'Fertile window', source: 'predicted' }
  if (isWithin(date, stats.pmsStart, stats.pmsEnd)) return { key: 'pms', label: 'Predicted PMS days', source: 'predicted' }
  if (stats.lastLog && stats.nextStart) {
    const periodEnd = parseISO(stats.lastLog.endDate)
    if (isAfter(date, periodEnd) && isBefore(date, stats.ovulation || stats.nextStart)) return { key: 'follicular', label: 'Follicular phase', source: 'estimated' }
    if (stats.ovulation && isAfter(date, stats.ovulation) && isBefore(date, stats.pmsStart || stats.nextStart)) return { key: 'luteal', label: 'Luteal phase', source: 'estimated' }
  }
  return { key: 'unknown', label: 'Cycle day', source: 'estimated' }
}
export const dateRange = (start, end) => eachDayOfInterval({ start: parseISO(start), end: parseISO(end) })
export const isWithin = (date, start, end) => {
  if (!start || !end) return false
  return (isAfter(date, start) || isEqual(date, start)) && (isBefore(date, end) || isEqual(date, end))
}
export const overlapsLog = (candidate, logs, editingId) => logs.some((log) =>
  log.id !== editingId && candidate.startDate <= log.endDate && candidate.endDate >= log.startDate)
export const formatDate = (value, pattern = 'MMM d, yyyy') => value ? format(typeof value === 'string' ? parseISO(value) : value, pattern) : '—'
