import { Badge, Box, HStack, Heading, NativeSelect, Text, VStack } from '@chakra-ui/react'
import { Plane } from 'lucide-react'
import type { ForeignInputs, ProfileResult } from '../calc'
import { formatPct } from '../calc'
import { FOREIGN_REGIONS, FOREIGN_REGION_ORDER } from '../data'
import type { ForeignRegionCode } from '../types'
import { BreakdownCard } from './BreakdownCard'
import { LabeledSlider } from './LabeledSlider'

interface Props {
  inputs: ForeignInputs
  onChange: (patch: Partial<ForeignInputs>) => void
  onRegionChange: (region: ForeignRegionCode) => void
  result: ProfileResult
}

export function ForeignProfile({ inputs, onChange, onRegionChange, result }: Props) {
  const region = FOREIGN_REGIONS[inputs.region]

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
          <Box color="orange.300">
            <Plane size={20} />
          </Box>
          <Box>
            <Heading size="md" color="white">
              Foreign Comparison
            </Heading>
            <Text fontSize="xs" color="gray.500">
              Selectable Contractor Profile
            </Text>
          </Box>
        </HStack>
        <Badge variant="subtle" colorPalette="gray" rounded="md">
          Tax {formatPct(region.taxRate)}
        </Badge>
      </HStack>

      <VStack align="stretch" gap="5">
        <Box>
          <Text fontSize="sm" color="gray.300" mb="2">
            Target Region
          </Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={inputs.region}
              bg="gray.950"
              borderColor="gray.700"
              color="white"
              onChange={(e) => onRegionChange(e.currentTarget.value as ForeignRegionCode)}
            >
              {FOREIGN_REGION_ORDER.map((code) => (
                <option key={code} value={code}>
                  {FOREIGN_REGIONS[code].label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Text fontSize="xs" color="gray.500" mt="2">
            {region.note}
          </Text>
        </Box>

        <LabeledSlider
          label="Gross Annual Salary"
          value={inputs.gross}
          min={20000}
          max={150000}
          step={1000}
          onChange={(v) => onChange({ gross: v })}
        />
        <LabeledSlider
          label="Monthly Rent"
          value={inputs.monthlyRent}
          min={400}
          max={3000}
          step={50}
          onChange={(v) => onChange({ monthlyRent: v })}
        />
        <LabeledSlider
          label="Monthly General Living Expenses"
          value={inputs.monthlyExpenses}
          min={300}
          max={2000}
          step={50}
          onChange={(v) => onChange({ monthlyExpenses: v })}
        />
      </VStack>

      <BreakdownCard result={result} />
    </Box>
  )
}
