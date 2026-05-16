/**
 * Architecture Decision Records (ADR)
 *
 * This document records key architectural decisions made in this template.
 * For each decision, we capture the context, decision, and consequences.
 *
 * See https://adr.github.io/ for more information on ADRs.
 */

# ADR-001: Monorepo with Turborepo

**Date:** 2024

**Status:** Accepted

**Context:**
The project needs to share code between frontend, backend, and worker without duplicating utilities and types. We needed a way to manage multiple applications with shared dependencies efficiently.

**Decision:**
Use Turborepo for monorepo management with Bun as the package manager.

**Consequences:**
- ✅ Shared packages (auth, store, ui, common, backend-common) reduce duplication
- ✅ Type-safe cross-package imports
- ✅ Single lock file (bun.lock)
- ✅ Efficient parallel builds with Turborepo caching
- ⚠️ More complex initial setup
- ⚠️ Need discipline to maintain clean boundaries

---

# ADR-002: Better Auth for Authentication

**Date:** 2024

**Status:** Accepted

**Context:**
Authentication needs to be flexible, modern, and easy to integrate with OAuth providers. We need session management, type safety, and minimal boilerplate.

**Decision:**
Use Better Auth as the auth solution with session-based authentication.

**Consequences:**
- ✅ Built-in OAuth provider support
- ✅ TypeScript types for auth procedures
- ✅ Session-based (can migrate to JWT later if needed)
- ✅ Simple integration with tRPC
- ⚠️ Vendor lock-in (though open-source)
- ⚠️ Requires active maintenance to stay current

---

# ADR-003: tRPC for API Layer

**Date:** 2024

**Status:** Accepted

**Context:**
Need end-to-end type safety between frontend and backend. REST would require manual type synchronization. GraphQL adds complexity.

**Decision:**
Use tRPC for the API layer.

**Consequences:**
- ✅ Full type safety (frontend & backend share types)
- ✅ Minimal boilerplate (no schema files)
- ✅ Easy to add new endpoints
- ✅ Automatic docs from types
- ⚠️ Tight coupling between frontend and backend
- ⚠️ Not suitable for public/mobile APIs (consider REST wrapper)

---

# ADR-004: Prisma for Database ORM

**Date:** 2024

**Status:** Accepted (with Drizzle alternative)

**Context:**
Need a type-safe ORM with good DX and migration support. Considered Prisma vs Drizzle.

**Decision:**
Default to Prisma with Drizzle as an option.

**Consequences:**
- ✅ Prisma: Great DX, migrations, data seed, good for most projects
- ✅ Drizzle: Lightweight, type-safe, better for advanced queries
- ⚠️ Prisma: Adds runtime overhead
- ⚠️ Drizzle: Smaller ecosystem, fewer plugins

---

# ADR-005: BullMQ for Background Jobs

**Date:** 2024

**Status:** Accepted

**Context:**
Need background job processing for email, webhooks, and scheduled tasks. Considered Bull, BullMQ, and Inngest.

**Decision:**
Use BullMQ (modern Bull) with Redis as the backing store.

**Consequences:**
- ✅ Simple queue API
- ✅ Persistent job storage
- ✅ Bull Board for UI
- ✅ Great for microservices
- ⚠️ Requires Redis
- ⚠️ Not suitable for very high-throughput systems

---

# ADR-006: Express for Backend Framework

**Date:** 2024

**Status:** Accepted (with Hono option)

**Context:**
Need a backend framework with good middleware ecosystem and production track record.

**Decision:**
Default to Express with Hono as a lightweight alternative.

**Consequences:**
- ✅ Express: Mature, large ecosystem, most developers know it
- ✅ Hono: Lightweight, Edge Runtime compatible, great for Bun
- ⚠️ Express: Heavy, not optimized for modern Node
- ⚠️ Hono: Smaller ecosystem
