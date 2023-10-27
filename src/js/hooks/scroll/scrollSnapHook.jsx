import { useEffect, useState } from 'react';

import createScrollSnap from 'scroll-snap';

export default function useScrollSnap(ref, settings, callback) {
  const [scrollBind, setBind] = useState(() => () => {});
  const [scrollUnbind, setUnbind] = useState(() => () => {});

  useEffect(() => {
    const element = ref.current;

    if (element) {
      const { bind, unbind } = createScrollSnap(element, settings, callback);
      setBind(() => bind);
      setUnbind(() => unbind);
      console.log(element);
      console.log(settings);
      console.log(callback)

    }
  }, []);

  useEffect(() => {
    console.log(scrollBind)
  }, [scrollBind])

  return [scrollBind, scrollUnbind];
}
