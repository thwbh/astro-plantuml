#!/usr/bin/env node

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { createGeneratePlugin } from '../dist/remark-plugin-generate.js';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Generate PlantUML diagrams for markdown files
 * Usage: npx astro-plantuml generate [pattern]
 */
async function generateDiagrams() {
  const args = process.argv.slice(2);
  
  // Skip 'generate' command if present
  const pattern = args[0] === 'generate' ? (args[1] || '**/*.md') : (args[0] || '**/*.md');
  
  // Try to read Astro config to get PlantUML options
  let options = await readAstroConfig();
  
  // Default configuration if no config found
  if (!options || Object.keys(options).length === 0) {
    options = {
      serverUrl: 'http://localhost:8080/svg/',
      format: 'svg',
      diagramsPath: 'diagrams',
      timeout: 10000
    };
  }

  console.log('PlantUML Diagram Generator');
  console.log('==========================');
  console.log(`Pattern: ${pattern}`);
  console.log(`Server: ${options.serverUrl}`);
  console.log(`Output: ${options.diagramsPath || 'diagrams'}`);
  console.log('');

  try {
    // Find markdown files
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    
    if (files.length === 0) {
      console.log('No markdown files found');
      return;
    }

    console.log(`Found ${files.length} markdown files`);

    // Create processor with generate plugin
    const processor = unified()
      .use(remarkParse)
      .use(createGeneratePlugin(options));

    // Process each file
    for (const file of files) {
      console.log(`\nProcessing: ${file}`);
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        const vfile = { path: path.resolve(file) };
        
        await processor.process({ value: content, ...vfile });
      } catch (error) {
        console.error(`  Error: ${error.message}`);
      }
    }

    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

/**
 * Try to read PlantUML configuration from Astro config
 */
async function readAstroConfig() {
  const configFiles = [
    'astro.config.mjs',
    'astro.config.js', 
    'astro.config.ts',
    'astro.config.mts'
  ];

  for (const configFile of configFiles) {
    if (fs.existsSync(configFile)) {
      try {
        const configUrl = `file://${path.resolve(configFile)}`;
        const configModule = await import(configUrl);
        const config = configModule.default;
        
        if (config?.integrations) {
          for (const integration of config.integrations) {
            if (integration && typeof integration === 'object') {
              if (integration.name === 'astro-plantuml' || 
                  (typeof integration === 'function' && integration.name?.includes('plantuml'))) {
                return integration.options || {};
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not read config from ${configFile}`);
      }
    }
  }
  
  return {};
}

// Show usage if no arguments
if (process.argv.length <= 2) {
  console.log('astro-plantuml generate');
  console.log('');
  console.log('Generate PlantUML diagrams from markdown files');
  console.log('');
  console.log('Usage:');
  console.log('  npx astro-plantuml generate [pattern]');
  console.log('');
  console.log('Examples:');
  console.log('  npx astro-plantuml generate');
  console.log('  npx astro-plantuml generate "src/**/*.md"');
  console.log('  npx astro-plantuml generate "docs/*.md"');
  process.exit(0);
}

// Run generator
generateDiagrams().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});