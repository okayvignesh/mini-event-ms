"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CalendarClock, ChevronDown, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function NewEventPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent({
        name,
        location,
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        max_capacity: typeof maxCapacity === "number" ? maxCapacity : parseInt(String(maxCapacity || 0), 10),
      });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Create Event</h1>
        <Button variant="outline" className="cursor-pointer">
          <Link href="/">← Back</Link>
        </Button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input id="location" className="pl-8" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Start</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between font-normal">
                  <span className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-muted-foreground" />{start ? new Date(start).toLocaleDateString() : "Select date"}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={start ? new Date(start) : undefined}
                  onSelect={(d) => {
                    if (!d) return;
                    const t = start ? new Date(start) : new Date();
                    t.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
                    setStart(t.toISOString().slice(0, 16));
                  }}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              step="60"
              value={start ? new Date(start).toTimeString().slice(0,5) : ""}
              onChange={(e) => {
                const [hh, mm] = e.target.value.split(":");
                const base = start ? new Date(start) : new Date();
                base.setHours(Number(hh ?? 0), Number(mm ?? 0), 0, 0);
                setStart(base.toISOString().slice(0, 16));
              }}
              placeholder="HH:MM"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>End</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between font-normal">
                  <span className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-muted-foreground" />{end ? new Date(end).toLocaleDateString() : "Select date"}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={end ? new Date(end) : undefined}
                  onSelect={(d) => {
                    if (!d) return;
                    const t = end ? new Date(end) : new Date();
                    t.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
                    setEnd(t.toISOString().slice(0, 16));
                  }}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              step="60"
              value={end ? new Date(end).toTimeString().slice(0,5) : ""}
              onChange={(e) => {
                const [hh, mm] = e.target.value.split(":");
                const base = end ? new Date(end) : new Date();
                base.setHours(Number(hh ?? 0), Number(mm ?? 0), 0, 0);
                setEnd(base.toISOString().slice(0, 16));
              }}
              placeholder="HH:MM"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_capacity">Max Capacity</Label>
          <Input
            id="max_capacity"
            type="number"
            min={1}
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value === "" ? "" : Number(e.target.value))}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
}


