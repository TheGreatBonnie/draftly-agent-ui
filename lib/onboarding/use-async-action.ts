import { useCallback, useState } from "react";
import { ApiError } from "@/api/client";

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const run = useCallback(
    async (fn: () => Promise<unknown>): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await fn();
        return true;
      } catch (e) {
        setError(
          e instanceof ApiError
            ? e.message
            : "Something went wrong. Please try again."
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { run, loading, error, clearError };
}
