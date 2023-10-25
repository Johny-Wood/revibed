import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

function NoResultsNotFollowing() {
  return (
    <div className="c-gray-2 t-center">
      <div className="t-medium m-bottom-20">Your subscription feed is&nbsp;empty.</div>
      <i>
        You can subscribe to&nbsp;other users from their profiles and add favorites tags on&nbsp;your&nbsp;
        <LinkRoute className="underline" text="profile page" href={RoutePathsConstants.MY_PROJECTS} />.
      </i>
    </div>
  );
}

export default NoResultsNotFollowing;
