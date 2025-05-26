import type { Root, Code } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import axios from 'axios';
import * as zlib from 'node:zlib';
import type { PlantUMLOptions } from './types.js';
import { encode64 } from './utils.js';

/**
 * Create a remark plugin for PlantUML processing
 */
export function createRemarkPlugin(options: PlantUMLOptions = {}): Plugin<[], Root> {
  const serverUrl = options.serverUrl || 'https://www.plantuml.com/plantuml/png/';
  const timeout = options.timeout || 10000;
  const addWrapperClasses = options.addWrapperClasses !== false;
  const language = options.language || 'plantuml';

  return function remarkPlantuml() {
    return async function transformer(tree: Root) {
      if (!tree || typeof tree !== 'object') {
        console.warn('Received invalid AST in remarkPlantuml plugin');
        return tree;
      }
      
      const codeBlocks: Array<{
        node: Code;
        parent: any;
        index: number;
      }> = [];

      // First pass: collect all PlantUML code blocks
      try {
        visit(tree, 'code', (node: Code, index?: number, parent?: any) => {
          if (node && parent && typeof index === 'number' && node.lang === language) {
            codeBlocks.push({
              node,
              parent,
              index
            });
          }
        });
      } catch (error) {
        console.error('Error traversing AST in remarkPlantuml:', error);
        return tree;
      }
      
      if (codeBlocks.length > 0) {
        console.log(`Found ${codeBlocks.length} PlantUML blocks to process`);
      }

      // Process each code block sequentially to ensure completion
      for (const { node, parent, index } of codeBlocks) {
        try {
          const content = node.value;
          if (!content) {
            console.warn('Empty PlantUML content found');
            continue;
          }

          // Encode the PlantUML content using the proper encoder
          const encodedContent = encodePlantUmlForUrl(content.trim());
          
          // Call the PlantUML server to get the PNG
          const url = `${serverUrl}${encodedContent}`;
          
          const response = await axios.get(url, { 
            responseType: 'arraybuffer',
            timeout: timeout
          });

          // Convert the binary response to a base64 string for embedding in HTML
          const base64Image = Buffer.from(response.data).toString('base64');
          const imgSrc = `data:image/png;base64,${base64Image}`;

          // Replace the code block with an HTML node containing the image
          const htmlNode: any = {
            type: 'html',
            value: `<figure${addWrapperClasses ? ' class="plantuml-diagram"' : ''}>
  <img src="${imgSrc}" alt="PlantUML Diagram"${addWrapperClasses ? ' class="plantuml-img"' : ''} />
</figure>`
          };

          // Replace the original code block with the HTML node
          parent.children.splice(index, 1, htmlNode);
        } catch (error) {
          console.error('Error processing PlantUML diagram:', error);
          
          // Create an error message if the conversion fails
          const errorHtml = `<div${addWrapperClasses ? ' class="plantuml-error"' : ''}>
  <p>Error generating PlantUML diagram: ${(error as Error).message}</p>
  <pre><code class="language-${language}">${escapeHtml(node.value)}</code></pre>
</div>`;

          const errorNode: any = {
            type: 'html',
            value: errorHtml
          };
          
          // Replace the original code block with the error message
          parent.children.splice(index, 1, errorNode);
        }
      }

      return tree;
    };
  };
}

/**
 * Encodes a string into the format expected by PlantUML servers
 */
function encodePlantUmlForUrl(plantUmlText: string): string {
  // Add the @startuml and @enduml if they're not already there
  let text = plantUmlText.trim();
  if (!text.startsWith('@startuml')) {
    text = '@startuml\n' + text;
  }
  if (!text.endsWith('@enduml')) {
    text = text + '\n@enduml';
  }
  
  // Compress with zlib deflate (raw deflate, no headers)
  const compressed = zlib.deflateRawSync(text, { level: 9 });
  
  // Encode with PlantUML's custom base64 variant
  return encode64(compressed);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}