# Next.js Posts App

A small posts app (sign up, create, view, edit, delete) built to practice the core features of Next.js 16:

- App Router (layouts, dynamic routes, `loading` / `error` / `not-found` files)
- React Server Components (server-rendered, fetching data directly with Prisma)
- Server/client boundaries (`"use client"`, `"use server"`, `server-only`)
- Cache Components (`"use cache"`, `cacheTag`, `updateTag`)
- Partial Prerendering (static shell + streamed dynamic content)
- Streaming with Suspense, including session-dependent UI
- Passing server promises to client components and reading them with `use()`
- Server Actions (auth, create, edit and delete posts), with `useActionState` in the auth forms
- Parallel + intercepting route modals
- Proxy (`proxy.ts`) redirects for signed-in users
- Error boundaries
