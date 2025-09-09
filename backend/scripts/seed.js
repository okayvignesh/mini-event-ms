/* eslint-disable no-console */
const crypto = require("crypto");

const API_BASE = process.env.API_BASE || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const TOTAL_EVENTS = Number(process.env.TOTAL_EVENTS || 50);
const ATTENDEES_PER_EVENT = Number(process.env.ATTENDEES_PER_EVENT || 100);
const CONCURRENCY = Number(process.env.CONCURRENCY || 5);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function http(method, path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    try {
      const j = text ? JSON.parse(text) : {};
      const msg = j?.error || j?.message || `${res.status} ${res.statusText}`;
      throw new Error(msg);
    } catch (_) {
      throw new Error(text || `${res.status} ${res.statusText}`);
    }
  }
  return text ? JSON.parse(text) : null;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomWord(len = 6) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let s = "";
  for (let i = 0; i < len; i++) s += letters[Math.floor(Math.random() * letters.length)];
  return s;
}

function randomName() {
  const first = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Avery", "Jamie", "Cameron"];
  const last = ["Lee", "Patel", "Kim", "Garcia", "Nguyen", "Smith", "Jones", "Brown", "Davis", "Wilson"];
  return `${randomFrom(first)} ${randomFrom(last)}`;
}

function randomEmail() {
  const providers = ["example.com", "mail.com", "test.io", "demo.dev", "sample.org"]; 
  const local = `${randomWord(5)}.${randomWord(7)}.${crypto.randomUUID().slice(0, 8)}`;
  return `${local}@${randomFrom(providers)}`.toLowerCase();
}

function randomEventPayload() {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const start = new Date(now + randomInt(0, 60) * dayMs + randomInt(0, 23) * 3600000);
  const end = new Date(start.getTime() + randomInt(1, 6) * 3600000);
  const locations = ["New York", "San Francisco", "Berlin", "London", "Bengaluru", "Tokyo", "Sydney", "Toronto", "Paris", "Dubai"];
  const topics = [
    "AI Summit",
    "Cloud Expo",
    "FinTech Forum",
    "Cybersecurity Conference",
    "Developer Week",
    "Data Science Summit",
    "Product Management Meetup",
    "Design Systems Day",
    "DevOps Days",
    "Startup Pitch Night",
  ];
  const industries = [
    "Healthcare",
    "Education",
    "E-commerce",
    "Gaming",
    "Automotive",
    "Finance",
    "Media",
    "Retail",
    "Energy",
    "Logistics",
  ];
  return {
    name: `${randomFrom(topics)} – ${randomFrom(industries)} ${new Date(start).getFullYear()}`,
    location: randomFrom(locations),
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    max_capacity: Math.max(ATTENDEES_PER_EVENT + 20, 300),
  };
}

async function waitForApiReady(maxWaitMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(`${API_BASE}/`);
      if (res.ok) return true;
    } catch (_) {
      // ignore
    }
    await sleep(500);
  }
  return false;
}

async function createEventAndRegisterAttendees(idx) {
  const payload = randomEventPayload();
  const event = await http("POST", "/events", payload);
  const eventId = event?.id;
  if (!eventId) {
    throw new Error("Event ID missing in response");
  }

  let success = 0;
  for (let i = 0; i < ATTENDEES_PER_EVENT; i++) {
    const name = randomName();
    const email = randomEmail();
    try {
      await http("POST", `/events/${eventId}/register`, { name, email });
      success++;
    } catch (err) {
      // Likely duplicate or capacity reached; continue
      if (i % 25 === 0) {
        console.warn(`Event ${idx}: registration error at ${i}: ${err?.message || err}`);
      }
    }
    // Light pacing
    if (i % 20 === 0) await sleep(50);
  }
  return { eventId, success };
}

async function run() {
  const ready = await waitForApiReady();
  if (!ready) {
    console.error(`API at ${API_BASE} not reachable. Start the backend before seeding.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Seeding ${TOTAL_EVENTS} events with ~${ATTENDEES_PER_EVENT} attendees each at ${API_BASE} ...`);

  let created = 0;
  let registered = 0;

  const indices = Array.from({ length: TOTAL_EVENTS }, (_, i) => i + 1);

  for (let i = 0; i < indices.length; i += CONCURRENCY) {
    const batch = indices.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (idx) => {
        try {
          const r = await createEventAndRegisterAttendees(idx);
          console.log(`Created event #${idx} (${r.eventId}); registered ${r.success}`);
          return r;
        } catch (err) {
          console.error(`Failed event #${idx}:`, err?.message || err);
          return { eventId: null, success: 0 };
        }
      })
    );
    created += results.filter((r) => r.eventId).length;
    registered += results.reduce((sum, r) => sum + r.success, 0);
    // small pause between batches
    await sleep(200);
  }

  console.log(`Done. Events created: ${created}/${TOTAL_EVENTS}. Registrations: ${registered}.`);
}

// Ensure global fetch in Node >= 18; if unavailable, exit gracefully.
if (typeof fetch !== "function") {
  console.error("Global fetch is not available in this Node version. Please use Node.js v18+.");
  process.exit(1);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});


