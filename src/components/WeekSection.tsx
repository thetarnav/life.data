import { useAppStore } from '@/store/app'
import { useViewportObserver } from './Timeline'
import { range } from 'lodash'
import DaySection from './DaySection'
import useAPI, { DayData } from '@/logic/api'

const Days: Component<{ firstDayIndex: number; nDays: number }> = props => {
	let dayIndex = props.firstDayIndex

	const { requestDaysData } = useAPI

	const [daysData, setDaysData] = createSignal<DayData[]>()
	requestDaysData(
		props.firstDayIndex,
		props.firstDayIndex + props.nDays - 1,
		setDaysData,
	)

	return (
		<Show when={daysData()}>
			{data => (
				<For each={range(props.nDays)}>
					{i => <DaySection index={dayIndex++} data={data[i]} />}
				</For>
			)}
		</Show>
	)
}

const WeekSection: Component<{
	index: number
	days: number
	firstDayIndex: number
}> = props => {
	const { daysOpacity } = useAppStore()

	let elRef!: HTMLElement
	const [isVisible] = useViewportObserver(() => elRef)

	// const [initialTimeout, setInitialTimeout] = createSignal(false)
	// setTimeout(() => setInitialTimeout(true), 500)

	return (
		<section
			ref={elRef}
			class="week-section flex flex-shrink-0 items-center justify-center transition-base duration-300"
			style={{
				opacity: isVisible() ? ('var(--weeks-opacity)' as any) : 0,
				'--week-days': props.days,
				transform: isVisible() ? '' : 'translateY(-64px)',
			}}
		>
			<p class="absolute">W {props.days}</p>
			<div class="cover absolute inset-0"></div>
			<div
				class="absolute inset-0 grid grid-cols-7"
				style={{
					'grid-template-columns': `repeat(${props.days}, minmax(0, 1fr))`,
				}}
			>
				<Show when={isVisible() && daysOpacity() > 0}>
					<Suspense>
						<Days
							nDays={props.days}
							firstDayIndex={props.firstDayIndex}
						/>
					</Suspense>
				</Show>
			</div>
		</section>
	)
}

export default WeekSection
