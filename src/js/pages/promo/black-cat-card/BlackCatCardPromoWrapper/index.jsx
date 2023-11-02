import classNames from 'classnames';
import Image from 'next/image';
import { connect } from 'react-redux';

import blackCatCardImg from '@/assets/images/promo/black-cat-card/black-cat-card__card.png';
import globalStyles from '@/assets/styles/global-classes.module.scss';
import BlackCatCardCodeForm from '@/components/forms/promo/blackCatCard/CodeForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import LinkDefault from '@/components/ui/links/LinkDefault';
import KoinGoldIcon from '@/icons/KoinGoldIcon';
import BlackCatCardDisclaimer from '@/pages/promo/black-cat-card/BlackCatCardPromoWrapper/_components/BlackCatCardDisclaimer';
import BlackCatCardInstruction from '@/pages/promo/black-cat-card/BlackCatCardPromoWrapper/_components/BlackCatCardInstruction';
import BlackCatCardLinkButtons from '@/pages/promo/black-cat-card/BlackCatCardPromoWrapper/_components/BlackCatCardLinkButtons';

import styles from './styles.module.scss';

const renderLinks = ({ lastInCode }) => {
  if (!lastInCode) {
    return <BlackCatCardLinkButtons />;
  }

  return null;
};

function BlackCatCardPromoWrapper({ promoInfo: { lastInCode } = {} }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Black Cat Card Promo',
      }}
      pageName={styles.pageBlackCatCard}
    >
      <SiteWrapperLayout>
        <div className={classNames([styles.promoBlackCatCard, globalStyles.breakWord])}>
          <div className={styles.promoBlackCatCard__info}>
            <h1>
              Get a&nbsp;Blackcatcard now
              <br />
              and&thinsp;
              <span className="c-gold">get 20&nbsp;Koins</span>
              &thinsp;to&nbsp;spend on&nbsp;your first pre-orders!
            </h1>
            <BlackCatCardCodeForm />
            {!lastInCode && (
              <BlackCatCardInstruction>
                <MobileLayout>{renderLinks({ lastInCode })}</MobileLayout>
                <BlackCatCardDisclaimer />
              </BlackCatCardInstruction>
            )}
          </div>
          <div className={styles.promoBlackCatCard__links}>
            <div className={styles.promoBlackCatCard__image}>
              <LinkDefault
                href="https://get.blackcatcard.com/?utm_source=collective_x&utm_medium=refferal&utm_campaign=collective_prt&utm_term=lp"
                className={styles.promoBlackCatCard__image__link}
              >
                <Image
                  src={blackCatCardImg.src}
                  blurDataURL={blackCatCardImg.blurDataURL}
                  placeholder="blur"
                  fill
                  sizes="(max-width: 1024px) 75%, 495px"
                  alt="pre-order"
                  quality={90}
                />
              </LinkDefault>
              <KoinGoldIcon />
            </div>
            <DesktopLayout>{renderLinks({ lastInCode })}</DesktopLayout>
          </div>
        </div>
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  promoInfo: state.PromoReducer.promoActions.BLACK_CAT_CARD,
}))(BlackCatCardPromoWrapper);
