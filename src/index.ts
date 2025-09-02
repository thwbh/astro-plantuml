import type { AstroIntegration, AstroConfig } from 'astro';
import { createRemarkPlugin } from './remark-plugin.js';
import type { PlantUMLOptions } from './types.js';

export { type PlantUMLOptions } from './types.js';
export { createGeneratePlugin } from './remark-plugin-generate.js';

/**
 * Creates an Astro integration for converting PlantUML code blocks to images
 * 
 * @param options - Configuration options for PlantUML processing
 * @returns An Astro integration
 */
export default function astroPlantUML(options: PlantUMLOptions = {}): AstroIntegration {
  const resolvedOptions: PlantUMLOptions = {
    serverUrl: options.serverUrl || 'https://www.plantuml.com/plantuml/png/',
    timeout: options.timeout || 10000,
    addWrapperClasses: options.addWrapperClasses !== false,
    ...options
  };

  const integration: AstroIntegration = {
    name: 'astro-plantuml',
    hooks: {
      'astro:config:setup': ({ updateConfig, config }: { updateConfig: (newConfig: Partial<AstroConfig>) => void, config: AstroConfig }) => {
        // Get existing remark plugins or initialize empty array
        const existingRemarkPlugins = Array.isArray(config.markdown?.remarkPlugins) 
          ? config.markdown.remarkPlugins 
          : [];
        
        // Add our plugin to the array
        updateConfig({
          markdown: {
            ...config.markdown,
            remarkPlugins: [
              ...existingRemarkPlugins,
              createRemarkPlugin(resolvedOptions)
            ]
          }
        });
      }
    }
  };
  
  return integration;
}