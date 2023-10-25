import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';
import RipperProjectsWrapper from '@/pages/personal/RipperProjectsWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetProjectsWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';

function RipperPage() {
  return <RipperProjectsWrapper />;
}

RipperPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetProjectsWithCookie({
      ctx,
      location: ProjectsLocationsConstants.RIPPER,
      reducerName: ProjectsReducersConstants.RipperProjectsReducer,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(RipperPage);
