import { CommonRegExpConstants } from '@/constants/common/regExp';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ProjectCardWrapper from '@/pages/projects/ProjectCardWrapper';
import { SSRGetProjectCardWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';

function ProjectPage({ tab, event, projectCardId }) {
  return <ProjectCardWrapper projectCardId={projectCardId} tab={tab} event={event} />;
}

ProjectPage.getInitialProps = async (ctx) => {
  const { res, req, query: { projectCardId = '', event, tab } = {} } = ctx;

  const id = projectCardId.split('-')[0];

  if (!id || !CommonRegExpConstants.INT.test(id)) {
    if (req && res) {
      res.statusCode = 302;
      res.setHeader('Location', RoutePathsConstants.PROJECTS);
      res.end();
    }
  } else {
    await SSRGetProjectCardWithCookie({ ctx, projectCardId: +id });
  }

  return {
    tab,
    event,
    projectCardId: +id,
  };
};

export default ProjectPage;
