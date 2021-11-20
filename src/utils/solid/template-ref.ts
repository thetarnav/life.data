import { Accessor } from 'solid-js'
import { MaybeAccessor, access, accessArray, Fn, withAccess } from './common'

type MutationObserverAdd = (target: Node, options: MutationObserverInit) => void

const createMutationObserver = (
	initial: MaybeAccessor<[Node, MutationObserverInit][]>,
	callback: MutationCallback,
) => {
	const instance = new MutationObserver(callback)
	const add: MutationObserverAdd = (el, options) =>
		instance.observe(el, options)
	const start = () => {
		const elements = access(initial)
		elements.forEach(([el, options]) => add(el, options))
	}
	const stop = () => instance.takeRecords().length && instance.disconnect()
	onMount(start)
	onCleanup(() => instance.disconnect())
	return {
		add,
		start,
		stop,
	}
}

export type TemplateRefObserve<El extends Node> = (target: El) => void
export type TemplateRefReturn<El extends Node> = [
	Accessor<El | undefined>,
	TemplateRefObserve<El>,
]

export const createTemplateRef = <El extends Node>(
	initial?: MaybeAccessor<El>,
): TemplateRefReturn<El> => {
	const [node, setNode] = createSignal<El>()
	let prevParent: Node
	const { add, start, stop } = createMutationObserver([], () => {
		if (!node()?.isConnected) setNode(undefined)
	})
	createEffect(() =>
		withAccess(node, node =>
			withAccess(node.parentNode, parent => {
				if (prevParent === parent) return
				prevParent = parent
				stop()
				add(parent, { childList: true })
			}),
		),
	)
	onMount(() => withAccess(initial, el => setNode(el as any)))
	onCleanup(() => setNode(undefined))
	const observe = (target: El) => {
		setNode(target as any)
	}
	return [node, observe]
}
