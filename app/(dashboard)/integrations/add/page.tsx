"use client";

import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { Card, IconTile, PageHeader } from "@/components/dashboard/ui";
import { IntegrationIcon } from "@/components/sections/integrations/integration-icon";
import { PROVIDERS } from "@/lib/integrations";

export default function Page() {
  const { membership } = useOrganization();
  return <>
    <PageHeader title="Add integration" subtitle="Choose a provider to connect to your organization." />
    {membership?.role !== "org:admin" ? <Card className="p-6 text-sm text-slate-600">An organization admin can connect integrations.</Card> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{PROVIDERS.map((provider) => <Card key={provider.id} className="p-5"><IconTile><IntegrationIcon provider={provider.id} /></IconTile><h2 className="mt-4 font-semibold">{provider.name}</h2><p className="mt-2 min-h-12 text-sm text-slate-500">{provider.description}</p><Link href={`/integrations/${provider.id}`} className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">Continue to {provider.name} →</Link></Card>)}</div>}
  </>;
}
