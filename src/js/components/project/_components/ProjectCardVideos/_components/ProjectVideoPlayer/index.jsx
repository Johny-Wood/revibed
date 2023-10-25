import { connect } from 'react-redux';

import ProjectVideos from '@/components/project/_components/ProjectCardVideos/_components/ProjectVideos';
import { togglePlayVideoPlayerAction } from '@/redux-actions/components/videoPlayerActions';

function ProjectVideoPlayer({
  youtubeLinks,
  withUpdateOrder,
  projectCardId,
  title,

  changeOrderProjectVideosInProcess,
  togglePlayVideoPlayer,
}) {
  return (
    <ProjectVideos
      youtubeLinks={youtubeLinks}
      withUpdateOrder={withUpdateOrder}
      projectCardId={projectCardId}
      projectTitle={title}
      withList
      inProcess={changeOrderProjectVideosInProcess}
      togglePlayVideoPlayer={togglePlayVideoPlayer}
    />
  );
}

export default connect(
  (state) => ({
    changeOrderProjectVideosInProcess: state.ProjectCardReducer.changeOrderProjectVideosInProcess,
  }),
  (dispatch) => ({
    togglePlayVideoPlayer: (isPlay, { externalTriggerPause, externalTriggerPlay } = {}) => {
      dispatch(
        togglePlayVideoPlayerAction(isPlay, {
          externalTriggerPause,
          externalTriggerPlay,
        })
      );
    },
  })
)(ProjectVideoPlayer);
