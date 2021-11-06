import { useAppStore } from '@/store/app'

const DaySection: Component = props => {
	const { daysOpacity } = useAppStore()
	return (
		<section
			class="day-section border-r border-orange-400"
			style={{
				opacity: daysOpacity(),
			}}
		>
			Day
		</section>
	)
}

export default DaySection
