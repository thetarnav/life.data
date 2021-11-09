import { useAppStore } from '@/store/app'
import { wait } from '@/utils/general'
import { useViewportObserver } from './Timeline'
import { random, range } from 'lodash'
import { createResource } from 'solid-js'
import DaySection from './DaySection'
import { fetchDaysData } from '@/logic/api'

const Days: Component<{ firstDayIndex: number; nDays: number }> = props => {
	let dayIndex = props.firstDayIndex

	const fetcher = async () => {
		try {
			const data = await fetchDaysData(
				props.firstDayIndex,
				props.firstDayIndex + props.nDays - 1,
			)
			return data
		} catch (error) {
			console.log(error)
			return undefined
		}
	}

	const [daysData] = createResource(fetcher)

	return (
		<For each={range(props.nDays)}>
			{i => <DaySection index={dayIndex++} data={daysData()?.[i]} />}
		</For>
	)
}

const WeekSection: Component<{
	index: number
	days: number
	firstDayIndex: number
}> = props => {
	const { daysOpacity } = useAppStore()

	let elRef!: HTMLElement
	const [isVisible] = useViewportObserver(() => elRef)

	return (
		<section
			ref={elRef}
			class="week-section flex flex-shrink-0 items-center justify-center transition-base duration-300"
			style={{
				opacity: isVisible() ? ('var(--weeks-opacity)' as any) : 0,
				'--week-days': props.days,
				transform: isVisible() ? '' : 'translateY(-64px)',
			}}
		>
			<p class="absolute">W {props.days}</p>
			<div class="cover absolute inset-0"></div>
			<div
				class="absolute inset-0 grid grid-cols-7"
				style={{
					'grid-template-columns': `repeat(${props.days}, minmax(0, 1fr))`,
				}}
			>
				<Show when={isVisible() && daysOpacity() > 0}>
					<Suspense>
						<Days
							nDays={props.days}
							firstDayIndex={props.firstDayIndex}
						/>
					</Suspense>
				</Show>
			</div>
		</section>
	)
}

export default WeekSection
