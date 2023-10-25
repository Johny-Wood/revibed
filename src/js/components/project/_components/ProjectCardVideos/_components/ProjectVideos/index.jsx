import { Component } from 'react';

import PropTypes from 'prop-types';

import YoutubePlayer from '@/components/player/video/YoutubePlayer';
import ProjectCardVideoSectionLayout from '@/components/project/_components/ProjectCardVideos/_components/ProjectCardVideoSectionLayout';
import ProjectCardVideosList from '@/components/project/_components/ProjectCardVideos/_components/ProjectCardVideosList';

import styles from './styles.module.scss';

class ProjectVideos extends Component {
  constructor(props) {
    super(props);

    const { youtubeLinks } = props;
    const youtubeLinksForState = this.fillTitleForEmptyVideos(youtubeLinks);

    this.state = {
      activeYoutubeVideo: youtubeLinksForState.length > 0 ? youtubeLinksForState[0] : undefined,
      activeYoutubeVideoIdx: 0,
      youtubeLinksState: youtubeLinksForState,
      externalTriggerPlay: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const { youtubeLinks, inProcess } = this.props;
    const { youtubeLinks: youtubeLinksPrev } = prevProps;

    if (youtubeLinks !== youtubeLinksPrev && !inProcess) {
      this.updateYoutubeLinks(youtubeLinks);
    }
  }

  updateYoutubeLinks = (youtubeLinksState) => {
    this.setState({
      youtubeLinksState: this.fillTitleForEmptyVideos(youtubeLinksState),
    });
  };

  fillTitleForEmptyVideos = (youtubeLinks) => {
    const { projectTitle } = this.props;

    return youtubeLinks.map((linkItem) => {
      const { title, link } = linkItem;

      return {
        ...linkItem,
        youtubeLink: link,
        title: title || projectTitle,
      };
    });
  };

  setActiveYoutubeVideo = (newActiveYoutubeVideo) => {
    const { activeYoutubeVideo } = this.state;

    if (activeYoutubeVideo === newActiveYoutubeVideo) {
      return;
    }

    this.setState({
      activeYoutubeVideo: newActiveYoutubeVideo,
    });
  };

  changeVideo = ({ newIdx, newId }) => {
    const { activeYoutubeVideoIdx, youtubeLinksState } = this.state;

    const nextIdx = newIdx >= 0 ? newIdx : youtubeLinksState.findIndex(({ id: videoId }) => videoId === newId);

    if (activeYoutubeVideoIdx === nextIdx) {
      this.setState({ externalTriggerPlay: new Date().valueOf() });
      return;
    }

    if (nextIdx === -1) {
      return;
    }

    this.setActiveYoutubeVideo(youtubeLinksState[nextIdx]);

    this.setState({
      activeYoutubeVideoIdx: nextIdx,
    });
  };

  render() {
    const { projectCardId, withUpdateOrder, withList, togglePlayVideoPlayer } = this.props;
    const { youtubeLinksState, activeYoutubeVideo, activeYoutubeVideoIdx, externalTriggerPlay } = this.state;

    const hasVideos = youtubeLinksState.length > 0;

    return (
      <div className={styles.projectVideo}>
        <ProjectCardVideoSectionLayout>
          <YoutubePlayer
            id="project-youtube-player"
            height={194}
            width={275}
            youtubeLinks={youtubeLinksState}
            activeYoutubeVideo={activeYoutubeVideo}
            activeYoutubeVideoIdx={activeYoutubeVideoIdx}
            togglePlayVideoPlayer={togglePlayVideoPlayer}
            changeVideo={this.changeVideo}
            externalTriggerPlay={externalTriggerPlay}
          />
        </ProjectCardVideoSectionLayout>
        {hasVideos && withList && (
          <ProjectCardVideosList
            activeYoutubeVideo={activeYoutubeVideo}
            youtubeLinks={youtubeLinksState}
            onClick={this.changeVideo}
            updateYoutubeLinks={this.updateYoutubeLinks}
            projectCardId={projectCardId}
            withUpdateOrder={withUpdateOrder}
          />
        )}
      </div>
    );
  }
}

ProjectVideos.defaultProps = {
  youtubeLinks: [],
  withUpdateOrder: false,
  withList: false,
  projectCardId: '',
  projectTitle: '',
};

ProjectVideos.propTypes = {
  youtubeLinks: PropTypes.array,
  withUpdateOrder: PropTypes.bool,
  withList: PropTypes.bool,
  projectCardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  projectTitle: PropTypes.string,
};

export default ProjectVideos;
