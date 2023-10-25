import { connect } from 'react-redux';

import ProfileBarUser from '@/components/personal/profile/_components/ProfileBarUser';
import MyProfileBarFavoriteStyles from '@/components/personal/profile/MyProfileBar/_components/MyProfileBarFavoriteStyles';

function MyProfileBarUser({ userInfo }) {
  return (
    <ProfileBarUser userInfo={userInfo} isMy>
      <MyProfileBarFavoriteStyles />
    </ProfileBarUser>
  );
}

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(MyProfileBarUser);
