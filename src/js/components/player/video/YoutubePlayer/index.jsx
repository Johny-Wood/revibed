import { Component } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import PlayListLocation from '@/components/player/video/YoutubePlayer/_components/PlayListLocation';
import VideoName from '@/components/player/video/YoutubePlayer/_components/VideoName';
import VideoProcess from '@/components/player/video/YoutubePlayer/_components/VideoProcess';
import VolumeControl from '@/components/player/video/YoutubePlayer/_components/VolumeControl';
import Button from '@/components/ui/buttons/Button';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import CloseIcon from '@/icons/control/close/CloseIcon';
import { getYouTubeLinkIdUtil } from '@/utils/linkUtils';
import { loadYTPlayerUtil } from '@/utils/player/videoPlayerUtils';

import VideoPlayerAsyncStateChangedHandler from './state-hanler/VideoPlayerAsyncStateChangedHandler';
import styles from './styles.module.scss';

class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    this.player = null;
    this.progressTimer = null;
    this.direction = 'next';

    this.stateChangedHandler = new VideoPlayerAsyncStateChangedHandler();

    this.state = {
      muted: false,
      volume: [80],
      played: [0],
      videoDuration: 0,
    };
  }

  componentDidMount() {
    loadYTPlayerUtil(() => this.createPlayer());
  }

  componentDidUpdate(prevProps) {
    const { activeYoutubeVideo: { id: activeId } = {}, externalTriggerPause, externalTriggerPlay, triggerPlayDate } = this.props;

    const {
      activeYoutubeVideo: { id: activeIdPrev } = {},
      externalTriggerPause: externalTriggerPausePrev,
      externalTriggerPlay: externalTriggerPlayPrev,
      triggerPlayDate: triggerPlayDatePrev,
    } = prevProps;

    if (externalTriggerPause !== externalTriggerPausePrev && externalTriggerPause > 0) {
      this.triggerPause();
    }

    if (externalTriggerPlay !== externalTriggerPlayPrev && externalTriggerPlay > 0) {
      this.triggerPlay();
    }

    if (activeId !== activeIdPrev) {
      this.changeVideo();
    }

    if (triggerPlayDate !== triggerPlayDatePrev) {
      this.resetVideoPlayedProcess();
    }
  }

  componentWillUnmount() {
    this.destroyPlayer();
  }

  changeVideo = () => {
    const { activeYoutubeVideo: { youtubeLink: activeYoutubeLink } = {} } = this.props;

    this.player?.loadVideoByUrl(activeYoutubeLink);
  };

  destroyPlayer = () => {
    this.player?.destroy();
  };

  createPlayer = () => {
    const {
      height,
      width,
      activeYoutubeVideo: { youtubeLink: activeYoutubeLink } = {},
      id,
      withCustomControl,
      autoPlay,
    } = this.props;

    if (!window?.YT?.Player) {
      return;
    }

    this.player = new window.YT.Player(id, {
      height,
      width,
      videoId: getYouTubeLinkIdUtil(activeYoutubeLink),
      events: {
        onStateChange: this.onPlayerStateChange,
        onReady: this.onPlayerReady,
        onError: this.onPlayerError,
      },
      playerVars: !withCustomControl
        ? {
            enablejsapi: 1,
          }
        : {
            enablejsapi: 1,
            autoplay: autoPlay ? 0 : 1,
            playsinline: 1,
            controls: 0,
            rel: 0,
          },
    });
  };

  onPlayerReady = (target) => {
    const { withCustomControl } = this.props;

    if (withCustomControl) {
      this.updatePrevIndex();

      if (this.getPlayerState(target) === 5) {
        this.updateSwitchingInProcessVideoPlayer(false);
      } else {
        this.triggerPlay();
      }
    }
  };

  onPlayerError = () => {
    this.removeWrongVideo();
  };

  onPlayerStateChange = ({ data: status }) => {
    const {
      withCustomControl,
      togglePlayVideoPlayer,
      listenedVideo,
      activeYoutubeVideoIdx,
      activeLocation,
      activeYoutubeVideo: { id: playingId } = {},
      // removeListenedVideo,
    } = this.props;

    if (withCustomControl) {
      const loadNewPlaylist = () => {
        this.stateChangedHandler.handle({
          activeLocation,
          status,
          index: activeYoutubeVideoIdx,
          callback: () => {
            loadNewPlaylist();
          },
        });
      };

      loadNewPlaylist();

      if (status === -1 || status === 0) {
        this.resetVideoPlayedProcess();
        this.updatePrevIndex();
      }

      switch (status) {
        case -1: {
          this.updateSwitchingInProcessVideoPlayer(true);
          this.stopDurationUpdateProgress();
          this.updateVideoDuration(0);
          break;
        }
        case 0: {
          // removeListenedVideo({ location: activeLocation });
          this.triggerNextVideo({ isAutoPlay: true });
          break;
        }
        case 1: {
          if (!this.getListenedIds().includes(playingId)) {
            listenedVideo({
              location: activeLocation,
              id: playingId,
            });
          }
          this.onPlay();
          break;
        }
        case 2: {
          this.onPause();
          break;
        }
        case 3: {
          this.stopDurationUpdateProgress();
          break;
        }
        default: {
          break;
        }
      }
    } else {
      if (status === 0) {
        this.triggerNextVideo();
      }

      if (status === 1 && togglePlayVideoPlayer) {
        togglePlayVideoPlayer(false, { externalTriggerPause: true });
      }
    }
  };

  getPlayerState = ({ target: { playerInfo: { playerState } = {} } = {} } = {}) => {
    if (playerState >= -1) {
      return playerState;
    }

    return this.player?.getPlayerState();
  };

  getListenedIds = () => {
    const { listenedIds } = this.props;

    return listenedIds || [];
  };

  youtubeLinksIsEmpty = () => {
    const { youtubeLinks } = this.props;

    return youtubeLinks.length === 0;
  };

  isLastVideo = () => {
    const { activeYoutubeVideoIdx, youtubeLinks } = this.props;

    const newActiveVideo = youtubeLinks[activeYoutubeVideoIdx + 1];

    return !newActiveVideo;
  };

  isFirstVideo = () => {
    const { activeYoutubeVideoIdx, youtubeLinks } = this.props;

    const newActiveVideo = youtubeLinks[activeYoutubeVideoIdx - 1];

    return !newActiveVideo;
  };

  isSwitching = () => {
    const { activeYoutubeVideoIdx } = this.props;

    return !this.player || (this.player && this.prevIndex !== activeYoutubeVideoIdx);
  };

  removeWrongVideo = () => {
    const { activeYoutubeVideo = {}, removeVideoInVideoPlayer, activeLocation, withCustomControl, onClose } = this.props;

    const { id: activeVideoId } = activeYoutubeVideo;

    if (withCustomControl) {
      if (this.isLastVideo()) {
        onClose();
      } else if (this.direction === 'next') {
        this.triggerNextVideo({ isAutoPlay: true });
      } else if (this.direction === 'prev') {
        this.triggerPrevVideo();
      }

      if (activeVideoId) {
        removeVideoInVideoPlayer({
          location: activeLocation,
          videoId: activeVideoId,
        });
      }
    }
  };

  updatePrevIndex = () => {
    const { activeYoutubeVideoIdx } = this.props;

    this.prevIndex = activeYoutubeVideoIdx;
  };

  triggerPrevVideo = () => {
    const { activeYoutubeVideoIdx, youtubeLinks, changeVideo, withCustomControl } = this.props;

    const newIndex = activeYoutubeVideoIdx - 1;

    const { id: nextId } = youtubeLinks[newIndex] || {};

    if (this.isFirstVideo() || !nextId) {
      return;
    }

    changeVideo({ newId: nextId });
    this.direction = 'prev';

    if (withCustomControl) {
      this.resetVideoPlayedProcess();
    }
  };

  triggerNextVideo = ({ isAutoPlay } = {}) => {
    const { activeYoutubeVideo: { id: activeId } = {}, changeVideo, withCustomControl, youtubeLinks, onClose } = this.props;

    if (this.youtubeLinksIsEmpty()) {
      return;
    }

    const links = !isAutoPlay
      ? youtubeLinks
      : youtubeLinks.filter(({ id: videoId }) => ![...this.getListenedIds().filter((id) => id !== activeId)].includes(videoId));

    const currentIndex = links.findIndex(({ id: videoId }) => videoId === activeId);
    const newIndex = currentIndex > -1 ? currentIndex + 1 : currentIndex;

    const { id: newId } = links[newIndex <= links.length - 1 ? newIndex : 0] || {};

    if (!newId || (links.filter(({ id: videoId }) => videoId !== activeId).length === 0 && onClose)) {
      onClose();
    }

    changeVideo({ newId });
    this.direction = 'next';

    if (withCustomControl) {
      this.resetVideoPlayedProcess();
    }
  };

  triggerPause = () => {
    const { togglePlayVideoPlayer } = this.props;

    this.player?.pauseVideo();
    togglePlayVideoPlayer(false);
  };

  triggerPlay = () => {
    const { togglePlayVideoPlayer } = this.props;

    this.player?.playVideo();
    togglePlayVideoPlayer(true);

    this.stopDurationUpdateProgress();
  };

  onPause = () => {
    const { togglePlayVideoPlayer } = this.props;

    togglePlayVideoPlayer(false);

    this.stopDurationUpdateProgress();
    this.updateSwitchingInProcessVideoPlayer(this.isSwitching());
  };

  onPlay = () => {
    const { togglePlayVideoPlayer } = this.props;

    togglePlayVideoPlayer(true);
    this.updateSwitchingInProcessVideoPlayer(false);
    this.updateVideoDuration();
    this.startDurationUpdateProgress();
  };

  toggleMute = () => {
    if (this.player?.isMuted()) {
      this.player?.unMute();
    } else {
      this.player?.mute();
    }

    this.setState({
      muted: !this.player?.isMuted(),
    });
  };

  changeVolume = (values) => {
    this.player?.setVolume(values[0]);

    this.setState({ volume: values });
  };

  changeVideoProgress = (values) => {
    this.player.seekTo(parseFloat(values[0]));

    this.setState({ played: values });
  };

  updateVideoDuration = (duration) => {
    const { played, videoDuration } = this.state;

    const newDuration = Math.trunc(duration || this.player.getDuration());

    if (videoDuration === newDuration) {
      return;
    }

    this.setState({
      videoDuration: newDuration,
      played: newDuration === 0 ? [0] : played,
    });
  };

  updateVideoPlayedProgress = () => {
    const { switchingInProcess } = this.props;
    const playedSeconds = Math.trunc(this.player.getCurrentTime());

    if (switchingInProcess) {
      return;
    }
    this.setState({
      played: [playedSeconds],
    });
  };

  resetVideoPlayedProcess = () => {
    const { videoDuration, played } = this.state;

    if (played[0] === 0 && videoDuration === 0) {
      return;
    }

    this.setState({
      videoDuration: 0,
      played: [0],
    });
  };

  startDurationUpdateProgress = () => {
    this.stopDurationUpdateProgress();

    this.progressTimer = setInterval(() => {
      this.updateVideoPlayedProgress();
    }, 1000);
  };

  stopDurationUpdateProgress = () => {
    clearInterval(this.progressTimer);
  };

  updateSwitchingInProcessVideoPlayer = (switchingInProcess) => {
    const { updateInProcessVideoPlayer, switchingInProcess: switchingInProcessProps } = this.props;

    if (switchingInProcessProps === switchingInProcess) {
      return;
    }

    updateInProcessVideoPlayer(switchingInProcess);
  };

  render() {
    const {
      id,
      withCustomControl,
      name,
      playing,
      switchingInProcess,
      userId,
      target,
      activeLocation,
      activeVideoProjectInfo,
      onClose,
      iframeClassName,
    } = this.props;

    const { volume, muted, played, videoDuration } = this.state;

    return (
      <div className={classNames([styles.videoPlayer, name])}>
        {!!onClose && (
          <ButtonIcon type="button_string" className={styles.videoPlayer__closeButton} icon={CloseIcon} onClick={onClose} />
        )}
        <div className={classNames(styles.videoPlayer__iframe, iframeClassName)}>
          <div id={id} />
          {withCustomControl && (
            <VideoProcess played={played} videoDuration={videoDuration} onChange={this.changeVideoProgress} />
          )}
        </div>
        {withCustomControl && (
          <div className={styles.videoPlayer__content}>
            <div className={styles.videoPlayer__control}>
              {!!activeLocation && (
                <>
                  <PlayListLocation activeLocation={activeLocation} userId={userId} target={target} />
                  <VideoName location={activeLocation} projectInfo={activeVideoProjectInfo} />
                </>
              )}
              <div className={styles.videoPlayer__controls}>
                <div className={styles.videoPlayer__controls__play}>
                  <Button
                    type="button_string"
                    className={classNames(styles.startPlayVideoButton)}
                    onClick={this.triggerPrevVideo}
                    disabled={this.isFirstVideo()}
                  >
                    <div className={styles.prev}>
                      <span className={classNames(styles.line)} />
                      <span className={classNames(styles.triangle)} />
                    </div>
                  </Button>
                  {playing || switchingInProcess ? (
                    <Button type="button_string" className={classNames(styles.startPlayVideoButton)} onClick={this.triggerPause}>
                      <span className={styles.lines}>
                        <span className={classNames(styles.line)} />
                        <span className={classNames(styles.line)} />
                      </span>
                    </Button>
                  ) : (
                    <Button type="button_string" className={classNames(styles.startPlayVideoButton)} onClick={this.triggerPlay}>
                      <span className={classNames(styles.triangle)} />
                    </Button>
                  )}
                  <Button
                    type="button_string"
                    className={classNames(styles.startPlayVideoButton)}
                    onClick={this.triggerNextVideo}
                    disabled={this.isLastVideo()}
                  >
                    <span className={styles.next}>
                      <span className={classNames(styles.triangle)} />
                      <span className={styles.line} />
                    </span>
                  </Button>
                </div>
                <VolumeControl isMuted={muted} volume={volume} onChange={this.changeVolume} onClick={this.toggleMute} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

YoutubePlayer.defaultProps = {
  height: 194,
  width: 275,
  playing: false,
  withCustomControl: false,
  autoPlay: false,
  name: '',
  activeLocation: '',
};

YoutubePlayer.propTypes = {
  id: PropTypes.string.isRequired,
  youtubeLinks: PropTypes.array.isRequired,
  activeYoutubeVideo: PropTypes.object.isRequired,
  activeYoutubeVideoIdx: PropTypes.number.isRequired,

  height: PropTypes.number,
  width: PropTypes.number,
  playing: PropTypes.bool,
  withCustomControl: PropTypes.bool,
  autoPlay: PropTypes.bool,
  name: PropTypes.string,
  activeLocation: PropTypes.string,
};

export default YoutubePlayer;
