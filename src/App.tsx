import styles from './App.module.scss'
import Aside from './components/Aside'
import Timeline from './components/Timeline'
import { useAppStore } from './store/app'

const App: Component = () => {
	const { zoom, daysOpacity } = useAppStore()

	return (
		<div class="h-full flex items-center">
			<div class="fixed top-4 left-[50vw]">{daysOpacity()}</div>
			<Aside />
			<Timeline />
		</div>
	)
}

export default App
