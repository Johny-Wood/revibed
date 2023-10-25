import { useEffect, useMemo, useState } from 'react';

import { connect } from 'react-redux';

import WantListImportForm from '@/components/forms/wantList/import/WantListImportForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import WantlistImportInProcess from '@/components/wantList/import/WantlistImportInProcess';
import WantListImportInstruction from '@/components/wantList/import/WantListImportInstruction';
import { RoutePathsConstants } from '@/constants/routes/routes';
import WantListImportStatusConstants from '@/constants/wantList/status';
import NextRouter from '@/services/NextRouter';

const TITLE = 'Add New Wantlist';
const TOOL_TIP_TEXT =
  'Add your wantlist to&nbsp;track releases. The number of&nbsp;releases you can track is&nbsp;reflected in&nbsp;your subscription Plan';

function AddWantListPageWrapper({ userIsAuthorized, wantListInfo: { status: wantListStatus } = {} }) {
  const [importByDiscogs, setImportByDiscogs] = useState(false);

  useEffect(() => {
    const {
      router,

      router: { query },
    } = NextRouter.getInstance();
    const { importByDiscogs: importByDiscogsQuery } = query;

    if (importByDiscogsQuery) {
      setImportByDiscogs(importByDiscogsQuery);

      if (importByDiscogsQuery) {
        router.replace(RoutePathsConstants.WANTLIST_ADD);
      }
    }
  }, []);

  const renderStatus = () => {
    if (wantListStatus === WantListImportStatusConstants.PENDING) {
      return <WantlistImportInProcess />;
    }

    if (
      !userIsAuthorized ||
      wantListStatus === WantListImportStatusConstants.ACTIVE ||
      wantListStatus === WantListImportStatusConstants.NOT_FOUND
    ) {
      return (
        <>
          <WantListImportInstruction />
          <WantListImportForm
            title={TITLE}
            tooltipText={TOOL_TIP_TEXT}
            importByDiscogs={importByDiscogs}
            callbackImport={() => {
              setImportByDiscogs(false);
            }}
          />
        </>
      );
    }

    return null;
  };

  const isPendingStatus = useMemo(() => wantListStatus === WantListImportStatusConstants.PENDING, [wantListStatus]);

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      pageName="wantlist"
      shownBanners
    >
      <PersonalPageLayout
        headerText={isPendingStatus ? TITLE : ''}
        tooltip={{
          text: TOOL_TIP_TEXT,
        }}
        withPersonalTabsNavigation={false}
        withDashboard={false}
        withProfileBar={false}
        withSideBar={false}
      >
        {renderStatus()}
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  wantListInfo: state.WantListReducer.wantListInfo,
  getWantListInfoInProcess: state.WantListReducer.getWantListInfoInProcess,
}))(AddWantListPageWrapper);
