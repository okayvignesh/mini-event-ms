"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventById, getAttendees, registerAttendee } from "@/lib/api";
import { CalendarClock, MapPin } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [attendeesPage, setAttendeesPage] = useState(1);
  const attendeesPageSize = 6;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      const ev = await getEventById(eventId);
      setEvent(ev);
      const list = await getAttendees(eventId);
      setAttendees(list);
    })();
  }, [eventId]);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!eventId) return;
    setError("");
    try {
      await registerAttendee(eventId, { name, email });
      setName("");
      setEmail("");
      const list = await getAttendees(eventId);
      setAttendees(list);
    } catch (err: any) {
      console.log(err)
      setError(err?.message || "Failed to register attendee");
    }
  }

  if (!event) return <p className="text-sm text-muted-foreground">Event not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-9" />
        <Button variant="outline" className="cursor-pointer"><Link href="/">← Back</Link></Button>
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{event.name}</h1>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-accent/40">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            {formatDateTime(event.start_time)} – {formatDateTime(event.end_time)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-accent/40">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {event.location}
          </span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Register Attendee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onRegister} className="space-y-3">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
              )}
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit">Register</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Attendees</span>
              {attendees.length > 0 && (
                <span className="text-xs text-muted-foreground">{attendees.length} total</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attendees yet.</p>
            ) : (
              <>
                <ul className="divide-y">
                  {attendees
                    .slice((attendeesPage - 1) * attendeesPageSize, attendeesPage * attendeesPageSize)
                    .map((a: any, i) => {
                      const displayName = (a.name && a.name.trim()) || a.email || "Unknown";
                      const displayEmail = a.email || "";
                      const initial = (displayName || displayEmail || "?").trim().charAt(0).toUpperCase();
                      return (
                        <li key={`${a.email}-${i}`} className="py-2">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-border shadow-sm text-xs font-medium select-none">
                              {initial}
                            </span>
                            <div className="min-w-0 flex-1 leading-tight">
                              <p className="text-sm font-medium truncate">{displayName}</p>
                              {displayEmail && (
                                <p className="text-xs text-muted-foreground truncate" title={displayEmail}>{displayEmail}</p>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                {attendees.length > attendeesPageSize && (
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-xs text-muted-foreground">
                      Page {attendeesPage} of {Math.max(1, Math.ceil(attendees.length / attendeesPageSize))}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        disabled={attendeesPage <= 1}
                        onClick={() => setAttendeesPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        disabled={attendeesPage >= Math.ceil(attendees.length / attendeesPageSize)}
                        onClick={() => setAttendeesPage((p) => Math.min(Math.ceil(attendees.length / attendeesPageSize), p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


