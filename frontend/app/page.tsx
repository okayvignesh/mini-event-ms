import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEvents } from "@/lib/api";
import { CalendarClock, MapPin, Eye } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const events = (await getEvents()).slice().sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const pageSize = 6;
  const sp = await searchParams;
  const pageParam = typeof sp?.page === "string" ? parseInt(sp?.page, 10) : 1;
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = events.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Upcoming Events</h1>
        <Button>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">No events yet.</p>
        )}
        {pageItems.map((e: any) => (
          <Card key={e.id} className="hover:-translate-y-0.5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-3 text-base sm:text-lg">
                <span className="line-clamp-1">{e.name}</span>
                <Link aria-label="View event" className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-muted-foreground hover:text-foreground hover:shadow-sm transition-colors" href={`/events/${e.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                  <span>{formatDateTime(e.start_time)} – {formatDateTime(e.end_time)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate" title={e.location}>{e.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {events.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="cursor-pointer" disabled={safePage <= 1}>
              <Link href={`/?page=${safePage - 1}`}>Previous</Link>
            </Button>
            <Button variant="outline" size="sm" className="cursor-pointer" disabled={safePage >= totalPages}>
              <Link href={`/?page=${safePage + 1}`}>Next</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
