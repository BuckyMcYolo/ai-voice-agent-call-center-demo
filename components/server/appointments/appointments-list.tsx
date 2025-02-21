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
import moment from "moment"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Id</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {moment(appointment.date).format("MM-DD-YYYY")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "scheduled"
                        ? "outline"
                        : appointment.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(appointment.startTime).toLocaleTimeString()}
                    {/* calculate length  */}
                    <span className="text-xs text-muted-foreground">
                      (
                      {moment(appointment.endTime).diff(
                        moment(appointment.startTime),
                        "minutes"
                      )}{" "}
                      min)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</span>
                    <span className="text-xs text-muted-foreground">
                      SSN: {appointment.patient.ssn}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {moment(appointment.patient.dateOfBirth).format("MM-DD-YYYY")}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({moment().diff(appointment.patient.dateOfBirth, "years")}{" "}
                    yo)
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <p className="truncate text-left">
                        {appointment.notes || "No notes"}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="p-2 rounded-md shadow-lg max-w-96">
                      {appointment.notes || "-"}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{appointment.id}</TableCell>
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
