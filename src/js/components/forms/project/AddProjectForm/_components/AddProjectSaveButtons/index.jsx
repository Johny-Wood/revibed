import { useCallback } from 'react';

import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { ProjectStatusesConstants } from '@/constants/projects/status';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { UseHistory } from '@/contexts/history/History';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { createProjectRequestAction, editProjectRequestAction } from '@/redux-actions/create-project/createProjectActions';
import NextRouter from '@/services/NextRouter';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

function AddProjectSaveButtons({
  status,
  disabledPublishButton,
  disabledDraftButton,

  projectId,
  isProjectEdit,

  cutPrice,
  founderStartCutsCount,

  createFormData,
  requestCatch,
  changeStatus,

  createProjectInProcess,
  editProjectInProcess,

  createProjectRequest,
  editProjectRequest,
  showPopup,
}) {
  const { setActiveScrollPosition } = UseHistory();

  const redirect = useCallback(
    ({ callback }) => {
      const { router = {} } = NextRouter.getInstance();

      if (isProjectEdit) {
        setActiveScrollPosition({
          route: RoutePathsConstants.MY_PROJECTS,
          isActive: true,
        });
      }

      router.push(RoutePathsConstants.MY_PROJECTS).then(() => {
        if (!callback) {
          return;
        }
        callback();
      });
    },
    [isProjectEdit, setActiveScrollPosition]
  );

  const onCreateProjectRequest = useCallback(
    (currentStatus = ProjectStatusesConstants.OPEN, isToDraft = false) => {
      const formData = createFormData(currentStatus);

      changeStatus({ status: currentStatus });

      createProjectRequest({
        formData,
        id: projectId,
        status: currentStatus,
        projectPriceCut: cutPrice,
        cutsCount: +founderStartCutsCount,
        isToDraft,
      })
        .then(() => {
          const isDraftStatus = projectsStatusesUtil.isDraftStatus(currentStatus);

          changeStatus({ status: undefined });

          redirect({
            callback: () => {
              if (isDraftStatus) {
                showPopup(PopupProjectIdsConstants.EditDraftProjectSuccessPopup);
              } else {
                showPopup(PopupProjectIdsConstants.PublishProjectSuccessPopup);
              }
            },
          });
        })
        .catch(({ error, data: errorData, payload: { errorField, projectLink } = {} }) => {
          requestCatch({ error, errorData, errorField, link: projectLink });
        });
    },
    [
      changeStatus,
      createFormData,
      createProjectRequest,
      cutPrice,
      founderStartCutsCount,
      projectId,
      redirect,
      requestCatch,
      showPopup,
    ]
  );

  const onEditProjectRequest = useCallback(
    (currentStatus = ProjectStatusesConstants.DRAFT, isToDraft = false) => {
      const formData = createFormData(currentStatus);

      changeStatus({ status });

      editProjectRequest({
        formData,
        id: projectId,
        status: currentStatus,
        projectPriceCut: cutPrice,
        cutsCount: +founderStartCutsCount,
        isToDraft,
      })
        .then(() => {
          const isDraftStatus = projectsStatusesUtil.isDraftStatus(currentStatus);

          changeStatus({ status: undefined });

          redirect({
            callback: () => {
              if (isDraftStatus) {
                showPopup(PopupProjectIdsConstants.EditDraftProjectSuccessPopup);
              } else {
                showPopup(PopupProjectIdsConstants.PublishProjectSuccessPopup);
              }
            },
          });
        })
        .catch(({ error, data: errorData, payload: { errorField, projectLink } = {} }) => {
          requestCatch({ error, errorData, errorField, link: projectLink });
        });
    },
    [
      changeStatus,
      createFormData,
      cutPrice,
      editProjectRequest,
      founderStartCutsCount,
      projectId,
      redirect,
      requestCatch,
      showPopup,
      status,
    ]
  );

  return (
    <>
      <Button
        className="button_place_project"
        text="Place your project"
        isInProcess={(createProjectInProcess || editProjectInProcess) && projectsStatusesUtil.isOpenStatus(status)}
        disabled={disabledPublishButton()}
        onClick={() =>
          !isProjectEdit
            ? onCreateProjectRequest(ProjectStatusesConstants.OPEN)
            : onEditProjectRequest(ProjectStatusesConstants.OPEN)
        }
      />
      <Button
        text="Save Draft"
        transparent
        className="button_save_draft"
        borderColor="gray-4"
        isInProcess={(createProjectInProcess || editProjectInProcess) && projectsStatusesUtil.isDraftStatus(status)}
        disabled={disabledDraftButton()}
        onClick={() =>
          !isProjectEdit
            ? onCreateProjectRequest(ProjectStatusesConstants.DRAFT, true)
            : onEditProjectRequest(ProjectStatusesConstants.DRAFT, true)
        }
      />
    </>
  );
}

export default connect(
  (state) => ({
    createProjectInProcess: state.CreateProjectReducer.createProjectInProcess,
    editProjectInProcess: state.CreateProjectReducer.editProjectInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    createProjectRequest: (params) => createProjectRequestAction(params)(dispatch),
    editProjectRequest: (params) => editProjectRequestAction(params)(dispatch),
  })
)(AddProjectSaveButtons);
