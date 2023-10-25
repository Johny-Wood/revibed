import { useEffect, useRef } from 'react';

export function PreviousHook<Value = unknown>(value: Value) {
  const ref = useRef<Value>(value);

  useEffect(() => {
    if (ref.current === value) {
      return;
    }

    ref.current = value;
  }, [value]);

  return ref.current;
}
