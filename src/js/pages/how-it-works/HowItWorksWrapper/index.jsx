import classNames from 'classnames';
import Image from 'next/image';

import HelpBlock from '@/components/common/HelpBlock';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { youTubeEnableJsapiLinkUtil } from '@/utils/linkUtils';

import videosData from './_data/videos';
import howItWorksImg from './_images/how_it_works.png';
import styles from './styles.module.scss';

const metaTitle = 'Music Digitization Crowdfunding';

const renderVideo = ({ id, title, src }) => (
  <div key={`video-instruction-${id}`} className={classNames([styles.howItWorks__videoInstruction__instructionItem])}>
    <div className={styles.howItWorks__videoInstruction__instructionItem__name}>{title}</div>
    <div className={styles.howItWorks__videoInstruction__instructionItem__video}>
      <iframe
        src={youTubeEnableJsapiLinkUtil(src)}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
);

function HowItWorksWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      shownBanners
    >
      <div className={styles.howItWorks}>
        <SiteWrapperLayout className="t-center f-y-center f-x-center f-grow-1" direction="column" withYPadding={false}>
          <section>
            <h1 className={styles.howItWorks__title}>How it works</h1>
            <p className={styles.howItWorks__description}>
              We&nbsp;offer audiophile quality digitization of&nbsp;wanted records through crowdfunding. Show&nbsp;us the record,
              and we&nbsp;will do&nbsp;the rest to&nbsp;help preserve the world&rsquo;s rich musical heritage.
            </p>
            <p className={classNames([styles.howItWorks__description, 'c-last-call t-medium m-top-10'])}>
              It&nbsp;is&nbsp;important to&nbsp;know and remember that the digital versions of&nbsp;the records belong to&nbsp;the
              pre-order contributors under the terms of&nbsp;their ownership of&nbsp;the physical media.
            </p>
          </section>
        </SiteWrapperLayout>
        <div className={styles.howItWorks__pictureItWorks}>
          <div className={styles.howItWorks__pictureItWorks__imageBox}>
            <Image
              src={howItWorksImg.src}
              blurDataURL={howItWorksImg.blurDataURL}
              placeholder="blur"
              fill
              alt="contributors"
              sizes="(max-width: 1024px) 100vw, 1229px"
              priority
            />
          </div>
        </div>
        <div className={styles.howItWorks__videoInstruction}>
          <SiteWrapperLayout className="t-center f-y-center f-x-center f-grow-1" direction="column" withYPadding={false}>
            <div className={styles.howItWorks__videoInstruction__box}>
              {videosData.map(({ id, title, src }) =>
                renderVideo({
                  id,
                  title,
                  src,
                })
              )}
            </div>
          </SiteWrapperLayout>
        </div>
        <HelpBlock />
      </div>
    </BaseWebsiteLayout>
  );
}

export default HowItWorksWrapper;
