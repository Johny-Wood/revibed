import { useMemo } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { UserAuthorized } from '@/components/layouts/AuthLayouts';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import PrivateLabel from '@/components/project/_components/PrivateLabel';
import ProjectFooterControl from '@/components/project/_components/ProjectFooterControl';
import ProjectContributorCount from '@/components/projects/Project/_components/ProjectContributorCount';
import ProjectCover from '@/components/projects/Project/_components/ProjectCover';
import ProjectDiscogsLink from '@/components/projects/Project/_components/ProjectDiscogsLink';
import ProjectFormats from '@/components/projects/Project/_components/ProjectFormats';
import ProjectNames from '@/components/projects/Project/_components/ProjectNames';
import ProjectPriceDetails from '@/components/projects/Project/_components/ProjectPriceDetails';
import ProjectProcess from '@/components/projects/Project/_components/ProjectProcess';
import ProjectShareButton from '@/components/projects/Project/_components/ProjectShareButton';
import ProjectStatus from '@/components/projects/Project/_components/ProjectStatus';
import ProjectTags from '@/components/projects/Project/_components/ProjectTags';
import ProjectTime from '@/components/projects/Project/_components/ProjectTime';
import LinkDefault from '@/components/ui/links/LinkDefault';
import ToolTip from '@/components/ui/ToolTip';
import ComponentsCommonConstants from '@/constants/components/common';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const renderBuyOnDiscogs = ({ marketplaceLinkSell, priceSell }) => {
  if (!marketplaceLinkSell) {
    return null;
  }

  return (
    <>
      <LinkDefault underline text="Buy" href={marketplaceLinkSell} transparent />
      <span className="t-size_22 t-semi-bold">
        {floatWithCommaFixedUtil(priceSell)}
        &nbsp;&euro;
      </span>
    </>
  );
};

const renderSoldPrice = ({ priceSell }) => (
  <>
    <span className="c-gray-3 m-right-5 p-bottom-2">Sold for</span>
    <span className="t-size_22 t-semi-bold">
      {floatWithCommaFixedUtil(priceSell)}
      &nbsp;&euro;
    </span>
  </>
);

const renderTooltip = ({ status: { name: statusName } = {}, isNotDesktop, text }) => {
  if (!projectsStatusesUtil.isLegacyStatus(statusName)) {
    return null;
  }

  return <ToolTip text={text} width={260} position={isNotDesktop ? 'Y' : undefined} />;
};

const renderNames = ({ title, artists, albumTitle }) => (
  <ProjectNames
    className={styles.projectNames}
    titlesClassName={styles.projectNames__titles}
    titleClassName={styles.projectNames__title}
    albumClassName={styles.projectNames__album__title}
    title={title}
    artists={artists}
    albumTitle={albumTitle}
    isRoute={false}
    isInline
    titleTagNumber={1}
  />
);

const renderPrivateLabel = ({ isPrivate }) => <PrivateLabel className={styles.privateLabel} isShown={isPrivate} />;

const renderShare = ({ status }) => <ProjectShareButton status={status} />;

const renderProjectActionLabels = ({ isPrivate, status }) => (
  <div className={styles.projectCard__actions}>
    {renderPrivateLabel({ isPrivate })}
    {renderShare({ status })}
  </div>
);

const renderProjectStatusInfo = ({
  isNotDesktop,
  isPrivate,
  projectInfo = {},
  projectInfo: { status } = {},
  isLateEntryStatus,
  isComingSoonStatus,
}) => {
  let tooltipText =
    "Currently not funding. To&nbsp;start a&nbsp;new Kollektiv, select an&nbsp;item then tap 'start&nbsp;project'.";

  if (isLateEntryStatus) {
    tooltipText =
      'A&nbsp;unique opportunity to&nbsp;enter an&nbsp;already completed project with a&nbsp;Golden Koin or&nbsp;gem. Limited to&nbsp;maximum 3&nbsp;users.';
  } else if (isComingSoonStatus) {
    tooltipText =
      'Record received. After digitization, a&nbsp;limited number of&nbsp;eligible users with a&nbsp;Golden Koin or&nbsp;gem can still enter the project.';
  }

  return (
    <div className={styles.projectCard__statusInfo}>
      <ProjectStatus projectInfo={projectInfo} />
      {isNotDesktop && renderPrivateLabel({ isPrivate })}
      {!!tooltipText && renderTooltip({ status, isNotDesktop, text: tooltipText })}
    </div>
  );
};

function ProjectCardInfo({
  projectCardInfo: projectInfo,
  projectCardInfo: {
    id,
    title,
    artists,
    albumTitle,
    covers,
    discogsLink,
    status,
    status: { name: statusName = {} } = {},
    cutsCount,
    totalCutsCount,
    priceSell,
    marketplaceLinkSell,
    isPrivate,
    priceInfo,
    estimatedPriceInfo,
    tags = [],
    releaseDetails: { formats = [] } = {},
    startDate,
    closeDate,
    lateEntryStatus: { name: lateEntryStatusName } = {},
  } = {},

  userIsAuthorized,
}) {
  const { isNotDesktop, isTablet } = ViewportHook();

  const isOpenStatus = useMemo(() => projectsStatusesUtil.isOpenStatus(statusName), [statusName]);

  const isLastCallStatus = useMemo(() => projectsStatusesUtil.isLastCallStatus(statusName), [statusName]);

  const isLegacyStatus = useMemo(() => projectsStatusesUtil.isLegacyStatus(statusName), [statusName]);

  const isListedStatus = useMemo(() => projectsStatusesUtil.isListedStatus(statusName), [statusName]);
  const isSoldStatus = useMemo(() => projectsStatusesUtil.isSoldStatus(statusName), [statusName]);

  const isCreatedProject = useMemo(
    () =>
      !projectsStatusesUtil.isDraftStatus(statusName) &&
      !projectsStatusesUtil.isInModerationStatus(statusName) &&
      !projectsStatusesUtil.isRejectedStatus(statusName),
    [statusName]
  );

  const canBeLateEntryStatus = useMemo(
    () => projectsStatusesUtil.canBeLateEntryStatus(projectInfo, { userIsAuthorized }),
    [projectInfo, userIsAuthorized]
  );

  const isLateEntryStatus = useMemo(
    () => canBeLateEntryStatus && projectsStatusesUtil.isLateEntryStatus(lateEntryStatusName),
    [canBeLateEntryStatus, lateEntryStatusName]
  );

  const isComingSoonStatus = useMemo(
    () => canBeLateEntryStatus && projectsStatusesUtil.isComingSoonStatus(lateEntryStatusName),
    [canBeLateEntryStatus, lateEntryStatusName]
  );

  return (
    <div className={styles.projectCard__card}>
      <div className={styles.projectCard__info}>
        <DesktopLayout>{renderProjectActionLabels({ isPrivate, status })}</DesktopLayout>
        <MobileLayout>
          <div className="f-y-center m-bottom-5 w-100pct">
            {renderProjectStatusInfo({
              isNotDesktop,
              isPrivate,
              projectInfo,
              isLateEntryStatus,
              isComingSoonStatus,
            })}
          </div>
          {renderNames({ title, artists, albumTitle })}
        </MobileLayout>
        <ProjectCover
          className={styles.projectCover}
          containerClassName={styles.projectCoverContainer}
          covers={covers}
          withImageLiteBox={covers && covers.length > 0}
          isDefault={!covers || !covers.length > 0}
          projectInfo={{
            id,
            projectId: id,
            albumTitle,
            artists,
            title,
          }}
          size={150}
        />
        <div className="f-x-start f_direction_column w-100pct">
          <DesktopLayout>
            {renderProjectStatusInfo({
              isNotDesktop,
              isPrivate,
              projectInfo,
              isLateEntryStatus,
              isComingSoonStatus,
            })}
            {renderNames({ title, artists, albumTitle })}
          </DesktopLayout>
          <div className={styles.projectCard__carrier}>
            {formats.length > 0 && (
              <span className={styles.projectCard__formats}>
                <ProjectFormats items={formats} />
              </span>
            )}
            <ProjectDiscogsLink link={discogsLink} className={styles.discogsLink} />
          </div>
          {tags.length > 0 && <ProjectTags className={styles.projectTags} tags={tags} widthTooltip={400} />}
        </div>
      </div>
      <div className={styles.projectCard__footer}>
        <div className={classNames(styles.projectCard__cuts, 'f-y-start', isLegacyStatus && 'o-50')}>
          <div className={styles.projectCard__balanceInfo}>
            <ProjectContributorCount
              totalCount={totalCutsCount}
              cutsCount={cutsCount}
              className={classNames(isLegacyStatus && 'o-50')}
            />
            <UserAuthorized>
              <TransitionLayout isShown={isCreatedProject && !isLegacyStatus}>
                <ToolTip size={ComponentsCommonConstants.Size.NORMAL} borderRadius={false} position={isTablet && 'right'}>
                  <ProjectPriceDetails priceInfo={priceInfo} estimatedPriceInfo={estimatedPriceInfo} />
                </ToolTip>
              </TransitionLayout>
            </UserAuthorized>
          </div>
          <ProjectTime
            className={styles.projectTime}
            isLastCallStatus={isLastCallStatus}
            isOpenStatus={isOpenStatus}
            startDate={startDate}
            closeDate={closeDate}
          />
        </div>
        {!!totalCutsCount && (
          <ProjectProcess
            className={styles.projectProcess}
            cutsCount={cutsCount}
            totalCutsCount={totalCutsCount}
            statusName={statusName}
          />
        )}
        <TransitionLayout isShown={isCreatedProject}>
          <div className={classNames(styles.projectCard__control, 'f-y-start')}>
            <div
              className={classNames([
                styles.projectCard__join,
                'f-y-center f-x-end',
                (isOpenStatus || isLastCallStatus || isLegacyStatus) && styles.projectCard__buy_fixed,
              ])}
            >
              <ProjectFooterControl
                projectInfo={projectInfo}
                canBeLateEntryStatus={canBeLateEntryStatus}
                cutSizeClassName={styles.projectCutSize}
              />
            </div>
            <MobileLayout>
              <>{renderShare({ status })}</>
            </MobileLayout>
            <TransitionLayout isShown={isListedStatus}>
              <div className={styles.projectCard__buyOnDiscogs}>
                {renderBuyOnDiscogs({
                  marketplaceLinkSell,
                  priceSell,
                })}
              </div>
            </TransitionLayout>
            <TransitionLayout isShown={isSoldStatus}>
              <div className={styles.projectCard__buyOnDiscogs}>{renderSoldPrice({ priceSell })}</div>
            </TransitionLayout>
          </div>
        </TransitionLayout>
      </div>
    </div>
  );
}

ProjectCardInfo.defaultProps = {
  projectCardInfo: undefined,
};

ProjectCardInfo.propTypes = {
  projectCardInfo: PropTypes.object,
};

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(ProjectCardInfo);
