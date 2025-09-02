import type { Root, Code } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import axios from 'axios';
import * as zlib from 'node:zlib';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import type { PlantUMLOptions } from './types.js';
import { encode64 } from './utils.js';

/**
 * PlantUML block with content and hash for file naming
 */
interface PlantUMLBlock {
  content: string;
  hash: string;
}

/**
 * Create a remark plugin for generating PlantUML diagrams to local files
 * This plugin is intended for development/build time usage to pre-generate diagrams
 */
export function createGeneratePlugin(options: PlantUMLOptions = {}): Plugin<[], Root> {
  const format = options.format || 'svg';
  const serverUrl = options.serverUrl || `https://www.plantuml.com/plantuml/${format}/`;
  const timeout = options.timeout || 10000;
  const language = options.language || 'plantuml';
  const diagramsPath = options.diagramsPath || 'diagrams';

  return function remarkPlantUMLGenerate() {
    return async function transformer(tree: Root, file: any) {
      if (!tree || typeof tree !== 'object') {
        console.warn('Received invalid AST in remarkPlantUMLGenerate plugin');
        return tree;
      }

      const blocks: PlantUMLBlock[] = [];

      // Collect all PlantUML code blocks
      visit(tree, 'code', (node: Code) => {
        if (node.lang === language && node.value?.trim()) {
          const content = node.value.trim();
          const hash = crypto.createHash('md5').update(content).digest('hex');
          blocks.push({ content, hash });
        }
      });

      if (blocks.length === 0) {
        return tree;
      }

      // Get current file path and determine project root
      const currentFilePath = file?.path;
      if (!currentFilePath) {
        console.warn('No file path available for PlantUML generation');
        return tree;
      }

      // Find project root by looking for package.json
      let projectRoot = path.dirname(currentFilePath);
      while (projectRoot && projectRoot !== path.dirname(projectRoot)) {
        if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
          break;
        }
        projectRoot = path.dirname(projectRoot);
      }

      if (!projectRoot) {
        console.warn('Could not find project root for PlantUML generation');
        return tree;
      }

      // Create diagrams directory
      const diagramsDir = path.join(projectRoot, diagramsPath);
      if (!fs.existsSync(diagramsDir)) {
        fs.mkdirSync(diagramsDir, { recursive: true });
        console.log(`Created directory: ${diagramsDir}`);
      }

      // Generate file base name from relative path
      const relativePath = path.relative(projectRoot, currentFilePath);
      const baseFileName = relativePath.replace(/[\/\\]/g, '-').replace(/\.md$/, '');

      // Generate missing diagrams
      for (const block of blocks) {
        const fileName = `${baseFileName}-${block.hash}.${format}`;
        const filePath = path.join(diagramsDir, fileName);

        if (fs.existsSync(filePath)) {
          console.log(`✓ ${fileName} already exists`);
          continue;
        }

        try {
          console.log(`→ Generating ${fileName}...`);
          const diagramData = await generateDiagram(block.content, serverUrl, timeout, format);
          
          if (format === 'svg') {
            fs.writeFileSync(filePath, diagramData, 'utf8');
          } else if (format === 'png') {
            fs.writeFileSync(filePath, Buffer.from(diagramData as ArrayBuffer));
          }
          
          console.log(`✓ Generated ${fileName}`);
        } catch (error) {
          console.error(`✗ Failed to generate ${fileName}: ${(error as Error).message}`);
        }
      }

      return tree;
    };
  };
}

/**
 * Generate diagram from PlantUML content
 */
async function generateDiagram(content: string, serverUrl: string, timeout: number, format: string): Promise<string | Buffer> {
  const encodedContent = encodePlantUmlForUrl(content);
  const url = `${serverUrl}${encodedContent}`;

  const response = await axios.get(url, {
    responseType: format === 'svg' ? 'text' : 'arraybuffer',
    timeout: timeout
  });

  return response.data;
}

/**
 * Encode PlantUML content for URL
 */
function encodePlantUmlForUrl(plantUmlText: string): string {
  let text = plantUmlText.trim();
  if (!text.startsWith('@startuml')) {
    text = '@startuml\n' + text;
  }
  if (!text.endsWith('@enduml')) {
    text = text + '\n@enduml';
  }

  const compressed = zlib.deflateRawSync(text, { level: 9 });
  return encode64(compressed);
}