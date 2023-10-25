import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import Preloader from '@/components/ui/Preloader';
import FaqList from '@/pages/help/FAQ/FAQWrapper/_components/FaqList';

function FAQWrapper({ loadFaqInProcess, loadFaqFromApi, activeTitle }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: `${activeTitle}` || 'FAQ',
      }}
      shownBanners
    >
      <SiteWrapperLayout>
        <Preloader isShown={loadFaqInProcess} opacity={1} />
        {loadFaqFromApi && <FaqList />}
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  loadFaqInProcess: state.FaqReducer.loadFaqInProcess,
  loadFaqFromApi: state.FaqReducer.loadFaqFromApi,
  activeTitle: state.FaqReducer.activeTitle,
}))(FAQWrapper);
