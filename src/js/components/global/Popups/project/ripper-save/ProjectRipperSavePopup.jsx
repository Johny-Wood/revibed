import { Component } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import Cover from '@/components/common/Cover';
import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import ProjectNames from '@/components/projects/Project/_components/ProjectNames';
import LinkDefault from '@/components/ui/links/LinkDefault';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { PopupFileConstants, PopupProjectIdsConstants } from '@/constants/popups/id';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { addProjectCardRipperInfoRequestAction } from '@/redux-actions/project/projectRipperActions';
import ScrollService from '@/services/scroll/ScrollService';
import { handleErrorUtil } from '@/utils/apiUtils';
import { appendFormUtil } from '@/utils/form/formUtils';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';
import { textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

class ProjectRipperSavePopup extends Component {
  disableAddProjectCardRipperInfo = () => {
    const { addProjectCardRipperInfoInProcess } = this.props;

    return addProjectCardRipperInfoInProcess;
  };

  buildFormFields = () => {
    const {
      popupData: {
        changeStatus,
        realMediaCondition: { id: realMediaConditionId } = {},
        realSleeveCondition: { id: realSleeveConditionId } = {},
        comment,
        realConditionComment,
        uploadedDocuments = [],
        uploadedExpenses = [],
        ripLink,
        ripComment,
      } = {},
    } = this.props;

    const fieldsForm = [];

    if (changeStatus) {
      fieldsForm.push({
        name: 'changeStatus',
        value: true,
      });
    }

    if (realMediaConditionId) {
      fieldsForm.push({
        name: 'realCondition.media',
        value: realMediaConditionId,
      });
    }

    if (realConditionComment) {
      fieldsForm.push({
        name: 'realCondition.comment',
        value: realConditionComment,
      });
    }

    if (realSleeveConditionId) {
      fieldsForm.push({
        name: 'realCondition.sleeve',
        value: realSleeveConditionId,
      });
    }

    if (comment) {
      fieldsForm.push({
        name: 'comment',
        value: comment,
      });
    }

    if (ripLink) {
      fieldsForm.push({
        name: 'ripLink',
        value: ripLink,
      });
    }

    if (ripComment) {
      fieldsForm.push({
        name: 'ripComment',
        value: ripComment,
      });
    }

    uploadedDocuments.forEach(({ comment: commentFile, fileBlob: { file } = {} }, idx) => {
      fieldsForm.push({
        name: `attachments[${idx}].comment`,
        value: commentFile,
      });

      fieldsForm.push({
        name: `attachments[${idx}].file`,
        value: file,
      });
    });

    uploadedExpenses.forEach(({ sum, comment: commentFiles, filesBlob = [] }, idx) => {
      fieldsForm.push({
        name: `expenses[${idx}].sum`,
        value: sum,
      });

      fieldsForm.push({
        name: `expenses[${idx}].comment`,
        value: commentFiles,
      });

      filesBlob.forEach(({ file }, fileIdx) => {
        fieldsForm.push({
          name: `expenses[${idx}].files[${fileIdx}]`,
          value: file,
        });
      });
    });

    return fieldsForm;
  };

  addProjectCardRipperInfo = () =>
    new Promise((resolve, reject) => {
      const {
        popupId = PopupProjectIdsConstants.ProjectRipperSavePopup,
        popupData: { projectId, badRequest, filesProps } = {},
        addProjectCardRipperInfoRequest,
        showMessage,
        closePopup,
        showPopup,
      } = this.props;

      if (this.disableAddProjectCardRipperInfo()) {
        reject();

        return;
      }

      const formData = appendFormUtil({ fieldsForm: this.buildFormFields() });

      addProjectCardRipperInfoRequest(projectId, formData)
        .then(() => {
          closePopup(popupId);

          ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTop({
            sectionId: ScrollBlockIdConstants.PROJECT_CARD,
            behavior: 1,
            callback: () => {
              showMessage('SuccessMessage', {
                messageText: 'Information saved successfully',
              });
            },
          });

          resolve();
        })
        .catch(({ error, payload: { errorField } = {} }) => {
          closePopup(popupId);

          if (error) {
            handleErrorUtil(error, {
              BAD_REQUEST: () => {
                badRequest(errorField);
              },
              FILE_INVALID_MIME_TYPE: () => {
                showPopup(PopupFileConstants.FileInvalidMimeTypePopup, { ...filesProps });
              },
              FILE_INVALID_SIZE: () => {
                showPopup(PopupFileConstants.FileInvalidSizePopup, { ...filesProps });
              },
            });
          }

          reject();
        });
    });

  renderInfo = () => {
    const {
      popupData: {
        statusName,
        realMediaCondition: { label: realMediaConditionTitle } = {},
        realSleeveCondition: { label: realSleeveConditionTitle } = {},
        uploadedDocuments = [],
        uploadedExpenses = [],
        ripLink = '',
      } = {},
    } = this.props;

    if (
      (projectsStatusesUtil.isShippedStatus(statusName) ||
        projectsStatusesUtil.isInTransitStatus(statusName) ||
        projectsStatusesUtil.isReceivedByRipperStatus(statusName)) &&
      realMediaConditionTitle &&
      realSleeveConditionTitle
    ) {
      return (
        <div className={classNames('t-center', styles.projectConditions)}>
          <div className={styles.projectConditions__item}>
            <b className={styles.projectConditions__description}>Factual media:</b>
            <div>{realMediaConditionTitle}</div>
          </div>
          <div className={styles.projectConditions__item}>
            <b className={styles.projectConditions__description}>Factual sleeve:</b>
            <div>{realSleeveConditionTitle}</div>
          </div>
        </div>
      );
    }

    if (projectsStatusesUtil.isRipPendingStatus(statusName)) {
      return (
        <div className="w-100pct">
          Are you sure you want to send the link on rip to admin:&nbsp;
          <LinkDefault href={ripLink} className={classNames('c-blue t-bold', globalStyles.breakWord)} text={ripLink} />?
        </div>
      );
    }

    if (projectsStatusesUtil.isSoldStatus(statusName) || projectsStatusesUtil.isRefundPendingStatus(statusName)) {
      return <div className="w-100pct">Are you sure the media is sent?</div>;
    }

    const isUploadedDocuments = uploadedDocuments.length > 0;
    const isUploadedExpenses = uploadedExpenses.length > 0;

    return (
      <div className="w-100pct">
        {(isUploadedDocuments || isUploadedExpenses) && (
          <p>
            Are you sure you want to&nbsp;
            {isUploadedDocuments &&
              parse(
                `upload&nbsp;<b>${uploadedDocuments.length}</b>&nbsp;${textForLotsOfUtil(uploadedDocuments.length, [
                  'file',
                  'files',
                ])}`
              )}
            {isUploadedDocuments && isUploadedExpenses && <>&nbsp;and&nbsp;</>}
            {isUploadedExpenses &&
              parse(
                `add&nbsp;<b>${uploadedExpenses.length}</b>&nbsp;${textForLotsOfUtil(uploadedExpenses.length, [
                  'expense',
                  'expenses',
                ])}`
              )}
            ?
          </p>
        )}
      </div>
    );
  };

  render() {
    const {
      popupId = PopupProjectIdsConstants.ProjectRipperSavePopup,
      popupData: { projectTitle: { albumTitle, artists, title } = {}, projectCovers = [] } = {},

      addProjectCardRipperInfoInProcess,
      closePopup,
    } = this.props;

    return (
      <Popup
        popupId={popupId}
        maxWidth={425}
        textAlign="center"
        headerText="Confirm action"
        classCustom={styles.ProjectRipperSavePopup}
      >
        {this.renderInfo()}
        <div className={styles.projectInformation}>
          <Cover
            covers={projectCovers}
            isNoCover={projectCovers.length <= 0}
            withImageLiteBox={false}
            isDefault
            className={styles.projectCover}
            containerClassName={styles.projectCoverContainer}
            size={50}
          />
          <ProjectNames
            title={title}
            artists={artists}
            albumTitle={albumTitle}
            isRoute={false}
            className={styles.projectNames}
            titleClassName={styles.projectNames__title}
            albumClassName={styles.projectNames__album__title}
          />
        </div>
        <PopupDoubleButtons
          popupId={popupId}
          closePopup={closePopup}
          okButtonText={CommonMessagesConstants.SAVE}
          okButtonDisables={this.disableAddProjectCardRipperInfo()}
          okButtonInProcess={addProjectCardRipperInfoInProcess}
          okButtonOnClick={this.addProjectCardRipperInfo}
        />
      </Popup>
    );
  }
}

export default connect(
  (state) => ({
    projectCards: state.ProjectCardReducer.projectCards,
    addProjectCardRipperInfoInProcess: state.ProjectRipperReducer.addProjectCardRipperInfoInProcess,
  }),
  (dispatch) => ({
    addProjectCardRipperInfoRequest: (id, form) => addProjectCardRipperInfoRequestAction(id, form)(dispatch),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
  })
)(ProjectRipperSavePopup);
