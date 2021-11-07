import { useAppStore } from '@/store/app'
import { createVisibilityObserver } from '@solid-primitives/intersection-observer'
// import { createVisibilityObserver } from '@/utils/solid/intersection-observer'
import { range } from 'lodash'
import DaySection from './DaySection'

const WeekSection: Component<{
	index: number
	days: number
	firstDayIndex: number
}> = props => {
	const { weeksOpacity, daysOpacity } = useAppStore()

	let elRef!: HTMLElement

	const [isVisible] = createVisibilityObserver(() => elRef)

	return (
		<section
			ref={elRef}
			class="week-section flex flex-shrink-0 items-center justify-center transition-transform"
			style={{
				opacity: weeksOpacity(),
				'--week-days': props.days,
				transform: isVisible() && 'translateY(30px)',
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
					{() => {
						let dayIndex = props.firstDayIndex
						return (
							<For each={range(props.days)}>
								{i => <DaySection index={dayIndex++} />}
							</For>
						)
					}}
				</Show>
			</div>
		</section>
	)
}

export default WeekSection
