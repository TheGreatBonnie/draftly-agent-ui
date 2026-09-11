"use client";

import { useCallback } from "react";
import { listWorkflowTemplates, listWorkflows } from "@/api/workflows";
import { useLiveRefresh } from "@/hooks/use-live-refresh";

export function useWorkflows(options: { status?: "active" | "paused" | "draft" } = {}) {
  const fetchWorkflows = useCallback(() => listWorkflows({ status: options.status, limit: 100, days: 30 }), [options.status]);
  const fetchTemplates = useCallback(() => listWorkflowTemplates(100), []);
  const workflows = useLiveRefresh(fetchWorkflows, ["workflow:changed"]);
  const templates = useLiveRefresh(fetchTemplates, ["workflow:changed"]);
  return { ...workflows, templates: templates.data ?? { items: [] }, templatesError: templates.error };
}
