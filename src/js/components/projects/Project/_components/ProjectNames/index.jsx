import Names from '@/components/common/Names';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';

function ProjectNames({ projectId, title, href = createProjectUrlUtil(projectId, title), ...props }) {
  return <Names {...props} href={href} />;
}

export default ProjectNames;
