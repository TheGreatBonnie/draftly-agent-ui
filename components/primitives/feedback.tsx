"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
import { Card, IconTile } from "./card";

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <Card className="grid min-h-64 place-items-center p-8 text-center"><div><IconTile size="lg" tone="violet" className="mx-auto">{icon}</IconTile><h3 className="mt-4 font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-foreground-muted">{description}</p>{action && <div className="mt-5">{action}</div>}</div></Card>;
}

export function MockDialog({ open, onClose, title, description, children, confirmLabel = "Confirm", danger = false, onConfirm }: { open: boolean; onClose: () => void; title: string; description?: string; children?: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm?: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={onClose}><Card className="w-full max-w-md p-5 shadow-2xl"><div onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">{title}</h3>{description && <p className="mt-1 text-sm text-foreground-muted">{description}</p>}</div><button onClick={onClose} className="rounded-lg p-2 hover:bg-surface-subtle" aria-label="Close dialog"><X className="h-4 w-4" /></button></div>{children && <div className="mt-4">{children}</div>}<div className="mt-5 flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button danger={danger} primary={!danger} onClick={() => { onConfirm?.(); onClose(); }}>{confirmLabel}</Button></div></div></Card></div>;
}

export function Skeleton({ className = "" }: { className?: string }) { return <div className={`animate-pulse rounded-lg bg-surface-subtle ${className}`} />; }
