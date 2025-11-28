// Date Range Picker - Quick date range selection
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  presets?: boolean;
}

const presetRanges = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 },
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function DateRangePicker({
  value = { start: null, end: null },
  onChange,
  presets = true,
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const isInRange = (day: number) => {
    if (!value.start || !value.end) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= value.start && date <= value.end;
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      (value.start && date.toDateString() === value.start.toDateString()) ||
      (value.end && date.toDateString() === value.end.toDateString())
    );
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (selecting === 'start' || (value.start && date < value.start)) {
      onChange?.({ start: date, end: null });
      setSelecting('end');
    } else {
      onChange?.({ start: value.start, end: date });
      setSelecting('start');
    }
  };

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange?.({ start, end });
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal min-w-[240px]">
          <CalendarBlank size={16} className="mr-2" />
          {value.start && value.end ? (
            <span>
              {formatDate(value.start)} - {formatDate(value.end)}
            </span>
          ) : (
            <span className="text-muted-foreground">Select date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {presets && (
            <div className="border-r p-2 space-y-1">
              {presetRanges.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset.days)}
                  className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <CaretLeft size={16} />
              </Button>
              <span className="text-sm font-medium">
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <CaretRight size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS.map((day) => (
                <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="w-8 h-8" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const selected = isSelected(day);
                const inRange = isInRange(day);
                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDayClick(day)}
                    className={`
                      w-8 h-8 rounded-full text-sm flex items-center justify-center
                      ${selected ? 'bg-primary text-primary-foreground' : ''}
                      ${inRange && !selected ? 'bg-primary/10' : ''}
                      ${!selected && !inRange ? 'hover:bg-muted' : ''}
                    `}
                  >
                    {day}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
