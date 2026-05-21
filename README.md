# Immoklu Frontend

Monorepo for the Immoklu web and mobile clients.

## Workspaces

- `apps/web`: Next.js web application
- `apps/mobile`: Expo companion application
- `packages/ui`: shared UI primitives
- `packages/api-client`: generated API client and hooks
- `packages/types`: shared domain and API types
- `packages/i18n`: shared locale config and translation helpers
- `packages/config`: shared TypeScript, ESLint, and Tailwind config

## Commands

Use the Windows command shims if PowerShell blocks script shims:

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npx.cmd turbo run dev --filter=@immoklu/web
npx.cmd turbo run dev --filter=@immoklu/mobile
npx.cmd turbo run build
npx.cmd turbo run lint
npx.cmd turbo run typecheck
```

## Notes

- Web is the primary product surface.
- Mobile is intentionally a companion app in v1.
- API contracts should be generated from `immoklu-back` OpenAPI into `packages/api-client`.
- The web app expects the backend at `NEXT_PUBLIC_API_URL`.
- Local development falls back to `http://localhost:4000` when `NEXT_PUBLIC_API_URL` is omitted.
- Vercel production must define `NEXT_PUBLIC_API_URL` with the deployed backend URL.
