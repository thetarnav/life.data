import type { Accessor } from 'solid-js'
import type { Store } from 'solid-js/store'

import { flipP, valToP } from '@/utils/general'
import { clamp } from 'lodash'
import { getNumberOfMonths } from '@/logic/time'

interface AppStoreState {
	nMonths: number
	zoom: number
	activities: string[]
}

type AppStore = {
	state: Store<AppStoreState>
	zoom: Accessor<number>
	updateZoom: (move: number) => void
	monthsOpacity: Accessor<number>
	weeksOpacity: Accessor<number>
	daysOpacity: Accessor<number>
}

const AppStoreContext = createContext<AppStore>()

const easing = (t: number) => t * t

export const AppStoreProvider: Component = props => {
	const [state, setState] = createStore<AppStoreState>({
		nMonths: getNumberOfMonths(),
		zoom: 0,
		activities: [
			'sport',
			'work-out',
			'walking',
			'meditation',
			'reading',
			'learning',
			'drawing',
			'photography',
			'graphics',
			'design',
			'programming',
		],
	})

	const zoom = createMemo(() => easing(state.zoom))

	const updateZoom = (move: number) =>
		setState('zoom', z => clamp(z + move, 0, 1))

	const monthsOpacity = createMemo(() =>
		flipP(clamp(valToP(zoom(), 0.05, 0.3), 0, 1)),
	)
	const weeksOpacity = createMemo(() => clamp(valToP(zoom(), 0.1, 0.4), 0, 1))
	const daysOpacity = createMemo(() => clamp(valToP(zoom(), 0.5, 0.8), 0, 1))

	const store: AppStore = {
		state,
		zoom,
		updateZoom,
		monthsOpacity,
		weeksOpacity,
		daysOpacity,
	}

	return (
		<AppStoreContext.Provider value={store}>
			{props.children}
		</AppStoreContext.Provider>
	)
}

export const useAppStore = () => useContext(AppStoreContext) as AppStore
