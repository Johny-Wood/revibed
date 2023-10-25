import classNames from 'classnames';
import Image from 'next/image';

import styles from './styles.module.scss';

import imageLg1 from '../../../_images/Main-lg-1.png';
import imageLg2 from '../../../_images/Main-lg-2.png';
import imageMd1 from '../../../_images/Main-md-1.png';
import imageMd2 from '../../../_images/Main-md-2.png';
import imageMd3 from '../../../_images/Main-md-3.png';
import imageMd4 from '../../../_images/Main-md-4.png';
import imageSm1 from '../../../_images/Main-sm-1.png';
import imageSm2 from '../../../_images/Main-sm-2.png';
import imageSm3 from '../../../_images/Main-sm-3.png';
import imageSm4 from '../../../_images/Main-sm-4.png';
import imageSm5 from '../../../_images/Main-sm-5.png';
import imageSm6 from '../../../_images/Main-sm-6.png';
import imageSm7 from '../../../_images/Main-sm-7.png';
import imageSm8 from '../../../_images/Main-sm-8.png';

function VinilParallax({ scrollValue }) {
  function getParallaxValue(value) {
    let transformValue = value * scrollValue;

    const myStyle = {
      transform: `translateY(${transformValue}px)`,
    };

    return myStyle;
  }

  return (
    <div className={styles.Parallax}>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageLg)} style={getParallaxValue(0.2)}>
        <Image src={imageLg1} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageLg2} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageMd)} style={getParallaxValue(0.5)}>
        <Image src={imageMd1} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageMd2} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageMd3} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageMd4} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
      <div className={classNames(styles.Parallax__image, styles.Parallax__imageSm)} style={getParallaxValue(0.6)}>
        <Image src={imageSm1} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm2} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm3} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm4} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm5} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm6} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm7} className={styles.Parallax__imageItem} alt="vinill"></Image>
        <Image src={imageSm8} className={styles.Parallax__imageItem} alt="vinill"></Image>
      </div>
    </div>
  );
}

export default VinilParallax;
