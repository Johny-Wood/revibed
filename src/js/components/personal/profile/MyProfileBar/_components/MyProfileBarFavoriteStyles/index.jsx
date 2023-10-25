import { connect } from 'react-redux';

import ProfileBarFavoriteStyles from '@/components/personal/profile/_components/ProfileBarFavoriteStyles';

function MyProfileBarFavoriteStyles({ userInfo }) {
  return <ProfileBarFavoriteStyles userInfo={userInfo} isMy />;
}

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(MyProfileBarFavoriteStyles);
