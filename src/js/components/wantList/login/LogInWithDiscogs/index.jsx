import classNames from 'classnames';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import NickName from '@/components/user/NickName';
import ComponentsCommonConstants from '@/constants/components/common';
import SocialAuthConstants from '@/constants/social/auth';
import DiscogsLogoIcon from '@/icons/DiscogsLogoIcon';
import LogoutIcon from '@/icons/LogoutIcon';
import {
  socialConnectGenerateRedirectUriRequestAction,
  socialDisconnectRequestAction,
} from '@/redux-actions/socialConnectActions';

import styles from './styles.module.scss';

function LogInWithDiscogs({
  navigateToSignInOrExecute = ({ executableFunction = () => {} }) => {
    executableFunction();
  },

  userInfo: { socials: { DISCOGS, DISCOGS: { socialUsername: discogsUserName } = {} } = {} },

  forConnected: { componentRender: componentForConnected, logoutButtonSize = ComponentsCommonConstants.Size.SMALL35 } = {},

  discogsSocialConnectGenerateRedirectUrlInProcess,
  discogsSocialDisconnectInProcess,
  importWantListInProcess,

  socialConnectGenerateRedirectUriRequest,
  socialDisconnectRequest,

  className,
  loginClassName,
  buttonLoginDiscogsClassName,
  buttonLogoutDiscogsClassName,
  discogsLoginButtonsClassName,

  payloadQuery,
}) {
  const discogsLogIn = () => {
    socialConnectGenerateRedirectUriRequest({ payloadQuery })
      .then(({ redirectUrl }) => {
        window.location.replace(redirectUrl);
      })
      .catch(() => {});
  };

  return (
    <div className={classNames(styles.discogsLoginBlock, className)}>
      {DISCOGS ? (
        <>
          <div className={classNames(styles.discogsLogin, loginClassName)}>
            <span className="c-gray-2">Discogs login as&nbsp;</span>
            <NickName className={styles.nickname} withFlag={false} name={discogsUserName} />
          </div>
          <div className={classNames(styles.discogsLogin__buttons, discogsLoginButtonsClassName)}>
            {componentForConnected}
            <ButtonIcon
              transparent
              className={classNames(styles.buttonLogoutDiscogs, buttonLogoutDiscogsClassName)}
              borderColor="gray-4"
              text="Log Out"
              size={logoutButtonSize}
              icon={LogoutIcon}
              isInProcess={discogsSocialDisconnectInProcess}
              disabled={discogsSocialDisconnectInProcess || importWantListInProcess}
              onClick={() => {
                if (discogsSocialDisconnectInProcess || importWantListInProcess) {
                  return;
                }

                socialDisconnectRequest();
              }}
            />
          </div>
        </>
      ) : (
        <ButtonIcon
          className={classNames(buttonLoginDiscogsClassName)}
          iconPosition={ComponentsCommonConstants.Position.RIGHT}
          text="Login with"
          disabled={discogsSocialConnectGenerateRedirectUrlInProcess}
          isInProcess={discogsSocialConnectGenerateRedirectUrlInProcess}
          onClick={() => {
            navigateToSignInOrExecute({
              executableFunction: () => {
                discogsLogIn();
              },
            });
          }}
        >
          <DiscogsLogoIcon />
        </ButtonIcon>
      )}
    </div>
  );
}

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,

    discogsSocialConnectGenerateRedirectUrlInProcess: state.SocialConnectReducer.discogsSocialConnectGenerateRedirectUrlInProcess,
    discogsSocialDisconnectInProcess: state.SocialConnectReducer.discogsSocialDisconnectInProcess,
  }),
  (dispatch) => ({
    socialConnectGenerateRedirectUriRequest: ({ payloadQuery }) =>
      socialConnectGenerateRedirectUriRequestAction({
        socialType: SocialAuthConstants.DISCOGS,
        payloadQuery,
      })(dispatch),
    socialDisconnectRequest: () =>
      socialDisconnectRequestAction({
        socialType: SocialAuthConstants.DISCOGS,
      })(dispatch),
  })
)(LogInWithDiscogs);
