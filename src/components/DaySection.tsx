import { dateToString, getDateByIndex } from '@/logic/time'
import { useAppStore } from '@/store/app'

const DaySection: Component<{
	index: number
}> = props => {
	const { daysOpacity } = useAppStore()
	const date = getDateByIndex(props.index)

	return (
		<section
			class="day-section border-r border-orange-400 "
			style={{
				opacity: daysOpacity(),
			}}
		>
			{props.index} — {dateToString(date)}
		</section>
	)
}

export default DaySection
