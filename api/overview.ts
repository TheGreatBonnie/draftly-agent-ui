import { request } from "./client";

export type OverviewDays = 1 | 7 | 14 | 30;

export interface OverviewSnapshot {
  summary: {
    documentation_total: number;
    active_workflows: number;
    running_workflows: number;
    scheduled_workflows: number;
    pending_reviews: number;
    average_evaluation_score: number | null;
  };
  attention: {
    pending_reviews: number;
    pending_interventions: number;
    high_risk_reviews: number;
    failed_evaluations: number;
    integration_issues: number;
    stale_documentation: number;
  };
  system: {
    agents_online: number;
    agents_total: number;
    data_sources_connected: number;
    data_sources_total: number;
    evaluations_status: "Running" | "Idle" | "Failed" | "Unknown";
    scheduler_status: "Healthy" | "Idle" | "Unavailable";
  };
  recent_changes: Array<{
    id: string;
    title: string;
    detail: string;
    timestamp: string | null;
    status: string;
    href: string;
  }>;
  active_workflows: Array<{
    id: string;
    name: string;
    repository: string;
    status: string;
    timestamp: string | null;
    href: string;
  }>;
  evaluation: {
    average_score: number | null;
    trend: number | null;
    dimensions: Array<{ name: string; value: number }>;
  };
  activity: Array<{
    date: string;
    created: number;
    updated: number;
    reviewed: number;
    published: number;
  }>;
}

export function getOverview(days: OverviewDays): Promise<OverviewSnapshot> {
  return request<OverviewSnapshot>(`/overview?days=${days}`);
}
