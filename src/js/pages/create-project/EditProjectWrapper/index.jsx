import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import AddProjectForm from '@/components/forms/project/AddProjectForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import Preloader from '@/components/ui/Preloader';
import { CommonHeadConstants } from '@/constants/common/head';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function EditProjectWrapper({ projectCards, getProjectCardInProcess }) {
  const router = useRouter();
  const { projectCardId } = router.query;

  const [projects] = projectCards || {};
  const project = projects[projectCardId];

  const pageTitle = `Edit ${CommonHeadConstants.SITE_NAME} Pre-order`;

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Edit Pre-order',
      }}
      shownBanners
    >
      <PersonalPageLayout withSideBar={false} withPersonalTabsNavigation={false}>
        <Preloader id="project-edit" isShown={getProjectCardInProcess} type="container" duration={400} />
        {project && !getProjectCardInProcess && (
          <AddProjectForm project={project || {}} isProjectEdit projectId={projectCardId} pageTitle={pageTitle} />
        )}
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  projectCards: state.ProjectCardReducer.projectCards,
  getProjectCardInProcess: state.ProjectCardReducer.getProjectCardInProcess,
}))(withPrivateAuthRoute(EditProjectWrapper));
