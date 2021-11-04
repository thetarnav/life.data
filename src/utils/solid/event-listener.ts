import { onMount, onCleanup } from 'solid-js'

type DOMEvent = keyof WindowEventMap
type EventHandler<E extends DOMEvent> = (event: WindowEventMap[E]) => void

/**
 * Creates an event listener helper primitive.
 *
 * @param eventName - Event name to bind to
 * @param handler - Function handler to trigger
 * @param element - HTML element to bind the event to
 *
 * @example
 * ```ts
 * createEventListener("mouseDown", () => console.log("Click"), document.getElementById("mybutton"))
 * ```
 */
const createEventListener = <T extends HTMLElement, E extends DOMEvent>(
	eventName: E,
	handler: EventHandler<E>,
	targets: T | Array<T> | Window = window,
): readonly [
	add: (el: T | Window) => void,
	remove: (el: T | Window) => void,
] => {
	const add = (target: T | Window): void =>
		target.addEventListener &&
		target.addEventListener(
			eventName,
			handler as EventListenerOrEventListenerObject,
		)
	const remove = (target: T | Window): void =>
		target.removeEventListener &&
		target.removeEventListener(
			eventName,
			handler as EventListenerOrEventListenerObject,
		)
	onMount(() => (Array.isArray(targets) ? targets.forEach(add) : add(targets)))
	onCleanup(() =>
		Array.isArray(targets) ? targets.forEach(remove) : remove(targets),
	)
	return [add, remove]
}

export default createEventListener
