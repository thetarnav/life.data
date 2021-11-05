import { useAppStore } from '@/store/app'

const MonthSection: Component = () => {
	const { monthsOpacity } = useAppStore()

	return (
		<section class="month-section flex flex-shrink-0 items-center justify-center">
			<p class="absolute top-4">MONTH</p>
			<div class="w-full h-full" style={{ opacity: monthsOpacity() }}></div>
		</section>
	)
}

export default MonthSection
