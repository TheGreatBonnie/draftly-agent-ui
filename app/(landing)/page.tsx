import { OrganizationList, Show } from "@clerk/nextjs";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { SystemFlow } from "@/components/landing/system-flow";
import { FeatureSection } from "@/components/landing/feature-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { KnowledgeSection } from "@/components/landing/knowledge-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Show when="signed-in">
        <section className="flex flex-1 items-center justify-center bg-surface/50 px-6 py-20">
          <OrganizationList
            afterSelectOrganizationUrl="/onboarding"
            afterCreateOrganizationUrl="/onboarding"
          />
        </section>
      </Show>

      <Show when="signed-out">
        <Hero />

        <TrustedBy />

        <SystemFlow />

        <FeatureSection />

        <WorkflowSection />

        <KnowledgeSection />

        <IntegrationsSection />

        <FinalCTA />
      </Show>

      <Footer />
    </main>
  );
}
