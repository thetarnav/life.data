import { daysFirstWeek } from '@/logic/time'
import { useAppStore } from '@/store/app'
// import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { createVisibilityObserver } from '@/utils/solid/intersection-observer'

const WeekSection: Component<{ index: number }> = props => {
	const { weeksOpacity } = useAppStore()

	const days = props.index !== 0 ? 7 : daysFirstWeek

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
			<div class="cover"></div>
		</section>
	)
}

export default WeekSection
