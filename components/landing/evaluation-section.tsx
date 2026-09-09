const scores = [
  ["Faithfulness", "0.96"],
  ["Completeness", "0.91"],
  ["Consistency", "0.94"],
  ["Grounding", "0.98"],
];

export function EvaluationSection() {
  return (
    <section className="section border-y border-border bg-surface-secondary">
      <div className="container-draftly grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <div className="eyebrow text-primary">Evaluation</div>

          <h2 className="section-heading mt-5">
            Generated documentation should prove itself.
          </h2>

          <p className="mt-7 text-lg leading-8 text-muted">
            Draftly evaluates documentation before it becomes part of your
            trusted product knowledge.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
              <p className="text-sm font-semibold">
                Authentication Migration Guide
              </p>

              <p className="mt-1 text-xs text-muted">Evaluation report</p>
            </div>

            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
              PASS
            </span>
          </div>

          <div className="space-y-5 pt-6">
            {scores.map(([label, score]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold">{score}</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-surface-secondary">
                  <div
                    className="h-full bg-foreground"
                    style={{
                      width: `${Number(score) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-xl border border-border p-4">
            <p className="text-xs text-muted">Overall evaluation</p>
            <p className="mt-2 text-2xl font-semibold">0.95</p>
            <p className="mt-1 text-xs text-muted">
              All required quality gates passed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
