import { useMemo } from 'react';

import { useRouter } from 'next/router';

import AddProjectForm from '@/components/forms/project/AddProjectForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import { CommonMessagesConstants } from '@/constants/common/message';

function CreateProjectPageWrapper() {
  const router = useRouter();
  const { itemId, restartProjectId } = router.query;
  const pageTitle = useMemo(() => `Create ${CommonMessagesConstants.PREORDER}`, []);

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'To add a new pre-order, fill in the form',
      }}
      shownBanners
    >
      <PersonalPageLayout withSideBar={false} withPersonalTabsNavigation={false}>
        <AddProjectForm itemId={itemId} restartProjectId={restartProjectId} pageTitle={pageTitle} />
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default CreateProjectPageWrapper;
