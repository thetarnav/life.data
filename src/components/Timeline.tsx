import { clamp, range } from 'lodash'
import listen from '@/utils/solid/event-listener'

const Timeline: Component = () => {
	const n = 15
	// content wrapper padding: 16rem
	const pad =
		parseFloat(getComputedStyle(document.documentElement).fontSize) * 16

	const [el, setEl] = createSignal<HTMLElement>()
	const [contentWrapper, setContentWrapper] = createSignal<HTMLElement>()
	const [sections, setSections] = createSignal<HTMLElement[]>([])

	const [zoom, setZoom] = createSignal(0)
	const [getMouseX, setMouseX] = createSignal(0)

	// const getContentWidth = ():number => contentWrapper.scrollWidth

	const handleWheel = (e: WheelEvent) => {
		const container = el(),
			wrapper = contentWrapper()
		if (!container || !wrapper) return
		if (e.deltaY) {
			e.preventDefault()

			const mouseX = getMouseX()
			const prevP =
				(container.scrollLeft + mouseX - pad) /
				(container.scrollWidth - 2 * pad)

			// vertical scrolling zooms the timeline
			setZoom(z => clamp(z - e.deltaY / 2000, 0, 1))
			// this effects DOM immediately, causing the mouse to be in different position relatively to the timeline's content

			const newSL = prevP * (container.scrollWidth - 2 * pad) - mouseX + pad
			// container's scroll position needs to be adjusted to correct mouse position
			container.scrollTo({ left: newSL })
		} else if (e.deltaX) {
			// console.log(e.deltaX)
			// moveXScroll(e.deltaX)
		}
	}

	listen('mousemove', e => setMouseX(e.x))

	return (
		<>
			<div
				ref={setEl}
				class="w-full overflow-x-scroll bg-gray-100 my-auto border-t border-b border-dark-100"
				style={`--zoom: ${zoom()}`}
				onwheel={handleWheel}
			>
				<div ref={setContentWrapper} class="flex px-64 w-max">
					<For each={range(n)}>
						{index => (
							<section
								ref={el => setSections(p => [...p, el])}
								class="month-section h-[70vh] flex flex-shrink-0 items-center justify-center"
							>
								{index + 1}
							</section>
						)}
					</For>
				</div>
			</div>
		</>
	)
}

export default Timeline
