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
	start: () => void
	stop: () => void
}

type ViewportObserverProvider = Component<{
	options?: IntersectionObserverOptions
}>

type UseViewportObserver = (
	el: Element | Accessor<Element>,
	onChange?: EntryCallback,
) => [Accessor<boolean>]

const createViewportObserverProvider = (
	options?: IntersectionObserverOptions,
): [ViewportObserverProvider, UseViewportObserver] => {
	const ViewportObserverContext = createContext<ContextState>()

	const provider: ViewportObserverProvider = props => {
		const methods = createViewportObserver(props.options ?? options)
		return (
			<ViewportObserverContext.Provider value={methods}>
				{props.children}
			</ViewportObserverContext.Provider>
		)
	}

	const useHook: UseViewportObserver = (el, onChange) => {
		const observer = useContext(ViewportObserverContext)
		const getEl = typeof el === 'function' ? el : () => el
		const [visible, setVisible] = createSignal(false)

		onMount(() =>
			observer?.add(getEl(), e => {
				setVisible(e.isIntersecting)
				onChange?.(e)
			}),
		)
		onCleanup(() => observer?.remove(getEl()))
		return [visible]
	}

	return [provider, useHook]
}

export { createViewportObserverProvider }
