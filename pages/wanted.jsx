import WantedWrapper from '@/pages/wanted/WantedWrapper';
import { SSRLoadWantedRequest } from '@/SSR/requests/wanted/SSRWantedRequests';

function WantedPage() {
  return <WantedWrapper />;
}

WantedPage.getInitialProps = async (ctx) => {
  await SSRLoadWantedRequest(ctx);

  return { props: {} };
};

export default WantedPage;
