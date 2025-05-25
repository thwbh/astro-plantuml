import { defineConfig } from 'astro/config';
import plantuml from 'astro-plantuml';

export default defineConfig({
  integrations: [plantuml()],
  site: 'https://astro-plantuml-demo.netlify.app'
});