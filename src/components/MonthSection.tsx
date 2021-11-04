import { zoom } from '@/store/general'

const MonthSection: Component = () => {
	const showWeeks = createMemo(() => zoom() > 0.4)

	return (
		<section class="month-section flex flex-shrink-0 items-center justify-center">
			<p class="absolute top-4">MONTH</p>
		</section>
	)
}

export default MonthSection
