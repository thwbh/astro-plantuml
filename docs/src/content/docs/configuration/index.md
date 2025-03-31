---
title: Configuration
description: Learn about the configuration options available in astro-plantuml.
---

# Configuration

The astro-plantuml integration accepts the following configuration options:

## Options

### `server`

The URL of the PlantUML server to use for rendering diagrams.

```js
plantuml({
  server: 'https://www.plantuml.com/plantuml'
})
```

Default: `'https://www.plantuml.com/plantuml'`

### `theme`

The PlantUML theme to use for rendering diagrams.

```js
plantuml({
  theme: 'dark'
})
```

Default: `'default'`

## Complete Configuration Example

Here's an example showing all available configuration options:

```js
import { defineConfig } from 'astro/config';
import plantuml from 'astro-plantuml';

export default defineConfig({
  integrations: [
    plantuml({
      server: 'https://www.plantuml.com/plantuml',
      theme: 'dark'
    })
  ]
});
```

## Using a Custom PlantUML Server

If you want to use your own PlantUML server, you can configure it like this:

```js
plantuml({
  server: 'https://your-plantuml-server.com/plantuml'
})
```

Make sure your custom server supports the same API as the official PlantUML server.

## Available Themes

The following themes are available by default:

- `default` - The standard PlantUML theme
- `dark` - A dark theme suitable for dark mode
- `cerulean` - A blue-based theme
- `cerulean-outline` - A blue-based theme with outlined elements
- `minty` - A mint-colored theme
- `minty-outline` - A mint-colored theme with outlined elements
- `united` - A red-based theme
- `united-outline` - A red-based theme with outlined elements 