import { useAppStore } from '@/store/app'

const WeekSection: Component = () => {
	const { weeksOpacity } = useAppStore()

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
