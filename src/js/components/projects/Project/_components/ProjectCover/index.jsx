import Cover from '@/components/common/Cover';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';

function ProjectCover({
  projectId,
  title,
  projectInfo,
  projectInfo: { artists, albumTitle } = {},
  href = createProjectUrlUtil(projectId, title),
  ...props
}) {
  return (
    <Cover {...props} title={title} artists={artists} albumTitle={albumTitle} projectInfo={projectInfo} href={href} isProject />
  );
}

export default ProjectCover;
