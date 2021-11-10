import { debounce, throttle } from 'lodash'
import type { DebounceSettings, ThrottleSettings } from 'lodash'
import type { ReturnTypes, Accessor } from 'solid-js'

type Fn = () => void
type MaybeAccessor<T> = T | Accessor<T>
const read = <T>(val: MaybeAccessor<T>): T =>
	typeof val === 'function' ? (val as Function)() : val

createRoot(() => {
	const [count, setCount] = createSignal(0)
	const double = createMemo(() => count() * 2)

	setInterval(() => {
		setCount(p => p + 1)
	}, 1000)

	const { stop, ignore } = ignorableWatch2(count, n => {
		console.log('effect', n)
		if (n % 2 === 0) {
			ignore(() => {
				console.log('* 10:')
				setCount(p => p * 10)
			})
			// console.log('+ 1')
			// setCount(p => p + 1)
		} else {
			// console.log('+ 1')
			// setCount(p => p + 1)
		}
		if (n > 100000) stop()
	})

	// watchAtMost(
	// 	count,
	// 	x => {
	// 		console.log(x)
	// 	},
	// 	5,
	// )
})

type EventFilter = (invoke: Function) => void

export type StopWatch = Fn

export type WatchOptions = Parameters<typeof on>[2] &
	Parameters<typeof createEffect>[2]

type ValidWatchCallback = (input: any, prevInput: any, prevValue?: any) => any

interface WatchArrayParams<T extends (() => any)[], U> {
	source: [...T]
	fn: (input: ReturnTypes<T>, prevInput: ReturnTypes<T>, prevValue?: U) => U
}
interface WatchSignalParams<T extends () => any, U> {
	source: T
	fn: (input: ReturnType<T>, prevInput: ReturnType<T>, prevValue?: U) => U
}

export function watch<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	options?: WatchOptions,
): StopWatch
export function watch<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	options?: WatchOptions,
): StopWatch
export function watch(
	source: any,
	fn: ValidWatchCallback,
	options: WatchOptions = {},
): StopWatch {
	return createRoot(stop => {
		const { defer = true } = options
		createEffect(on(source, fn, { defer }), options)
		return stop
	})
}

export function debouncedWatch<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	wait: number,
	options?: WatchOptions & DebounceSettings,
): StopWatch
export function debouncedWatch<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	wait: number,
	options?: WatchOptions & DebounceSettings,
): StopWatch
export function debouncedWatch(
	source: any,
	fn: ValidWatchCallback,
	wait: number,
	options?: WatchOptions & DebounceSettings,
): StopWatch {
	const debouncedFn = debounce(fn, wait, options)
	return watch(source, debouncedFn, options)
}

export function throttledWatch<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	wait: number,
	options?: WatchOptions & ThrottleSettings,
): StopWatch
export function throttledWatch<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	wait: number,
	options?: WatchOptions & ThrottleSettings,
): StopWatch
export function throttledWatch(
	source: any,
	fn: ValidWatchCallback,
	wait: number,
	options?: WatchOptions & ThrottleSettings,
): StopWatch {
	const throttledFn = throttle(fn, wait, options)
	return watch(source, throttledFn, options)
}

export type PausableWatchReturn = {
	stop: Fn
	pause: Fn
	resume: Fn
}

export type PausableWatchOptions = {
	active?: boolean
}

export function pausableWatch<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	options?: WatchOptions & PausableWatchOptions,
): PausableWatchReturn
export function pausableWatch<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	options?: WatchOptions & PausableWatchOptions,
): PausableWatchReturn
export function pausableWatch(
	source: any,
	fn: ValidWatchCallback,
	options: WatchOptions & PausableWatchOptions = {},
): PausableWatchReturn {
	let { active = true } = options
	const pause = () => (active = false)
	const resume = () => (active = true)
	const _fn = (...args: [any, any, any]) => active && fn(...args)
	const stop = watch(source, _fn, options)
	return { stop, pause, resume }
}

export function watchOnce<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	options?: WatchOptions,
): void
export function watchOnce<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	options?: WatchOptions,
): void
export function watchOnce(
	source: any,
	fn: ValidWatchCallback,
	options?: WatchOptions,
): void {
	const stop = watch(
		source,
		(...a: [any, any, any]) => {
			stop()
			fn(...a)
		},
		options,
	)
}

export type WatchAtMostReturn = {
	stop: Fn
	count: Accessor<number>
}

export function watchAtMost<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	max: MaybeAccessor<number>,
	options?: WatchOptions,
): WatchAtMostReturn
export function watchAtMost<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	max: MaybeAccessor<number>,
	options?: WatchOptions,
): WatchAtMostReturn
export function watchAtMost(
	source: any,
	fn: ValidWatchCallback,
	max: MaybeAccessor<number>,
	options?: WatchOptions,
): WatchAtMostReturn {
	const [count, setCount] = createSignal(1)
	const stop = watch(
		source,
		(...a: [any, any, any]) => {
			fn(...a)
			setCount(p => p + 1)
			count() >= read(max) && stop()
		},
		options,
	)
	return { stop, count }
}

export type IgnorableWatchReturn = {
	stop: Fn
	ignore: (updater: Fn) => void
}

/**
 * Unfortunately `ignore` method in **NOT** synchronous, unlike it's equivalent in vueuse. It's because solid's reactive system batches updates made in effects. So they cannot be ignored without defering them to the next effect.
 * ```
 * ignore(() => {
 * 	// this will run second:
 * 	setCounter(p => p * 2)
 * })
 * // this will run first:
 * setCounter(p => p + 1)
 * ```
 */
export function ignorableWatch<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	options?: WatchOptions,
): IgnorableWatchReturn
export function ignorableWatch<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	options?: WatchOptions,
): IgnorableWatchReturn
export function ignorableWatch(
	source: any,
	fn: ValidWatchCallback,
	options?: WatchOptions,
): IgnorableWatchReturn {
	let ignoring = false
	const ignore = (updater: Fn) =>
		setTimeout(() => {
			ignoring = true
			updater()
			ignoring = false
		}, 0)
	const _fn = (...a: [any, any, any]) => ignoring || fn(...a)
	const stop = watch(source, _fn, options)
	return { stop, ignore }
}

export function ignorableWatch2<T extends (() => any)[], U>(
	source: WatchArrayParams<T, U>['source'],
	fn: WatchArrayParams<T, U>['fn'],
	options?: WatchOptions,
): IgnorableWatchReturn
export function ignorableWatch2<T extends () => any, U>(
	source: WatchSignalParams<T, U>['source'],
	fn: WatchSignalParams<T, U>['fn'],
	options?: WatchOptions,
): IgnorableWatchReturn
export function ignorableWatch2(
	source: any,
	fn: ValidWatchCallback,
	options?: WatchOptions,
): IgnorableWatchReturn {
	let disposeWatcher!: Fn
	const ignore = (updater: Fn) => {
		disposeWatcher?.()
		updater()
		setTimeout(createWatcher, 0)
	}
	const createWatcher = () => (disposeWatcher = watch(source, fn, options))
	createWatcher()
	return {
		ignore,
		stop,
	}
}
