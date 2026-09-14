"use client";

import { ChevronDown, FileCheck2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/dashboard/ui";
import {
  buildEvaluationTrendDays,
  evaluationScore,
  splitEvaluationTrendSegments,
  type EvaluationTrendPoint,
} from "@/lib/evaluations";

type EvaluationWindow = 1 | 7 | 14 | 30;

interface EvaluationScoreTrendProps {
  trend: EvaluationTrendPoint[];
  days: EvaluationWindow;
  onDaysChange(days: EvaluationWindow): void;
}

const PLOT = {
  left: 40,
  right: 740,
  top: 42,
  bottom: 184,
};

function dateLabel(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function EvaluationScoreTrend({
  trend,
  days,
  onDaysChange,
}: EvaluationScoreTrendProps) {
  const values = buildEvaluationTrendDays(trend, days);
  const observed = values.filter((point) => point.average_score !== null);
  const plotPoints = values.map((point, index) => ({
    ...point,
    x: values.length === 1
      ? (PLOT.left + PLOT.right) / 2
      : PLOT.left + (index * (PLOT.right - PLOT.left)) / (values.length - 1),
    y: PLOT.bottom - ((point.average_score ?? 0) / 100) * (PLOT.bottom - PLOT.top),
  }));
  const segments = splitEvaluationTrendSegments(plotPoints);
  const latest = [...plotPoints].reverse().find((point) => point.average_score !== null);
  const labelIndexes = Array.from(new Set(
    Array.from(
      { length: Math.min(7, values.length) },
      (_, index) => Math.round((index * (values.length - 1)) / Math.max(1, Math.min(6, values.length - 1))),
    ),
  ));
  const tooltipX = latest
    ? Math.min(Math.max(latest.x - 44, PLOT.left), PLOT.right - 88)
    : PLOT.left;

  return (
    <Card className="h-[286px] min-w-0 overflow-hidden xl:col-span-2">
      <SectionTitle
        icon={<FileCheck2 aria-hidden="true" className="h-4 w-4" />}
        title="Evaluation score trend"
        subtitle="UTC daily average from persisted runs"
        action={(
          <label className="relative block">
            <span className="sr-only">Evaluation score trend date range</span>
            <select
              value={days}
              onChange={(event) => onDaysChange(Number(event.target.value) as EvaluationWindow)}
              className="h-8 appearance-none rounded-md border border-border bg-surface py-0 pl-3 pr-9 text-[11px] font-medium text-foreground-secondary outline-none hover:bg-surface-subtle focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted"
            />
          </label>
        )}
      />

      {observed.length < 2 ? (
        <div role="status" className="flex h-[218px] items-center justify-center px-4 text-sm text-foreground-muted">
          Not enough completed runs to show a trend.
        </div>
      ) : (
        <div className="px-4 pb-3 pt-1">
          <svg
            viewBox="0 0 780 218"
            role="img"
            aria-labelledby="evaluation-trend-title evaluation-trend-description"
            className="h-[218px] w-full"
          >
            <title id="evaluation-trend-title">Evaluation score trend</title>
            <desc id="evaluation-trend-description">
              Daily average evaluation scores over the last {days} days. Missing dates have no plotted score.
            </desc>
            <defs>
              <linearGradient id="evaluation-score-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#5B7CFA" stopOpacity=".24" />
                <stop offset="1" stopColor="#5B7CFA" stopOpacity=".025" />
              </linearGradient>
            </defs>

            {[100, 80, 60, 40, 20, 0].map((score) => {
              const y = PLOT.bottom - (score / 100) * (PLOT.bottom - PLOT.top);
              return (
                <g key={score}>
                  <line
                    x1={PLOT.left}
                    y1={y}
                    x2={PLOT.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                  />
                  <text
                    x="27"
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-500 text-[9px] dark:fill-slate-400"
                  >
                    {score}
                  </text>
                </g>
              );
            })}

            {labelIndexes.map((index) => (
              <line
                key={`grid-${values[index].date}`}
                x1={plotPoints[index].x}
                y1={PLOT.top}
                x2={plotPoints[index].x}
                y2={PLOT.bottom}
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800/70"
                strokeWidth="1"
              />
            ))}

            {segments.filter((segment) => segment.length > 1).map((segment) => {
              const line = segment.map((point) => `${point.x},${point.y}`).join(" ");
              const area = `${segment[0].x},${PLOT.bottom} ${line} ${segment.at(-1)?.x},${PLOT.bottom}`;
              return (
                <g key={`segment-${segment[0].date}`}>
                  <polygon points={area} fill="url(#evaluation-score-area)" />
                  <polyline
                    points={line}
                    fill="none"
                    stroke="#2F62F5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}

            {plotPoints.filter((point) => point.average_score !== null).map((point) => (
              <circle
                key={`point-${point.date}`}
                cx={point.x}
                cy={point.y}
                r={point.date === latest?.date ? 6 : 3}
                fill="#2F62F5"
                stroke="white"
                strokeWidth={point.date === latest?.date ? 3 : 1.5}
              >
                <title>{`${dateLabel(point.date)}: ${evaluationScore(point.average_score)} (${point.run_count} runs)`}</title>
              </circle>
            ))}

            {latest && (
              <>
                <line
                  x1={latest.x}
                  y1={PLOT.top}
                  x2={latest.x}
                  y2={PLOT.bottom}
                  stroke="#C9D5F6"
                  strokeDasharray="3 3"
                />
                <g transform={`translate(${tooltipX} 0)`}>
                  <rect
                    width="88"
                    height="40"
                    rx="6"
                    className="fill-white stroke-slate-200 dark:fill-slate-950 dark:stroke-slate-700"
                    filter="drop-shadow(0 2px 4px rgba(15,23,42,.08))"
                  />
                  <text x="12" y="16" className="fill-slate-500 text-[9px] dark:fill-slate-400">
                    {dateLabel(latest.date)}
                  </text>
                  <text x="12" y="30" className="fill-slate-900 text-[10px] font-semibold dark:fill-slate-100">
                    Score: {evaluationScore(latest.average_score)}
                  </text>
                </g>
              </>
            )}

            {labelIndexes.map((index) => (
              <text
                key={`label-${values[index].date}`}
                x={plotPoints[index].x}
                y="207"
                textAnchor={index === 0 ? "start" : index === values.length - 1 ? "end" : "middle"}
                className="fill-slate-500 text-[9px] dark:fill-slate-400"
              >
                {dateLabel(values[index].date)}
              </text>
            ))}
          </svg>
        </div>
      )}
    </Card>
  );
}
