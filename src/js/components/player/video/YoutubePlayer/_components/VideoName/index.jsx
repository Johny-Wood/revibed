import Names from '@/components/common/Names';
import { ReleaseLocationConstants } from '@/constants/release';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function VideoName({ location, projectInfo: { projectId, title, artists, albumTitle } = {} }) {
  return (
    <div className={styles.videoPlayerNames}>
      <Names
        href={
          location === ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS
            ? parseReplaceTextUtil(RoutePathsConstants.RELEASE, projectId)
            : createProjectUrlUtil(projectId, title)
        }
        title={title}
        artists={artists}
        albumTitle={albumTitle}
        isRoute
        titleClassName={styles.project__title}
        albumClassName={styles.project__album__title}
      />
    </div>
  );
}

export default VideoName;
