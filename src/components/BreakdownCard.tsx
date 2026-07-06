import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { formatPct, formatUSD, type ProfileResult } from '../calc'

interface Props {
  result: ProfileResult
}

export function BreakdownCard({ result }: Props) {
  const { gross, segments, netSavings, savingsRate, effectiveTaxRate } = result
  const positive = netSavings >= 0
  const total = gross > 0 ? gross : 1

  // Stacked proportions of gross. Savings takes whatever remains (clamped at 0).
  const savingsWidth = Math.max(0, netSavings) / total

  return (
    <Box mt="5">
      {/* Stacked proportion bar */}
      <Flex
        height="3"
        width="100%"
        rounded="full"
        overflow="hidden"
        bg="gray.800"
        borderWidth="1px"
        borderColor="gray.800"
      >
        {segments.map((s) => (
          <Box
            key={s.key}
            width={`${(s.amount / total) * 100}%`}
            bg={s.color}
            title={`${s.label}: ${formatUSD(s.amount)}`}
          />
        ))}
        <Box width={`${savingsWidth * 100}%`} bg="green.400" />
      </Flex>

      {/* Line items */}
      <VStack align="stretch" gap="0" mt="4">
        <LineItem label="Gross Salary" amount={gross} bold />
        {segments.map((s) => (
          <LineItem
            key={s.key}
            label={s.label}
            amount={-s.amount}
            dot={s.color}
            rate={s.rate}
            muted
          />
        ))}
      </VStack>

      {/* Net savings */}
      <Flex
        justify="space-between"
        align="baseline"
        mt="4"
        pt="4"
        borderTopWidth="1px"
        borderColor="gray.800"
      >
        <VStack align="start" gap="0">
          <Text fontSize="sm" color="gray.400">
            Net Annual Savings
          </Text>
          <Text fontSize="xs" color="gray.600">
            Effective tax {formatPct(effectiveTaxRate)} · savings rate {formatPct(savingsRate)}
          </Text>
        </VStack>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          letterSpacing="-0.02em"
          color={positive ? 'green.300' : 'red.400'}
        >
          {formatUSD(netSavings)}
        </Text>
      </Flex>
    </Box>
  )
}

function LineItem({
  label,
  amount,
  dot,
  rate,
  bold,
  muted,
}: {
  label: string
  amount: number
  dot?: string
  rate?: number
  bold?: boolean
  muted?: boolean
}) {
  return (
    <HStack justify="space-between" py="1.5">
      <HStack gap="2.5">
        {dot ? (
          <Box boxSize="2.5" rounded="full" bg={dot} flexShrink="0" />
        ) : (
          <Box boxSize="2.5" flexShrink="0" />
        )}
        <Text fontSize="sm" color={muted ? 'gray.400' : 'gray.200'} fontWeight={bold ? 'semibold' : 'normal'}>
          {label}
        </Text>
        {rate !== undefined && (
          <Box
            as="span"
            fontSize="xs"
            color="gray.500"
            bg="gray.800"
            px="1.5"
            py="0.5"
            rounded="sm"
            fontVariantNumeric="tabular-nums"
          >
            {formatPct(rate)}
          </Box>
        )}
      </HStack>
      <Text
        fontSize="sm"
        color={bold ? 'white' : 'gray.300'}
        fontWeight={bold ? 'semibold' : 'normal'}
        fontVariantNumeric="tabular-nums"
      >
        {amount < 0 ? `− ${formatUSD(Math.abs(amount))}` : formatUSD(amount)}
      </Text>
    </HStack>
  )
}
