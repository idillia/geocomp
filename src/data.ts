import type { ForeignRegionCode, USStateCode } from './types'

/**
 * Cost-of-living defaults (monthly USD) are seeded from Numbeo city indices
 * (mid-2025): 1-bedroom rent in the city centre and single-person monthly costs
 * excluding rent. They are only starting points — every field is adjustable.
 */

export interface USStateInfo {
  code: USStateCode
  label: string
  /** Default monthly rent seed value (city centre 1BR). */
  defaultRent: number
  /** Default monthly living expenses seed (single person, excl. rent). */
  defaultExpenses: number
}

export const US_STATES: Record<USStateCode, USStateInfo> = {
  CA: { code: 'CA', label: 'California', defaultRent: 3200, defaultExpenses: 1500 },
  TX: { code: 'TX', label: 'Texas', defaultRent: 1700, defaultExpenses: 1100 },
  NY: { code: 'NY', label: 'New York', defaultRent: 4200, defaultExpenses: 1600 },
  WA: { code: 'WA', label: 'Washington', defaultRent: 2300, defaultExpenses: 1300 },
}

export const US_STATE_ORDER: USStateCode[] = ['CA', 'TX', 'NY', 'WA']

export interface ForeignRegionInfo {
  code: ForeignRegionCode
  label: string
  /** Effective average total tax burden on gross (see note for basis). */
  taxRate: number
  defaultRent: number
  defaultExpenses: number
  note: string
}

export const FOREIGN_REGIONS: Record<ForeignRegionCode, ForeignRegionInfo> = {
  BR_PJ: {
    code: 'BR_PJ',
    label: 'Brazil (São Paulo — PJ Structure)',
    taxRate: 0.13,
    defaultRent: 600,
    defaultExpenses: 550,
    note: 'Simples Nacional Anexo III via Fator R (IRPJ + CSLL + ISS + INSS pró-labore) — ~13% effective for typical dev billing. No 401(k)/health premium.',
  },
  PT_STD: {
    code: 'PT_STD',
    label: 'Portugal (Lisbon — Standard Freelancer)',
    taxRate: 0.35,
    defaultRent: 1550,
    defaultExpenses: 800,
    note: 'Recibos verdes simplified regime taxed on 75% of income through progressive 2024 IRS brackets (13%–48%) — ~35% effective at this income.',
  },
  PT_NHR: {
    code: 'PT_NHR',
    label: 'Portugal (Lisbon — NHR 2.0 Startup Regime)',
    taxRate: 0.2,
    defaultRent: 1550,
    defaultExpenses: 800,
    note: 'IFICI / NHR 2.0 statutory flat 20% on eligible Portuguese-source tech income.',
  },
}

export const FOREIGN_REGION_ORDER: ForeignRegionCode[] = ['BR_PJ', 'PT_STD', 'PT_NHR']
