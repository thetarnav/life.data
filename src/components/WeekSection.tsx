import { daysFirstWeek } from '@/logic/time'
import { useAppStore } from '@/store/app'

const WeekSection: Component<{ index: number }> = props => {
	const { weeksOpacity } = useAppStore()

	const days = props.index !== 0 ? 7 : daysFirstWeek

	return (
		<section
			class="week-section flex flex-shrink-0 items-center justify-center"
			style={{ opacity: weeksOpacity(), '--week-days': days }}
		>
			<p>W {days}</p>
		</section>
	)
}

export default WeekSection
