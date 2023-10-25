import { connect } from 'react-redux';

import ProfileBarAwards from '@/components/personal/profile/_components/ProfileBarAwards';

function MyProfileBarAwards({ userInfo }) {
  return <ProfileBarAwards userInfo={userInfo} />;
}

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(MyProfileBarAwards);
