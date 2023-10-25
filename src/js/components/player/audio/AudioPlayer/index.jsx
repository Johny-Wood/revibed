import { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { togglePlayVideoPlayerAction } from '@/redux-actions/components/videoPlayerActions';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.audio = null;
  }

  componentDidMount() {
    const { activePlayingTrack: { src: activePlayingTrackSrc } = {} } = this.props;
    this.audio = typeof Audio !== 'undefined' ? new Audio(activePlayingTrackSrc) : {};

    this.init();
  }

  componentDidUpdate(prevProps) {
    const {
      activePlayingTrack: { id: activePlayingTrackId, src: activePlayingTrackSrc } = {},
      activePlayingItemId,
      isPlaying,
      playList,
      playing: videoPlayerPlaying,
      togglePlayVideoPlayer: toggleVideoPlayerPlayVideo,
    } = this.props;

    const {
      activePlayingTrack: { id: activePlayingTrackIdPrev } = {},
      activePlayingItemId: activePlayingItemIdPrev,
      isPlaying: isPlayingPrev,
      playList: playListPrev,
      playing: videoPlayerPlayingPrev,
    } = prevProps;

    if (videoPlayerPlaying && !videoPlayerPlayingPrev && isPlaying) {
      this.onPauseCallback();
    }

    if (!isPlayingPrev && isPlaying && videoPlayerPlaying) {
      toggleVideoPlayerPlayVideo(false, { externalTriggerPause: true });
    }

    if (playList.length !== playListPrev.length) {
      if (playList.length === 0) {
        this.destroy();
      } else {
        this.init();
      }
    }

    if (isPlaying !== isPlayingPrev && activePlayingTrackId === activePlayingTrackIdPrev) {
      if (!isPlaying) {
        this.onPause();
      } else {
        this.onPlay();
      }
    }

    if (activePlayingTrackId !== activePlayingTrackIdPrev || activePlayingItemId !== activePlayingItemIdPrev) {
      this.onPause();
      this.destroy();
      this.init();

      if (activePlayingTrackId > -1) {
        this.audio.src = activePlayingTrackSrc;
        this.onLoad();
        this.onPlay();
      } else {
        this.audio.currentTime = 0;
      }
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  init = () => {
    const { nextTrack } = this.props;

    this.audio.preload = 'metadata';

    this.audio.addEventListener('loadedmetadata', this.fixInfinityDuration);
    this.audio.addEventListener('play', this.onPlayCallback);
    this.audio.addEventListener('pause', this.onPauseCallback);
    this.audio.addEventListener('ended', nextTrack);
    this.audio.addEventListener('timeupdate', this.timeUpdate);
  };

  destroy = () => {
    const { nextTrack } = this.props;

    this.audio.removeEventListener('loadedmetadata', this.fixInfinityDuration);
    this.audio.removeEventListener('play', this.onPlayCallback);
    this.audio.removeEventListener('pause', this.onPauseCallback);
    this.audio.removeEventListener('ended', nextTrack);
    this.audio.removeEventListener('timeupdate', this.timeUpdate);
    this.audio.removeEventListener('timeupdate', this.clearCurrentTime);

    this.onPause();
    this.audio.currentTime = 0;
    this.audio.src = '';
  };

  onPlayCallback = () => {
    const { onPlay } = this.props;

    onPlay();
  };

  onPauseCallback = () => {
    const { onPause } = this.props;

    onPause();
  };

  fixInfinityDuration = () => {
    if (this.audio.duration === Infinity) {
      this.audio.currentTime = 1e101;

      this.audio.addEventListener('timeupdate', this.clearCurrentTime);
    }
  };

  clearCurrentTime = () => {
    this.audio.currentTime = 0;
    this.audio.removeEventListener('timeupdate', this.clearCurrentTime);
    this.audio.addEventListener('timeupdate', this.timeUpdate);
  };

  timeUpdate = () => {
    const { timeUpdate, playingTime } = this.props;
    const { duration = 20, currentTime = 0 } = this.audio;

    if (duration === currentTime && currentTime !== 0) {
      return;
    }

    const newPlayingTime = Math.ceil(
      ((currentTime || 0) * 100) / (duration && duration > 0 && duration !== Infinity ? duration : 20)
    );

    if (playingTime === newPlayingTime) {
      return;
    }

    timeUpdate(newPlayingTime);
  };

  onPlay = () => {
    this.audio.play();
  };

  onLoad = () => {
    this.audio.load();
  };

  onPause = () => {
    this.audio.pause();
  };

  render() {
    return null;
  }
}

AudioPlayer.defaultProps = {
  playList: [],
  isPlaying: false,
  activePlayingTrack: {
    src: '',
    id: -1,
  },
};

AudioPlayer.propTypes = {
  playList: PropTypes.array,
  isPlaying: PropTypes.bool,
  activePlayingTrack: PropTypes.shape({
    src: PropTypes.string,
    id: PropTypes.number,
  }),
};

export default connect(
  (state) => ({
    playing: state.VideoPlayerReducer.playing,
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
)(AudioPlayer);
