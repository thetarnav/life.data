import { onMount, onCleanup, createSignal } from 'solid-js'
import type { JSX, Accessor } from 'solid-js'

type MaybeAccessor<T> = T | Accessor<T>
const read = <T>(val: MaybeAccessor<T>): T =>
	typeof val === 'function' ? (val as Function)() : val

export interface IntersectionObserverOptions {
	readonly root?: Element | Document | null
	readonly rootMargin?: string
	readonly threshold?: number | number[]
}

export type AddIntersectionObserverEntry = (el: Element) => void
export type RemoveIntersectionObserverEntry = (el: Element) => void

export type EntryCallback = (
	entry: IntersectionObserverEntry,
	instance: IntersectionObserver,
) => void
export type AddViewportObserverEntry = (
	el: Element,
	callback: MaybeAccessor<EntryCallback>,
) => void
export type RemoveViewportObserverEntry = (el: Element) => void

type CreateViewportObserverReturnValue = [
	AddViewportObserverEntry,
	{
		remove: RemoveViewportObserverEntry
		start: () => void
		stop: () => void
		instance: IntersectionObserver
	},
]

declare module 'solid-js' {
	namespace JSX {
		interface Directives {
			observer: true | EntryCallback
		}
	}
}
// this ensures the `JSX` import won't fall victim to tree shaking before typescript can use it
export type E = JSX.Element

/**
 * Creates a very basic Intersection Observer.
 *
 * @param elements - A list of elements to watch
 * @param onChange - An event handler that returns an array of observer entires
 * @param options - IntersectionObserver constructor options:
 * - `root` — The Element or Document whose bounds are used as the bounding box when testing for intersection.
 * - `rootMargin` — A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections, effectively shrinking or growing the root for calculation purposes.
 * - `threshold` — Either a single number or an array of numbers between 0.0 and 1.0, specifying a ratio of intersection area to total bounding box area for the observed target.
 *
 * @example
 * ```tsx
 * const [add, { remove, start, stop, instance }] = createIntersectionObserver(els, entries =>
 *   console.log(entries)
 * );
 *
 * // directive usage:
 * const [observer] = createIntersectionObserver(els, () => {...})
 * <div use:observer></div>
 * ```
 */
export const createIntersectionObserver = (
	elements: MaybeAccessor<Element[]>,
	onChange: IntersectionObserverCallback,
	options?: IntersectionObserverOptions,
): [
	AddIntersectionObserverEntry,
	{
		remove: RemoveIntersectionObserverEntry
		start: () => void
		stop: () => void
		instance: IntersectionObserver
	},
] => {
	// If not supported, skip
	const instance = new IntersectionObserver(onChange, options)
	const add: AddIntersectionObserverEntry = el => instance.observe(read(el))
	const remove: RemoveIntersectionObserverEntry = el =>
		instance.unobserve(read(el))
	const start = () => read(elements).forEach(el => add(el))
	const stop = () =>
		instance.takeRecords().forEach(entry => remove(entry.target))
	onMount(start)
	onCleanup(stop)
	return [add, { remove, start, stop, instance }]
}

/**
 * Creates a more advanced viewport observer for complex tracking.
 *
 * @param elements - A list of elements to watch
 * @param callback - Element intersection change event handler
 * @param options - IntersectionObserver constructor options:
 * - `root` — The Element or Document whose bounds are used as the bounding box when testing for intersection.
 * - `rootMargin` — A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections, effectively shrinking or growing the root for calculation purposes.
 * - `threshold` — Either a single number or an array of numbers between 0.0 and 1.0, specifying a ratio of intersection area to total bounding box area for the observed target.
 *
 * @example
 * ```tsx
 * const [add, { remove, start, stop, instance }] = createViewportObserver(els, e => {...});
 * add(el, e => console.log(e.isIntersecting))
 *
 * // directive usage:
 * const [observer] = createIntersectionObserver()
 * <div use:observer={(e) => console.log(e.isIntersecting)}></div>
 * ```
 */
export function createViewportObserver(
	elements: Element[],
	callback: EntryCallback,
	options?: IntersectionObserverOptions,
): CreateViewportObserverReturnValue

export function createViewportObserver(
	initial: [Element, EntryCallback][],
	options?: IntersectionObserverOptions,
): CreateViewportObserverReturnValue

export function createViewportObserver(
	options?: IntersectionObserverOptions,
): CreateViewportObserverReturnValue

export function createViewportObserver(...a: any) {
	let initial: [Element, EntryCallback][] = []
	let options: IntersectionObserverOptions = {}
	if (Array.isArray(a[0])) {
		if (typeof a[1] === 'function') {
			initial = a[0].map(el => [el, a[1]])
			options = a[2]
		} else {
			initial = a[0]
			options = a[1]
		}
	}
	const callbacks = new WeakMap<Element, MaybeAccessor<EntryCallback>>()
	const onChange: IntersectionObserverCallback = (entries, instance) =>
		entries.forEach(entry => {
			const cb = callbacks.get(entry.target)?.(entry, instance)
			// additional check to prevent errors when the user use "observe" directive without providing a callback
			typeof cb === 'function' && cb(entry, instance)
		})
	const [add, { remove, start, stop, instance }] = createIntersectionObserver(
		[],
		onChange,
		options,
	)
	const addEntry: AddViewportObserverEntry = (el, callback) => {
		add(el)
		callbacks.set(el, callback)
	}
	const removeEntry: RemoveViewportObserverEntry = el => {
		callbacks.delete(el)
		remove(el)
	}
	initial.forEach(([el, cb]) => addEntry(el, cb))
	return [addEntry, { remove: removeEntry, start, stop, instance }]
}

/**
 * Creates reactive signal that changes when element's visibility changes
 *
 * @param element - An element to watch
 * @param options - A Primitive and IntersectionObserver constructor options:
 * - `root` — The Element or Document whose bounds are used as the bounding box when testing for intersection.
 * - `rootMargin` — A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections, effectively shrinking or growing the root for calculation purposes.
 * - `threshold` — Either a single number or an array of numbers between 0.0 and 1.0, specifying a ratio of intersection area to total bounding box area for the observed target.
 * - `initialValue` — Initial value of the signal *(default: false)*
 * - `once` — If true: the stop function will be called automatically after visibility changes *(default: false)*
 *
 * @example
 * ```ts
 * let el!: HTMLElement
 * const [isVisible, { start, stop }] = createVisibilityObserver(() => el, { once: true })
 * ```
 */
export const createVisibilityObserver = (
	element: MaybeAccessor<Element>,
	options?: IntersectionObserverOptions & {
		initialValue?: boolean
		once?: boolean
	},
): [Accessor<boolean>, { start: () => void; stop: () => void }] => {
	const [isVisible, setVisible] = createSignal(options?.initialValue || false)
	const [, { start, stop }] = createIntersectionObserver(
		() => [read(element)],
		([entry]) => {
			setVisible(entry.isIntersecting)
			if (options?.once && entry.isIntersecting !== !!options?.initialValue)
				stop()
		},
		options,
	)
	return [isVisible, { start, stop }]
}
