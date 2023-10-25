import FAQWrapper from '@/pages/help/FAQ/FAQWrapper';
import { SSRLoadFAQ } from '@/SSR/requests/faq/SSRFAQRequests';

function FaqPage() {
  return <FAQWrapper />;
}

FaqPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(SSRLoadFAQ(ctx));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default FaqPage;
