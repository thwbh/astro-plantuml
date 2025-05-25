// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import plantuml from '../src/index';
// https://astro.build/config
export default defineConfig({
	integrations: [
		plantuml(),
		starlight({
			title: 'Astro PlantUML',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Getting Started',
					link: '/'
				},
			],
		}),
	],
});
