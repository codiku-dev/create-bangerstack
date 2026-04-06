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
2. Supprime l’app mobile **native** (`apps/mobile`, ex. Capacitor) si elle est encore présente ; conserve **mobile-pwa**. Nettoie les scripts racine associés.
3. (Optionnel) Installation des dépendances avec le PM choisi
4. Génération des fichiers `.env` (api + web)
5. (Optionnel) Démarrage de Docker / conteneurs DB
6. `db:start` puis `db:update` (scripts du template)
7. (Optionnel) Exemples web + message de fin

## Prérequis

- [Node.js](https://nodejs.org/) (v18+) — requis pour `npx`
- [Git](https://git-scm.com/)

## Développement (TypeScript)

Le CLI est écrit en TypeScript. Chaque module et paramètre est documenté (JSDoc).

- **Source** : `src/` — `cli.ts`, `workflow.ts`, `pruneMobileNative.ts`, `repo.ts`, `run.ts`, `docker.ts`, `pm.ts`, `database.ts`, `env.ts`, `prompts.ts`, `nodeVersion.ts`, `types.ts`.
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
