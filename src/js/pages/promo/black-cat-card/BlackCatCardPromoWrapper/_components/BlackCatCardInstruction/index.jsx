import TextContentLayout from '@/components/layouts/TextContentLayout';
import { CommonHeadConstants } from '@/constants/common/head';
import EEAIcon from '@/icons/EEAIcon';

import styles from './styles.module.scss';

function BlackCatCardInstruction({ children }) {
  return (
    <div className={styles.blackCatCardInstruction}>
      <TextContentLayout>
        <div className={styles.blackCatCardInstruction__blackCardEEA}>
          <EEAIcon />
        </div>
        <div className={styles.blackCatCardInstruction__list}>
          <h2>Here&apos;s what you need to do:</h2>
          <ol>
            <li>
              Complete registration on&nbsp;the Blackcatcard website, and don&rsquo;t forget to&nbsp;use the{' '}
              {CommonHeadConstants.SITE_NAME} promo code
            </li>
            <li>Within 24&nbsp;hours of&nbsp;registering, you will receive an&nbsp;email with a&nbsp;Blackcatcard promo code.</li>
            <li>
              Redeem the promo code on&nbsp;your {CommonHeadConstants.SITE_NAME} dashboard page here and instantly get
              20&nbsp;Koins that can go&nbsp;towards any purchase made on&nbsp;the
              {CommonHeadConstants.SITE_NAME}
              &nbsp;platform.
              <div className="t-bold">
                <i>1&nbsp;Koin = 1&nbsp;EUR</i>
              </div>
            </li>
          </ol>
        </div>
        {children}
      </TextContentLayout>
    </div>
  );
}

export default BlackCatCardInstruction;
