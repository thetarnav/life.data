import { flipP, valToP } from '@/utils/general'
import { clamp } from 'lodash'

const [generalState, setGeneralState] = createStore({
	zoom: 0,
})

export const zoom = createMemo(() => generalState.zoom)

export const updateZoom = (move: number) =>
	setGeneralState('zoom', z => clamp(z + move, 0, 1))

export const monthsOpacity = createMemo(() =>
	flipP(clamp(valToP(zoom(), 0.2, 0.5), 0, 1)),
)

export const weeksOpacity = createMemo(() =>
	clamp(valToP(zoom(), 0.3, 0.6), 0, 1),
)
