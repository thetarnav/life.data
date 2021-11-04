import { monthsOpacity, zoom } from '@/store/general'
import { flipP, valToP } from '@/utils/general'
import { clamp } from 'lodash'

const MonthSection: Component = () => {
	return (
		<section class="month-section flex flex-shrink-0 items-center justify-center">
			<p class="absolute top-4">MONTH</p>
			<div class="w-full h-full" style={{ opacity: monthsOpacity() }}></div>
		</section>
	)
}

export default MonthSection
