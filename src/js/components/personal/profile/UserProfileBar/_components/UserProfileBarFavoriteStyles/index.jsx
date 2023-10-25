import { connect } from 'react-redux';

import ProfileBarFavoriteStyles from '@/components/personal/profile/_components/ProfileBarFavoriteStyles';

function UserProfileBarFavoriteStyles({ userId, userInfo }) {
  return <ProfileBarFavoriteStyles userInfo={userInfo[userId] || {}} />;
}

export default connect((state) => ({
  userInfo: state.UsersReducer.userInfo,
}))(UserProfileBarFavoriteStyles);
