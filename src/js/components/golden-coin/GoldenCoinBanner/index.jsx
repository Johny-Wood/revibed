import classNames from 'classnames';
import { connect } from 'react-redux';

import DateFormatDDMMYYYY from '@/components/common/date/DateFormatDDMMYYYY';
import GoldenCoin from '@/components/ui/currency/GoldenCoin';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

function GoldenCoinBanner({
  type = 'inline',
  className,
  withText = true,
  personalActiveGoldenCoinPoints,
  userInfo: { goldenCoinsCount = 0 } = {},
}) {
  if (!personalActiveGoldenCoinPoints || personalActiveGoldenCoinPoints.length === 0 || goldenCoinsCount === 0) {
    return null;
  }

  return (
    <div
      className={classNames([
        styles.goldenCoinUseBanner,
        type === 'popup' && styles.goldenCoinUseBanner_popup,
        type === 'inline' && styles.goldenCoinUseBanner_inline,
        className,
      ])}
    >
      <div className={styles.goldenCoinUseBanner__content}>
        {withText && <GoldenCoin shadow />}
        <div className={styles.goldenCoinUseBanner__info}>
          {withText && (
            <div className={styles.goldenCoinUseBanner__text}>
              <div className={styles.goldenCoinUseBanner__title}>
                <b className="c-golden-coin">
                  You
                  {type === 'popup' ? 'received' : 'have'} a Golden&nbsp;Koin
                </b>
              </div>
              Use it&nbsp;to&nbsp;
              <b>
                join your first project&nbsp;
                <br />
                for free
              </b>
              , no&nbsp;matter it&rsquo;s value.&nbsp;
              <br />
              <LinkRoute
                className={classNames(styles.goldenCoinUseBanner__details, 'underline')}
                href={RoutePathsConstants.GOLDEN_COIN_DETAILS}
                text="View details"
              />
            </div>
          )}
          {personalActiveGoldenCoinPoints[0]?.useUntil > 0 && (
            <div className={styles.goldenCoinUseBanner__date}>
              <b>Use before:</b>
              <div>
                <DateFormatDDMMYYYY date={personalActiveGoldenCoinPoints[0]?.useUntil} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
  personalActiveGoldenCoinPoints: state.PersonalActiveGoldenCoinReducer.personalActivePoints,
}))(GoldenCoinBanner);
