import { range } from 'lodash'
import listen from '@/utils/solid/event-listener-rewrite'
import MonthSection from './MonthSection'
import { useAppStore } from '@/store/app'
import WeekSection from './WeekSection'
import { daysFirstWeek, daysLastWeek, getNumberOfWeeks } from '@/logic/time'
import { createViewportObserver } from '@/utils/solid/intersection-observer'

const Timeline: Component = () => {
	const { state, zoom, updateZoom, weeksOpacity, daysOpacity } = useAppStore()

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

	const { add: addObservedRef, remove: removeObservedRef } =
		createViewportObserver({ threshold: 0.2 })

	const Weeks = () => {
		let dayIndex = 0
		return (
			<For each={range(getNumberOfWeeks())}>
				{i => {
					const days =
						i === 0
							? daysFirstWeek
							: i === getNumberOfWeeks() - 1
							? daysLastWeek
							: 7
					const firstDayIndex = dayIndex
					dayIndex += days

					return (
						<WeekSection
							index={i}
							days={days}
							firstDayIndex={firstDayIndex}
							addEntry={addObservedRef}
							removeEntry={removeObservedRef}
						/>
					)
				}}
			</For>
		)
	}

	return (
		<>
			<div class="fixed z-50 left-4 top-4"></div>
			<div
				ref={setEl}
				class="hide-scrollbar w-screen h-screen flex overflow-x-scroll my-auto select-none"
				style={{
					'--zoom': zoom(),
					'--weeks-opacity': weeksOpacity(),
					'--days-opacity': daysOpacity(),
				}}
				onMouseDown={() => (isDragging = true)}
			>
				<div
					ref={setContentWrapper}
					class="relative my-auto px-84 w-max box-content border-t border-b border-dark-100 bg-gray-100"
				>
					<div class="flex">
						<For each={range(state.nMonths)}>
							{index => <MonthSection index={index} />}
						</For>
					</div>
					<Show when={weeksOpacity() > 0}>
						<div class="absolute top-0 left-84 flex h-full">
							<Weeks />
						</div>
					</Show>
				</div>
			</div>
		</>
	)
}

export default Timeline
