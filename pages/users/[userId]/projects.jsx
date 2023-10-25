import { ProjectsLocationsConstants } from '@/constants/projects/location';
import UserProjectWrapper from '@/pages/users/projects/UserProjectWrapper';
import { userGetInitialPropsLogic } from '@/SSR/getInitialProps/users';

function UserProjectPage() {
  return <UserProjectWrapper />;
}

UserProjectPage.getInitialProps = async (ctx) => {
  await userGetInitialPropsLogic({
    ctx,
    location: ProjectsLocationsConstants.PROJECTS_USER,
    reducerName: 'UserProjectsReducer',
  });

  return { props: {} };
};

export default UserProjectPage;
