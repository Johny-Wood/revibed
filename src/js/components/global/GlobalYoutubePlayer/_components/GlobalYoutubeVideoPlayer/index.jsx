import { useEffect, useMemo, useState } from 'react';

import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import YoutubePlayer from '@/components/player/video/YoutubePlayer';
import {
  changeVideoPlayerVideoAction,
  closeVideoPlayerAction,
  removeListenedVideoPlayerAction,
  removeVideoInVideoPlayerAction,
  setListenedVideoPlayerAction,
  togglePlayVideoPlayerAction,
  updateInProcessVideoPlayerAction,
} from '@/redux-actions/components/videoPlayerActions';

import styles from './styles.module.scss';

function GlobalYoutubeVideoPlayer({
  autoPlay,
  playList,
  activeLocation,
  playingId,
  playing,
  switchingInProcess,
  externalTriggerPause,
  externalTriggerPlay,
  triggerPlayDate,
  userId,
  target,

  closeVideoPlayer,
  changeVideoAction,
  togglePlayVideoPlayer,
  updateInProcessVideoPlayer,
  removeVideoInVideoPlayer,
  listenedVideo,
  removeListenedVideo,
}) {
  const { list = [], listenedIds = [] } = useMemo(() => playList[activeLocation] || [], [playList, activeLocation]);

  const [youtubeLinks, setYoutubeLinks] = useState(list);

  const activeYoutubeVideoIdx = useMemo(() => {
    const newIndex = youtubeLinks.findIndex(({ id: videoId }) => videoId === playingId);

    return newIndex > -1 ? newIndex : youtubeLinks.length;
  }, [youtubeLinks, playingId]);

  const [activeYoutubeVideo, setActiveYoutubeVideo] = useState(
    activeYoutubeVideoIdx > -1 ? youtubeLinks[activeYoutubeVideoIdx] : {}
  );

  const { id, projectId, albumTitle, artists } = activeYoutubeVideo || {};

  const [activeVideoProjectInfo, setActiveVideoProjectInfo] = useState({
    projectId,
    albumTitle,
    artists,
  });

  useEffect(() => {
    if (youtubeLinks.length === 0) {
      closeVideoPlayer();
    }
  }, [closeVideoPlayer, youtubeLinks]);

  useEffect(() => {
    if (activeYoutubeVideoIdx === -1 || !isEqual(list, youtubeLinks)) {
      setYoutubeLinks(list);
    }
  }, [activeYoutubeVideoIdx, list, youtubeLinks]);

  useEffect(() => {
    if (youtubeLinks[activeYoutubeVideoIdx]) {
      setActiveYoutubeVideo(activeYoutubeVideoIdx > -1 ? youtubeLinks[activeYoutubeVideoIdx] : {});
    }
  }, [activeYoutubeVideoIdx, youtubeLinks]);

  useEffect(() => {
    if (id) {
      setActiveVideoProjectInfo({ projectId, albumTitle, artists });
    }
  }, [albumTitle, artists, id, projectId]);

  const changeVideo = ({ newId, newIdx }) => {
    const nextIdx = newIdx || youtubeLinks.findIndex(({ id: videoId }) => videoId === newId);

    if (activeYoutubeVideoIdx === nextIdx || nextIdx === -1) {
      return;
    }

    changeVideoAction({
      videoIdx: nextIdx,
    });
  };

  return (
    <YoutubePlayer
      id="youtube-player"
      name={styles.globalVideoPlayer}
      height={194}
      width={275}
      activeLocation={activeLocation}
      youtubeLinks={youtubeLinks}
      listenedIds={listenedIds}
      withCustomControl
      autoPlay={autoPlay}
      activeYoutubeVideo={activeYoutubeVideo}
      activeYoutubeVideoIdx={activeYoutubeVideoIdx}
      triggerPlayDate={triggerPlayDate}
      playing={playing}
      switchingInProcess={switchingInProcess}
      externalTriggerPlay={externalTriggerPlay}
      externalTriggerPause={externalTriggerPause}
      userId={userId}
      target={target}
      activeVideoProjectInfo={activeVideoProjectInfo}
      onClose={closeVideoPlayer}
      changeVideo={changeVideo}
      togglePlayVideoPlayer={togglePlayVideoPlayer}
      updateInProcessVideoPlayer={updateInProcessVideoPlayer}
      removeVideoInVideoPlayer={removeVideoInVideoPlayer}
      listenedVideo={listenedVideo}
      removeListenedVideo={removeListenedVideo}
      iframeClassName={styles.videoPlayer__iframe}
    />
  );
}

export default connect(
  (state) => ({
    activeLocation: state.VideoPlayerReducer.activeLocation,
    playList: state.VideoPlayerReducer.playList,
    playingId: state.VideoPlayerReducer.playingId,
    autoPlay: state.VideoPlayerReducer.autoPlay,
    playing: state.VideoPlayerReducer.playing,
    externalTriggerPause: state.VideoPlayerReducer.externalTriggerPause,
    switchingInProcess: state.VideoPlayerReducer.inProcess,
    triggerPlayDate: state.VideoPlayerReducer.triggerPlayDate,
    externalTriggerPlay: state.VideoPlayerReducer.externalTriggerPlay,
    userId: state.VideoPlayerReducer.userId,
    target: state.VideoPlayerReducer.target,
  }),
  (dispatch) => ({
    removeVideoInVideoPlayer: ({ location, videoId }) => {
      dispatch(
        removeVideoInVideoPlayerAction({
          location,
          videoId,
        })
      );
    },
    closeVideoPlayer: () => {
      dispatch(closeVideoPlayerAction());
    },
    togglePlayVideoPlayer: (isPlay) => {
      dispatch(togglePlayVideoPlayerAction(isPlay));
    },
    updateInProcessVideoPlayer: (inProcess) => {
      dispatch(updateInProcessVideoPlayerAction(inProcess));
    },
    changeVideoAction: ({ videoIdx }) => {
      dispatch(changeVideoPlayerVideoAction({ videoIdx }));
    },
    listenedVideo: ({ location, id }) => {
      dispatch(
        setListenedVideoPlayerAction({
          location,
          id,
        })
      );
    },
    removeListenedVideo: ({ location }) => {
      dispatch(removeListenedVideoPlayerAction({ location }));
    },
  })
)(GlobalYoutubeVideoPlayer);
