import { Badge, Box, HStack, Heading, NativeSelect, Text, VStack } from '@chakra-ui/react'
import { Flag } from 'lucide-react'
import type { ProfileResult, USInputs } from '../calc'
import { formatPct } from '../calc'
import { US_STATES, US_STATE_ORDER } from '../data'
import type { USStateCode } from '../types'
import { BreakdownCard } from './BreakdownCard'
import { LabeledSlider } from './LabeledSlider'

interface Props {
  inputs: USInputs
  onChange: (patch: Partial<USInputs>) => void
  onStateChange: (state: USStateCode) => void
  result: ProfileResult
}

export function USProfile({ inputs, onChange, onStateChange, result }: Props) {
  return (
    <Box
      bg="gray.900"
      borderWidth="1px"
      borderColor="gray.800"
      rounded="2xl"
      p={{ base: '5', md: '6' }}
    >
      <HStack justify="space-between" align="start" mb="5">
        <HStack gap="3">
          <Box color="blue.300">
            <Flag size={20} />
          </Box>
          <Box>
            <Heading size="md" color="white">
              United States
            </Heading>
            <Text fontSize="xs" color="gray.500">
              W2 Target Profile
            </Text>
          </Box>
        </HStack>
        <Badge variant="subtle" colorPalette="gray" rounded="md">
          Effective tax {formatPct(result.effectiveTaxRate)}
        </Badge>
      </HStack>

      <VStack align="stretch" gap="5">
        <Box>
          <Text fontSize="sm" color="gray.300" mb="2">
            State
          </Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={inputs.state}
              bg="gray.950"
              borderColor="gray.700"
              color="white"
              onChange={(e) => onStateChange(e.currentTarget.value as USStateCode)}
            >
              {US_STATE_ORDER.map((code) => (
                <option key={code} value={code}>
                  {US_STATES[code].label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <LabeledSlider
          label="Gross Annual Salary"
          value={inputs.gross}
          min={80000}
          max={350000}
          step={1000}
          onChange={(v) => onChange({ gross: v })}
        />
        <LabeledSlider
          label="401(k) Annual Contribution"
          value={inputs.contribution401k}
          min={0}
          max={24500}
          step={500}
          onChange={(v) => onChange({ contribution401k: v })}
        />
        <LabeledSlider
          label="Out-of-pocket Health Insurance (annual)"
          value={inputs.healthPremium}
          min={0}
          max={8000}
          step={100}
          onChange={(v) => onChange({ healthPremium: v })}
        />
        <LabeledSlider
          label="Monthly Rent"
          value={inputs.monthlyRent}
          min={1200}
          max={6000}
          step={50}
          onChange={(v) => onChange({ monthlyRent: v })}
        />
        <LabeledSlider
          label="Monthly General Living Expenses"
          value={inputs.monthlyExpenses}
          min={600}
          max={3000}
          step={50}
          onChange={(v) => onChange({ monthlyExpenses: v })}
        />
      </VStack>

      <BreakdownCard result={result} />
    </Box>
  )
}
