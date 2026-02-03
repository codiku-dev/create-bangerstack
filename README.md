# create-bangerstack

Scaffold a new **Bangerstack** project (Turborepo avec Next.js + NestJS) en une commande, avec une CLI interactive via [enquirer](https://github.com/enquirer/enquirer).

## Utilisation

```bash
npx create-bangerstack
```

Sans argument, la CLI te demande :
- le **nom du projet** (défaut : `bangerstack-project`)
- le **gestionnaire de paquets** (npm, yarn, pnpm, bun)
- **Installer les dépendances ?** (oui/non)
- **Démarrer Docker Desktop ?** (oui/non)
- **Démarrer les conteneurs DB (docker compose) ?** (oui/non)
- **Lancer le projet maintenant ?** (oui/non)

```bash
npx create-bangerstack mon-projet
```

Crée directement le projet dans `mon-projet` (les autres questions s’affichent quand même).

## Ce que fait la commande

1. Clone le template [codiku-dev/turbo-template](https://github.com/codiku-dev/turbo-template)
2. (Optionnel) Installation des dépendances avec le PM choisi
3. (Optionnel) Démarrage de Docker (`docker compose up -d` si un `docker-compose.yml` existe)
4. `db:start` puis `db:update` (scripts du template)
5. (Optionnel) Lancement du serveur de dev

## Prérequis

- [Node.js](https://nodejs.org/) (v18+) — requis pour `npx`
- [Git](https://git-scm.com/)

## Développement (TypeScript)

Le CLI est écrit en TypeScript. Chaque module et paramètre est documenté (JSDoc).

- **Source** : `src/` — `cli.ts` (workflow), `run.ts`, `docker.ts`, `repo.ts`, `pm.ts`, `database.ts`, `env.ts`, `prompts.ts`, `types.ts`.
- **Build** : `bun run build` → compile vers `dist/`.
- **Entry** : `dist/cli.js` (pointé par `bin` dans `package.json`).

Tester en local :

```bash
bun run build
node dist/cli.js mon-projet
```

Ou après `bun link` : `npx create-bangerstack test-app`.

## Publication sur npm

```bash
bun run build
npm publish
```

(`prepublishOnly` lance le build automatiquement avant publish.)
