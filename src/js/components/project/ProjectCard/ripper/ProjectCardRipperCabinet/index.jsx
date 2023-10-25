import { Component } from 'react';

import { connect } from 'react-redux';

import RipperCabinetReceivedByRipper from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetReceivedByRipper';
import RipperCabinetRipPending from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetRipPending';
import RipperCabinetSave from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetSave';
import RipperCabinetSendMedia from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetSendMedia';
import RipperCabinetShipped from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetShipped';
import RipperCabinetStatus from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet/_components/RipperCabinetStatus';
import RipperCabinetFilesTable from '@/components/tables/RipperCabinetFilesTable';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

import styles from './styles.module.scss';

class ProjectCardRipperCabinet extends Component {
  uploadedDocuments = () => {
    const { projectId, projectCards } = this.props;
    const projectCard = (projectCards[0] || {})[projectId] || {};
    const { documents = [] } = projectCard;

    return documents.filter(({ fileBlob }) => !!fileBlob) || [];
  };

  uploadedAdditionalExpenses = () => {
    const { projectId, projectCards } = this.props;
    const projectCard = (projectCards[0] || {})[projectId] || {};
    const { expenses = [] } = projectCard;

    return expenses.filter(({ filesBlob = [] }) => filesBlob.length > 0) || [];
  };

  disableSave = () => this.uploadedDocuments().length === 0;

  ripperStatusesContent = () => {
    const {
      projectId,
      projectTitle,
      projectCovers,
      status: { name: statusName } = {},
      conditions = {},
      realConditions = {},

      projectCards = [],

      shippingInfo,
      filesProps,
    } = this.props;

    const projectCard = (projectCards[0] || {})[projectId] || {};
    const { documents = [], expenses = [] } = projectCard;

    const canUpload =
      !projectsStatusesUtil.isDraftStatus(statusName) &&
      !projectsStatusesUtil.isClosedStatus(statusName) &&
      !projectsStatusesUtil.isInModerationStatus(statusName) &&
      !projectsStatusesUtil.isRejectedStatus(statusName);

    if (projectsStatusesUtil.isShippedStatus(statusName) || projectsStatusesUtil.isInTransitStatus(statusName)) {
      return (
        <RipperCabinetShipped
          projectId={projectId}
          projectTitle={projectTitle}
          projectCovers={projectCovers}
          conditions={conditions}
          realConditions={realConditions}
          documents={documents}
          expenses={expenses}
          uploadedDocuments={this.uploadedDocuments()}
          uploadedExpenses={this.uploadedAdditionalExpenses()}
          statusName={statusName}
          withExpenses={projectsStatusesUtil.isShippedStatus(statusName)}
          filesProps={filesProps}
        />
      );
    }

    if (projectsStatusesUtil.isReceivedByRipperStatus(statusName)) {
      return (
        <RipperCabinetReceivedByRipper
          projectId={projectId}
          projectTitle={projectTitle}
          projectCovers={projectCovers}
          documents={documents}
          expenses={expenses}
          uploadedDocuments={this.uploadedDocuments()}
          uploadedExpenses={this.uploadedAdditionalExpenses()}
          statusName={statusName}
          filesProps={filesProps}
          conditions={conditions}
          realConditions={realConditions}
        />
      );
    }

    if (projectsStatusesUtil.isRipPendingStatus(statusName)) {
      return (
        <RipperCabinetRipPending
          projectId={projectId}
          projectTitle={projectTitle}
          projectCovers={projectCovers}
          documents={documents}
          uploadedDocuments={this.uploadedDocuments()}
          statusName={statusName}
          filesProps={filesProps}
        />
      );
    }

    if (projectsStatusesUtil.isSoldStatus(statusName) || projectsStatusesUtil.isRefundPendingStatus(statusName)) {
      return (
        <RipperCabinetSendMedia
          projectId={projectId}
          projectTitle={projectTitle}
          projectCovers={projectCovers}
          documents={documents}
          uploadedDocuments={this.uploadedDocuments()}
          statusName={statusName}
          shippingInfo={shippingInfo}
          filesProps={filesProps}
        />
      );
    }

    return (
      <>
        <RipperCabinetFilesTable projectId={projectId} documents={documents} filesProps={filesProps} canUpload={canUpload} />
        {canUpload && (
          <RipperCabinetSave
            projectId={projectId}
            projectTitle={projectTitle}
            projectCovers={projectCovers}
            disabled={this.disableSave()}
            statusName={statusName}
            uploadedDocuments={this.uploadedDocuments()}
            uploadedExpenses={this.uploadedAdditionalExpenses()}
            filesProps={filesProps}
          />
        )}
      </>
    );
  };

  render() {
    const { status: { name: statusName } = {} } = this.props;

    return (
      <div className={styles.ripperCabinet}>
        <RipperCabinetStatus status={statusName} />
        {this.ripperStatusesContent()}
      </div>
    );
  }
}

export default connect((state) => ({
  projectCards: state.ProjectCardReducer.projectCards,
}))(ProjectCardRipperCabinet);
