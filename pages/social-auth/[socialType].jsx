import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import { RoutePathsConstants } from '@/constants/routes/routes';
import SocialAuthConstants from '@/constants/social/auth';
import SocialAuthCallbackWrapper from '@/pages/social/SocialAuthCallbackWrapper';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { socialConnectRequestAction } from '@/redux-actions/socialConnectActions';

const extractCode = ({ socialType, query }) => {
  if (socialType === SocialAuthConstants.DISCOGS) {
    const { oauth_verifier: oauthVerifier } = query;
    return oauthVerifier;
  }

  return null;
};

const extractStartImport = ({ socialType, query }) => {
  if (socialType === SocialAuthConstants.DISCOGS) {
    const { start_import_wantlist: startImportWanlist } = query;
    return startImportWanlist;
  }

  return null;
};

const SocialAuthCallbackPage = ({ showMessage, socialConnectRequest }) => {
  const router = useRouter();
  const { query, query: { socialType } = {} } = router || {};

  useEffect(() => {
    const code = extractCode({
      socialType,
      query,
    });
    const startImportWantlist = extractStartImport({
      socialType,
      query,
    });

    if (!code) {
      router.push(RoutePathsConstants.MAIN).then();
      return;
    }

    socialConnectRequest({
      socialType,
      code,
    })
      .then(() => {
        if (startImportWantlist) {
          router
            .push({
              pathname: RoutePathsConstants.WANTLIST_ADD,
              query: { importByDiscogs: true },
            })
            .then();
        } else {
          router.push(RoutePathsConstants.PERSONAL_WANTLIST_SETTINGS).then();
        }

        showMessage(
          'SuccessMessage',
          {
            messageText: 'Discogs connected',
          },
          false
        );
      })
      .catch(() => {
        router.push(RoutePathsConstants.MAIN).then();
      });
  }, [query, router, showMessage, socialConnectRequest, socialType]);

  return <SocialAuthCallbackWrapper />;
};

export default connect(
  () => ({}),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    socialConnectRequest: ({ socialType, code }) =>
      socialConnectRequestAction({
        socialType,
        code,
      })(dispatch),
  })
)(SocialAuthCallbackPage);
