import ProjectStatusContent from '@/components/projects/Project/_components/ProjectStatus/_components/ProjectStatusContent';
import {
  ProjectStatusDefaultProps,
  ProjectStatusPropTypes,
} from '@/components/projects/Project/_components/ProjectStatus/_config/props';

function ProjectStatus(props) {
  return <ProjectStatusContent {...props} />;
}

ProjectStatus.defaultProps = {
  ...ProjectStatusDefaultProps,
};

ProjectStatus.propTypes = {
  ...ProjectStatusPropTypes,
};

export default ProjectStatus;
