import { FOREIGN_REGIONS, US_STATES } from './data'
import {
  computeFICA,
  FEDERAL_BRACKETS,
  FEDERAL_STANDARD_DEDUCTION,
  progressiveTax,
  STATE_TAX,
} from './taxData'
import type { ForeignRegionCode, Mode, USStateCode } from './types'

export interface Segment {
  key: string
  label: string
  amount: number
  color: string
  /** Optional rate this segment represents, shown as a % next to the label. */
  rate?: number
}

export interface ProfileResult {
  gross: number
  taxes: number
  effectiveTaxRate: number
  netSavings: number
  savingsRate: number
  segments: Segment[]
}

const COLORS = {
  federal: '#f59e0b', // amber
  fica: '#f97316', // orange
  state: '#ef4444', // red
  taxes: '#f59e0b', // amber (foreign, single tax bucket)
  insurance: '#ec4899', // pink
  retirement: '#a855f7', // purple
  rent: '#3b82f6', // blue
  expenses: '#06b6d4', // cyan
}

export interface USInputs {
  state: USStateCode
  gross: number
  contribution401k: number
  healthPremium: number
  monthlyRent: number
  monthlyExpenses: number
}

/**
 * United States (W2) engine — real progressive brackets and FICA caps.
 *
 *   FICA wages       = Gross - HealthPremium         (401(k) is NOT FICA-exempt)
 *   Federal taxable  = Gross - 401(k) - HealthPremium - Federal standard deduction
 *   State taxable    = Gross - 401(k) - HealthPremium - State standard deduction
 *   Taxes            = progressive federal + FICA (SS capped) + progressive state
 *   Liquid           = Gross - Taxes - HealthPremium - 401(k) - Rent(yr) - Expenses(yr)
 *
 * Liquid Cash Flow mode treats the 401(k) as locked (an outflow).
 * Total Net Worth mode adds the 401(k) back as retained wealth.
 * The `rate` shown on each tax line is its EFFECTIVE rate (amount ÷ gross).
 */
export function computeUS(i: USInputs, mode: Mode): ProfileResult {
  const stateInfo = US_STATES[i.state]
  const state = STATE_TAX[i.state]

  const ficaWages = Math.max(0, i.gross - i.healthPremium)
  const ficaTax = computeFICA(ficaWages)

  const federalTaxable = Math.max(
    0,
    i.gross - i.contribution401k - i.healthPremium - FEDERAL_STANDARD_DEDUCTION,
  )
  const federalTax = progressiveTax(federalTaxable, FEDERAL_BRACKETS)

  const stateTaxable = Math.max(
    0,
    i.gross - i.contribution401k - i.healthPremium - state.standardDeduction,
  )
  const stateTax = progressiveTax(stateTaxable, state.brackets)

  const taxes = federalTax + ficaTax + stateTax
  const eff = (amount: number) => (i.gross > 0 ? amount / i.gross : 0)

  const rentAnnual = i.monthlyRent * 12
  const expensesAnnual = i.monthlyExpenses * 12

  const liquid =
    i.gross - taxes - i.healthPremium - i.contribution401k - rentAnnual - expensesAnnual
  const netSavings = mode === 'liquid' ? liquid : liquid + i.contribution401k

  const segments: Segment[] = [
    { key: 'federal', label: 'Federal Income Tax', amount: federalTax, rate: eff(federalTax), color: COLORS.federal },
    { key: 'fica', label: 'FICA · Social Security + Medicare', amount: ficaTax, rate: eff(ficaTax), color: COLORS.fica },
    { key: 'state', label: `${stateInfo.label} State Tax`, amount: stateTax, rate: eff(stateTax), color: COLORS.state },
    { key: 'insurance', label: 'Health Insurance', amount: i.healthPremium, color: COLORS.insurance },
  ]
  // In Total Net Worth mode the 401(k) is wealth, not a drain, so it flows into savings.
  if (mode === 'liquid') {
    segments.push({
      key: 'retirement',
      label: '401(k) Contribution (locked)',
      amount: i.contribution401k,
      color: COLORS.retirement,
    })
  }
  segments.push(
    { key: 'rent', label: 'Rent (annual)', amount: rentAnnual, color: COLORS.rent },
    { key: 'expenses', label: 'Living Expenses (annual)', amount: expensesAnnual, color: COLORS.expenses },
  )

  return {
    gross: i.gross,
    taxes,
    effectiveTaxRate: eff(taxes),
    netSavings,
    savingsRate: i.gross > 0 ? netSavings / i.gross : 0,
    segments,
  }
}

export interface ForeignInputs {
  region: ForeignRegionCode
  gross: number
  monthlyRent: number
  monthlyExpenses: number
}

/**
 * Foreign contractor engine — flat tax on gross, no 401(k) or health premium.
 * Unaffected by the mode toggle.
 */
export function computeForeign(i: ForeignInputs): ProfileResult {
  const taxRate = FOREIGN_REGIONS[i.region].taxRate
  const taxes = i.gross * taxRate

  const rentAnnual = i.monthlyRent * 12
  const expensesAnnual = i.monthlyExpenses * 12

  const netSavings = i.gross - taxes - rentAnnual - expensesAnnual

  const segments: Segment[] = [
    { key: 'taxes', label: 'Corporate / Income Tax', amount: taxes, rate: taxRate, color: COLORS.taxes },
    { key: 'rent', label: 'Rent (annual)', amount: rentAnnual, color: COLORS.rent },
    { key: 'expenses', label: 'Living Expenses (annual)', amount: expensesAnnual, color: COLORS.expenses },
  ]

  return {
    gross: i.gross,
    taxes,
    effectiveTaxRate: taxRate,
    netSavings,
    savingsRate: i.gross > 0 ? netSavings / i.gross : 0,
    segments,
  }
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUSD(n: number): string {
  return usd.format(Math.round(n))
}

export function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}
