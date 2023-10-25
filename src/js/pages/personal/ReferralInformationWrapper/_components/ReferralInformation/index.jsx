import { useMemo } from 'react';

import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ReferralInformation({
  referralInfo: { isActive, lastInProvidedCode: { code: referralCode } = {}, agentReward = 0, buyCoinsToComplete = 25 } = {},
  variablesList: { HOST } = {},
  showPopup,
}) {
  const agentRewardFixed = useMemo(() => floatWithCommaFixedUtil(agentReward), [agentReward]);
  const referralLink = useMemo(() => `${HOST}${RoutePathsConstants.REFERRAL}/${referralCode}`, [HOST, referralCode]);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <b>
        <h1 className={styles.referralInfo__title}>
          Invite friends and get{' '}
          <Coin size={18} offset={false} type="xl">
            {agentRewardFixed}
          </Coin>
        </h1>
      </b>
      <p className={styles.referralInfo__intro}>
        Invite your friends with your unique invitation link and get a&nbsp;bonus! You&nbsp;will&nbsp;receive{' '}
        <Coin offset={false} size={12}>
          {agentRewardFixed}
        </Coin>{' '}
        for each friend that tops up&nbsp;for{' '}
        <Coin offset={false} size={12}>
          {buyCoinsToComplete}
        </Coin>{' '}
        or&nbsp;more.
      </p>
      <p className={styles.referralInfo__intro}>
        Top ups can be&nbsp;done in&nbsp;one single transaction or&nbsp;spread over several smaller ones, your bonus will
        be&nbsp;credited as&nbsp;soon as&nbsp;your friend has reached a&nbsp;total of&nbsp;
        <Coin offset={false} afterText={String(buyCoinsToComplete)} /> in&nbsp;top ups.
      </p>
      <div className={styles.referralInfo__link}>
        <b className={styles.referralInfo__linkTitle}>Share your unique invite link:</b>
        <div className={styles.referralInfo__input}>
          <div className="input-block large border">
            <div className="input">
              <span className="text t-ellipsis">{referralLink}</span>
              <Button
                type="button_string"
                text="Copy"
                className={classNames(styles.buttonCopy, 'c-blue')}
                onClick={() => copy(referralLink)}
              />
            </div>
          </div>
          <Button
            text="Send invite"
            className={styles.buttonSendReferral}
            onClick={() => {
              showPopup(PopupPersonalIdsConstants.ShareInvitePopup, {
                href: referralLink,
                withCopyLink: true,
              });
            }}
          />
        </div>
      </div>
    </>
  );
}

export default connect(
  (state) => ({
    referralInfo: state.PromoReducer.promoActions.REFERRAL_PROGRAM,
    variablesList: state.VariablesReducer.variablesList,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(ReferralInformation);
