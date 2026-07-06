import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { TrendingUp, Wallet } from 'lucide-react'
import type { Mode } from '../types'

interface Props {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <Box>
      <HStack
        gap="1"
        p="1"
        rounded="xl"
        bg="gray.900"
        borderWidth="1px"
        borderColor="gray.800"
        width="fit-content"
      >
        <Button
          size="sm"
          variant={mode === 'liquid' ? 'solid' : 'ghost'}
          colorPalette="green"
          onClick={() => onChange('liquid')}
        >
          <Wallet size={16} />
          Liquid Cash Flow
        </Button>
        <Button
          size="sm"
          variant={mode === 'networth' ? 'solid' : 'ghost'}
          colorPalette="green"
          onClick={() => onChange('networth')}
        >
          <TrendingUp size={16} />
          Total Net Worth
        </Button>
      </HStack>
      <Text fontSize="xs" color="gray.500" mt="2" maxW="640px">
        {mode === 'liquid'
          ? 'Liquid Cash Flow — 401(k) contributions reduce available cash because funds are locked until retirement age.'
          : 'Total Net Worth — 401(k) retirement contributions are added back into your final annual net savings as wealth building.'}
      </Text>
    </Box>
  )
}
