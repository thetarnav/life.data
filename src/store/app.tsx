import type { Accessor } from 'solid-js'
import type { Store } from 'solid-js/store'

import { flipP, valToP } from '@/utils/general'
import { clamp } from 'lodash'
import { getNumberOfMonths } from '@/logic/time'

interface AppStoreState {
	nMonths: number
	zoom: number
	maxBar: number
}

type AppStore = {
	state: Store<AppStoreState>
	zoom: Accessor<number>
	updateZoom: (move: number) => void
	monthsOpacity: Accessor<number>
	weeksOpacity: Accessor<number>
	daysOpacity: Accessor<number>
	updateMaxBar: (height: number) => void
}

const AppStoreContext = createContext<AppStore>()

const easing = (t: number) => t * t

export const AppStoreProvider: Component = props => {
	const [state, setState] = createStore<AppStoreState>({
		nMonths: getNumberOfMonths(),
		zoom: 0,
		maxBar: 10,
	})

	const zoom = createMemo(() => easing(state.zoom))
	const updateZoom = (move: number) =>
		setState('zoom', z => clamp(z + move, 0, 1))

	const monthsOpacity = createMemo(() =>
		flipP(clamp(valToP(zoom(), 0.05, 0.3), 0, 1)),
	)
	const weeksOpacity = createMemo(() => clamp(valToP(zoom(), 0.1, 0.35), 0, 1))
	const daysOpacity = createMemo(() => clamp(valToP(zoom(), 0.65, 0.9), 0, 1))

	const updateMaxBar = (height: number) =>
		setState('maxBar', p => (height > p ? height : p))

	const store: AppStore = {
		state,
		zoom,
		updateZoom,
		monthsOpacity,
		weeksOpacity,
		daysOpacity,
		updateMaxBar,
	}

	return (
		<AppStoreContext.Provider value={store}>
			{props.children}
		</AppStoreContext.Provider>
	)
}

export const useAppStore = () => useContext(AppStoreContext) as AppStore
