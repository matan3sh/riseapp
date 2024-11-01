import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { SelectSingleEventHandler } from 'react-day-picker'

type Props = {
  value?: Date
  onChange?: SelectSingleEventHandler
  disabled?: boolean
}

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectDate: SelectSingleEventHandler = (
    day,
    selectedDay,
    activeModifiers,
    e
  ) => {
    if (onChange) {
      onChange(day, selectedDay, activeModifiers, e)
    }
    setIsOpen(false)
  }

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          onClick={handleButtonClick}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="pointer-events-auto"
        onFocus={(e) => e.stopPropagation()}
        onBlur={(e) => setIsOpen(false)}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelectDate}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
