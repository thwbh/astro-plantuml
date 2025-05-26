# Astro PlantUML Documentation

This is the documentation site for the Astro PlantUML integration, built with [Starlight](https://starlight.astro.build).

## 🚀 Project Structure

```
docs/
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   │   │   ├── configuration/
│   │   │   ├── installation/
│   │   │   ├── introduction/
│   │   │   └── usage/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Documentation pages are written in `.md` or `.mdx` files in the `src/content/docs/` directory.

## 🧞 Commands

All commands are run from the docs directory:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build the documentation site to `./dist/`        |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📚 Learn More

- [Astro PlantUML on npm](https://www.npmjs.com/package/astro-plantuml)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)