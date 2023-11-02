import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

const buttonsData = [
  {
    translateKey: 'faq',
    href: RoutePathsConstants.FAQ,
  },
  {
    translateKey: 'contactUs',
    href: RoutePathsConstants.CONTACT_US,
  },
];

export default function HelpBlock() {
  return (
    <div className={styles.HelpBlock}>
      <SiteWrapperLayout className="t-center f-y-center f-x-center f-grow-1" direction="column" withYPadding={false}>
        <h2 className={styles.HelpBlock__title}>Have a question?</h2>
        <div className={styles.HelpBlock__btnBox}>
          {buttonsData.map(({ translateKey, href }) => (
            <LinkRoute
              key={`button-support-link-${translateKey}`}
              translateKey={translateKey}
              href={href}
              transparent
              type="button"
              size="small-45"
              className="question__btn"
            />
          ))}
        </div>
      </SiteWrapperLayout>
    </div>
  );
}
