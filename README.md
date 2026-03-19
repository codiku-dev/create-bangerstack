# create-bangerstack

Scaffold a new **Bangerstack** project (Turborepo with Next.js + NestJS) in one command, using an interactive CLI powered by [enquirer](https://github.com/enquirer/enquirer).

## Usage

```bash
npx create-bangerstack
```

Without any arguments, the CLI will prompt you for:
- **Project name** (default: `bangerstack-project`)
- **Package manager** (npm, yarn, pnpm, bun)
- **Install dependencies?** (yes/no)
- **Start Docker Desktop?** (yes/no)
- **Start DB containers (docker compose)?** (yes/no)
- **Start the project now?** (yes/no)

```bash
npx create-bangerstack my-project
```

Creates the project directly in `my-project` (the other questions are still prompted).

## What the command does

1. Clones the template [codiku-dev/turbo-template](https://github.com/codiku-dev/turbo-template)
2. (Optional) Installs dependencies with the selected package manager
3. (Optional) Starts Docker (`docker compose up -d` if a `docker-compose.yml` exists)
4. Runs `db:start` then `db:update` (template scripts)
5. (Optional) Starts the development server

## Requirements

- [Node.js](https://nodejs.org/) (v18+) — required for `npx`
- [Git](https://git-scm.com/)

## Development (TypeScript)

The CLI is written in TypeScript. Each module and parameter is documented (JSDoc).

- **Source**: `src/` — `cli.ts` (workflow), `run.ts`, `docker.ts`, `repo.ts`, `pm.ts`, `database.ts`, `env.ts`, `prompts.ts`, `types.ts`.
- **Build**: `bun run build` → compiles to `dist/`.
- **Entry point**: `dist/cli.js` (targeted by `bin` in `package.json`).

To test locally:

```bash
bun run build
node dist/cli.js my-project
```

Or after `bun link`: `npx create-bangerstack test-app`.

## Publishing to npm

```bash
bun run build
npm publish
```

(`prepublishOnly` will automatically run the build before publishing.)
