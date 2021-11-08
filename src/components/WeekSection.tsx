import { useAppStore } from '@/store/app'
import { wait } from '@/utils/general'
import type {
	AddViewportObserverEntry,
	RemoveViewportObserverEntry,
} from '@/utils/solid/intersection-observer'
import { random, range } from 'lodash'
import { createResource } from 'solid-js'
import DaySection from './DaySection'

const Days: Component<{ firstDayIndex: number; nDays: number }> = props => {
	let dayIndex = props.firstDayIndex

	const fetchData = async () => {
		await wait(random(300, 1000))
		return true
	}

	const [daysData] = createResource(fetchData)

	return (
		<For each={range(props.nDays)}>
			{i => <DaySection index={dayIndex++} data={daysData()} />}
		</For>
	)
}

const WeekSection: Component<{
	index: number
	days: number
	firstDayIndex: number
	addEntry: AddViewportObserverEntry
	removeEntry: RemoveViewportObserverEntry
}> = props => {
	const { daysOpacity } = useAppStore()

	const [isVisible, setVisible] = createSignal(false)

	let elRef!: HTMLElement

	onMount(() => props.addEntry(elRef, e => setVisible(e.isIntersecting)))
	onCleanup(() => props.removeEntry(elRef))

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
