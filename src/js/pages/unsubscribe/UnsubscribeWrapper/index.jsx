import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import Preloader from '@/components/ui/Preloader';
import FullUnsubscribeWrapper from '@/components/unsubscribe/FullUnsubscribeWrapper';
import ShortUnsubscribeWrapper from '@/components/unsubscribe/ShortUnsubscribeWrapper';
import UnsubscribeTypesConstants from '@/constants/unsubscribe/type';

import styles from './styles.module.scss';

function UnsubscribeWrapper({ token, template, unsubscribeType }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Unsubscribe',
      }}
      pageName={styles.pageUnsubscribe}
    >
      <SiteWrapperLayout firstInPage className={styles.pageUnsubscribe__siteWrapper}>
        {!unsubscribeType && <Preloader isShown fullScreen opacity={1} />}
        {unsubscribeType === UnsubscribeTypesConstants.FULL && <FullUnsubscribeWrapper token={token} template={template} />}
        {unsubscribeType === UnsubscribeTypesConstants.SHORT && <ShortUnsubscribeWrapper token={token} />}
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  unsubscribeType: state.UnsubscribeReducer.unsubscribeType,
}))(UnsubscribeWrapper);
