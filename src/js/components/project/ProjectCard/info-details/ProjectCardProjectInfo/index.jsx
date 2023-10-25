import { Component } from 'react';

import ProjectCardDiscogsDetails from '@/components/project/ProjectCard/info-details/ProjectCardDiscogsDetails';
import ProjectCardItemDetails from '@/components/project/ProjectCard/info-details/ProjectCardItemDetails';
import ProjectCardReleaseDetails from '@/components/project/ProjectCard/info-details/ProjectCardReleaseDetails';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

import styles from './styles.module.scss';

class ProjectCardProjectInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderProjectCardReleaseDetails = () => {
    const { projectCard: { releaseDetails } = {} } = this.props;

    return (
      <ProjectCardReleaseDetails
        releaseDetails={releaseDetails}
        title="Release details"
        items={['label', 'genres', 'styles', 'country', 'year', 'format']}
      />
    );
  };

  renderProjectCardDiscogsDetails = () => {
    const { projectCard: { releaseDetails: { discogsDetails = {} } = {} } = {} } = this.props;

    return <ProjectCardDiscogsDetails discogsDetails={discogsDetails} />;
  };

  renderProjectCardItemDetails = () => {
    const { projectCard: { shippingFrom, shippingFrom: { titleDiscogs } = {}, sleeveCondition, mediaCondition } = {} } =
      this.props;

    return (
      <ProjectCardItemDetails
        shippingFrom={shippingFrom}
        titleDiscogs={titleDiscogs}
        sleeveCondition={sleeveCondition}
        mediaCondition={mediaCondition}
      />
    );
  };

  render() {
    const { projectCard: { status: { name } = {} } = {} } = this.props;

    return (
      <div className={styles.projectCardProjectInfo}>
        {!projectsStatusesUtil.isLegacyStatus(name) && this.renderProjectCardItemDetails()}
        {this.renderProjectCardReleaseDetails()}
        {this.renderProjectCardDiscogsDetails()}
      </div>
    );
  }
}

export default ProjectCardProjectInfo;
