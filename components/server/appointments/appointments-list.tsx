import { getAppointmentsForUser } from "@/db/queries/appointments"
import { auth } from "@/lib/auth"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CardContent } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const AppointmentsList = async ({
  session,
  date,
}: {
  session: typeof auth.$Infer.Session
  date: Date
}) => {
  const appointments = await getAppointmentsForUser({
    userId: session.user.id,
    date,
  })

  return (
    <CardContent>
      <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</span>
                    <span className="text-xs text-muted-foreground">
                      SSN: {appointment.patient.ssn}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(appointment.startTime).toLocaleTimeString()} -
                    {new Date(appointment.endTime).toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{appointment.status}</span>
                </TableCell>
                <TableCell>{appointment.notes || "No notes"}</TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No appointments found for this date
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  )
}

export default AppointmentsList
