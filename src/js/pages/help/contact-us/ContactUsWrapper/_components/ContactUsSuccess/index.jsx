import PrivacyPolicyLink from '@/components/common-ui/links/terms/PrivacyPolicyLink';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import SupportIcon from '@/icons/SupportIcon';

import styles from './styles.module.scss';

const renderContactUsFromLinks = ({ translateKey, href }) => (
  <LinkRoute translateKey={translateKey} href={href} type="button" transparent className="border-gray-3" />
);

function ContactUsSuccess() {
  return (
    <div className={styles.contactUsSuccess}>
      <SupportIcon />
      <h1 className={styles.contactUsSuccess__title}>Thank you for contacting&nbsp;us!</h1>
      <div className={styles.contactUsSuccess__description}>
        We&nbsp;usually answer within 60&nbsp;minutes Mon.&nbsp;-&nbsp;Fri.&nbsp;10.00&nbsp;- 18.00&nbsp;CET. At&nbsp;different
        time range please allow more time for reply.
      </div>
      <div className={styles.contactUsSuccess__buttons}>
        {/* {renderContactUsFromLinks({ */}
        {/*  href: RoutePathsConstants.ABOUT_US, */}
        {/*  translateKey: 'aboutUs', */}
        {/* })} */}
        {renderContactUsFromLinks({
          href: RoutePathsConstants.FAQ,
          translateKey: 'faq',
        })}
      </div>
      <PrivacyPolicyLink />
    </div>
  );
}

export default ContactUsSuccess;
