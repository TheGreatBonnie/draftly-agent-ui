import type { ReviewViewModel, ReviewFileViewModel } from "./reviews";

export interface ReviewDetailFacts {
  title: string;
  reference: string | null;
  description: string;
  repository: string | null;
  status: string;
  risk: string | null;
  score: number | null;
  evidenceCount: number;
  dimensionCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  githubUrl: string | null;
  files: ReviewFileViewModel[];
}

export function reviewDetailFacts(review: ReviewViewModel): ReviewDetailFacts {
  return {
    title: review.title,
    reference: review.reference,
    description: review.description,
    repository: review.repository,
    status: review.status,
    risk: review.risk,
    score: review.score,
    evidenceCount: review.evidence.length,
    dimensionCount: review.evaluation.dimensions.length,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    githubUrl: review.githubUrl,
    files: review.files,
  };
}
