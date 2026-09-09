import { request } from "./client";

export async function issueDashboardTicket(): Promise<string> {
  const data = await request<{ ticket: string }>(
    "/workflows/dashboard-ticket",
    { method: "POST" },
  );
  return data.ticket;
}
