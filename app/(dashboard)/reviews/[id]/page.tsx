import ReviewDetailPage from "@/components/sections/reviews/review-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReviewDetailPage id={id} />;
}
