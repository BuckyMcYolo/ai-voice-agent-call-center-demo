import { getPatientsBelongingToUser } from "@/db/queries/patients"
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
import { Phone, MapPin } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const PatientsList = async ({
  session,
}: {
  session: typeof auth.$Infer.Session
}) => {
  const patients = await getPatientsBelongingToUser(session.user.id)

  return (
    <CardContent>
      <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{`${patient.firstName} ${patient.lastName}`}</span>
                    <span className="text-xs text-muted-foreground">
                      SSN: {patient.ssn}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className="capitalize">
                    {patient.gender || "Not specified"}
                  </span>
                </TableCell>
                <TableCell>
                  {patient.phoneNumber && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone size={14} />
                      {patient.phoneNumber}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {patient.address && (
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin size={14} />
                      {patient.address}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  )
}

export default PatientsList
