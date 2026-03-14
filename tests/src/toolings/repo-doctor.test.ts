import { describe, expect, it } from 'bun:test'
import { collectRepoDoctorFindings } from '../../../toolings/scripts/repo-doctor'

describe('repo-doctor', () => {
  it('does not report broken package exports', async () => {
    const findings = await collectRepoDoctorFindings()
    expect(findings.some((finding) => finding.code === 'broken-package-export')).toBe(false)
  })
})
