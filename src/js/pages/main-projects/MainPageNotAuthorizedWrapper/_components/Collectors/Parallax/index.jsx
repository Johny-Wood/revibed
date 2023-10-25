import { createRef, useEffect, useState } from 'react';

import Image from 'next/image';

import ScrollService from '@/js/services/scroll/ScrollService';
import classNames from 'classnames';
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


function CollectorsParallax({ scrollObject }) {
  let { scrollTop, contentScrollHeight } = scrollObject;

  const parallaxRef = createRef();
  const [topParallaxBlock, setTopParallaxBlock] = useState(0);

  useEffect(() => {
    setTopParallaxBlock(parallaxRef.current.getBoundingClientRect().top + ScrollService.getScrollPosition());
  }, [parallaxRef]);

  function getParallaxValue(value) {
    let topElement = topParallaxBlock;

    let ParallaxCoeff = (topElement - scrollTop) > 0 ? (topElement - window.innerHeight + 977 - scrollTop) : 0;
  
    let transformValue = value * ParallaxCoeff;


    const myStyle = {
      transform: `translateY(${transformValue}px)`,
    };

    return myStyle;
  }

  return (
    <div ref={parallaxRef} className={styles.Parallax}>
      <Image src={imageMain} width={483} height={239} className={styles.Parallax__mainImage} alt="vinill"></Image>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageXl)} style={getParallaxValue(-0.1)}>
        <Image src={imageLg1} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageLg)} style={getParallaxValue(-0.2)}>
        <Image src={imageLg2} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageMd)} style={getParallaxValue(-0.25)}>
        <Image src={imageMd1} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageMd2} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageMd3} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageSm)} style={getParallaxValue(-0.3)}>
        <Image src={imageSm2} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm3} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm4} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageXs)} style={getParallaxValue(-0.4)}>
        <Image src={imageSm1} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
    </div>
  );
}

export default CollectorsParallax;
