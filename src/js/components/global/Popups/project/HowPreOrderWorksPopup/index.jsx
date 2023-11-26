import { useMemo } from 'react';

import Image from 'next/image';
import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import imageModal1 from '@/pages/main-projects/MainPageNotAuthorizedWrapper/_images/card1_illustration.png';
import imageModal2 from '@/pages/main-projects/MainPageNotAuthorizedWrapper/_images/card2_illustration.png';
import imageModal3 from '@/pages/main-projects/MainPageNotAuthorizedWrapper/_images/card3_illustration.png';

import styles from './styles.module.scss';

function HowPreOrderWorksPopup({
  popupId = PopupProjectIdsConstants.HowPreOrderWorksPopup,
  closePopup,
  variablesList: {
    DEFAULT_PROJECT_EXPIRATION_HOURS,
    PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT,
    PROJECT_CONTRIBUTOR_CONTRIBUTION_PRICE,
  } = {},
}) {
  const modalCards = useMemo(
    () => [
      {
        id: '1',
        title: '1. Join In',
        subtitle: (
          <>
            Join or start pre-order <br /> (30&nbsp;fans needed for funding)
          </>
        ),
        url: imageModal1,
        imgClass: styles.HowPreOrderWorksPopup__img1,
        footer: <>Up to {Math.floor(DEFAULT_PROJECT_EXPIRATION_HOURS / 24)}&nbsp;days of funding time</>,
        bottom: (
          <>
            Get your digital files cheaper <br className={styles.HowPreOrderWorksPopup__brmoddsk} />
            and quicker than <br className={styles.HowPreOrderWorksPopup__brmodmob} />
            anyone else <br className={styles.HowPreOrderWorksPopup__brmoddsk} />
            <strong>(pay {PROJECT_CONTRIBUTOR_CONTRIBUTION_PRICE}&nbsp;eur instead of&nbsp;12.99)</strong>
          </>
        ),
      },
      {
        id: '2',
        title: "2. Wait, it's coming",
        subtitle: (
          <>
            Securing, purchase, delivery <br />
            &&nbsp;digitisation of the record
          </>
        ),
        url: imageModal2,
        imgClass: styles.HowPreOrderWorksPopup__img2,
        footer: (
          <>
            Average time from purchase <br className={styles.HowPreOrderWorksPopup__brmodmob} />
            to <br className={styles.HowPreOrderWorksPopup__brmoddsk} />
            digitisation — 14 days
          </>
        ),
        bottom: false,
      },
      {
        id: '3',
        title: '3. Get the music',
        subtitle: 'The digital copy is ready',
        url: imageModal3,
        imgClass: styles.HowPreOrderWorksPopup__img3,
        footer: (
          <>
            for the first 3&nbsp;months, <br /> files will be exclusively available <br />
            to fans who pre-ordered
          </>
        ),
        bottom: (
          <>
            Join {PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT}&nbsp;successful pre-orders and{' '}
            <br className={styles.HowPreOrderWorksPopup__brmoddsk} />
            <strong>
              get {PROJECT_CONTRIBUTOR_CONTRIBUTION_PRICE}&nbsp;EUR <br className={styles.HowPreOrderWorksPopup__brmodmob} />
              in cashback
            </strong>
            &nbsp;(that&apos;s 1&nbsp;release <br className={styles.HowPreOrderWorksPopup__brmoddsk} />
            you get completely <br className={styles.HowPreOrderWorksPopup__brmodmob} />
            for free!)
          </>
        ),
      },
    ],
    []
  );

  return (
    <Popup
      popupId={popupId}
      maxWidth={1082}
      textAlign="center"
      classCustom={styles.HowPreOrderWorksPopup}
      popupInClassName={styles.HowPreOrderWorksPopup__popupIn}
      popupContentClassName={styles.HowPreOrderWorksPopup__popupContent}
      popupHeaderClassName={styles.HowPreOrderWorksPopup__popupHeader}
    >
      <div className={styles.HowPreOrderWorksPopup__content}>
        <div className={styles.HowPreOrderWorksPopup__modalTitle}>
          Here&apos;s how <br className={styles.HowPreOrderWorksPopup__brmodtab} /> pre-order works!
        </div>
        <div className={styles.HowPreOrderWorksPopup__modalSubtitle}>
          Three simple steps to get exclusive music before <br className={styles.HowPreOrderWorksPopup__brmodmob} />
          the crowds do. <br className={styles.HowPreOrderWorksPopup__brmoddsk} />
          Anyone can start a pre-order.
        </div>
        <ul className={styles.HowPreOrderWorksPopup__modalCards}>
          {modalCards.map((modalCard) => (
            <li key={modalCard.id} className={styles.HowPreOrderWorksPopup__modalCard}>
              <div key={modalCard.id} className={styles.HowPreOrderWorksPopup__modalCardWrapper}>
                <div className={styles.HowPreOrderWorksPopup__modalCardCaption}>{modalCard.title}</div>
                <div className={styles.HowPreOrderWorksPopup__modalCardDesc}>{modalCard.subtitle}</div>
                <div className={styles.HowPreOrderWorksPopup__modalCardImage}>
                  <Image src={modalCard.url} alt={modalCard.title} className={modalCard.imgClass} style={{ height: 'auto' }} />
                </div>
                <div className={styles.HowPreOrderWorksPopup__modalCardFooter}>{modalCard.footer}</div>
              </div>
              {modalCard.bottom !== false && (
                <div className={styles.HowPreOrderWorksPopup__modalBottom}> {modalCard.bottom} </div>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.HowPreOrderWorksPopup__modalFooter}>
          If a&nbsp;pre-order does not receive enough fan support <br className={styles.HowPreOrderWorksPopup__brmodmob} />
          during the funding stage,
          <br className={styles.HowPreOrderWorksPopup__brmoddsk} />
          it&nbsp;will be cancelled.&nbsp;
          <br className={styles.HowPreOrderWorksPopup__brmodmob} />
          <strong>All participants will receive a&nbsp;full refund</strong>
        </div>
        <button className={styles.HowPreOrderWorksPopup__modalBtn} onClick={() => closePopup(popupId)} type="button">
          Close
        </button>
      </div>
    </Popup>
  );
}

const connector = connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}));

export default connector(HowPreOrderWorksPopup);
