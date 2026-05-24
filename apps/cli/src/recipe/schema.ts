import { z } from 'zod'

export const StablePackageManagerSchema = z.enum(['bun', 'pnpm'])
export type StablePackageManager = z.infer<typeof StablePackageManagerSchema>

export const RecipeSchema = z.object({
  $schema: z.string().optional(),
  version: z.literal(1),
  preset: z.enum([
    'typescript-fullstack',
    'rust-api',
    'rust-fullstack',
    'solana-program',
    'solana-web',
    'solana-mobile',
    'solana-product',
    'customize',
    'experiments',
  ]),
  support: z.enum(['stable', 'experimental', 'requiresValidation']),
  packageManager: StablePackageManagerSchema,
  runtime: z.record(z.string(), z.string()),
  workspace: z.object({
    turbo: z.boolean().default(true),
    cargo: z.boolean().default(false),
  }),
  capabilities: z.record(z.string(), z.record(z.string(), z.unknown())),
})

export type Recipe = z.infer<typeof RecipeSchema>
