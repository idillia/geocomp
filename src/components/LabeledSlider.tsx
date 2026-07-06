import { useEffect, useState } from 'react'
import { Box, HStack, Input, Slider, Text } from '@chakra-ui/react'
import { clamp } from '../calc'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export function LabeledSlider({ label, value, min, max, step = 100, onChange }: Props) {
  // Local text buffer so the user can type freely (including intermediate,
  // temporarily out-of-range values) without the number being clamped mid-edit.
  const [text, setText] = useState(String(value))

  // Re-sync the buffer when the value changes from the outside (slider drag,
  // state/region default reseed) — but never clobber what the user is typing.
  useEffect(() => {
    if (Number(text) !== value) setText(String(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const commit = () => {
    const n = Number(text)
    const next = text.trim() !== '' && Number.isFinite(n) ? clamp(n, min, max) : value
    setText(String(next))
    if (next !== value) onChange(next)
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb="2.5" gap="3">
        <Text fontSize="sm" color="gray.300" lineHeight="1.2">
          {label}
        </Text>
        <HStack gap="1" flexShrink="0">
          <Text fontSize="sm" color="gray.500">
            $
          </Text>
          <Input
            size="sm"
            width="6.5rem"
            type="number"
            inputMode="numeric"
            value={text}
            min={min}
            max={max}
            step={step}
            textAlign="right"
            bg="gray.950"
            borderColor="gray.700"
            color="white"
            _focusVisible={{ borderColor: 'green.400' }}
            onChange={(e) => {
              const t = e.target.value
              setText(t)
              // Live-update only while the typed value is valid and in range.
              const n = Number(t)
              if (t.trim() !== '' && Number.isFinite(n) && n >= min && n <= max) {
                onChange(n)
              }
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
          />
        </HStack>
      </HStack>

      <Slider.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        colorPalette="green"
        onValueChange={(details) => onChange(details.value[0])}
      >
        <Slider.Control>
          <Slider.Track bg="gray.800">
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} borderColor="green.400">
            <Slider.HiddenInput />
          </Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
    </Box>
  )
}
