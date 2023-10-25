import { connect } from 'react-redux';

import ProfileBarAwards from '@/components/personal/profile/_components/ProfileBarAwards';

function UserProfileBarAwards({ userId, userInfo }) {
  return <ProfileBarAwards userInfo={userInfo[userId] || {}} />;
}

export default connect((state) => ({
  userInfo: state.UsersReducer.userInfo,
}))(UserProfileBarAwards);
