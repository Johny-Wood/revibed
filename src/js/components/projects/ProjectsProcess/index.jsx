import NoResults from '@/components/common/NoResults';
import Preloader from '@/components/ui/Preloader';

function ProjectsProcess({
  loadedProjectsFromApi,
  noResults: { text, component } = {},
  location,
  projects = [],
  getProjectsInProcess,
}) {
  return (
    <>
      {projects.length === 0 && loadedProjectsFromApi && <NoResults location="projects" text={text} component={component} />}
      <Preloader
        id={`project-list-${location}`}
        isShown={getProjectsInProcess}
        opacity={projects.length > 0 ? 0.8 : 1}
        type="container"
      />
    </>
  );
}

export default ProjectsProcess;
