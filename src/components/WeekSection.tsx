import { daysFirstWeek, daysLastWeek } from '@/logic/time'
import { useAppStore } from '@/store/app'
// import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { createVisibilityObserver } from '@/utils/solid/intersection-observer'
import { range } from 'lodash'
import DaySection from './DaySection'

const WeekSection: Component<{ index: number; isLast: boolean }> = props => {
	const { weeksOpacity, daysOpacity } = useAppStore()

	const days =
		props.index === 0 ? daysFirstWeek : props.isLast ? daysLastWeek : 7

	let elRef!: HTMLElement

	const [isVisible] = createVisibilityObserver(() => elRef)

	return (
		<section
			ref={elRef}
			class="week-section flex flex-shrink-0 items-center justify-center transition-transform"
			style={{
				opacity: weeksOpacity(),
				'--week-days': days,
				transform: isVisible() && 'translateY(30px)',
			}}
		>
			<p class="absolute">W {days}</p>
			<div class="cover absolute inset-0"></div>
			<div
				class="absolute inset-0 grid grid-cols-7"
				style={{
					'grid-template-columns': `repeat(${days}, minmax(0, 1fr))`,
				}}
			>
				<Show when={isVisible() && daysOpacity() > 0}>
					<For each={range(days)}>{i => <DaySection />}</For>
				</Show>
			</div>
		</section>
	)
}

export default WeekSection
