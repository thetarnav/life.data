import { getMonthDays, getMonthName } from '@/logic/time'
import { useAppStore } from '@/store/app'
import { cellHeight } from '@/store/variables'

const MonthSection: Component<{
	index: number
}> = props => {
	const { state, monthsOpacity } = useAppStore()

	return (
		<section
			class="month-section flex flex-shrink-0 items-center justify-center"
			style={{
				'--days': getMonthDays(props.index),
				height: state.activities.length * cellHeight + 'px',
			}}
		>
			<div class="absolute top-4 flex flex-col items-center">
				<p>{getMonthName(props.index)}</p>
				<p>{getMonthDays(props.index)}</p>
			</div>
			<div class="cover" style={{ opacity: monthsOpacity() }}></div>
		</section>
	)
}

export default MonthSection
