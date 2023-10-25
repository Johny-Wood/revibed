import { connect } from 'react-redux';

import PlayerPlayPauseButton from '@/components/player/control/PlayerPlayPauseButton';
import { showVideoPlayerAction, togglePlayVideoPlayerAction } from '@/redux-actions/components/videoPlayerActions';

function StartPlayVideo({
  withPlayDisabled,

  projectInfo: { id: playingId, projectId } = {},
  isPlayingProject,
  location,
  showVideoPlayer,
  togglePlayVideoPlayer,
  userId,
  target,
  playingId: playingIdStore,
  className,
  disabledClassName,
  contentClassName,
}) {
  return (
    <PlayerPlayPauseButton
      isPlaying={isPlayingProject}
      disabled={withPlayDisabled}
      onClickPause={() => {
        togglePlayVideoPlayer(false, { externalTriggerPause: true });
      }}
      onClickPlay={() => {
        if (playingId === playingIdStore) {
          togglePlayVideoPlayer(false, { externalTriggerPlay: true });
        } else {
          showVideoPlayer({
            location,
            playingId,
            playingProjectId: projectId,
            userId,
            target,
          });
        }
      }}
      className={className}
      disabledClassName={disabledClassName}
      contentClassName={contentClassName}
    />
  );
}

export default connect(
  (state) => ({
    playingId: state.VideoPlayerReducer.playingId,
  }),
  (dispatch) => ({
    showVideoPlayer: (params) => {
      dispatch(showVideoPlayerAction(params));
    },
    togglePlayVideoPlayer: (isPlay, { externalTriggerPause, externalTriggerPlay } = {}) => {
      dispatch(
        togglePlayVideoPlayerAction(isPlay, {
          externalTriggerPause,
          externalTriggerPlay,
        })
      );
    },
  })
)(StartPlayVideo);
