import { connect } from 'react-redux';

import ProfileBarShortInfo from '@/components/personal/profile/_components/ProfileBarShortInfo';

function MyProfileBarShortInfo({ userInfo }) {
  return <ProfileBarShortInfo userInfo={userInfo} isMy />;
}

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(MyProfileBarShortInfo);
