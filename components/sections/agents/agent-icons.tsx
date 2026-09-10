import { Bot, FileText, Github, MessageSquare, Search, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  documentation: FileText,
  github: Github,
  support: MessageSquare,
  research: Search,
};

export function agentIcon(surface: string): LucideIcon {
  return icons[surface] ?? Bot;
}

export function surfaceTone(surface: string): "blue" | "violet" | "green" | "amber" | "rose" | "cyan" | "slate" {
  if (surface === "documentation") return "blue";
  if (surface === "support") return "violet";
  if (surface === "github") return "green";
  if (surface === "research") return "amber";
  if (surface === "content") return "cyan";
  return "slate";
}
