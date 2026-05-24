import { z } from 'zod'
import { PresetSchema, StablePackageManagerSchema } from '../types/schemas'

export const RecipeSchema = z.object({
  $schema: z.string().optional(),
  version: z.literal(1),
  preset: PresetSchema,
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
