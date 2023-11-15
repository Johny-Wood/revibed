import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';
import ProjectsWrapper from '@/pages/projects/ProjectsWrapper';
import { SSRGetProjectsWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';

function ProjectsPage() {
  return <ProjectsWrapper />;
}

ProjectsPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetProjectsWithCookie({
      ctx,
      location: ProjectsLocationsConstants.PROJECTS,
      reducerName: ProjectsReducersConstants.DefaultProjectsReducer,
      withoutLoadedFromApi: true,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default ProjectsPage;
