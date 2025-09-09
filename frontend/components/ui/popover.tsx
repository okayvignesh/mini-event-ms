"use client";
import * as React from "react";

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export function Popover({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode; }) {
  const [internal, setInternal] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const value = isControlled ? open : internal;
  const setValue = (v: boolean) => {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
  };
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent | TouchEvent) {
      if (!value) return;
      const el = containerRef.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && el.contains(target)) return;
      setValue(false);
    }
    function onKey(e: KeyboardEvent) {
      if (!value) return;
      if (e.key === "Escape") setValue(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick as any);
      document.removeEventListener("keydown", onKey);
    };
  }, [value]);

  return (
    <PopoverContext.Provider value={{ open: value, setOpen: setValue }}>
      <div ref={containerRef} className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ asChild, children, ...props }: { asChild?: boolean; children: React.ReactElement<any>; [key: string]: any; }) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) return children;
  const child = React.cloneElement<any>(children, {
    ...props,
    onClick: (e: any) => {
      (children.props as any).onClick?.(e);
      ctx.setOpen(!ctx.open);
    },
    "aria-expanded": ctx.open,
  } as any);
  return asChild ? child : <button type="button">{child}</button>;
}

export function PopoverContent({ className, align, children }: { className?: string; align?: "start" | "center" | "end"; children: React.ReactNode; }) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx || !ctx.open) return null;
  const alignment = align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";
  return (
    <div className={`absolute z-50 mt-2 rounded-md border bg-popover text-popover-foreground shadow-md ${alignment} ${className ?? ""}`}>
      {children}
    </div>
  );
}

export default Popover;


