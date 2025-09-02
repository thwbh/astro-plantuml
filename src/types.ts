/**
 * Configuration options for the PlantUML integration
 */
export interface PlantUMLOptions {
    /**
     * URL of the PlantUML server
     * @default 'http://www.plantuml.com/plantuml/png/'
     */
    serverUrl?: string;
    
    /**
     * Timeout for HTTP requests to the PlantUML server in milliseconds
     * @default 10000
     */
    timeout?: number;
    
    /**
     * Add CSS classes to wrapper elements for styling
     * @default true
     */
    addWrapperClasses?: boolean;
    
    /**
     * Language identifier in code blocks to process as PlantUML
     * @default 'plantuml'
     */
    language?: string;
    
    /**
     * Output format for PlantUML diagrams
     * @default 'png'
     */
    format?: 'png' | 'svg';
    
    /**
     * Remove inline styles from SVG elements for better CSS control
     * Only applies when format is 'svg'
     * @default false
     */
    removeInlineStyles?: boolean;
    
    /**
     * Use pre-generated SVG files from local filesystem instead of server generation
     * When enabled, looks for SVG files in 'diagrams' directory next to markdown files
     * @default false
     */
    useLocalFiles?: boolean;
  }