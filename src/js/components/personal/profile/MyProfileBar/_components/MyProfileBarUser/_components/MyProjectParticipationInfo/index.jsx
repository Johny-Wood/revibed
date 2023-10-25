import { connect } from 'react-redux';

import ProjectParticipationInfo from '@/components/personal/profile/_components/ProfileBarUser/_components/ProjectParticipationInfo';

function MyProjectParticipationInfo({ userInfo }) {
  return <ProjectParticipationInfo userInfo={userInfo} />;
}

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(MyProjectParticipationInfo);
