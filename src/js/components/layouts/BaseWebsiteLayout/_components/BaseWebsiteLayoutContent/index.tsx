import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

import classNames from 'classnames';
import dynamic from 'next/dynamic';

import Banners from '@/components/global/Banners';
import type { FooterExternalProps } from '@/components/global/Footer';
import Footer from '@/components/global/Footer';
import styles from '@/components/layouts/BaseWebsiteLayout/_components/BaseWebsiteLayoutScrollBar/styles.module.scss';
import Preloader from '@/components/ui/Preloader';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

const Messages = dynamic(() => import('@/components/global/Messages'), { ssr: false });

type BaseWebsiteLayoutContentProps = FooterExternalProps &
  PropsWithChildren & {
    withoutFooter?: boolean;
    pageHeight?: string | number;
    withoutFullFooter?: boolean;
    preloadInProcess?: boolean;
    shownBanners?: boolean;
    pageName?: string;
    withoutCustomScrollbar?: boolean;
  };

export default function BaseWebsiteLayoutContent({
  pageName,
  footerProps,
  withoutFooter,
  withoutFullFooter,
  preloadInProcess,
  shownBanners,
  pageHeight,
  withoutCustomScrollbar,

  children,
}: BaseWebsiteLayoutContentProps) {
  const { isNotDesktop } = ViewportHook();

  const footerHeight = useMemo(() => {
    if (withoutFooter) {
      return 0;
    }

    return covertPx2RemUtil(70 + (!withoutFullFooter ? (isNotDesktop ? 145 : 183) : 0));
  }, [withoutFullFooter, withoutFooter, isNotDesktop]);

  return (
    <>
      <div className={classNames(styles.page, withoutCustomScrollbar && styles.page_native, pageName)}>
        <Banners isShown={shownBanners} />
        <Messages />
        {children}
      </div>
      <Preloader
        id={`page-${pageName}`}
        isShown={preloadInProcess}
        opacity={1}
        fullScreen
        pageHeight={`calc(${pageHeight} - ${footerHeight})`}
      />
      {!withoutFooter && <Footer footerProps={footerProps} />}
    </>
  );
}
