import { range } from 'lodash'
import listen from '@/utils/solid/event-listener'
import MonthSection from './MonthSection'
import { updateZoom, zoom } from '@/store/general'
import WeekSection from './WeekSection'

const Timeline: Component = () => {
	const n = 21
	// content wrapper padding: 16rem
	const pad =
		parseFloat(getComputedStyle(document.documentElement).fontSize) * 21

	let mouseX = 0
	let isDragging = false

	const [el, setEl] = createSignal<HTMLElement>()
	const [contentWrapper, setContentWrapper] = createSignal<HTMLElement>()

	const handleWheel = (e: WheelEvent) => {
		const container = el(),
			wrapper = contentWrapper()

		if (!container || !wrapper || isDragging || e.deltaX || !e.deltaY) return

		e.preventDefault()

		const prevP =
			(container.scrollLeft + mouseX - pad) /
			(container.scrollWidth - 2 * pad)

		// vertical scrolling zooms the timeline
		updateZoom(-e.deltaY / 4000)
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
				<div
					ref={setContentWrapper}
					class="relative px-84 w-max h-[70vh] box-content"
				>
					<div class="flex h-full">
						<For each={range(n)}>{index => <MonthSection />}</For>
					</div>
					<div class="absolute top-0 left-84 flex h-full">
						<For each={range(Math.floor(n * 4.34524))}>
							{index => <WeekSection />}
						</For>
					</div>
					{/* <Switch>
						<Match when={zoom() < 0.4}>
						</Match>
						<Match when={zoom() >= 0.4}>
						</Match>
					</Switch> */}
				</div>
			</div>
		</>
	)
}

export default Timeline
