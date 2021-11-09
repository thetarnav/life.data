import { activities } from '@/store/variables'
import { coinFlip, wait } from '@/utils/general'
import { random } from 'lodash'

export interface DayData {
	activities: Record<string, 0 | 1 | 2 | 3 | 4>
}

const getActivitiesMap = () => {
	const map: Record<string, 0 | 1 | 2 | 3 | 4> = {}
	activities.forEach(name => (map[name] = random(0, 4) as 0 | 1 | 2 | 3 | 4))
	return map
}

export const fetchDaysData = async (
	from: number,
	to: number,
): Promise<DayData[]> => {
	const length = to - from + 1
	await wait(random(200, 1000))
	if (coinFlip(0.05)) throw 'MOCK ERROR'
	return Array.from({ length }, () => ({
		activities: getActivitiesMap(),
	}))
}
