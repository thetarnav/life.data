import { defineConfig } from 'windicss/helpers'
// import colors from 'windicss/colors'
// import typography from 'windicss/plugin/typography'

export default defineConfig({
	darkMode: false,
	attributify: true,
	plugins: [
		// typography(),
	],
	theme: {
		extend: {
			zIndex: {
				'-1': '-1',
			},
			spacing: {
				'4.5': '1.125rem',
				'15': '3.75rem',
				'18': '4.5rem',
				'21': '5.25rem',
				'10vh': '10vh',
				'20vh': '20vh',
				'30vh': '30vh',
				'40vh': '40vh',
				'50vh': '50vh',
				'60vh': '60vh',
				'70vh': '70vh',
				'80vh': '80vh',
				'90vh': '90vh',
				'10vw': '10vw',
				'20vw': '20vw',
				'30vw': '30vw',
				'40vw': '40vw',
				'50vw': '50vw',
				'60vw': '60vw',
				'70vw': '70vw',
				'80vw': '80vw',
				'90vw': '90vw',
			},
			height: {
				max: 'max-content',
			},
			transitionProperty: {
				'clip-path': 'clip-path',
				base: 'opacity, transform',
			},
		},
		// fontSize: {
		// 	base: '1.125rem',
		// },
	},
	shortcuts: {
		'center-child': 'flex justify-center items-center',
		h1: 'font-display font-bold text-4xl uppercase font-extrabold',
		h2: 'font-display font-bold text-3xl',
		h3: 'font-display font-bold text-2xl leading-6',
		h4: 'font-display font-bold text-xl',
		h5: 'font-display font-bold text-lg',
		h6: 'font-display font-bold text-base',
		'hide-scrollbar': {
			'-ms-overflow-style': 'none',
			'scrollbar-width': 'none',
			'&::-webkit-scrollbar': {
				width: '0',
				height: '0',
				background: 'transparent',
			},
		},
	},
})
