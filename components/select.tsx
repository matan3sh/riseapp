'use client'

import { useMemo } from 'react'
import { SingleValue } from 'react-select'
import CreateableSelect from 'react-select/creatable'

type Props = {
  options?: { label: string; value: string }[]
  onCreate?: (name: string) => void
  onChange: (name?: string) => void
  value?: string | null | undefined
  disabled?: boolean
  placeholder?: string
}

export const Select = ({
  options,
  onCreate,
  onChange,
  value,
  disabled,
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    if (option) {
      onChange(option.value)
    }
  }

  const formattedValue = useMemo(() => {
    return options?.find((option) => option.value === value)
  }, [options, value])

  return (
    <CreateableSelect
      isDisabled={disabled}
      options={options}
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreate}
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#e2e8f0',
          ':hover': {
            borderColor: '#e2e8f0',
          },
        }),
      }}
    />
  )
}
