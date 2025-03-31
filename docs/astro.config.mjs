import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import plantuml from '../src/index';

export default defineConfig({
  integrations: [
    starlight({
      title: 'astro-plantuml',
      description: 'PlantUML integration for Astro',
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/introduction/' },
            { label: 'Installation', link: '/installation/' },
            { label: 'Usage', link: '/usage/' },
            { label: 'Configuration', link: '/configuration/' },
          ],
        },
      ],
    }),
    plantuml(),
  ],
}); 