"use client";

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-start justify-between gap-3 rounded-[9px] border border-red-200 bg-red-50 px-[15px] py-[13px] text-xs leading-[1.5] text-red-700"
    >
      <p className="m-0">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-bold text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
