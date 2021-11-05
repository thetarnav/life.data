import { addMonths, format, nextMonday, differenceInDays } from 'date-fns'
import { enGB } from 'date-fns/locale'

import {
	getDaysInMonth,
	getWeek,
	differenceInCalendarMonths,
} from 'date-fns/fp'
import { random } from 'lodash'

export const startDate = new Date(
	`${random(2018, 2020)}.${random(1, 12)}.${random(1, 28)}`,
)
export const daysFirstMonth =
	getDaysInMonth(startDate) - startDate.getDate() + 1
export const daysFirstWeek = differenceInDays(nextMonday(startDate), startDate)

export const dateToString = (date: number | Date) => format(date, 'd MMM yyyy')

export const getNumberOfMonths = () =>
	differenceInCalendarMonths(startDate, Date.now()) + 1

export const getNumberOfDays = () => differenceInDays(Date.now(), startDate)

export const getNumberOfWeeks = () =>
	(getNumberOfDays() - daysFirstWeek) / 7 + 1

export const getMonthDate = (i: number) => addMonths(startDate, i)

export const getMonthDays = (i: number) =>
	i !== 0 ? getDaysInMonth(getMonthDate(i)) : daysFirstMonth

export const getMonthName = (i: number): string =>
	format(getMonthDate(i), 'MMM')

console.log(dateToString(startDate), getNumberOfMonths(), getNumberOfDays())
