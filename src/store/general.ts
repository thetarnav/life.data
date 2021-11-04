import { clamp } from 'lodash'

const [generalState, setGeneralState] = createStore({
	zoom: 0,
})

export const zoom = createMemo(() => generalState.zoom)

export const updateZoom = (move: number) =>
	setGeneralState('zoom', z => clamp(z + move, 0, 1))
