import { Accessor } from 'solid-js'
import {
	AddViewportObserverEntry,
	createViewportObserver,
	EntryCallback,
	IntersectionObserverOptions,
	RemoveViewportObserverEntry,
} from './intersection-observer'

type ContextState = {
	add: AddViewportObserverEntry
	remove: RemoveViewportObserverEntry
}

type ViewportObserverProvider = Component<{
	options?: IntersectionObserverOptions
}>

type UseViewportObserver = (
	el: Element | Accessor<Element>,
	onChange?: EntryCallback,
) => [Accessor<boolean>]

export const createViewportObserverProvider = (
	options?: IntersectionObserverOptions,
): [ViewportObserverProvider, UseViewportObserver] => {
	const ViewportObserverContext = createContext<ContextState>()

	const provider: ViewportObserverProvider = props => {
		const [add, { remove }] = createViewportObserver(props.options ?? options)
		return (
			<ViewportObserverContext.Provider value={{ add, remove }}>
				{props.children}
			</ViewportObserverContext.Provider>
		)
	}

	const useHook: UseViewportObserver = (el, onChange) => {
		const [visible, setVisible] = createSignal(false)
		const context = useContext(ViewportObserverContext)
		if (context) {
			const getEl = typeof el === 'function' ? el : () => el

			onMount(() =>
				context.add(getEl(), (e, o) => {
					setVisible(e.isIntersecting)
					onChange?.(e, o)
				}),
			)
			onCleanup(() => context.remove(getEl()))
		}
		return [visible]
	}

	return [provider, useHook]
}
