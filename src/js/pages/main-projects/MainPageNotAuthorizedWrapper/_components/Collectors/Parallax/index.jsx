import { createRef, useEffect, useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';

// import ScrollService from '@/js/services/scroll/ScrollService';

import styles from './styles.module.scss';

import imageMain from '../../../_images/Vinill-1.png';
import imageLg1 from '../../../_images/Vinill-lg-1.png';
import imageLg2 from '../../../_images/Vinill-lg-2.png';
import imageMd1 from '../../../_images/Vinill-md-1.png';
import imageMd2 from '../../../_images/Vinill-md-2.png';
import imageMd3 from '../../../_images/Vinill-md-3.png';
import imageSm1 from '../../../_images/Vinill-sm-1.png';
import imageSm2 from '../../../_images/Vinill-sm-2.png';
import imageSm3 from '../../../_images/Vinill-sm-3.png';
import imageSm4 from '../../../_images/Vinill-sm-4.png';
import Vinil from '@/js/components/common/Vinil';

function CollectorsParallax({ scrollValue }) {
  const parallaxRef = createRef();
  const [topParallaxBlock, setTopParallaxBlock] = useState(0);

  useEffect(() => {
    setTopParallaxBlock(parallaxRef.current.getBoundingClientRect().top + scrollValue);
  }, [parallaxRef, scrollValue]);

  function getParallaxValue(value) {
    const topElement = topParallaxBlock;
    const ParallaxCoeff = topElement - scrollValue > 0 ? topElement - window.innerHeight + 977 - scrollValue : 0;
    const transformValue = value * ParallaxCoeff;
    // const topValue = value * ParallaxCoeff;

    return {
       //top: `calc(55% + ${transformValue}px)`
      transform: `translateY(${transformValue}px)`,
    };
  }

  return (
    <div ref={parallaxRef} className={styles.Parallax}>
      <Image src={imageMain} width={483} height={239} className={styles.Parallax__mainImage} alt="vinill" />
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageXl)} style={getParallaxValue(-0.1)}>
        <Vinil
          src={imageLg1}
          className={styles.Parallax__imageItem}
        />
        {/* <Image src={imageLg1} className={styles.Parallax__imageItem} alt="vinill" /> */}
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageLg)} style={getParallaxValue(-0.2)}>
        <Vinil
          src={imageLg2}
          className={styles.Parallax__imageItem}
        />
        {/* <Image src={imageLg2} className={styles.Parallax__imageItem} alt="vinill" /> */}
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageMd)} style={getParallaxValue(-0.25)}>
        <Vinil
          src={imageMd1}
          className={styles.Parallax__imageItem}
        />
        <Vinil
          src={imageMd2}
          className={styles.Parallax__imageItem}
        />
        <Vinil
          src={imageMd3}
          className={styles.Parallax__imageItem}
        />
        {/* <Image src={imageMd1} className={styles.Parallax__imageItem} alt="vinill" /> */}
        {/* <Image src={imageMd2} className={styles.Parallax__imageItem} alt="vinill" /> */}
        {/* <Image src={imageMd3} className={styles.Parallax__imageItem} alt="vinill" /> */}
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageSm)} style={getParallaxValue(-0.3)}>
        <Vinil
          src={imageSm2}
          className={styles.Parallax__imageItem}
        />
        <Vinil
          src={imageSm3}
          className={styles.Parallax__imageItem}
        />
        <Vinil
          src={imageSm4}
          className={styles.Parallax__imageItem}
        />
        {/* <Image src={imageSm2} className={styles.Parallax__imageItem} alt="vinill" /> */}
        {/* <Image src={imageSm3} className={styles.Parallax__imageItem} alt="vinill" /> */}
        {/* <Image src={imageSm4} className={styles.Parallax__imageItem} alt="vinill" /> */}
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageXs)} style={getParallaxValue(-0.4)}>
        <Vinil
          src={imageSm1}
          className={styles.Parallax__imageItem}
        />
        {/* <Image src={imageSm1} className={styles.Parallax__imageItem} alt="vinill" /> */}
      </div>
    </div>
  );
}

export default CollectorsParallax;
