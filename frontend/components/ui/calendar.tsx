"use client";
import * as React from "react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

export function Calendar({ className, ...props }: DayPickerProps & { className?: string }) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-2", className)}
      {...props}
    />
  );
}

export default Calendar;


