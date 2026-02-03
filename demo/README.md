<div align="center">

# 🚀 Turbo Template

**A blazing-fast, type-safe monorepo starter with Next.js, NestJS, tRPC, and Tailwind CSS**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs)](https://nestjs.com/)
[![tRPC](https://img.shields.io/badge/tRPC-11-blue?logo=trpc)](https://trpc.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.7-ef4444?logo=turborepo)](https://turborepo.org/)

*Built with ❤️ using Bun, TypeScript, and modern best practices*

</div>

---

## 🔥 Features
### ⚛️ Frontend

- **⚡ Next.js 16** - Latest Next.js with App Router, React 19, and Server Components
- **🔄 Hot Module Replacement** - Instant updates during development
- **📦 Auto-reload** - Styles and components from shared packages refresh automatically

### 🏗️ Backend

- **🚀 NestJS 11** - Progressive Node.js framework with decorators and dependency injection
- **🔄 Watch Mode** - Auto-reload on file changes
- **📝 Swagger Integration** - API documentation ready
- **📊 Request Logging Middleware** - Automatic logging of all tRPC requests with inputs, outputs, errors, and performance metrics

### 🗄️ Database & ORM

- **🐘 Prisma Setup** - Fully configured Prisma ORM with PostgreSQL, migrations, and Prisma Studio
- **🔄 Database Migrations** - Easy migration workflow with `bun db:update`
- **🐳 Docker Integration** - One-command PostgreSQL setup with Docker Compose

### 🛡️ Type Safety & Validation

- **🔐 Environment Variable Type Checking** - Zod-powered validation with TypeScript types generated from your `.env` files. Catch missing or invalid env vars before your app starts!
- **✅ Runtime Validation** - Automatic Zod schema validation on startup with watch mode during development



### 🔌 API & Type Safety

- **⚡ tRPC Setup** - End-to-end type-safe APIs between Next.js and NestJS. Zero API contracts, full autocomplete!
- **📚 tRPC UI Documentation** - Beautiful, interactive API docs at `/docs` - test endpoints directly from your browser
- **🎯 Shared Router Definitions** - Centralized tRPC routers in `@repo/trpc` for maximum type safety

### 🎨 Styling & UI

- **💨 Tailwind CSS v4** - Latest Tailwind with PostCSS integration and auto-compilation
- **🎨 Shared UI Package** - Reusable React components in `@repo/ui` with hot-reload support
- **📖 Storybook** - Component development environment with isolated component testing


### 🧰 Developer Experience

- **📦 Shared Configs** - Common TypeScript, ESLint, and Jest configurations across the monorepo
- **🔍 Type Checking** - Run `check-types` across all packages for instant feedback
- **🎯 Turborepo** - Lightning-fast builds with intelligent caching
- **⚡ Bun** - Ultra-fast package manager and runtime

### 🧪 Testing & Quality

- **✅ Jest Configuration** - Shared Jest setup for unit and integration tests
- **📋 ESLint + Prettier** - Consistent code style across the entire monorepo
- **🔍 TypeScript Strict Mode** - Maximum type safety enabled

---

## ✨ What's Inside?

This is a **production-ready monorepo** that combines the best of both worlds:

### 🎯 Apps

- **`apps/web`** - Next.js 16 frontend with React 19, tRPC client, and Tailwind CSS v4
- **`apps/api`** - NestJS 11 backend with tRPC server, Prisma ORM, PostgreSQL, and **tRPC UI** for interactive API docs

### 📦 Packages

- **`@repo/ui`** - Shared React component library with Tailwind CSS and Storybook
- **`@repo/trpc`** - Shared tRPC router definitions for end-to-end type safety
- **`@repo/eslint-config`** - Shared ESLint + Prettier configurations
- **`@repo/typescript-config`** - Shared TypeScript configurations
- **`@repo/jest-config`** - Shared Jest testing configurations

---

## 🎬 Quick Start

### Prerequisites

- **Bun** ≥ 1.2.15 (package manager)
- **Docker** & **Docker Compose** (for PostgreSQL database)
- **Node.js** ≥ 18

### Initial Setup

```bash
# 1. Install dependencies
bun install

# 2. Start docker, then to Start the PostgreSQL database :

bun db:start

# 3. Run database migrations and generate Prisma client (REQUIRED - run this once!)
bun db:update

# 4. Start development servers
bun dev
```

That's it! 🎉 Your apps will be running at:
- **Web**: http://localhost:3000
- **API**: http://localhost:3090 (or check your `PORT` env var)
- **Docs(tRPC UI)**: http://localhost:3090/docs (Interactive API documentation)

---

## 🔥 Development Mode Explained

You just run 

```bash
bun dev
```
And here's what happens **concurrently**:

### 🎯 Behind the dev script

1. **`turbo run dev`** - Runs all `dev` scripts across apps:
   - **Next.js dev server** (`apps/web`) - Hot module replacement enabled
   - **NestJS dev server** (`apps/api`) - Watch mode with auto-reload

2. **`npm run watch:ui`** - Watches the shared UI package:
   - **`dev:styles`** - Tailwind CSS compiler in watch mode (auto-rebuilds `dist/globals.css`)
   - **`dev:components`** - TypeScript compiler in watch mode (auto-rebuilds component types)

3. **`npm run check-env:watch`** - Environment variable validator:
   - Watches for `.env` file changes
   - Validates required environment variables match your `env-type.ts` schemas
   - Exits with error if validation fails

### 🔄 Auto-Refresh Magic ✨

**Styles & Components from `@repo/ui` automatically refresh!**

- **Styles**: When you modify `packages/ui/src/globals.css` or any Tailwind classes, the CSS is automatically recompiled to `packages/ui/dist/globals.css`
- **Components**: When you modify any component in `packages/ui/src`, TypeScript recompiles and the Next.js app hot-reloads
- **No manual rebuild needed** - Everything syncs in real-time! 🚀

The web app imports styles via:
```css
@import "tailwindcss";
@import "@repo/ui/globals.css";
```

So changes in the shared package are instantly available in your Next.js app!

---

## 🔌 tRPC: End-to-End Type Safety

This monorepo uses **tRPC** for type-safe API communication between your Next.js frontend and NestJS backend.

### How It Works

1. **Define your router** in `packages/trpc/src/server.ts`:
```typescript
const appRouter = t.router({
  users: t.router({
    getUserById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        // Your logic here
      }),
  }),
});

export type AppRouter = typeof appRouter;
```

2. **Use in your NestJS API** (`apps/api/src/app.router.ts`):
```typescript
@Query({ output: z.object({ message: z.string() }) })
async hello(): Promise<{ message: string }> {
  return { message: 'Hello World' };
}
```

3. **Call from your Next.js app** with full autocomplete:
```typescript
import { trpc } from '@web/libs/trpc-client';

const { data } = trpc.users.getUserById.useQuery({ id: 1 });
// ✅ Fully typed! TypeScript knows the exact return type
```

### Benefits

- ✅ **Zero API contracts** - Types are shared, not duplicated
- ✅ **Autocomplete** - Your IDE knows all available endpoints
- ✅ **Compile-time safety** - Catch errors before runtime
- ✅ **No code generation** - Pure TypeScript inference

---

## 🎨 tRPC UI: Interactive API Documentation

This project includes **tRPC UI** - a beautiful, interactive API documentation and testing interface built right into your NestJS backend.

### Accessing tRPC UI

Once your API server is running, visit:

```
http://localhost:3090/docs
```

> **Note**: The port may vary based on your `PORT` environment variable (default: 3090)

### What You Get

tRPC UI provides a **fully interactive playground** where you can:

- 🔍 **Browse all endpoints** - See every procedure in your tRPC router
- 📝 **View schemas** - Inspect input/output types with Zod validation
- 🧪 **Test endpoints** - Execute queries and mutations directly from the browser
- 📊 **See responses** - View formatted JSON responses in real-time
- 🔗 **Copy code examples** - Get ready-to-use code snippets for your frontend
- 📚 **Read documentation** - View descriptions and metadata for each endpoint

### How It Works

The tRPC UI is automatically generated from your tRPC router definitions:

1. **Router Discovery**: The UI scans your `AppRouter` and all nested routers
2. **Schema Extraction**: Extracts Zod schemas for inputs and outputs
3. **Type Inference**: Uses TypeScript types to show exact return types
4. **Interactive Testing**: Connects to your tRPC endpoint to execute procedures

### Configuration

The tRPC UI is configured in `apps/api/src/infrastructure/docs/docs.controller.ts`:

```typescript
@Controller("docs")
export class TrpcPanelController {
  @All()
  panel(): string {
    return renderTrpcPanel(this.appRouter, {
      url: process.env.TRPC_URL, // e.g., "http://localhost:3090/trpc"
      meta: {
        title: "API Documentation",
        description: "This is the documentation of the API.",
      },
    });
  }
}
```

### Environment Setup

Make sure your `.env` file includes:

```env
TRPC_URL=http://localhost:3090/trpc
```

This tells tRPC UI where to send requests when testing endpoints.

### Usage Example

1. **Start your API server**:
   ```bash
   bun dev
   ```

2. **Open tRPC UI** in your browser:
   ```
   http://localhost:3090/docs
   ```

3. **Explore your API**:
   - Navigate through router groups (e.g., `app`, `users`)
   - Click on any procedure to see its schema
   - Fill in input fields and click "Execute"
   - View the response and copy the code example

4. **Use in your frontend**:
   - Copy the generated code snippet
   - Paste it into your React component
   - Enjoy full type safety! 🎉

### Features

- 🎯 **Zero Configuration** - Works out of the box with your existing tRPC setup
- 🔄 **Auto-updates** - Reflects changes to your router automatically
- 🎨 **Beautiful UI** - Modern, responsive interface
- 📱 **Mobile-friendly** - Test your API on any device
- 🔒 **Development Only** - Typically disabled in production (you can add environment checks)

### Customization

You can customize the UI by modifying the `renderTrpcPanel` options:

```typescript
renderTrpcPanel(this.appRouter, {
  url: process.env.TRPC_URL,
  meta: {
    title: "My Awesome API",
    description: "Custom description here",
  },
  // Add custom styling, themes, etc.
});
```

---

## 📊 Request Logging Middleware

This project includes a **powerful logging middleware** for tRPC that automatically logs all API requests with detailed information.

### Features

The `LoggedMiddleware` provides comprehensive request logging:

- 📝 **Request Details** - Logs the full request URL, path, and type (query/mutation)
- ⏱️ **Performance Metrics** - Tracks execution duration for each request
- 📥 **Input Logging** - Records all input parameters sent to procedures
- 📤 **Response Logging** - Logs successful responses with data payloads
- ❌ **Error Logging** - Captures and logs errors with full error details
- 🕐 **Timestamps** - Includes ISO timestamps for all log entries

### How It Works

The middleware intercepts all tRPC procedures and logs:
- Request URL (built from `TRPC_URL` env variable)
- Input parameters
- Response data or error details
- Execution duration in milliseconds
- Request metadata (path, type)

### Usage

Apply logging to your routers using the `@LoggedRouter` decorator:

```typescript
import { LoggedRouter } from '@api/src/infrastructure/middlewares/logged-router.decorator';
import { Query, Mutation } from 'nestjs-trpc';

@LoggedRouter({ alias: 'users' })
export class UserRouter {
  @Query({ /* ... */ })
  getUserById(@Input('id') id: number) {
    // This request will be automatically logged
    return this.usersService.findOne(id);
  }
}
```

### Log Format

The middleware outputs structured logs in the following format:

```
[2026-01-26T10:30:45.123Z]
REQUEST : http://localhost:3090/trpc/users.getUserById
INPUT :
{
  "id": 1
}
META :
{
  "path": "users.getUserById",
  "type": "query",
  "durationMs": 15
}
RESPONSE :
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

For errors, the log includes an `ERROR` section instead of `RESPONSE`:

```
[2026-01-26T10:30:45.123Z]
REQUEST : http://localhost:3090/trpc/users.getUserById
INPUT :
{
  "id": 999
}
META :
{
  "path": "users.getUserById",
  "type": "query",
  "durationMs": 5
}
ERROR :
{
  "code": "NOT_FOUND",
  "message": "User not found"
}
```

### Configuration

The middleware uses NestJS's `ConsoleLogger` and is registered in `TrpcMiddlewaresModule`:

```typescript
@Global()
@Module({
  providers: [ConsoleLogger, LoggedMiddleware],
  exports: [LoggedMiddleware],
})
export class TrpcMiddlewaresModule { }
```

Make sure your `.env` file includes:
```env
TRPC_URL=http://localhost:3090
```

This is used to build the full request URL in logs.

### Benefits

- 🔍 **Debugging** - Quickly identify which requests are slow or failing
- 📊 **Monitoring** - Track API usage patterns and performance
- 🐛 **Error Tracking** - See exact error details and request context
- 📈 **Performance Analysis** - Monitor execution times across all endpoints

---

## 🔐 Authentication (Better Auth + tRPC)

The template uses **Better Auth** for authentication. The API protects tRPC procedures by default; procedures marked with `@Public()` are accessible without a session.

### Backend: `@AuthGuard` and `@Public()`

**Router-level: `@AuthGuard(args?)`**

Apply `@AuthGuard` on a tRPC router class to enable auth (and optionally request/response logging) for all procedures in that router:

```typescript
import { Router, Query } from 'nestjs-trpc';
import { AuthGuard } from '@api/src/infrastructure/decorators/auth/auth-guard.decorator';
import { Public } from '@api/src/infrastructure/decorators/auth/public-procedure.decorator';

@Router({ alias: 'app' })
@AuthGuard({ logs: true })  // optional params below
export class AppRouter {
  @Public()
  @Query({ output: z.object({ message: z.string() }) })
  async hello() {
    return { message: 'Hello, no auth required' };
  }

  @Query({ output: z.object({ message: z.string() }) })
  async protectedHello() {
    return { message: 'Hello, you are authenticated' };  // ctx.user, ctx.session available
  }
}
```

**`@AuthGuard` parameters**

| Param     | Type    | Default | Description |
|----------|---------|---------|-------------|
| `logs`   | boolean | `false` | If `true`, also applies request/response logging (e.g. input, output, duration) for this router. |
| `enabled`| boolean | `true`  | If `false`, auth is disabled for the router (e.g. for an auth-only router); only logging applies when `logs: true`. |

**Procedure-level: `@Public()`**

- **Without `@Public()`** – The procedure **requires** a valid session. If the request has no session (or invalid session), the API returns `UNAUTHORIZED` (401).
- **With `@Public()`** – The procedure is **optional auth**: it can be called with or without a session. If the user is logged in, `ctx.user` and `ctx.session` are set; otherwise they are `undefined`.

At startup, `PublicPathScannerService` scans all routers and registers procedure paths that use `@Public()`. `AuthGuardMiddleware` then allows those paths without requiring auth; all other procedures require a session (Better Auth reads the session from request cookies).

**Context in procedures**

- **Protected procedures** (no `@Public()`): `ctx.user` and `ctx.session` are always set (middleware returns 401 otherwise).
- **Public procedures** (`@Public()`): `ctx.user` and `ctx.session` are set when the client sends a valid session cookie; otherwise they are `undefined`.

### Frontend: Auth client

The web app uses the Better Auth React client from `@web/libs/auth-client`:

```typescript
import { createAuthClient } from "better-auth/react";

export const { useSession, signIn, signUp, signOut } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,  // e.g. http://localhost:3090
});
```

**Exposed APIs**

| API          | Usage |
|-------------|--------|
| `useSession()` | React hook: `{ data: session, isPending, error }`. Session contains `user` and `session`. Use for conditional UI (e.g. show “Sign in” vs “Sign out”). |
| `signIn.email({ email, password })` | Sign in with email/password. Call from a form handler; redirect or update UI on success/error. |
| `signUp.email({ name, email, password })` | Register with email/password. |
| `signOut()` | Sign out the current user (clears session cookie). |

**Important**

- Better Auth uses **cookies** for the session. The auth API is called on your backend (e.g. Nest); the Next.js app must use `NEXT_PUBLIC_BETTER_AUTH_URL` pointing at that backend so that sign-in/sign-up requests and cookie domain match.
- tRPC and `fetch` send cookies by default for same-origin or correctly configured cross-origin requests, so protected tRPC procedures receive the session cookie and the API can resolve the user.

**Example: sign-in form**

```typescript
import { signIn } from '@web/libs/auth-client';

async function handleSubmit(values: { email: string; password: string }) {
  const res = await signIn.email({ email: values.email, password: values.password });
  if (res.error) {
    // show res.error.message
    return;
  }
  // redirect or update UI
}
```

**Example: show user or “Sign out”**

```typescript
import { useSession, signOut } from '@web/libs/auth-client';

function Account() {
  const { data: session, isPending } = useSession();
  if (isPending) return <div>Loading…</div>;
  if (!session?.user) return <div>Not signed in</div>;
  return (
    <div>
      <p>Hello, {session.user.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

---

## 🛠️ Type Checking & Utilities

### Type Checking

Run type checking across the entire monorepo:

```bash
# Check types in all packages and apps
turbo run check-types
```

This runs `tsc --noEmit` in each package/app, ensuring:
- No TypeScript errors
- All imports resolve correctly
- Type definitions are valid
- Shared packages are properly typed

### Environment Variable Validation

The project includes a **powerful environment validation system**:

```bash
# Check environment variables once
bun check-env

# Watch for .env changes and validate automatically
bun check-env:watch
```

**How it works:**
- Each app/package can have an `env-type.ts` file defining required env vars using Zod
- The validator checks that all required variables are present and valid
- Automatically loads `.env.local.development`, `.env.production`, or `.env` files
- Runs in watch mode during `bun dev` to catch missing env vars early

**Generate env types from existing `.env` files:**
```bash
bun generate-env-types
```

---

## 📜 Available Commands

### 🚀 Development

```bash
# Start all dev servers with auto-reload
bun dev

# Start only the UI package watchers
bun watch:ui
```

### 🗄️ Database

```bash
# Start PostgreSQL in Docker (run this first!)
bun db:start

# Run migrations and generate Prisma client
bun db:update

# Open Prisma Studio (database GUI)
bun db:studio
```

### 🏗️ Build

```bash
# Build all apps and packages
bun build

# Build UI package styles
bun ui:build:styles

# Build UI package components
bun ui:build:components
```

### 🧪 Testing

```bash
# Run all tests
bun test

# Run end-to-end tests
bun test:e2e
```

### 🔍 Quality

```bash
# Lint all code
bun lint

# Format all code
bun format

# Check TypeScript types
turbo run check-types
```

### 📚 Storybook

```bash
# Start Storybook for UI components
bun storybook

# Build Storybook for deployment
bun build-storybook
```

---

## 🏗️ Project Structure

```
.
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/
│   │   │   ├── features/ # Feature modules
│   │   │   └── infrastructure/
│   │   └── docker-compose.yml
│   └── web/              # Next.js frontend
│       ├── app/          # Next.js app directory
│       ├── providers/    # React providers (tRPC, React Query)
│       └── libs/         # Client libraries
│
├── packages/
│   ├── ui/               # Shared React components
│   │   ├── src/
│   │   └── dist/         # Compiled CSS and types
│   ├── trpc/             # Shared tRPC router
│   ├── api/              # Shared DTOs and entities
│   ├── eslint-config/    # Shared ESLint configs
│   ├── typescript-config/# Shared TS configs
│   └── jest-config/     # Shared Jest configs
│
└── scripts/              # Utility scripts
    ├── check-env-all-apps.ts   # Environment validator (all apps)
    ├── check-env-single-app.ts # Environment validator (one app)
    └── generate-env-types.ts
```

---

## 🎨 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **Tailwind CSS v4** - Utility-first CSS framework
- **tRPC** - End-to-end typesafe APIs
- **TanStack Query** - Powerful data synchronization

### Backend
- **NestJS 11** - Progressive Node.js framework
- **tRPC** - Type-safe API layer
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **Zod** - TypeScript-first schema validation

### Tooling
- **Turborepo** - High-performance build system
- **Bun** - Fast all-in-one JavaScript runtime
- **TypeScript** - Static type checking
- **ESLint + Prettier** - Code quality and formatting
- **Jest** - Testing framework
- **Storybook** - Component development environment

---

## 🔐 Environment Variables

Each app/package can define required environment variables in `env-type.ts`:

```typescript
import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_PORT: z.coerce.number().default(4000),
});

export type Env = z.infer<typeof envSchema>;
```

The validator ensures all required variables are present before the app starts.
