export type Event = {
  id: string;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
};

export type Attendee = {
  id: string;
  name: string;
  email: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function handleJson<T>(res: Response): Promise<T> {
  const raw: any = await res.text().catch(() => "");
  if (!res.ok) {
    let errObj: any = {};
    try {
      errObj = raw ? JSON.parse(raw) : {};
    } catch (_) {
    }
    let message = "";
    if (typeof errObj?.error === "string" && errObj.error) {
      message = errObj.error;
    } else if (typeof errObj?.error === "object" && typeof errObj.error.message === "string") {
      message = errObj.error.message;
    } else if (typeof errObj?.message === "string" && errObj.message) {
      message = errObj.message;
    } else {
      message = raw || `Request failed with ${res.status}`;
    }
    throw new Error(message);
  }
  try {
    return raw ? JSON.parse(raw) as T : null as unknown as T;
  } catch (_) {
    return null as unknown as T;
  }
}

export async function getEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/events`, { next: { revalidate: 0 } });
  return handleJson<Event[]>(res);
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const events = await getEvents();
  return events.find(e => e.id === eventId) ?? null;
}

export async function getAttendees(eventId: string): Promise<Attendee[]> {
  const res = await fetch(`${API_BASE}/events/${eventId}/attendees`, { next: { revalidate: 0 } });
  return handleJson<Attendee[]>(res);
}

export async function createEvent(payload: {
  name: string;
  location: string;
  start_time: string;
  end_time: string;  
  max_capacity: number;
}): Promise<Event> {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson<Event>(res);
}

export async function registerAttendee(eventId: string, payload: { name: string; email: string; }): Promise<{ message: string; registrationId: string; }>{
  const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

