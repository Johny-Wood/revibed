import { createRef, useEffect, useState } from 'react';

import Image from 'next/image';

import SiteWrapperLayout from '@/js/components/layouts/SiteWrapperLayout';
import Button from '@/js/components/ui/buttons/Button';
import ScrollService from '@/js/services/scroll/ScrollService';
import classNames from 'classnames';

import styles from './styles.module.scss';

import FanPoveredImage1 from '../../_images/FanPovered-1.png';
import FanPoveredImage2 from '../../_images/FanPovered-2.png';
import FanPoveredImage3 from '../../_images/FanPovered-3.png';
import FanPoveredImage4 from '../../_images/FanPovered-4.png';
import FanPoveredImage5 from '../../_images/FanPovered-5.png';
import FanPoveredImage6 from '../../_images/FanPovered-6.png';
import FanPoveredImage7 from '../../_images/FanPovered-7.png';
import MainImageUrl from '../../_images/FanPovered.png';

function FanPovered() {


  const [startAnimation, setStartAnimation] = useState(false);
  const animationRef = createRef();

  useEffect(() => {
    let condition = animationRef.current.getBoundingClientRect().top < (2 * animationRef.current.getBoundingClientRect().height);

    if (condition) {
      setStartAnimation(true);
    }

  }, [animationRef])

  return (
    <div className={styles.FanPovered}>
      <SiteWrapperLayout className={styles.FanPovered__wrapper} direction="column">
        <div ref={animationRef} className={styles.FanPovered__imageWrapper}>
          <Image
            className={classNames(styles.FanPovered__image, 
            startAnimation && styles.FanPovered__imageAnimate)}
            src={FanPoveredImage1}
            width={38}
            height={38}
            alt="Vinil"
            quality={100}
          ></Image>
          <Image
             className={classNames(styles.FanPovered__image, 
              startAnimation && styles.FanPovered__imageAnimate)}
            src={FanPoveredImage2}
            width={65}
            height={65}
            alt="Vinil"
            quality={100}
          ></Image>
          <Image
             className={classNames(styles.FanPovered__image, 
              startAnimation && styles.FanPovered__imageAnimate)}
            src={FanPoveredImage3}
            width={47}
            height={47}
            alt="Vinil"
            quality={100}
          ></Image>
          <Image
             className={classNames(styles.FanPovered__image, 
              startAnimation && styles.FanPovered__imageAnimate)}
            src={FanPoveredImage4}
            width={71}
            height={71}
            alt="Vinil"
            quality={100}
          ></Image>
          <Image
             className={classNames(styles.FanPovered__image, 
              startAnimation && styles.FanPovered__imageAnimate)}
            src={FanPoveredImage5}
            width={105}
            height={105}
            alt="Vinil"
            quality={100}
          ></Image>
          <Image
             className={classNames(styles.FanPovered__image, 
              startAnimation && styles.FanPovered__imageAnimate)}
            src={FanPoveredImage6}
            width={34}
            height={34}
            alt="Vinil"
            quality={100}
          ></Image>
          <Image
            className={classNames(styles.FanPovered__image, 
              startAnimation && styles.FanPovered__imageAnimate)}
            src={FanPoveredImage7}
            width={57}
            height={57}
            alt="Vinil"
            quality={100}
          ></Image>
          <Image
            className={classNames(styles.FanPovered__imageMain, 
              startAnimation && styles.FanPovered__imageMainAnimate)}
            src={MainImageUrl}
            alt="Revibed Site"
            quality={100}
          ></Image>
        </div>
        <h2 className={styles.FanPovered__title}>A fan-powered movement to&nbsp;save music!</h2>
        <div className={styles.FanPovered__desc}>
          All the records on Revibed have been unearthed <br/> thanks to&nbsp;a&nbsp;global community of music lovers, just&nbsp;like&nbsp;yourself. Every
          day, Revibers contribute their&nbsp;exciting and surprising musical discoveries that have yet to be reissued in digital
          format. <br/> Join&nbsp;the&nbsp;music revolution!
        </div>
        <div className={styles.FanPovered__footer}>
          <div className={styles.FanPovered__footerCol}>
            <div className={styles.FanPovered__footerText}>
              Kickstart your personal pre-order <br/>campaign&nbsp;and bring your desired <br/>music into the&nbsp;Revibed catalog!
            </div>
            <Button className={styles.FanPovered__button}>Start Pre-order</Button>
          </div>
          <span className={styles.FanPovered__footerSeparator}></span>
          <div className={styles.FanPovered__footerCol}>
            <div className={styles.FanPovered__footerText}>Join the vibe digger's world is into!</div>
            <Button className={styles.FanPovered__button}>Browse Pre-orders</Button>
          </div>
        </div>
      </SiteWrapperLayout>
    </div>
  );
}
export default FanPovered;
