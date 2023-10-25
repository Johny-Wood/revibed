import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';
import MyProjectsPageWrapper from '@/pages/personal/MyProjectsPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetProjectsWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';

function MyPreOrdersPage() {
  return <MyProjectsPageWrapper />;
}

MyPreOrdersPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetProjectsWithCookie({
      ctx,
      location: ProjectsLocationsConstants.MY_PROJECTS,
      reducerName: ProjectsReducersConstants.MyProjectsReducer,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(MyPreOrdersPage);
