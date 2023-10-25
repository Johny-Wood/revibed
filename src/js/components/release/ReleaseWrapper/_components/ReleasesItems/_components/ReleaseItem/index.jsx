import classNames from 'classnames';
import parse from 'html-react-parser';
import { connect } from 'react-redux';

import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import EventMarker from '@/components/events/EventMarker';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import CollapseSection from '@/components/primary/CollapseSection';
import ContributorsAvatars from '@/components/project/_components/ContributorsAvatars';
import CreateProjectLink from '@/components/projects/Project/_components/buttons/CreateProjectLink';
import ProjectConditionInfo from '@/components/projects/Project/_components/ProjectConditionInfo';
import ProjectDiscogsLink from '@/components/projects/Project/_components/ProjectDiscogsLink';
import ProjectFormats from '@/components/projects/Project/_components/ProjectFormats';
import ProjectShipFrom from '@/components/projects/Project/_components/ProjectShipFrom';
import { CommonMessagesConstants } from '@/constants/common/message';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { normalizeDateUtilAgoUtil } from '@/utils/dateUtils';
import { floatWithCommaFixedUtil, parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const renderPrice = ({ price, currency }) => (
  <div className={styles.price}>
    <b>
      {floatWithCommaFixedUtil(price)}
      {currency}
    </b>
  </div>
);

const renderDetails = ({
  formats,
  discogsLink,
  mediaCondition,
  mediaCondition: { mediaShortTitle } = {},
  sleeveCondition,
  sleeveCondition: { sleaveShortTitle } = {},
  shippingFrom,
}) => (
  <div className={styles.wantListReleasesItem__details}>
    <div className={styles.wantListReleasesItem__details__compos}>
      {formats.length > 0 && (
        <>
          <ProjectFormats items={formats} />
          &nbsp;
        </>
      )}
      <ProjectDiscogsLink className={styles.discogsLink} link={discogsLink} />
    </div>
    <div className={styles.wantListReleasesItem__details__info}>
      {!!mediaShortTitle && (
        <>
          <ProjectConditionInfo name="media" condition={mediaCondition} />
          &nbsp;
        </>
      )}
      {!!sleaveShortTitle && (
        <>
          <ProjectConditionInfo name="sleeve" condition={sleeveCondition} />
          &nbsp;
        </>
      )}
      <span className={styles.shippingFrom}>
        <ProjectShipFrom name="shipping from" country={shippingFrom} />
      </span>
    </div>
  </div>
);

function ReleaseItem({
  item: {
    key = '',
    unreadEvents = {},
    withUnread = true,
    withTime = true,
    withReleaseLink = true,
    videoShown,
    withPlayVideo,
    location,
    id,
    discogsItemId,
    discogsLink,
    createdAt,
    priceInfo: { price, currency } = {},
    releaseInfo: { id: releaseId, youtubeLink, formats = [], covers = [], artists = [], album: albumTitle } = {},
    shippingFrom,
    mediaCondition = {},
    sleeveCondition = {},
    contributors = [],
    restartProjectId,
    withNotifications,
    onClickCreateProjectLink = () => {},
    onClickReleaseLink = () => {},
    className,
    itemInnerProps: { innerClassName } = {},
  } = {},
}) {
  const { isNotDesktop } = ViewportHook();

  const { WANT_LIST_RELEASES_ITEMS = {} } = unreadEvents[0] || {};
  const notificationActive = !!WANT_LIST_RELEASES_ITEMS[id] && withUnread;

  return (
    <div className={classNames(styles.wantListReleasesItem, className, innerClassName)} key={key}>
      <div className={styles.wantListReleasesItem__block}>
        <Cover
          location={location}
          withPlayVideo={withPlayVideo}
          videoShown={videoShown}
          withPlayDisabled={!youtubeLink}
          covers={covers}
          isDefault={!withReleaseLink}
          href={parseReplaceTextUtil(RoutePathsConstants.RELEASE, releaseId)}
          projectInfo={{
            id,
            projectId: releaseId,
            albumTitle,
            artists,
          }}
          onClick={() => {
            if (!withReleaseLink) {
              return;
            }
            onClickReleaseLink();
          }}
          className={styles.projectCover}
          containerClassName={styles.projectCoverContainer}
          size={isNotDesktop ? 75 : 150}
        />
        <div className={styles.wantListReleasesItem__itemContent}>
          <Names
            artists={artists}
            albumTitle={albumTitle}
            isRoute={withReleaseLink}
            onClick={() => {
              if (!withReleaseLink) {
                return;
              }
              onClickReleaseLink();
            }}
            href={parseReplaceTextUtil(RoutePathsConstants.RELEASE, releaseId)}
            truncatedText={{
              sliceLengthArtists: !isNotDesktop ? 40 : 15,
              sliceLengthAlbum: !isNotDesktop ? 80 : 30,
            }}
            className={styles.projectNames}
            titleClassName={styles.projectNames__title}
            albumClassName={styles.projectNames__album__title}
          />
          <div className={styles.wantListReleasesItem__detailsWrapper}>
            <DesktopLayout>
              {renderDetails({
                formats,
                discogsLink,
                mediaCondition,
                sleeveCondition,
                shippingFrom,
              })}
              {renderPrice({ price, currency })}
            </DesktopLayout>
          </div>
          <MobileLayout>
            <CollapseSection
              className={styles.wantListReleasesItem__collapseSection}
              categoryClassName={styles.category}
              titleClassName={styles.category__name}
              titleContent={() => renderPrice({ price, currency })}
            >
              {renderDetails({
                formats,
                discogsLink,
                mediaCondition,
                sleeveCondition,
                shippingFrom,
              })}
            </CollapseSection>
          </MobileLayout>
          <MobileLayout>
            <ContributorsAvatars contributors={contributors} />
          </MobileLayout>
        </div>
        <div className={styles.wantListReleasesItem__startWrapper}>
          <CreateProjectLink
            query={!restartProjectId ? { itemId: discogsItemId } : { itemId: discogsItemId, restartProjectId }}
            pathname={RoutePathsConstants.DRAFTS_ADD}
            text={!isNotDesktop ? `Start ${CommonMessagesConstants.PREORDER}` : ''}
            gtmAttribute="start_project_wantlist"
            onClick={onClickCreateProjectLink}
          />
          {withTime && (
            <div className={styles.startTime}>
              <span>{parse(normalizeDateUtilAgoUtil(createdAt).replace(/[\d.]/g, (match) => `<b>${match}</b>`))}</span>
              {withNotifications && notificationActive && (
                <EventMarker className={styles.eventMarker} shown={notificationActive} />
              )}
            </div>
          )}
          <DesktopLayout>
            <ContributorsAvatars className={styles.wantListReleasesItem__contributorsAvatars} contributors={contributors} />
          </DesktopLayout>
        </div>
      </div>
    </div>
  );
}

export default connect((state) => ({
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(ReleaseItem);
