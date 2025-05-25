# Astro PlantUML Integration Project

## Overview
This is an Astro integration that automatically converts PlantUML code blocks in markdown files to diagrams using the PlantUML server.

## Project Structure
```
astro-plantuml/
├── src/               # Source TypeScript files
│   ├── index.ts      # Main integration entry point
│   ├── plugin.ts     # Rehype plugin implementation
│   ├── types.ts      # TypeScript type definitions
│   └── utils.ts      # Utility functions (base64 encoding)
├── dist/             # Compiled JavaScript files (generated)
├── example/          # Demo application for Netlify
└── docs/             # Documentation site (Starlight)
```

## Key Features
- Automatic PlantUML diagram rendering
- Configurable PlantUML server URL
- Error handling with fallback
- CSS class injection for styling
- TypeScript support

## Development Commands
```bash
# Build the integration
npm run build

# Watch mode for development
npm run dev

# Test in example app
cd example
npm install
npm run dev
```

## Testing & Validation
Before committing changes:
1. Run `npm run build` to ensure TypeScript compilation succeeds
2. Test the integration in the example app
3. Verify all PlantUML diagram types render correctly

## Integration Architecture
The integration uses Astro's hook system to inject a rehype plugin that:
1. Finds code blocks with language "plantuml"
2. Extracts the PlantUML content
3. Encodes it using PlantUML's custom base64 encoding
4. Fetches the diagram from the PlantUML server
5. Replaces the code block with an image element

## Publishing Checklist
- [ ] Update version in package.json
- [ ] Ensure "withastro" keyword is present
- [ ] Run `npm run build`
- [ ] Test in example app
- [ ] Update README with any new features
- [ ] Run `npm publish`

## Common Issues
1. **Build errors**: Ensure all dependencies are installed
2. **Diagram rendering fails**: Check PlantUML server URL and network connectivity
3. **TypeScript errors**: Run `npm run build` to catch type issues early