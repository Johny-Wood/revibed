import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { ProjectsPreviewTypesConstants } from '@/constants/projects/previewTypes';
import ProjectPreviewCardTypeIcon from '@/icons/project/preview/ProjectPreviewCardTypeIcon';
import ProjectPreviewListTypeIcon from '@/icons/project/preview/ProjectPreviewListTypeIcon';
import { projectsChangePreviewTypeAction } from '@/redux-actions/projects/projectsActions';

import styles from './styles.module.scss';

const BUTTON_PROPS = {
  transparent: true,
  borderColor: 'gray-3',
  size: ComponentsCommonConstants.Size.SMALL35,
};

const changeType = ({ location, projectsChangePreviewType, newType }) => {
  projectsChangePreviewType(location, newType);
};

function ProjectTypePreviewControl({ location, activePreviewType, projectsChangePreviewType }) {
  return (
    <div className={styles.projectTypePreviewControl}>
      <ButtonIcon
        icon={ProjectPreviewCardTypeIcon}
        {...BUTTON_PROPS}
        isActive={activePreviewType === ProjectsPreviewTypesConstants.CARD}
        onClick={() => {
          changeType({
            location,
            projectsChangePreviewType,
            newType: ProjectsPreviewTypesConstants.CARD,
          });
        }}
      />
      <ButtonIcon
        icon={ProjectPreviewListTypeIcon}
        {...BUTTON_PROPS}
        isActive={activePreviewType === ProjectsPreviewTypesConstants.LIST}
        onClick={() => {
          changeType({
            location,
            projectsChangePreviewType,
            newType: ProjectsPreviewTypesConstants.LIST,
          });
        }}
      />
    </div>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    projectsChangePreviewType: (location, previewType) => {
      dispatch(projectsChangePreviewTypeAction(location, previewType));
    },
  })
)(ProjectTypePreviewControl);
