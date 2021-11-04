import styles from './App.module.scss'
import Timeline from './components/Timeline'
import { zoom } from './store/general'

const App: Component = () => {
	return (
		<div class="h-full flex items-center">
			<div class="fixed top-4 left-[50vw]">{zoom()}</div>
			<div class="bg-red-400 bg-opacity-10 backdrop-filter backdrop-blur z-10 w-48 h-full fixed left-0"></div>
			<Timeline />
		</div>
	)
}

export default App
