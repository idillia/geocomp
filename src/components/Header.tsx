import { Badge, Box, Flex, HStack, Heading, Text } from '@chakra-ui/react'
import { Globe2, ShieldCheck } from 'lucide-react'

export function Header() {
  return (
    <Box as="header" mb="8">
      <Flex align="center" justify="space-between" wrap="wrap" gap="4">
        <HStack gap="3" align="center" minW="0">
          <Flex
            align="center"
            justify="center"
            boxSize={{ base: '10', md: '12' }}
            flexShrink="0"
            rounded="xl"
            bg="green.500/15"
            color="green.300"
            borderWidth="1px"
            borderColor="green.500/30"
          >
            <Globe2 size={22} />
          </Flex>
          <Box minW="0">
            <Heading size={{ base: 'xl', md: '2xl' }} color="white" letterSpacing="-0.02em">
              GeoComp
            </Heading>
            <Text color="gray.400" fontSize={{ base: 'xs', md: 'sm' }}>
              Global Compensation, Liquidity, and Purchasing Power Simulator
            </Text>
          </Box>
        </HStack>

        <Badge
          colorPalette="green"
          variant="subtle"
          rounded="full"
          px="3"
          py="1.5"
          fontSize="xs"
        >
          <HStack gap="1.5">
            <ShieldCheck size={14} />
            <Text>100% in-browser · no data leaves your device</Text>
          </HStack>
        </Badge>
      </Flex>
    </Box>
  )
}
