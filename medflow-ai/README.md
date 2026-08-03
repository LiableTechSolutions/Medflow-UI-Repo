# MedFlow AI — Frontend Foundation

Centralized React frontend for the MedFlow AI healthcare platform: layout, navigation,
design system and reusable components, plus the module screens wired to the MedFlow AI
backend API.

## Running against the backend

1. Start the backend (`mvn spring-boot:run` in `medflow-ai/`) — it serves
   `http://localhost:8080/api/v1`.
2. Copy `.env.example` to `.env` if you need a different API URL:
   `VITE_API_BASE_URL=http://localhost:8080/api/v1`
3. `npm install && npm run dev`, then sign in at <http://localhost:5173> with the seeded
   demo administrator `admin@medflow.local` / `Admin@12345`.

Full walkthrough: `medflow-ai/LOCAL_SETUP.md`.

### How API access is organised

| File | Responsibility |
|---|---|
| `src/core/api/client.ts` | fetch wrapper: base URL, bearer token, envelope unwrapping, `ApiError`, 401 handling |
| `src/core/api/services.ts` | one function per backend route, grouped by module |
| `src/core/api/types.ts` | response shapes |
| `src/core/auth/AuthContext.tsx` | session: login, register, logout, restore on refresh, `can(permission)` |
| `src/shared/hooks/useApiResource.ts` | load/error/retry state for a request |
| `src/shared/components/DataPage` | header + search + paged table used by the module list screens |

Routes under `AppLayout` require a session; anonymous visitors are redirected to
`/login` and returned to their destination after signing in.

## Stack

React 19 · TypeScript · Vite · React Router 7 · Lucide React icons ·
a custom, centralized component library (no external UI kit dependency)

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and produce a production build
npm run preview   # preview the production build locally
```

## Project structure

```
src/
├── app/                # router, providers, root App component
├── core/                # config, constants (nav items, routes), utils
├── shared/
│   ├── components/      # the reusable component library — Button, Card,
│   │                    # Input, Select, Modal, Drawer, Table, Badge, Avatar,
│   │                    # SearchBar, PageHeader, Breadcrumb, EmptyState,
│   │                    # Loading, VitalsLine, ModulePlaceholder
│   ├── layouts/          # AppLayout (sidebar + header), AuthLayout, Sidebar, Header
│   └── hooks/            # useDisclosure, useMediaQuery
├── modules/
│   ├── landing/          # public marketing page + 404
│   ├── auth/             # login, signup, forgot-password (frontend-only)
│   ├── dashboard/        # the main dashboard — KPIs, charts, tables, calendar
│   ├── doctors/          # placeholder — assign to a teammate
│   ├── patients/         # placeholder — assign to a teammate
│   ├── appointments/     # placeholder — assign to a teammate
│   ├── prescriptions/    # placeholder — assign to a teammate
│   ├── reports/          # placeholder — assign to a teammate
│   ├── notifications/    # placeholder — assign to a teammate
│   ├── ai/                # placeholder — assign to a teammate
│   ├── users/             # placeholder — assign to a teammate
│   └── settings/          # placeholder — assign to a teammate
└── styles/               # tokens.css (design tokens) + global.css (resets)
```

## Design system

All design tokens (color, type, spacing, radius, shadow, motion) live in
`src/styles/tokens.css` as CSS custom properties prefixed `--mf-`. Every
shared component consumes these variables — change a token once and it
propagates everywhere.

The signature visual motif is the **vitals line** (`VitalsLine` component):
a single continuous trace that reads as an ECG signal, used in the landing
hero, the auth screens and loading states.

## How the team works in this codebase

Each module under `src/modules/<name>/` is self-contained: its own `pages/`
and (optionally) `components/` folder. A developer assigned to a module:

1. Works only inside their `src/modules/<name>/` folder.
2. Imports whatever they need from `src/shared/components` (the shared
   library) and `src/core` (routes, nav, utils).
3. Replaces the placeholder page (e.g. `DoctorsPage.tsx`) with real UI and
   logic — the route, sidebar entry, and surrounding layout are already
   wired up in `src/app/router/router.tsx` and `src/core/constants/navigation.ts`.

No backend, database, authentication logic, or business logic is implemented
in this foundation — every form and action is frontend-only and ready for a
real API layer to be dropped in later.
