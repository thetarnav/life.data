import { range } from 'lodash'
// import listen from '@solid-primitives/event-listener'
// import listen from '@/utils/solid/event-listener'
import listen from '@/utils/solid/event-listener-rewrite'
import MonthSection from './MonthSection'
import { useAppStore } from '@/store/app'
import WeekSection from './WeekSection'
import { getNumberOfWeeks } from '@/logic/time'

const Timeline: Component = () => {
	const { state, zoom, updateZoom, weeksOpacity } = useAppStore()

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
	listen(window, 'mousemove', e => {
		const prevMouseX = mouseX
		mouseX = e.x

		// dragging logic:
		if (isDragging) {
			const drag = prevMouseX - mouseX
			el()?.scrollBy({ left: drag })
		}
	})
	listen(window, 'mouseup', () => (isDragging = false))
	listen(window, 'dragend', () => (isDragging = false))
	listen(window, 'fullscreenchange', e => (isDragging = false))
	listen(document.querySelector('body') as HTMLElement, 'wheel', handleWheel, {
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
					class="relative px-84 my-16 w-max h-[70vh] box-content"
				>
					<div class="flex h-full">
						<For each={range(state.nMonths)}>
							{index => <MonthSection index={index} />}
						</For>
					</div>
					<Show when={weeksOpacity() > 0}>
						<div class="absolute top-0 left-84 flex h-full">
							<For each={range(getNumberOfWeeks())}>
								{index => <WeekSection index={index} />}
							</For>
						</div>
					</Show>
				</div>
			</div>
		</>
	)
}

export default Timeline
