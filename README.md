<p align="center">
  <img src="https://nextjs.org/static/favicon/favicon-32x32.png" alt="Next.js" width="32" />
  <img src="https://expressjs.com/images/favicon.png" alt="Express" width="32" />
  <img src="https://trpc.io/img/logo.svg" alt="tRPC" width="32" />
  <img src="https://raw.githubusercontent.com/oven-sh/bun/main/assets/logo.svg" alt="Bun" width="32" />
  <img src="https://www.prisma.io/favicon.ico" alt="Prisma" width="32" />
</p>

<p align="center">
  <img src="./apps/web/public/brand/template-logo.svg" alt="Kitsune Stack Template logo" width="560" />
</p>

<h1 align="center">Next.js × Express × tRPC × Bun × Better Auth × Prisma × Turborepo Template</h1>

<p align="center">
  <b>Kickstart your next project with a modern, scalable, and type-safe monorepo template.</b><br/>
  <i>Production-ready, batteries included, and easy to extend.</i>
</p>

---

## 🧪 Use this template

```sh
bun create turbo@latest --example https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo
cd my-app
bun install
bun dev
```

> Requires Bun: [Bun](https://bun.sh)

## 🔗 Repository

- GitHub: [KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo](https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo)

---

## 🚀 Features

- **Full-Stack Ready:** Next.js frontend, Express backend, tRPC for typesafe APIs.
- **Ultra-Fast Tooling:** Powered by Bun for rapid installs and scripts.
- **Type Safety:** End-to-end TypeScript, including API contracts.
- **Modular Auth:** Plug-and-play authentication package.
- **Reusable UI:** Shared component library for consistent design.
- **Monorepo Power:** Code sharing and easy scaling with Turborepo.
- **Production Best Practices:** Pre-configured for real-world deployments.

---

## 🗂️ Project Structure

```text
apps/
  api/        # Express backend (tRPC, Auth, Prisma)
  client/     # Next.js frontend (tRPC client, UI)
packages/
  auth/       # Authentication logic(better-auth)
  store/      # Prisma schema & DB access
  trpc/       # tRPC routers & helpers
  ui/         # Shared UI components
  common/     # Shared types & utilities
  backend-common/ # Backend-specific shared code
```

---

## ⚡ Quick Start

1. **Install dependencies (with Bun):**

   ```sh
   bun install
   ```

2. **Start development (all apps/packages):**

   ```sh
   bun dev
   ```

3. **Build everything:**

   ```sh
   bun run build
   ```

4. Add shadcn component to your app

   ```sh
   bunx --bun shadcn@latest add <component-name> --c apps/web
   ```

---

## 🛠️ Why Use This Template?

- **Easy Initial Setup:** Get started in minutes, not hours.
- **Type-Safe Everywhere:** No more guessing types between client and server.
- **Scalable & Maintainable:** Modular structure for growing teams and projects.
- **Modern Stack:** Stay up-to-date with the latest best practices.
- **Ready for Production:** Sensible defaults and extensible configuration.

---

## 📚 Learn More

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [tRPC](https://trpc.io/)
- [Bun](https://bun.sh/)
- [Prisma](https://prisma.io/)
- [Turborepo](https://turbo.build/)
- [Better Auth](https://better-auth.com/)

---

## 📝 Author

- [@KitsunKode](https://x.com/KitsunKode)

---

## 📄 License

MIT

---

> Want to contribute? Add badges, contribution guidelines, or a screenshot/demo section!
