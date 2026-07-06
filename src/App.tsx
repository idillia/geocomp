import { useEffect, useMemo, useState } from 'react'
import { Box, Container, Flex, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { Header } from './components/Header'
import { ModeToggle } from './components/ModeToggle'
import { USProfile } from './components/USProfile'
import { ForeignProfile } from './components/ForeignProfile'
import {
  computeForeign,
  computeUS,
  formatUSD,
  type ForeignInputs,
  type USInputs,
} from './calc'
import { FOREIGN_REGIONS, US_STATES } from './data'
import { FICA, TAX_YEAR } from './taxData'
import type { ForeignRegionCode, Mode, USStateCode } from './types'

export default function App() {
  const [mode, setMode] = useState<Mode>('liquid')

  const [us, setUs] = useState<USInputs>({
    state: 'CA',
    gross: 150000,
    contribution401k: 10000,
    healthPremium: 4000,
    monthlyRent: US_STATES.CA.defaultRent,
    monthlyExpenses: US_STATES.CA.defaultExpenses,
  })

  const [foreign, setForeign] = useState<ForeignInputs>({
    region: 'BR_PJ',
    gross: 60000,
    monthlyRent: FOREIGN_REGIONS.BR_PJ.defaultRent,
    monthlyExpenses: FOREIGN_REGIONS.BR_PJ.defaultExpenses,
  })

  // Anonymous telemetry mock — registers an event locally, nothing leaves the browser.
  useEffect(() => {
    console.info(
      '[GeoComp] telemetry (mock): { event: "app_mounted", ts: %s } — no network telemetry sent.',
      new Date().toISOString(),
    )
  }, [])

  const updateUs = (patch: Partial<USInputs>) => setUs((prev) => ({ ...prev, ...patch }))
  const updateForeign = (patch: Partial<ForeignInputs>) =>
    setForeign((prev) => ({ ...prev, ...patch }))

  const handleStateChange = (state: USStateCode) =>
    setUs((prev) => ({
      ...prev,
      state,
      monthlyRent: US_STATES[state].defaultRent,
      monthlyExpenses: US_STATES[state].defaultExpenses,
    }))

  const handleRegionChange = (region: ForeignRegionCode) =>
    setForeign((prev) => ({
      ...prev,
      region,
      monthlyRent: FOREIGN_REGIONS[region].defaultRent,
      monthlyExpenses: FOREIGN_REGIONS[region].defaultExpenses,
    }))

  const usResult = useMemo(() => computeUS(us, mode), [us, mode])
  const foreignResult = useMemo(() => computeForeign(foreign), [foreign])

  const delta = usResult.netSavings - foreignResult.netSavings
  const usWins = delta >= 0

  return (
    <Box minH="100vh" color="gray.100">
      <Container maxW="6xl" py={{ base: '6', md: '10' }}>
        <Header />

        <Box mb="6">
          <ModeToggle mode={mode} onChange={setMode} />
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
          <USProfile
            inputs={us}
            onChange={updateUs}
            onStateChange={handleStateChange}
            result={usResult}
          />
          <ForeignProfile
            inputs={foreign}
            onChange={updateForeign}
            onRegionChange={handleRegionChange}
            result={foreignResult}
          />
        </SimpleGrid>

        {/* Verdict strip */}
        <Flex
          mt="6"
          bg="gray.900"
          borderWidth="1px"
          borderColor="gray.800"
          rounded="2xl"
          p={{ base: '5', md: '6' }}
          align="center"
          justify="space-between"
          wrap="wrap"
          gap="4"
        >
          <VStack align="start" gap="0.5">
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500">
              Net Savings Advantage
            </Text>
            <HStack gap="2" color="gray.300" fontSize="sm">
              <Text color="white" fontWeight="semibold">
                {usWins ? 'United States' : FOREIGN_REGIONS[foreign.region].label}
              </Text>
              <ArrowRight size={14} />
              <Text>keeps more each year</Text>
            </HStack>
          </VStack>
          <VStack align="end" gap="0">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={delta >= 0 ? 'green.300' : 'orange.300'}
              letterSpacing="-0.02em"
            >
              +{formatUSD(Math.abs(delta))}
            </Text>
            <Text fontSize="xs" color="gray.500">
              difference in annual net savings
            </Text>
          </VStack>
        </Flex>

        <Text mt="6" fontSize="xs" color="gray.600" textAlign="center" maxW="720px" mx="auto">
          US figures use real {TAX_YEAR} progressive brackets (IRS), FICA with the
          ${FICA.ssWageBase.toLocaleString()} Social Security wage base, and {TAX_YEAR} California /
          New York state brackets. Cost-of-living defaults seed from Numbeo (2025). Foreign rates are
          effective averages. Single filer, standard deduction — a simplified model for comparison,
          computed entirely on your device.
        </Text>
      </Container>
    </Box>
  )
}
