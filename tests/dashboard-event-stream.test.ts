import assert from "node:assert/strict";
import test from "node:test";

import { createDashboardEventStream } from "../lib/dashboard-event-stream.ts";

class FakeEventSource {
  onerror: (() => void) | null = null;
  closed = false;

  addEventListener(): void {}

  close(): void {
    this.closed = true;
  }
}

test("dashboard stream reconnects with a fresh one-time ticket", async () => {
  const requestedTickets: string[] = [];
  const sources: FakeEventSource[] = [];
  const scheduled: Array<() => void> = [];
  let ticketNumber = 0;

  const stream = createDashboardEventStream({
    getToken: async () => "clerk-token",
    fetchTicket: async () => ({
      ok: true,
      json: async () => ({ ticket: `ticket-${++ticketNumber}` }),
    }),
    createEventSource: (url) => {
      requestedTickets.push(url);
      const source = new FakeEventSource();
      sources.push(source);
      return source;
    },
    handlers: {},
    schedule: (callback) => {
      scheduled.push(callback);
      return scheduled.length;
    },
    cancelSchedule: () => {},
  });

  await stream.connect();
  assert.match(requestedTickets[0], /ticket=ticket-1/);

  sources[0].onerror?.();
  assert.equal(sources[0].closed, true);
  assert.equal(scheduled.length, 1);

  scheduled.shift()?.();
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(requestedTickets[1], /ticket=ticket-2/);

  stream.close();
});
