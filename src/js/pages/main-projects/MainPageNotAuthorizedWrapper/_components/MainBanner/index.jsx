import { createRef, useEffect, useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';

import { RoutePathsConstants } from '@/constants/routes/routes';
import LinkRoute from '@/js/components/ui/links/LinkRoute';

import VinilParallax from './Parallax';
import styles from './styles.module.scss';

import imageUrl from '../../_images/mainBanner.png';
import imageVinil from '../../_images/mainVinil.png';

function MainBanner({ scrollValue }) {
  const [startAnimation, setStartAnimation] = useState(false);

  const mainAnimationRef = createRef();

  useEffect(() => {
    setStartAnimation(true);
  }, [mainAnimationRef]);

  return (
    <div className={styles.MainBanner}>
      <div className={styles.MainBanner__wrapper}>
        <div ref={mainAnimationRef} className={styles.MainBanner__images}>
          <Image
            className={classNames(styles.MainBanner__vinil, startAnimation && styles.MainBanner__vinilAnimation)}
            src={imageVinil}
            width={222}
            height={222}
            alt="vinil"
            quality={100}
          />
          <Image
            className={classNames(styles.MainBanner__image, startAnimation && styles.MainBanner__imageAnimation)}
            src={imageUrl}
            alt="phone"
            quality={100}
          />
        </div>
        <h1 className={styles.MainBanner__title}>
          Digitalizing vinyl is legal. <br /> Get your lossless now!
        </h1>
        <div className={styles.MainBanner__desc}>
          Revibed has forever transformed <br className={styles.MainBanner__brmob} />
          the lives <br className={styles.MainBanner__brdsk} />
          of&nbsp;passionate music enthusiasts. Gone are <br className={styles.MainBanner__brmob} />
          the days <br className={styles.MainBanner__brdsk} />
          of&nbsp;spending a&nbsp;fortune on&nbsp;overpriced <br className={styles.MainBanner__brmob} />
          vinyl&nbsp;and&nbsp;ripping gear just <br className={styles.MainBanner__brdsk} />
          to stay in the loop. <br className={styles.MainBanner__brmob} />
          Now, hi-res digitization of musical heritage <br className={styles.MainBanner__brdsk} />
          becomes <br className={styles.MainBanner__brmob} />
          legal and&nbsp;accessible to&nbsp;everyone.
        </div>
        <LinkRoute
          type="button"
          href={RoutePathsConstants.MARKETPLACE}
          text="Download Now"
          className={classNames(styles.MainBanner__button)}
        />
        <VinilParallax scrollValue={scrollValue} />
      </div>
    </div>
  );
}

export default MainBanner;
