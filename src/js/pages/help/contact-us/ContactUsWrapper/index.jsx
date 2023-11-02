import { useState } from 'react';

import { connect } from 'react-redux';

import ContactUsForm from '@/components/forms/ContactUsForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import TitlesConstants from '@/constants/titles/titlesConstants';
import ContactUsSuccess from '@/pages/help/contact-us/ContactUsWrapper/_components/ContactUsSuccess';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.CONTACT_US;

function ContactUsWrapper({ goodsId, feedbackTopics }) {
  const [sentSupportMessage, setSentSupportMessage] = useState(false);

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      shownBanners
    >
      <SiteWrapperLayout className="t-center f-y-center f-x-center f-grow-1" direction="column">
        <div className={styles.contactUs}>
          <div className={styles.contactUs__header}>
            <h1 className={styles.contactUs__title}>{metaTitle}</h1>
            <div className={styles.contactUs__description}>
              Questions, bug reports, feedback&nbsp;&mdash; we&rsquo;re here to&nbsp;help you.
            </div>
          </div>
          {feedbackTopics.length > 0 && (
            <ContactUsForm goodsId={goodsId} sendRequestCallback={() => setSentSupportMessage(true)} />
          )}
          <TransitionSwitchLayout isShown={sentSupportMessage}>
            <ContactUsSuccess />
          </TransitionSwitchLayout>
        </div>
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  feedbackTopics: state.FeedbackReducer.feedbackTopics,
}))(ContactUsWrapper);
