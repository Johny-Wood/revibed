import classNames from 'classnames';
import Image from 'next/image';

import styles from './styles.module.scss';

function AboutUsImageSection({
  className = '',
  priority,
  primaryImg,
  primaryImgParams: { width: pWidth, height: pHeight, className: pClassName } = {},
  secondaryImg,
  secondaryImgParams: { width: sWidth, height: sHeight, className: sClassName } = {},
  secondaryImg2,
  secondaryImg2Params: { width: s2Width, height: s2Height, className: s2ClassName } = {},
}) {
  return (
    <div className={classNames([styles.aboutUsImageSection, className])}>
      <Image
        priority={priority}
        className={pClassName}
        src={primaryImg.src}
        blurDataURL={primaryImg.blurDataURL}
        placeholder="blur"
        width={pWidth}
        height={pHeight}
        alt="best place"
        quality={100}
      />
      {!!secondaryImg && (
        <Image
          priority={priority}
          className={sClassName}
          src={secondaryImg.src}
          blurDataURL={secondaryImg.blurDataURL}
          placeholder="blur"
          width={sWidth}
          height={sHeight}
          alt="best place"
          quality={100}
        />
      )}
      {!!secondaryImg2 && (
        <Image
          priority={priority}
          className={s2ClassName}
          src={secondaryImg2.src}
          blurDataURL={secondaryImg2.blurDataURL}
          placeholder="blur"
          width={s2Width}
          height={s2Height}
          alt="best place"
          quality={100}
        />
      )}
    </div>
  );
}

export default AboutUsImageSection;
