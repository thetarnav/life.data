import {
	addMonths,
	format,
	nextMonday,
	differenceInDays,
	previousMonday,
} from 'date-fns'
import { enGB } from 'date-fns/locale'

import {
	getDaysInMonth,
	getWeek,
	differenceInCalendarMonths,
} from 'date-fns/fp'
import { random } from 'lodash'

const now = new Date(Date.now())

export const startDate = new Date(
	`${random(2018, 2020)}.${random(1, 12)}.${random(1, 28)}`,
)
export const daysFirstMonth =
	getDaysInMonth(startDate) - startDate.getDate() + 1
export const daysFirstWeek = differenceInDays(nextMonday(startDate), startDate)
export const daysLastWeek = now.getDay()

export const dateToString = (date: number | Date) => format(date, 'd MMM yyyy')

export const getNumberOfMonths = () =>
	differenceInCalendarMonths(startDate, now) + 1

export const getNumberOfDays = () => differenceInDays(now, startDate)

export const getNumberOfWeeks = () =>
	Math.ceil((getNumberOfDays() - daysFirstWeek) / 7) + 1

export const getMonthDate = (i: number) => addMonths(startDate, i)

export const getMonthDays = (i: number) =>
	i !== 0 ? getDaysInMonth(getMonthDate(i)) : daysFirstMonth

export const getMonthName = (i: number): string =>
	format(getMonthDate(i), 'MMM')

console.log(dateToString(startDate), getNumberOfMonths(), getNumberOfDays())
