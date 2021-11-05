import { flipP, valToP } from '@/utils/general'
import { clamp } from 'lodash'
import type { Accessor } from 'solid-js'

type AppStore = {
	zoom: Accessor<number>
	updateZoom: (move: number) => void
	monthsOpacity: Accessor<number>
	weeksOpacity: Accessor<number>
}

const AppStoreContext = createContext<AppStore>()

const easing = (t: number) => t * t

export const AppStoreProvider: Component = props => {
	const [state, setState] = createStore({
		zoom: 0,
	})

	const zoom = createMemo(() => easing(state.zoom))

	const updateZoom = (move: number) =>
		setState('zoom', z => clamp(z + move, 0, 1))

	const monthsOpacity = createMemo(() =>
		flipP(clamp(valToP(zoom(), 0.05, 0.3), 0, 1)),
	)

	const weeksOpacity = createMemo(() => clamp(valToP(zoom(), 0.1, 0.4), 0, 1))

	const store: AppStore = {
		zoom,
		updateZoom,
		monthsOpacity,
		weeksOpacity,
	}

	return (
		<AppStoreContext.Provider value={store}>
			{props.children}
		</AppStoreContext.Provider>
	)
}

export const useAppStore = () => useContext(AppStoreContext) as AppStore
