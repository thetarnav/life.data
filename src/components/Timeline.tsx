import { clamp, range } from 'lodash'
import listen from '@/utils/solid/event-listener'

const Timeline: Component = () => {
	const n = 15
	// content wrapper padding: 16rem
	const pad =
		parseFloat(getComputedStyle(document.documentElement).fontSize) * 16

	let mouseX = 0
	let isDragging = false

	const [el, setEl] = createSignal<HTMLElement>()
	const [contentWrapper, setContentWrapper] = createSignal<HTMLElement>()
	const [sections, setSections] = createSignal<HTMLElement[]>([])

	const [zoom, setZoom] = createSignal(0)

	const handleWheel = (e: WheelEvent) => {
		const container = el(),
			wrapper = contentWrapper()

		if (!container || !wrapper || isDragging || e.deltaX || !e.deltaY) return

		e.preventDefault()

		const prevP =
			(container.scrollLeft + mouseX - pad) /
			(container.scrollWidth - 2 * pad)

		// vertical scrolling zooms the timeline
		setZoom(z => clamp(z - e.deltaY / 4000, 0, 1))
		// this effects DOM immediately, causing the mouse to be in different position relatively to the timeline's content

		const newSL = prevP * (container.scrollWidth - 2 * pad) - mouseX + pad
		// container's scroll position needs to be adjusted to correct mouse position
		container.scrollTo({ left: newSL })
	}

	// window event listeners
	listen('mousemove', e => {
		const prevMouseX = mouseX
		mouseX = e.x

		// dragging logic:
		if (isDragging) {
			const drag = prevMouseX - mouseX
			el()?.scrollBy({ left: drag })
		}
	})
	listen('mouseup', () => (isDragging = false))
	listen('dragend', () => (isDragging = false))
	listen('wheel', handleWheel, document.querySelector('body') as HTMLElement, {
		passive: false,
	})

	return (
		<>
			<div class="fixed z-50 left-4 top-4"></div>
			<div
				ref={setEl}
				class="w-full overflow-x-scroll bg-gray-100 my-auto border-t border-b border-dark-100 select-none"
				style={`--zoom: ${zoom()}`}
				onMouseDown={() => (isDragging = true)}
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
