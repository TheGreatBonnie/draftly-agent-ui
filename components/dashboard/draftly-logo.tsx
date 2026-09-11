import Link from "next/link";
import { BrandMark } from "@/components/onboarding/design/brand-mark";

export function DraftlyLogo() {
  return <Link href="/" aria-label="Draftly home" className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#101a43]"><BrandMark size={24} /></span><span className="text-xl font-semibold text-[#101a43]">Draftly</span></Link>;
}
