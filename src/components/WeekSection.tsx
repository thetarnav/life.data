import { weeksOpacity } from '@/store/general'

const WeekSection: Component = () => {
	return (
		<section
			class="week-section flex flex-shrink-0 items-center justify-center"
			style={{ opacity: weeksOpacity() }}
		>
			<p>W</p>
		</section>
	)
}

export default WeekSection
