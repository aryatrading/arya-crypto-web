import { useEffect, useCallback } from "react";

export default function useDebounce(
  effect: Function,
  dependencies: string[],
  delay: number
) {
  const callback = useCallback(effect, [...dependencies, effect]);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
