// components/forms/new-appointment-dialog.tsx
"use client"

import { Button } from "@/apps/web/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/apps/web/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/apps/web/components/ui/form"
import { Input } from "@/apps/web/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Calendar } from "@/apps/web/components/ui/calendar"
import { useCallback, useMemo, useState } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/apps/web/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/apps/web/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  PlusIcon,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/apps/web/components/ui/select"
import { Textarea } from "@/apps/web/components/ui/textarea"
import { SelectPatient } from "@/db/schema"
import { createAppointment } from "@/apps/web/app/actions/appointment"
import { toast } from "sonner"
import { debounce } from "underscore"
import { useRouter } from "next/navigation"
import moment from "moment"

const formSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),

  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const minute = (i % 4) * 15
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`
})

export function NewAppointmentDialog() {
  const [open, setOpen] = useState(false)
  const [patients, setPatients] = useState<SelectPatient[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const router = useRouter()

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        searchPatients(value)
      }, 300),
    []
  )

  const searchPatients = async (searchTerm: string) => {
    if (!searchTerm) {
      setPatients([])
      setIsLoadingPatients(false)
      return
    }

    setIsLoadingPatients(true)
    try {
      const response = await fetch(
        `/api/patients/search?q=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (!response.ok) {
        throw new Error("Failed to search patients")
      }
      const data = await response.json()
      console.log(data)
      setPatients(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error searching patients:", error)
      setPatients([])
    } finally {
      setIsLoadingPatients(false)
    }
  }

  async function onSubmit(values: FormData) {
    try {
      await createAppointment({
        patientId: values.patientId,
        date: values.date.toISOString(),
        startTime: new Date(
          `${values.date.toISOString().split("T")[0]}T${values.startTime}`
        ).getTime(),
        endTime: new Date(
          `${values.date.toISOString().split("T")[0]}T${values.endTime}`
        ).getTime(),
        notes: values.notes,
      })
      toast.success("Appointment created successfully")
      form.reset()
      setOpen(false)
      setPatients([])
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create appointment"
      )
    } finally {
      setIsLoadingPatients(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button endIcon={<PlusIcon size={12} />}>New Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>
            Select a patient and schedule their appointment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Patient</FormLabel>
                  <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? patients.find(
                                (patient) => patient.id === field.value
                              )
                              ? `${
                                  patients.find(
                                    (patient) => patient.id === field.value
                                  )?.firstName
                                } ${
                                  patients.find(
                                    (patient) => patient.id === field.value
                                  )?.lastName
                                }`
                              : "Select patient"
                            : "Select patient"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search patients..."
                          onValueChange={(value) => {
                            debouncedSearch(value)
                          }}
                        />
                        <CommandList>
                          {isLoadingPatients && (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          )}
                          <CommandEmpty>No patients found.</CommandEmpty>
                          <CommandGroup>
                            {patients.map((patient) => (
                              <CommandItem
                                key={patient.id}
                                value={patient.id}
                                onSelect={() => {
                                  form.setValue("patientId", patient.id)
                                  setSearchOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    patient.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {patient.firstName} {patient.lastName}
                                <span className="ml-2 text-muted-foreground">
                                  (
                                  {moment(patient.dateOfBirth).format(
                                    "MM-DD-YYYY"
                                  )}
                                  )
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about the appointment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Create Appointment
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
