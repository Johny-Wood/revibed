import { useMemo } from 'react';

import classNames from 'classnames';
import Image from 'next/image';

import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

function PageDecorations({
  className,
  classNameImage,
  classNameImageBg,
  classNameBg,
  withRepeatBg,
  pageBackgroundDesktop,
  pageBackgroundTablet,
  pageBackgroundMobile,
  quality = 100,
  placeholder,
}) {
  const { isTablet, isDesktop } = ViewportHook();

  const src = useMemo(
    () => (isTablet && !isDesktop ? pageBackgroundTablet : isDesktop ? pageBackgroundDesktop : pageBackgroundMobile),
    [isDesktop, isTablet, pageBackgroundDesktop, pageBackgroundMobile, pageBackgroundTablet]
  );

  const sizes = useMemo(
    () => (isTablet && !isDesktop ? `${(102 * 882) / 582}vh` : isDesktop ? `${(102 * 1470) / 877}vh` : `${(102 * 587) / 582}vh`),
    [isDesktop, isTablet]
  );

  const imageClass = useMemo(() => classNames(styles.pageBg__image, classNameImageBg), [classNameImageBg]);

  const imageProps = useMemo(
    () => ({
      quality,
      src: src.src,
      sizes,
      blurDataURL: placeholder === 'blur' ? src.blurDataURL : undefined,
      placeholder,
      alt: 'bg',
      fill: true,
      priority: true,
    }),
    [quality, src, sizes, placeholder]
  );

  return (
    <div className={classNames(styles.pageDecorations, className)}>
      <div className={classNames(styles.pageDecorations__image, classNameImage)}>
        <div className={classNames(styles.pageBg, classNameBg)}>
          <div className={imageClass}>
            <Image {...imageProps} alt="bg" />
          </div>
          {withRepeatBg && (
            <>
              <div className={imageClass}>
                <Image {...imageProps} alt="bg" />
              </div>
              <div className={imageClass}>
                <Image {...imageProps} alt="bg" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageDecorations;
