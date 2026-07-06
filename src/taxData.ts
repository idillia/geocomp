/**
 * Static, authoritative tax tables — pulled once and saved locally so the app
 * stays 100% offline. Tax year 2024, single filer (the latest fully finalized
 * federal + state figures).
 *
 * Sources:
 *  - Federal brackets & standard deduction: IRS Rev. Proc. 2023-34 (TY2024).
 *  - FICA: SSA 2024 wage base ($168,600); Medicare 1.45% + 0.9% Additional
 *    Medicare over $200k (single). 401(k) deferrals are NOT exempt from FICA;
 *    Section 125 health premiums ARE.
 *  - California: FTB 2024 single brackets + $5,540 standard deduction.
 *  - New York: NYS DTF 2024 single brackets + $8,000 standard deduction.
 *  - Texas & Washington: no state income tax on wages.
 */

import type { USStateCode } from './types'

export const TAX_YEAR = 2024

/** A marginal bracket: `rate` applies to income between the previous ceiling and `upTo`. */
export interface Bracket {
  /** Upper bound of this bracket; `null` means "and above" (top bracket). */
  upTo: number | null
  rate: number
}

/** Progressive tax on `income` across ascending marginal brackets. */
export function progressiveTax(income: number, brackets: Bracket[]): number {
  if (income <= 0 || brackets.length === 0) return 0
  let tax = 0
  let lower = 0
  for (const b of brackets) {
    if (income <= lower) break
    const upper = b.upTo ?? Infinity
    tax += (Math.min(income, upper) - lower) * b.rate
    lower = upper
  }
  return tax
}

// ── Federal (IRS TY2024, single) ────────────────────────────────────────────
export const FEDERAL_BRACKETS: Bracket[] = [
  { upTo: 11600, rate: 0.1 },
  { upTo: 47150, rate: 0.12 },
  { upTo: 100525, rate: 0.22 },
  { upTo: 191950, rate: 0.24 },
  { upTo: 243725, rate: 0.32 },
  { upTo: 609350, rate: 0.35 },
  { upTo: null, rate: 0.37 },
]
export const FEDERAL_STANDARD_DEDUCTION = 14600

// ── FICA (2024) ──────────────────────────────────────────────────────────────
export const FICA = {
  ssRate: 0.062,
  ssWageBase: 168600, // Social Security stops above this wage base.
  medicareRate: 0.0145,
  addlMedicareRate: 0.009, // extra Medicare on wages over the threshold (single)
  addlMedicareThreshold: 200000,
}

/** FICA on Medicare-eligible wages (gross minus pre-FICA Section 125 premiums). */
export function computeFICA(ficaWages: number): number {
  if (ficaWages <= 0) return 0
  const socialSecurity = Math.min(ficaWages, FICA.ssWageBase) * FICA.ssRate
  const medicare =
    ficaWages * FICA.medicareRate +
    Math.max(0, ficaWages - FICA.addlMedicareThreshold) * FICA.addlMedicareRate
  return socialSecurity + medicare
}

// ── State income tax ─────────────────────────────────────────────────────────
export interface StateTax {
  brackets: Bracket[]
  standardDeduction: number
}

export const STATE_TAX: Record<USStateCode, StateTax> = {
  CA: {
    standardDeduction: 5540,
    brackets: [
      { upTo: 10412, rate: 0.01 },
      { upTo: 24684, rate: 0.02 },
      { upTo: 38959, rate: 0.04 },
      { upTo: 54081, rate: 0.06 },
      { upTo: 68350, rate: 0.08 },
      { upTo: 349137, rate: 0.093 },
      { upTo: 418961, rate: 0.103 },
      { upTo: 698271, rate: 0.113 },
      { upTo: null, rate: 0.123 },
    ],
  },
  NY: {
    standardDeduction: 8000,
    brackets: [
      { upTo: 8500, rate: 0.04 },
      { upTo: 11700, rate: 0.045 },
      { upTo: 13900, rate: 0.0525 },
      { upTo: 80650, rate: 0.055 },
      { upTo: 215400, rate: 0.06 },
      { upTo: 1077550, rate: 0.0685 },
      { upTo: 5000000, rate: 0.0965 },
      { upTo: 25000000, rate: 0.103 },
      { upTo: null, rate: 0.109 },
    ],
  },
  TX: { standardDeduction: 0, brackets: [] }, // no state income tax
  WA: { standardDeduction: 0, brackets: [] }, // no state income tax on wages
}
