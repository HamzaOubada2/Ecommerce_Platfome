import { useState, useCallback, useRef } from "react";

export function useCartFeedback(duration = 2000) {
  const [feedback, setFeedback] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const trigger = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFeedback(true);
    timerRef.current = setTimeout(() => setFeedback(false), duration);
  }, [duration]);

  return { feedback, trigger } as const;
}
