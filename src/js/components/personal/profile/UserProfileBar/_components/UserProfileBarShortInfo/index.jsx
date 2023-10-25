import { connect } from 'react-redux';

import ProfileBarShortInfo from '@/components/personal/profile/_components/ProfileBarShortInfo';

function UserProfileBarShortInfo({ userId, userInfo }) {
  return <ProfileBarShortInfo userInfo={userInfo[userId] || {}} />;
}

export default connect((state) => ({
  userInfo: state.UsersReducer.userInfo,
}))(UserProfileBarShortInfo);
