import PropTypes from 'prop-types';

import ProjectCardVideoSectionLayout from '@/components/project/_components/ProjectCardVideos/_components/ProjectCardVideoSectionLayout';
import ProjectVideoPlayer from '@/components/project/_components/ProjectCardVideos/_components/ProjectVideoPlayer';
import User2Icon from '@/icons/users/User2Icon';

import styles from './styles.module.scss';

function ProjectCardVideos({ youtubeLinks, withUpdateOrder, projectCardId, title }) {
  return (
    <div className={styles.projectCardVideo}>
      {youtubeLinks.length > 0 ? (
        <ProjectVideoPlayer
          youtubeLinks={youtubeLinks}
          withUpdateOrder={withUpdateOrder}
          projectCardId={projectCardId}
          projectTitle={title}
        />
      ) : (
        <ProjectCardVideoSectionLayout>
          <div className={styles.projectCardVideo__error}>
            <User2Icon />
            <span>No video available</span>
          </div>
        </ProjectCardVideoSectionLayout>
      )}
    </div>
  );
}

ProjectCardVideos.defaultProps = {
  youtubeLinks: [],
  withUpdateOrder: false,
  projectCardId: '',
  title: '',
};

ProjectCardVideos.propTypes = {
  youtubeLinks: PropTypes.array,
  withUpdateOrder: PropTypes.bool,
  projectCardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
};

export default ProjectCardVideos;
