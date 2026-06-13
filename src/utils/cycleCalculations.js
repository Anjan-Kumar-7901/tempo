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
  return {
    cycles, durations, averageCycleLength, averagePeriodDuration, lastLog, nextStart, nextEnd,
    daysUntil, currentCycleDay, ovulation, fertileStart: ovulation ? subDays(ovulation, 5) : null,
    shortest: cycles.length ? Math.min(...cycles) : null,
    longest: cycles.length ? Math.max(...cycles) : null,
    regularity: cycles.length < 2 ? 'More data needed' : Math.max(...cycles) - Math.min(...cycles) <= 7 ? 'Regular' : 'Variable',
  }
}
export const dateRange = (start, end) => eachDayOfInterval({ start: parseISO(start), end: parseISO(end) })
export const isWithin = (date, start, end) => {
  if (!start || !end) return false
  return (isAfter(date, start) || isEqual(date, start)) && (isBefore(date, end) || isEqual(date, end))
}
export const overlapsLog = (candidate, logs, editingId) => logs.some((log) =>
  log.id !== editingId && candidate.startDate <= log.endDate && candidate.endDate >= log.startDate)
export const formatDate = (value, pattern = 'MMM d, yyyy') => value ? format(typeof value === 'string' ? parseISO(value) : value, pattern) : '—'
