import { clamp, range } from 'lodash'

const Timeline: Component = () => {
	const n = 15

	const [el, setEl] = createSignal<HTMLElement>()
	const [sections, setSections] = createSignal<HTMLElement[]>([])

	const [zoom, setZoom] = createSignal(0)
	const [scrollLeft, setScrollLeft] = createSignal(0)
	const [getMouseX, setMouseX] = createSignal(0)

	const mouseP = createMemo<number>(() => {
		const container = el()
		if (!container) return 0
		zoom()
		scrollLeft()
		// console.log(scrollLeft())
		return (container.scrollLeft + getMouseX()) / container.scrollWidth
	})

	const mouseAbsolute = createMemo<number>(() => {
		mouseP()
		return (el()?.scrollLeft ?? 0) + getMouseX()
	})

	const moveXScroll = (delta: number) => {
		const container = el()
		if (!container) return
		setScrollLeft(p =>
			clamp(p + delta, 0, container.scrollWidth - container.clientWidth),
		)
	}

	const handleWheel = (e: WheelEvent) => {
		// e.preventDefault()
		const container = el()
		if (!container) return
		if (e.deltaY) {
			const mouseX = getMouseX()
			const prevSW = container.scrollWidth
			const prevP = (container.scrollLeft + mouseX) / prevSW

			// vertical scrolling zooms the timeline
			setZoom(z => clamp(z - e.deltaY / 2000, 0, 1))
			// this effects DOM immediately, causing the mouse to be in different position relatively to the timeline's content

			const newSW = container.scrollWidth
			const newSL = prevP * newSW - mouseX
			// container's scroll position needs to be adjusted to correct mouse position
			container.scrollTo({ left: newSL })
		}
		if (e.deltaX) {
			// console.log(e.deltaX)
			moveXScroll(e.deltaX)
		}
	}

	// createEffect(
	// 	on(scrollLeft, left => {
	// 		const container = el()
	// 		if (!container) return
	// 		container.scrollTo({ left })
	// 		container.scrollLeft = left
	// 	}),
	// )

	// createEffect(() => console.log(mouseP()))

	const handleMouse = (e: MouseEvent) => {
		// const container = el()
		// if (!container) return
		setMouseX(e.x)
		// const mouseX = e.x + container.scrollLeft
		// const totalWidth = container.scrollWidth
	}

	return (
		<>
			<p class="fixed">{mouseP}</p>
			<div
				ref={setEl}
				class="w-full h-[70vh] overflow-x-scroll bg-gray-100 flex my-auto border-t border-b border-dark-100"
				style={`--zoom: ${zoom()}`}
				onwheel={handleWheel}
				onmousemove={handleMouse}
			>
				<For each={range(n)}>
					{index => (
						<section
							ref={el => setSections(p => [...p, el])}
							class="month-section flex flex-shrink-0 items-center justify-center"
						>
							{index + 1}
						</section>
					)}
				</For>
			</div>
		</>
	)
}

export default Timeline
