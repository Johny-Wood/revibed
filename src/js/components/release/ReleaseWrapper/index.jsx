import { connect } from 'react-redux';

import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import SideBarLayout from '@/components/layouts/SideBarLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import CollapseSection from '@/components/primary/CollapseSection';
import ProjectCardReleaseDetails from '@/components/project/ProjectCard/info-details/ProjectCardReleaseDetails';
import ProjectDiscogsLink from '@/components/projects/Project/_components/ProjectDiscogsLink';
import ProjectRatio from '@/components/projects/Project/_components/ProjectRatio';
import ButtonAddToWantlist from '@/components/release/ReleaseWrapper/_components/ButtonAddToWantlist';
import ReleaseBackButton from '@/components/release/ReleaseWrapper/_components/ReleaseBackButton';
import ReleaseTabs from '@/components/release/ReleaseWrapper/_components/ReleaseTabs';
import WantListRemoveRelease from '@/components/wantList/list/controls/WantListRemoveRelease';
import WantListToggleWatch from '@/components/wantList/list/controls/WantListToggleWatch';
import WantListHeader from '@/components/wantList/list/WantlistWrapper/_components/WantListHeader';
import ComponentsCommonConstants from '@/constants/components/common';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

const renderReleaseInfo = ({ ratioValue, releaseInfo } = {}) => (
  <ProjectCardReleaseDetails
    className={styles.projectCardDetails}
    containerClassName={styles.projectCardDetails__container}
    itemClassName={styles.projectCardDetails__item}
    releaseDetails={{ ...releaseInfo, ratio: ratioValue }}
  />
);

function Release({
  releaseItemId,
  releaseItem: {
    releaseInfo = {},
    releaseInfo: {
      id: releaseId,
      discogsId,
      covers = [],
      artists = [],
      releaseInfoLoaded,
      have,
      want,
      album,
      discogsLink,
      ratio,
      itemsAvailable,
      watchedInSystemWantlist,
    } = {},

    wantItemInfo: { isAdded, item: { id: watchId, active, releaseWatched } = {} } = {},
  } = {},
}) {
  const { isNotDesktop } = ViewportHook();

  const buttonSize = !isNotDesktop ? ComponentsCommonConstants.Size.SMALL40 : ComponentsCommonConstants.Size.SMALL35;

  let artistsNamesStr = '';

  artists.forEach(({ name }, idx) => {
    artistsNamesStr = `${artistsNamesStr}${name}${idx < artists.length - 1 ? ', ' : ''}`;
  });

  return (
    <>
      <DesktopLayout>
        <SideBarLayout>
          <ReleaseBackButton />
        </SideBarLayout>
      </DesktopLayout>
      <div className={styles.release}>
        {isAdded && (
          <WantListHeader className={styles.releaseWantListHeader} planClassName={styles.releaseWantListHeader__plan} />
        )}
        <div className={styles.releaseItem}>
          <MobileLayout>
            <ReleaseBackButton />
          </MobileLayout>
          <div className={styles.releaseItem__info}>
            <div className={styles.releaseItem__left}>
              <Cover
                isNoCover={releaseInfoLoaded && covers.length <= 0}
                inProcess={!releaseInfoLoaded && covers.length <= 0}
                covers={covers}
                withImageLiteBox={covers && covers.length > 0}
                isDefault={!covers || !covers.length > 0}
                className={styles.projectCover}
                containerClassName={styles.projectCoverContainer}
                size={isNotDesktop ? 135 : undefined}
              />
              <ProjectRatio
                className={styles.projectRatio}
                valueClassName={styles.projectRatio__value}
                ratio={ratio}
                have={have}
                want={want}
              />
            </div>
            <div className={styles.releaseItem__right}>
              <div className={styles.releaseItem__control}>
                <Names
                  projectId={releaseId}
                  artists={artists}
                  albumTitle={album}
                  isRoute={false}
                  afterContent={ProjectDiscogsLink}
                  afterContentProps={{
                    link: discogsLink,
                    className: styles.discogsLink,
                  }}
                  truncatedText={{
                    sliceLengthArtists: !isNotDesktop ? 40 : 15,
                    sliceLengthAlbum: 80,
                  }}
                  className={styles.projectNames}
                  titleClassName={styles.projectNames__title}
                  albumClassName={styles.projectNames__album__title}
                />
              </div>
              <MobileLayout>
                <CollapseSection title="Release Info">
                  {renderReleaseInfo({
                    ratioValue: ratio,
                    releaseInfo,
                  })}
                </CollapseSection>
              </MobileLayout>
              <DesktopLayout>{renderReleaseInfo({ releaseInfo })}</DesktopLayout>
            </div>
            <div className={styles.releaseItem__controls}>
              {isAdded ? (
                <>
                  {releaseWatched && (
                    <WantListToggleWatch
                      active={active}
                      releaseId={releaseId}
                      releaseItemId={watchId}
                      buttonSize={buttonSize}
                      withTooltip
                    />
                  )}
                  <WantListRemoveRelease
                    releaseIds={[releaseId]}
                    releases={[discogsLink]}
                    name={`${artistsNamesStr} - ${album}`}
                    buttonSize={buttonSize}
                    className={styles.buttonRemove}
                  />
                </>
              ) : (
                <ButtonAddToWantlist
                  discogsId={discogsId}
                  releaseId={releaseId}
                  size={ComponentsCommonConstants.Size.SMALL40}
                  rounded
                  borderColor="gray-8"
                  className={styles.buttonAdd}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.releaseItems}>
          {!!releaseId && (
            <ReleaseTabs
              releaseId={releaseItemId}
              parseNow={!itemsAvailable}
              isAdded={isAdded}
              active={active}
              watchedInSystemWantlist={watchedInSystemWantlist}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default connect((state) => ({
  wantlistReleaseItems: state.WantListReleaseItemReducer.wantlistReleaseItems,
}))(Release);
