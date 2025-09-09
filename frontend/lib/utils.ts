import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(input: string | number | Date): string {
  const date = new Date(input);
  const formatter = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: undefined,
  });
  const formatted = formatter.format(date)
    .replaceAll("\u202F", " ")
    .replaceAll("\u00A0", " ");
  const [datePart, timePart] = formatted.split(", ");
  const [mon, dayAndYear] = datePart.includes(" ") ? datePart.split(" ") : ["", datePart];
  const [dayStr, yearStr] = dayAndYear?.split(", ") || ["", ""];
  const day = dayStr?.trim();
  const monShort = mon?.trim();
  const year = yearStr?.trim();
  const niceDate = day && monShort && year ? `${day} ${monShort} ${year}` : datePart;
  return [niceDate, timePart].filter(Boolean).join(", ");
}

export function formatDateTimeWithZone(input: string | number | Date): string {
  const d = new Date(input);
  const formatter = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const formatted = formatter.format(d);
  const parts = formatted
    .replaceAll("\u202F", " ")
    .replaceAll("\u00A0", " ")
    .split(", ");
  let datePart = parts[0] || "";
  let timePart = parts[1] || "";
  let tzPart = parts.slice(2).join(" ") || "";
  const [mon, dayAndYear] = datePart.includes(" ") ? datePart.split(" ") : ["", datePart];
  const [dayStr, yearStr] = dayAndYear?.split(", ") || ["",""];
  const day = dayStr?.trim();
  const monShort = mon?.trim();
  const year = yearStr?.trim();
  const niceDate = day && monShort && year ? `${day} ${monShort} ${year}` : datePart;
  return [niceDate, timePart, tzPart].filter(Boolean).join(", ");
}
