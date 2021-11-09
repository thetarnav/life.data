import { getMonthDays, getMonthName } from '@/logic/time'
import { useAppStore } from '@/store/app'
import { activities, cellHeight } from '@/store/variables'

const MonthSection: Component<{
	index: number
}> = props => {
	const { monthsOpacity } = useAppStore()

	let elRef!: HTMLElement

	return (
		<section
			ref={elRef}
			class="month-section flex flex-shrink-0 items-center justify-center"
			style={{
				'--days': getMonthDays(props.index),
				height: activities.length * cellHeight + 'px',
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
