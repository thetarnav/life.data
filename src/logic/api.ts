import { activities, dayCacheSize } from '@/store/variables'
import { coinFlip, wait } from '@/utils/general'
import { cloneDeep, debounce, random } from 'lodash'

import { debouncedWatch } from '@/utils/solid/watch'

export type ActivityValueInt = 0 | 1 | 2 | 3 | 4
export type ActivityValueFloat = 0 | 0.5 | 1 | 2 | 3

export interface DayData {
	activities: Record<string, ActivityValueFloat>
}

const changeActivityIntToFloat = (
	value: ActivityValueInt,
): ActivityValueFloat => {
	if (!value) return 0
	if (value === 1) return 0.5
	return (value - 1) as ActivityValueFloat
}

const daysCache: Record<number, DayData> = {}
let daysCacheQueue: readonly number[] = []
const saveDayToCache = (index: number, data: DayData): void => {
	// is not is the cache
	if (typeof daysCache[index] === 'undefined') {
		if (daysCacheQueue.length >= dayCacheSize) {
			// cache is full
			const [dayToDrop, ...rest] = daysCacheQueue
			delete daysCache[dayToDrop]
			daysCacheQueue = [...rest, index]
			daysCache[index] = cloneDeep(data)
		} else {
			// cache is not full
			daysCacheQueue = [...daysCacheQueue, index]
		}
	}
	daysCache[index] = cloneDeep(data)
}
const saveDaysToCache = (start: number, days: DayData[]) =>
	days.forEach((data, i) => saveDayToCache(start + i, data))

const getDayFromCache = (index: number): DayData | undefined => daysCache[index]

const getActivitiesMap = (): Record<string, ActivityValueFloat> => {
	const map: Record<string, ActivityValueFloat> = {}
	activities.forEach(
		name =>
			(map[name] = changeActivityIntToFloat(
				random(0, 4) as ActivityValueInt,
			)),
	)
	return map
}

const fetchDaysData = async (from: number, to: number): Promise<DayData[]> => {
	const length = to - from + 1
	await wait(random(200, 1000))
	if (coinFlip(0.05)) throw 'MOCK ERROR'
	const days = Array.from({ length }, (_, i) => {
		const data = getDayFromCache(from + i) ?? {
			activities: getActivitiesMap(),
		}
		saveDayToCache(from + i, data)
		return data
	})
	return days
}

function createApiLogic() {
	const [fetchDaysQueue, setFetchDaysQueue] = createSignal<
		[number, number, (data: DayData[]) => void][]
	>([])

	const executeFetchDaysQueue = async () => {
		const queue = fetchDaysQueue()
		if (!queue.length) return
		setFetchDaysQueue([])
		const [fetchFrom, fetchTo] = queue.reduce(
			(total: [number, number] | [null, null], [from, to]) => {
				return [
					total[0] === null || total[0] > from ? from : total[0],
					total[1] === null || total[1] < to ? to : total[1],
				] as any
			},
			[null, null],
		) as [number, number]
		try {
			const fullData = await fetchDaysData(fetchFrom, fetchTo)
			queue.forEach(([from, to, cb]) => {
				const data = fullData.slice(from - fetchFrom, to - fetchFrom + 1)
				cb(data)
			})
		} catch (error) {
			console.log(error)
		}
	}

	debouncedWatch(fetchDaysQueue, executeFetchDaysQueue, 100)

	const requestDaysData = (
		from: number,
		to: number,
		callback: (data: DayData[]) => void,
	): void => {
		setFetchDaysQueue(list => [...list, [from, to, callback]])
	}

	return { requestDaysData }
}

export default createRoot(createApiLogic)
