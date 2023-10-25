import GoldenCoinBanner from '@/components/golden-coin/GoldenCoinBanner';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import GoldenCoinIconBigShadow from '@/icons/GoldenCoinIconBigShadow';

import styles from './styles.module.scss';

import SuccessPopup from '../../common/SuccessPopup';

function GoldenCoinPopup({ popupId = PopupPersonalIdsConstants.GoldenCoinPopup }) {
  return (
    <SuccessPopup popupId={popupId} popupTitle="Join a&nbsp;project for FREE" maxWidth={425} className={styles.GoldenCoinPopup}>
      <div className="golden-icon-bg">
        <GoldenCoinIconBigShadow />
      </div>
      <div className="m-bottom-10 text_size_16">
        with your <b className="c-golden-coin">Golden&nbsp;Koin</b>
      </div>
      Start digging now before it&nbsp;expires!
      <GoldenCoinBanner type="popup" withText={false} />
    </SuccessPopup>
  );
}

export default GoldenCoinPopup;
