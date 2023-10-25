import ProjectsProcess from '@/components/projects/ProjectsProcess';

import styles from './styles.module.scss';

function ProjectsContainer({ projects, getProjectsInProcess, loadedProjectsFromApi, location, children, noResults }) {
  return (
    <div className={styles.projectsContainer}>
      <ProjectsProcess
        projects={projects}
        getProjectsInProcess={getProjectsInProcess}
        loadedProjectsFromApi={loadedProjectsFromApi}
        location={location}
        noResults={noResults}
      />
      {children}
    </div>
  );
}

export default ProjectsContainer;
