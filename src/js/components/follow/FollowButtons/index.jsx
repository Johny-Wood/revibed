import { useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import { changeFollowUserRatingAction } from '@/redux-actions/common/ratingActions';
import {
  changeFollowInFollowersAction,
  changeFollowInFollowingAction,
  personalSubscriptionRequestAction,
  personalUnsubscriptionRequestAction,
} from '@/redux-actions/personal/friendsActions';
import { changeFollowUserProjectCardAction } from '@/redux-actions/project/projectCardActions';
import { changeFollowInUserFollowAction, changeFollowUsersAction } from '@/redux-actions/users/usersActions';

import styles from './styles.module.scss';

function FollowButtons({
  className,
  id,
  subscription,
  subscriber,
  isMe,
  userInfo: { id: userId },
  personalUnsubscriptionInProcess,
  personalSubscriptionInProcess,
  personalUnsubscriptionRequest,
  personalSubscriptionRequest,
  changeFollowInUserFollow,
  changeFollowInFollowing,
  changeFollowInFollowers,
  changeFollowUserProjectCard,
  changeFollowUserRating,
  changeFollowUsers,
  size = ComponentsCommonConstants.Size.SMALL25,
  variablesList: { FRIENDS_DISABLE } = {},
  userIsAuthorized,
}) {
  const subscriptionInProcess = useMemo(
    () => personalUnsubscriptionInProcess.includes(+id),
    [personalUnsubscriptionInProcess, id]
  );
  const unSubscriptionInProcess = useMemo(() => personalSubscriptionInProcess.includes(+id), [personalSubscriptionInProcess, id]);

  if (+userId === +id || isMe || FRIENDS_DISABLE || !userIsAuthorized) {
    return null;
  }

  if (subscription) {
    return (
      <Button
        size={size}
        text="Following"
        className={classNames(styles.followButton, styles.followButton_following, className)}
        borderColor="gray-3"
        disabled={subscriptionInProcess}
        isInProcess={subscriptionInProcess}
        onClick={() => {
          if (subscriptionInProcess) {
            return;
          }

          personalUnsubscriptionRequest(+id).then(() => {
            changeFollowInUserFollow({ userId: +id, isFollowing: false });
            changeFollowInFollowing({ userId: +id, isFollowing: false });
            changeFollowInFollowers({ userId: +id, isFollowing: false });
            changeFollowUserProjectCard({ userId: +id, isFollowing: false });
            changeFollowUserRating({ userId: +id, isFollowing: false });
            changeFollowUsers({ userId: +id, isFollowing: false });
          });
        }}
      />
    );
  }

  return (
    <Button
      size={size}
      borderColor="gray-3"
      transparent
      text={subscriber ? 'Follow back' : 'Follow'}
      className={classNames(styles.followButton, className)}
      disabled={unSubscriptionInProcess}
      isInProcess={unSubscriptionInProcess}
      onClick={() => {
        if (unSubscriptionInProcess) {
          return;
        }

        personalSubscriptionRequest(+id).then(() => {
          changeFollowInUserFollow({ userId: +id, isFollowing: true });
          changeFollowInFollowing({ userId: +id, isFollowing: true });
          changeFollowInFollowers({ userId: +id, isFollowing: true });
          changeFollowUserProjectCard({ userId: +id, isFollowing: true });
          changeFollowUserRating({ userId: +id, isFollowing: true });
          changeFollowUsers({ userId: +id, isFollowing: true });
        });
      }}
    />
  );
}

export default connect(
  (state) => ({
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    variablesList: state.VariablesReducer.variablesList,
    userInfo: state.AuthReducer.userInfo,
    personalSubscriptionInProcess: state.FriendsReducer.personalSubscriptionInProcess,
    personalUnsubscriptionInProcess: state.FriendsReducer.personalUnsubscriptionInProcess,
  }),
  (dispatch) => ({
    personalSubscriptionRequest: (userId) => personalSubscriptionRequestAction(userId)(dispatch),
    personalUnsubscriptionRequest: (userId) => personalUnsubscriptionRequestAction(userId)(dispatch),
    changeFollowUserRating: (params) => {
      dispatch(changeFollowUserRatingAction(params));
    },
    changeFollowUsers: (params) => {
      dispatch(changeFollowUsersAction(params));
    },
    changeFollowUserProjectCard: (params) => {
      dispatch(changeFollowUserProjectCardAction(params));
    },
    changeFollowInFollowers: (params) => {
      dispatch(changeFollowInFollowersAction(params));
    },
    changeFollowInFollowing: (params) => {
      dispatch(changeFollowInFollowingAction(params));
    },
    changeFollowInUserFollow: (params) => {
      dispatch(changeFollowInUserFollowAction(params));
    },
  })
)(FollowButtons);
