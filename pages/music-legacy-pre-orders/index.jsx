import { useEffect } from 'react';

import { connect } from 'react-redux';

import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';
import { PopupProjectIdsConstants } from '@/js/constants/popups/id';
import { showPopupAction } from '@/js/redux/actions/components/popupActions';
import ProjectsWrapper from '@/pages/projects/ProjectsWrapper';
import { SSRGetProjectsWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';

function ProjectsPage({ showPopup }) {
  useEffect(() => showPopup(PopupProjectIdsConstants.HowPreOrderWorksPopup), []);

  return <ProjectsWrapper />;
}

ProjectsPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetProjectsWithCookie({
      ctx,
      location: ProjectsLocationsConstants.PROJECTS,
      reducerName: ProjectsReducersConstants.DefaultProjectsReducer,
      withoutLoadedFromApi: true,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

const connector = connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
);

export default connector(ProjectsPage);
