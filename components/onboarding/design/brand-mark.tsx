export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true">
      <path
        d="M14 6.4C12 4.6 9.1 4 5.8 4c-.4 0-.8.3-.8.8v15.4c0 .5.4.8.8.8 3.3 0 6.2.6 8.2 2.4 2-1.8 4.9-2.4 8.2-2.4.4 0 .8-.3.8-.8V4.8c0-.5-.4-.8-.8-.8-3.3 0-6.2.6-8.2 2.4z"
        fill="var(--onboarding-brand-mark)"
      />
      <path
        d="M14 6.6v16.2"
        stroke="var(--onboarding-brand-mark-line)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8.4 9.2h3.1M8.4 12.4h3.1M16.5 9.2h3.1M16.5 12.4h3.1"
        stroke="var(--onboarding-brand-mark-detail)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
