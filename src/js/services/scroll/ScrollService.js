import NextRouter from '@/services/NextRouter';

const SCROLL_SMOOTH_DURATION = 300;
const SCROLL_SMOOTH_TIMING_FUNCTION_POW = 3;

const ScrollBehaviors = {
  DEFAULT: 0,
  SMOOTH: 1,
};

const animate = ({ duration, draw, timing, onFinish = () => {} }) => {
  let start = null;
  let animationId = null;

  const animateFrame = (time) => {
    if (!start) {
      start = time;
    }
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) {
      timeFraction = 1;
    }

    const progress = timing(timeFraction);

    draw(progress);

    if (timeFraction < 1) {
      animationId = requestAnimationFrame(animateFrame);
    } else {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      onFinish();
    }
  };

  animationId = requestAnimationFrame(animateFrame);
};

function makeEaseInOut(timing) {
  function makeEaseInOutCall(timeFraction) {
    if (timeFraction < 0.5) {
      return timing(2 * timeFraction) / 2;
    }
    return (2 - timing(2 * (1 - timeFraction))) / 2;
  }

  return makeEaseInOutCall;
}

function easeOut(timeFraction) {
  return timeFraction ** SCROLL_SMOOTH_TIMING_FUNCTION_POW;
}

const easeInOutTimeFraction = makeEaseInOut(easeOut);

const ScrollService = (() => {
  let instances = {};
  let scrollPosition = 0;

  const scrollTo = ({
    scrollBarName,
    position,
    behavior = ScrollBehaviors.SMOOTH,
    defaultOffset = true,
    callback = () => {},
    secondOffset = 0,
    duration = SCROLL_SMOOTH_DURATION,
  }) => {
    const { topOffset = 0, scrollBar } = instances[scrollBarName];
    const positionWithOffset = position - (defaultOffset ? topOffset : 0) - secondOffset;

    if (!scrollBar?.current) {
      return;
    }

    if (behavior === ScrollBehaviors.SMOOTH) {
      const { current: { scrollValues: { scrollTop: currentScrollTop } = {} } = {} } = scrollBar;
      const dif = currentScrollTop + positionWithOffset - currentScrollTop;

      animate({
        duration,
        timing: (timeFraction) => easeInOutTimeFraction(timeFraction),
        draw: (progress) => {
          scrollBar.current.scrollTo(0, currentScrollTop + progress * dif);
        },
        onFinish: () => {
          instances[scrollBarName].scrollInProcess = false;
          setTimeout(() => {
            callback();
          }, duration);
        },
      });
    } else {
      scrollBar.current.scrollTo(0, positionWithOffset);
      setTimeout(() => {
        instances[scrollBarName].scrollInProcess = false;
        callback();
      }, duration);
    }
  };

  const scrollTop = async ({ sectionId, scrollBarName, behavior = 1, callback = () => {} }) => {
    const { sectionsRef, scrollBar } = instances[scrollBarName];
    const foundedSection = sectionsRef[sectionId];

    if (!foundedSection || !foundedSection.page || !scrollBar?.current) {
      return;
    }

    if (behavior === ScrollBehaviors.SMOOTH) {
      const { current: { scrollValues: { scrollTop: currentScrollTop } = {} } = {} } = scrollBar;
      const dif = currentScrollTop;

      animate({
        duration: SCROLL_SMOOTH_DURATION,
        timing: (timeFraction) => timeFraction,
        draw: (progress) => {
          scrollBar.current.scrollTo(0, currentScrollTop - progress * dif);
        },
        onFinish: () => {
          instances[scrollBarName].scrollInProcess = false;
          setTimeout(() => {
            callback();
          }, SCROLL_SMOOTH_DURATION);
        },
      });
    } else {
      scrollBar.current.scrollTo(0, 0);
      setTimeout(() => {
        callback();
      }, 300);
    }
  };

  const scrollToElement = async ({
    scrollBarName,
    sectionId,
    behavior = ScrollBehaviors.SMOOTH,
    defaultOffset = true,
    inRoute = true,
    secondOffset = 0,
    duration,
    callback = () => {},
  }) => {
    const { scrollInProcess, sectionsRef } = instances[scrollBarName];
    const foundedSection = sectionsRef[sectionId];

    if (!foundedSection || !foundedSection.page) {
      return;
    }

    const scroll = (ref) => {
      if (!ref || !ref.current || scrollInProcess) {
        return;
      }

      const { top: elementTop } = ref.current.getBoundingClientRect();

      instances[scrollBarName].scrollInProcess = true;

      scrollTo({
        scrollBarName,
        position: elementTop,
        behavior,
        defaultOffset,
        callback,
        secondOffset,
        duration,
      });
    };

    const { router = {}, router: { router: { pathname } = {} } = {} } = NextRouter.getInstance();

    const scrollToNewSection = () => {
      const { sectionsRef: sectionsRefNew } = instances[scrollBarName];

      const newFoundedSection = sectionsRefNew[sectionId];

      if (newFoundedSection) {
        scroll(newFoundedSection.ref);
        router.events.off('routeChangeComplete', scrollToNewSection);
      }
    };

    if (pathname !== foundedSection.page && !inRoute) {
      router.push(foundedSection.page).then(() => {
        router.events.on('routeChangeComplete', scrollToNewSection);
      });

      return;
    }

    await new Promise((resolve) => {
      resolve();
      router.events.off('routeChangeComplete', scrollToNewSection);
    });

    scroll(foundedSection.ref);
  };

  const init = (scrollBarName) => ({
    scrollToElement: (data, callback) =>
      scrollToElement({
        ...data,
        scrollBarName,
        callback,
      }),
    scrollTop: ({ defaultOffset, offset, callback, sectionId, behavior, inRoute }) =>
      scrollTop({
        scrollBarName,
        defaultOffset,
        callback,
        offset,
        sectionId,
        behavior,
        inRoute,
      }),
    scrollTo: ({ elementTop, callback, behavior }) =>
      scrollTo({
        scrollBarName,
        position: elementTop,
        behavior,
        defaultOffset: 0,
        callback,
      }),
    setTopOffset: (offset) => {
      instances[scrollBarName].topOffset = offset;
    },
    addSection: (id, page, ref) => {
      const { sectionsRef } = instances[scrollBarName];

      sectionsRef[id] = {
        page,
        ref,
      };
    },
  });

  return {
    initialize: ({ scrollBarRef, scrollBarName }) => {
      instances = {
        ...instances,
        [scrollBarName]: {
          ...init(scrollBarName),
          topOffset: 0,
          isInitialize: true,
          sectionsRef: {},
          scrollInProcess: false,
          ...instances[scrollBarName],
          scrollBar: scrollBarRef,
        },
      };
    },
    getInstance: (scrollBarName) => {
      const { isInitialize } = instances[scrollBarName] || {};

      if (!isInitialize) {
        console.warn('ScrollService not initialized');
        return null;
      }

      return instances[scrollBarName];
    },
    getScrollPosition: () => scrollPosition,
    setScrollPosition: (newScrollPosition) => {
      scrollPosition = newScrollPosition;
    },
  };
})();

export default ScrollService;
export { ScrollBehaviors };
