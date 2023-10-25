import { connect } from 'react-redux';

import ProfileBarUser from '@/components/personal/profile/_components/ProfileBarUser';
import UserProfileBarFavoriteStyles from '@/components/personal/profile/UserProfileBar/_components/UserProfileBarFavoriteStyles';
import UserFollowButtons from '@/components/personal/profile/UserProfileBar/_components/UserProfileBarUser/_components/UserFollowButtons';

function UserProfileBarUser({ userId, userInfo }) {
  return (
    <ProfileBarUser userInfo={userInfo[userId] || {}}>
      <UserProfileBarFavoriteStyles userId={userId} />
      <UserFollowButtons userId={userId} userInfo={userInfo[userId] || {}} />
    </ProfileBarUser>
  );
}

export default connect((state) => ({
  userInfo: state.UsersReducer.userInfo,
}))(UserProfileBarUser);
