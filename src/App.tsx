import styles from './App.module.scss'
import Timeline from './components/Timeline'

const App: Component = () => {
	return (
		<div class="h-full flex items-center">
			<div class="bg-red-400 bg-opacity-10 backdrop-filter backdrop-blur z-10 w-48 h-full fixed left-0"></div>
			<Timeline />
		</div>
	)
}

export default App
