import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function Navbar() {
  return (
    <nav
      className={cn(
        "w-full border-b bg-white px-4 py-3 flex items-center justify-between"
      )}
    >
      <div className="flex items-center space-x-2">
        <Link href="/" className="font-bold text-lg tracking-tight text-primary hover:opacity-80 transition-opacity">
          MiniEvent
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
