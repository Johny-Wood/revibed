import { useEffect, useRef, useState } from 'react';

function useElementOnScreen(ref, rootMargin = '0px') {
  const [isIntersecting, setIsIntersecting] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return isIntersecting;
}

const AnimateIn = ({ children }) => {
  const [isAnimate, setIsAnimate] = useState(false);
  const [isStyled, setIsStyled] = useState(false);

  const ref = useRef(null);
  const onScreen = useElementOnScreen(ref);

  if (!onScreen && !isAnimate) {
    setIsAnimate(true);
  }

  if (onScreen && isAnimate && !isStyled) {
    setIsStyled(true);
  }

  return (
    <div
      ref={ref}
      style={{
        opacity: isStyled ? 1 : 0,
        translate: isStyled ? 'none' : '0 5rem',
        transition: '1s ease-in-out',
      }}
    >
      {children}
    </div>
  );
};

export default AnimateIn;
