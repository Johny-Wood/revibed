import { useCallback, useEffect } from 'react';

import classNames from 'classnames';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';

import IYKYKAvatar from '@/assets/images/promo/invite/IYKYK-avatar.png';
import Input from '@/components/ui/inputs/Input';
import NickName from '@/components/user/NickName';
import UserAvatar from '@/components/user/UserAvatar';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { getPromoCodeInfoRequestAction } from '@/redux-actions/promo/promoActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { ValidateMinLengthUtil } from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

function ReferralProgram({
  haveReferralCode,
  referralCode,
  referralCodeError,
  referralCodeErrorMsg,
  referralUser = {},
  referralUser: {
    promoAction: referralPromoAction,
    provider: { name: referralUserName, avatar: referralUserAvatar } = {},
    description: referralDescription,
    code: currentReferralCode = '',
  } = {},
  changeReferralUser,
  handlers: { badRequest, setInputError, changeInputHandler, validateField, onKeyDown } = {},

  getPromoCodeInfoInProcess,
  getPromoCodeInfoRequest,
}) {
  const getPromoCodeInfo = useCallback(() => {
    const code = referralCode.toUpperCase();
    const currentCode = currentReferralCode.toUpperCase();

    if (code && code !== currentCode && !referralCodeError) {
      getPromoCodeInfoRequest({ code })
        .then(({ promoCodeInfo }) => {
          changeReferralUser(promoCodeInfo);
        })
        .catch(({ error, payload: { errorField } = {} }) => {
          if (error) {
            handleErrorUtil(error, {
              BAD_REQUEST: () => {
                badRequest(errorField);
              },
              PROMO_CODE_NOT_FOUND: () => {
                setInputError('referralCode', CommonErrorMessages.REFERRAL_CODE_NOT_FOUND);
              },
              PROMO_ACTION_NOT_ACTIVE: () => {
                setInputError('referralCode', CommonErrorMessages.PROMO_ACTION_NOT_ACTIVE);
              },
            });
          }
        });
    }
  }, [
    badRequest,
    changeReferralUser,
    currentReferralCode,
    getPromoCodeInfoRequest,
    referralCode,
    referralCodeError,
    setInputError,
  ]);

  const getAvatar = useCallback(({ promoAction, avatar }) => {
    if (promoAction === 'FIRST_PARTNER_IYKYK') {
      return {
        localSrc: IYKYKAvatar,
        withBorder: true,
      };
    }

    return {
      src: avatar,
    };
  }, []);

  useEffect(() => {
    getPromoCodeInfo();
  }, [getPromoCodeInfo]);

  return (
    <div className={styles.authReferral}>
      <Collapse isOpened={haveReferralCode} initialStyle={{ height: 'auto', overflow: 'hidden' }}>
        <div className={classNames([styles.authReferral__content, 'w-100pct'])}>
          <Input
            id="referralCode"
            classNameTag="t-uppercase"
            label="Invitation code"
            value={referralCode}
            invalid={referralCodeError}
            invalidMessage={referralCodeErrorMsg}
            disabled={getPromoCodeInfoInProcess}
            maxLength={CommonErrorMessages.REFERRAL_CODE_MIN_LENGTH}
            onChange={(e) => {
              changeInputHandler(e);
              changeReferralUser();
            }}
            onBlur={(e) => {
              validateField(e, {
                fieldIsValid: (value) => ValidateMinLengthUtil(value, CommonErrorMessages.REFERRAL_CODE_MIN_LENGTH),
                invalidMessage: CommonErrorMessages.REFERRAL_CODE_MIN_LENGTH_ERROR,
                validateEmptyField: false,
                callback: () =>
                  getPromoCodeInfo({
                    referralUser,
                    referralCode,
                    referralCodeError,
                    changeReferralUser,
                    getPromoCodeInfoRequest,
                    badRequest,
                    setInputError,
                  }),
              });
            }}
            onKeyDown={onKeyDown}
          />
          {!!referralUserName && (
            <div className={styles.authReferral__info}>
              {!!referralUserName && (
                <div className={styles.authReferral__user}>
                  <UserAvatar
                    size={35}
                    className="m-right-7"
                    {...getAvatar({ promoAction: referralPromoAction, avatar: referralUserAvatar })}
                  />
                  <NickName
                    name={referralUserName}
                    classNameNickName={styles.authReferral__user__nickname__name}
                    withFlag={false}
                  />
                  &nbsp;invites you
                </div>
              )}
              {!!referralDescription && (
                <div className={classNames([styles.authReferral__description, 'text_size_12 c-gray-1'])}>
                  {referralDescription}
                </div>
              )}
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}

export default connect(
  (state) => ({
    getPromoCodeInfoInProcess: state.PromoReducer.getPromoCodeInfoInProcess,
  }),
  (dispatch) => ({
    getPromoCodeInfoRequest: ({ code }) => getPromoCodeInfoRequestAction({ scope: 'SIGN_UP', code, dispatch }),
  })
)(ReferralProgram);
