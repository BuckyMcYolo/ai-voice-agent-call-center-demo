"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/apps/web/components/ui/button"
import { Calendar } from "@/apps/web/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/apps/web/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"

export function DatePicker({ date: initialDate }: { date: Date }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = React.useState<Date | undefined>(initialDate)

  const onSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      const params = new URLSearchParams(searchParams)
      params.set("date", date.toISOString())
      router.push(`?${params.toString()}`)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
