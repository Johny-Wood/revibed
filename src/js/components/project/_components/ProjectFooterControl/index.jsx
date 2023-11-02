import { useMemo } from 'react';

import classNames from 'classnames';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import ProjectBuyCut from '@/components/projects/Project/_components/buttons/ProjectBuyCut';
import ProjectCutSize from '@/components/projects/Project/_components/ProjectCutSize';
import { projectParticipationInfoUtil } from '@/utils/project/projectParticipationInfoUtil';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

const ProjectFooterControl = ({
  canBeLateEntryStatus,
  projectInfo: {
    id,
    title,
    goodsId,
    status: { name: statusName = {} } = {},
    lateEntryStatus: { name: lateEntryStatusName } = {},
    requestedUserInfo,
    priceCut,
    cutsCount,
    minCutsCount = 1,
    totalCutsCount,
    freeBonuses,
    lateEntryInfo,
  } = {},
  withCutSize = true,
  cutSizeClassName,
}) => {
  const participationContributor = projectParticipationInfoUtil(requestedUserInfo);

  const isOpenStatus = projectsStatusesUtil.isOpenStatus(statusName);
  const isLastCallStatus = projectsStatusesUtil.isLastCallStatus(statusName);
  const isLegacyStatus = projectsStatusesUtil.isLegacyStatus(statusName);
  const isDraftStatus = projectsStatusesUtil.isDraftStatus(statusName);
  const isInModerationStatus = projectsStatusesUtil.isInModerationStatus(statusName);
  const isRejectedStatus = projectsStatusesUtil.isRejectedStatus(statusName);
  const isLateEntryStatus = canBeLateEntryStatus && projectsStatusesUtil.isLateEntryStatus(lateEntryStatusName);

  const isActiveProject = isOpenStatus || isLastCallStatus;

  const minCuts = useMemo(
    () => (participationContributor ? 1 : Math.max(Math.min(minCutsCount, totalCutsCount - cutsCount), 1)),
    [cutsCount, minCutsCount, participationContributor, totalCutsCount]
  );

  return (
    <>
      <TransitionLayout
        isShown={
          !isLegacyStatus &&
          ((isActiveProject && !participationContributor) || !isActiveProject) &&
          !isDraftStatus &&
          !isInModerationStatus &&
          !isRejectedStatus &&
          withCutSize
        }
      >
        <ProjectCutSize className={classNames(cutSizeClassName)} size={minCuts * priceCut} count={minCuts} />
      </TransitionLayout>
      <TransitionLayout isShown={isOpenStatus || isLastCallStatus || isLateEntryStatus || isLegacyStatus}>
        <ProjectBuyCut
          goodsId={goodsId}
          isLegacyStatus={isLegacyStatus}
          canBeLateEntryStatus={canBeLateEntryStatus}
          projectId={id}
          title={title}
          participationContributor={participationContributor}
          isLateEntryStatus={isLateEntryStatus}
          freeBonuses={!isLateEntryStatus ? freeBonuses : lateEntryInfo}
          lateEntryInfo={lateEntryInfo}
          withRoute
        />
      </TransitionLayout>
    </>
  );
};

export default ProjectFooterControl;
