import { onCleanup } from 'solid-js'

export default function clickOutside(
	el: Element,
	accessor: () => (e: MouseEvent) => void,
) {
	const onClick = (e: MouseEvent) =>
		!el.contains(e.target as any) && accessor()(e)
	document.body.addEventListener('click', onClick)

	onCleanup(() => document.body.removeEventListener('click', onClick))
}
