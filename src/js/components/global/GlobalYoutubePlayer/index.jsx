import { connect } from 'react-redux';

import GlobalYoutubeVideoPlayer from '@/components/global/GlobalYoutubePlayer/_components/GlobalYoutubeVideoPlayer';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';

import styles from './styles.module.scss';

function GlobalYoutubePlayer({ videoShown }) {
  return (
    <TransitionSwitchLayout
      isShown={videoShown}
      animationClassNames={{
        enter: styles.videoPlayerAnimationEnter,
        enterActive: styles.videoPlayerAnimationEnter_active,
        exit: styles.videoPlayerAnimationExit,
        exitActive: styles.videoPlayerAnimationExit_active,
      }}
      duration={400}
    >
      <GlobalYoutubeVideoPlayer />
    </TransitionSwitchLayout>
  );
}

export default connect((state) => ({
  videoShown: state.VideoPlayerReducer.shown,
}))(GlobalYoutubePlayer);
