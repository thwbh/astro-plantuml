---
title: Diagram Generation
description: Learn how to pre-generate PlantUML diagrams for improved build performance.
---

# Diagram Generation

The astro-plantuml integration supports pre-generating diagrams during development for faster, more reliable production builds.

## Generation Workflows

### 1. Server-Only Mode (Default)
Diagrams are generated on-demand from the PlantUML server during build:

```js
// astro.config.mjs
plantuml({
  serverUrl: 'https://www.plantuml.com/plantuml/svg/',
  format: 'svg'
})
```

**Pros:** Simple setup, no additional steps
**Cons:** Requires internet connection during build, slower builds, potential rate limiting

### 2. Local File Mode with Fallback
Pre-generate diagrams during development, use cached files during builds:

```js
// astro.config.mjs
plantuml({
  serverUrl: 'http://localhost:8080/svg/', // Local server for development
  format: 'svg',
  diagramsPath: 'diagrams' // Enable local file lookup
})
```

**Pros:** Fast builds, works offline, no rate limits
**Cons:** Requires pre-generation step

## Using the Built-in Generator

The integration includes a command-line tool for generating diagrams:

### Basic Usage

```bash
# Generate diagrams for all markdown files
npx astro-plantuml generate

# Generate for specific patterns
npx astro-plantuml generate "src/pages/**/*.md"
npx astro-plantuml generate "docs/*.md"
npx astro-plantuml generate "README.md"
```

The generator will:
- Find all PlantUML code blocks in markdown files
- Generate diagrams only for missing/changed content (based on content hash)
- Save diagrams to the configured `diagramsPath` directory
- Use the same configuration as your Astro integration

### Configuration Detection

The generator automatically reads your Astro configuration:

```js
// astro.config.mjs
export default defineConfig({
  integrations: [
    plantuml({
      serverUrl: 'http://localhost:8080/svg/',
      format: 'svg',
      diagramsPath: 'diagrams',
      timeout: 15000
    })
  ]
});
```

The `npx astro-plantuml generate` command will use these exact settings.

## Integration with Build Tools

### Package.json Scripts

Add generation to your build process:

```json
{
  "scripts": {
    "generate-diagrams": "astro-plantuml generate",
    "prebuild": "astro-plantuml generate",
    "dev": "astro-plantuml generate && astro dev"
  }
}
```

### Git Hooks

Ensure diagrams are always up-to-date:

```bash
# .git/hooks/pre-commit
#!/bin/sh
echo "Generating PlantUML diagrams..."
npx astro-plantuml generate
git add diagrams/
echo "Diagrams updated"
```

### GitHub Actions / CI

```yaml
name: Build Site

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Generate PlantUML diagrams
      run: npx astro-plantuml generate
      
    - name: Build site
      run: npm run build
```

## Development Workflow

### Recommended Setup

1. **Local PlantUML Server**: Start a local server for development
   ```bash
   # Using Docker
   docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
   
   # Using Java (if you have PlantUML jar)
   java -jar plantuml.jar -picoweb:8080
   ```

2. **Development Configuration**: Use local server in development
   ```js
   // astro.config.mjs
   plantuml({
     serverUrl: 'http://localhost:8080/svg/',
     format: 'svg',
     diagramsPath: 'diagrams'
   })
   ```

3. **Generate Diagrams**: Run generation when content changes
   ```bash
   # Manual generation
   npx astro-plantuml generate
   ```

3. **Development**: Run Astro dev server
   ```bash
   npm run dev
   ```

### File Organization

The generator creates files with this naming pattern:
```
diagrams/
├── src-pages-blog-post1-a1b2c3d4.svg
├── src-pages-blog-post2-e5f6g7h8.svg
├── docs-readme-i9j0k1l2.svg
└── ...
```

- File paths are converted: `/` → `-`, `.md` removed
- Content hash ensures unique files for different diagrams
- Only missing diagrams are generated (efficient incremental builds)

## Troubleshooting

### Common Issues

**Generator not finding config:**
- Ensure your `astro.config.mjs` exports a default configuration
- Check that the PlantUML integration is properly configured

**Local server connection errors:**
- Verify PlantUML server is running on the configured port
- Check firewall settings
- Try using `http://127.0.0.1:8080` instead of `localhost`

**Generated files not being used:**
- Ensure `diagramsPath` is set in your Astro configuration
- Check that diagram files exist in the correct location
- Verify file naming matches the expected pattern

**Build still hitting remote server:**
- Check if local files exist and are readable
- Ensure content hashes match (regenerate if PlantUML content changed)
- Look for console warnings about missing local files

### Performance Tips

1. **Use SVG format**: Generally faster and more flexible than PNG
2. **Local PlantUML server**: Much faster than remote servers
3. **Incremental generation**: Only changed diagrams are regenerated
4. **Parallel builds**: Pre-generate diagrams before starting build process