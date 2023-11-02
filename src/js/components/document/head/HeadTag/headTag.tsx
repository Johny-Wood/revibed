import Head from 'next/head';

import { CommonHeadConstants } from '@/constants/common/head';

const promoImg = 'https://kollektivx-resources.s3.amazonaws.com/images/promo-revibed.jpg';

export type HeadTagProps = {
  headSettings: {
    title?: string;
    description?: string;
    withSiteName?: boolean;
    social?: {
      title?: string;
      url?: string;
      image?: string;
      description?: string;
    };
  };
};

function HeadTag({
  headSettings: {
    title: headTitle,
    description: headDescription = CommonHeadConstants.DESCRIPTION,
    withSiteName = true,
    social: {
      title: socialTitle,
      url: socialUrl,
      image: socialImage = promoImg,
      description: socialDescription = headDescription,
    } = {},
  },
}: HeadTagProps) {
  const headTitleStr = `${headTitle}${withSiteName ? ` - ${CommonHeadConstants.SITE_NAME}` : ''}`;

  return (
    <Head>
      <title>{headTitleStr}</title>
      <meta name="title" content={headTitleStr} />
      {!!headDescription && <meta name="description" content={headDescription} />}
      {(!!socialUrl || !!headTitleStr) && (
        <>
          <meta property="og:url" content={socialUrl || headTitleStr} />
          <meta property="twitter:url" content={socialUrl || headTitleStr} />
        </>
      )}
      {(!!socialTitle || !!headTitleStr) && (
        <>
          <meta property="og:title" content={socialTitle || headTitleStr} />
          <meta property="twitter:title" content={socialTitle || headTitleStr} />
        </>
      )}
      {!!socialDescription && (
        <>
          <meta property="og:description" content={socialDescription} />
          <meta property="twitter:description" content={socialDescription} />
        </>
      )}
      {!!socialImage && (
        <>
          <meta property="og:image" content={socialImage} />
          <meta property="twitter:image" content={socialImage} />
        </>
      )}
    </Head>
  );
}

export default HeadTag;
