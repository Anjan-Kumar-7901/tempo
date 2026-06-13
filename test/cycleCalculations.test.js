import test from 'node:test'
import assert from 'node:assert/strict'
import { cycleLengths, getStats, overlapsLog, periodDuration } from '../src/utils/cycleCalculations.js'

const settings = { averageCycleLength: 28, averagePeriodDuration: 5 }
const logs = [
  { id: 'a', startDate: '2026-01-01', endDate: '2026-01-05' },
  { id: 'b', startDate: '2026-01-30', endDate: '2026-02-03' },
  { id: 'c', startDate: '2026-02-27', endDate: '2026-03-03' },
]

test('period duration includes both start and end dates', () => {
  assert.equal(periodDuration(logs[0]), 5)
})

test('cycle lengths measure gaps between period starts', () => {
  assert.deepEqual(cycleLengths(logs), [29, 28])
})

test('averages use actual history when available', () => {
  const stats = getStats(logs, settings)
  assert.equal(stats.averageCycleLength, 29)
  assert.equal(stats.averagePeriodDuration, 5)
  assert.equal(stats.shortest, 28)
  assert.equal(stats.longest, 29)
})

test('one log falls back to the entered cycle length', () => {
  assert.equal(getStats([logs[0]], settings).averageCycleLength, 28)
})

test('overlapping logs are rejected while the edited log is ignored', () => {
  assert.equal(overlapsLog({ startDate: '2026-01-04', endDate: '2026-01-07' }, logs), true)
  assert.equal(overlapsLog({ startDate: '2026-01-01', endDate: '2026-01-05' }, logs, 'a'), false)
})
