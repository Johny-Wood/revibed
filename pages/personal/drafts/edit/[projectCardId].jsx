import { RoutePathsConstants } from '@/constants/routes/routes';
import EditProjectWrapper from '@/pages/create-project/EditProjectWrapper';
import { SSRGetProjectCardWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';

function EditProjectPage() {
  return <EditProjectWrapper />;
}

EditProjectPage.getInitialProps = async (ctx) => {
  const { query: { projectCardId = '' } = {} } = ctx;

  const awaitPromises = [];

  awaitPromises.push(
    SSRGetProjectCardWithCookie({
      ctx,
      location: RoutePathsConstants.MY_PROJECTS,
      isEditRequest: true,
      projectCardId,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default EditProjectPage;
