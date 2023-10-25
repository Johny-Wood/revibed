import ContactUsWrapper from '@/pages/help/contact-us/ContactUsWrapper';
import { SSRLoadFeedbackTopics } from '@/SSR/requests/feedback/SSRFeedbackRequests';

function ContactUsPage({ goodsId }) {
  return <ContactUsWrapper goodsId={goodsId} />;
}

ContactUsPage.getInitialProps = async (ctx) => {
  const { query: { goodsId } = {} } = ctx;

  const awaitPromises = [];

  awaitPromises.push(SSRLoadFeedbackTopics(ctx));

  await Promise.all(awaitPromises);

  return {
    goodsId,
  };
};

export default ContactUsPage;
