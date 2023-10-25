import { Component, createRef } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

import BackButton from '@/components/common-ui/buttons/BackButton';
import EventsWrapper from '@/components/events/EventsWrapper';
import HotOffersDescription from '@/components/hot-offers/HotOffersDescription';
import { UserAuthorized } from '@/components/layouts/AuthLayouts';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import CollapseSection from '@/components/primary/CollapseSection';
import Contributor from '@/components/project/_components/Contributor';
import ProjectCardArtistFund from '@/components/project/_components/ProjectCardArtistFund';
import ProjectCardChat from '@/components/project/_components/ProjectCardChat';
import ProjectCardContributors from '@/components/project/_components/ProjectCardContributors';
import ProjectCardInfo from '@/components/project/_components/ProjectCardInfo';
import ProjectCardVideos from '@/components/project/_components/ProjectCardVideos';
import ProjectCardAbout from '@/components/project/ProjectCard/info-details/ProjectCardAbout';
import ProjectCardProjectInfo from '@/components/project/ProjectCard/info-details/ProjectCardProjectInfo';
import ProjectCardTabs from '@/components/project/ProjectCard/ProjectCardTabs';
import ProjectCardRipperCabinet from '@/components/project/ProjectCard/ripper/ProjectCardRipperCabinet';
import ProjectCardChanges from '@/components/project/ProjectCard/updates/ProjectCardChanges';
import ProjectGetRipButton from '@/components/project/ProjectGetRipButton';
import ProjectInviteButton from '@/components/project/ProjectInviteButton';
import Button from '@/components/ui/buttons/Button';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonHeadConstants } from '@/constants/common/head';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonNavigationsConstants } from '@/constants/common/navigation';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import DialogLocationsConstants from '@/constants/dialog/location';
import FilesTypesConstants from '@/constants/files/types';
import LateEntrySlotTypesConstants from '@/constants/lateEntry/slot-types';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { ProjectsNotificationLocationsConstants } from '@/constants/projects/notifications';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { WebSocketSubscriptionIdsConstants } from '@/constants/websocket/webSocketSubscriptionIds';
import { clearInitialStateAction, updateMessagesCounterAction } from '@/redux-actions/dialog/dialogActions';
import ScrollService from '@/services/scroll/ScrollService';
import WebSocketService from '@/services/WebSocketService';
import { analyticsStandartPush } from '@/utils/analytics/analyticsPushers';
import { projectParticipationInfoUtil } from '@/utils/project/projectParticipationInfoUtil';
import { removeUnreadableProjectByStoreUtil } from '@/utils/project/projectsListUtil';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';
import { subscribeProjectUtil } from '@/utils/project/projectsWebsocketUtil';
import { cropCounterUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const NotificationCount = dynamic(() => import('@/components/common/Notification/NotificationCount'), { ssr: false });

const TABS_TITLES = {
  ripper: 'Ripper cabinet',
  about: 'About',
  comments: 'Comments',
  updates: 'Updates',
  projectInfo: `${CommonMessagesConstants.PREORDER} info`,
  projectBalance: 'Balance',
  contributors: 'Contributors',
  bonuses: 'Gems',
  lateEntryAvailability: 'Last chance cuts',
};

const PREVIEW_TEXT_PARAGRAPHS = [
  {
    id: 1,
    paragraph: () => (
      <p>
        Hot offers are a&nbsp;limited number of&nbsp;digital archival copies of&nbsp;previously funded{' '}
        <b>
          <LinkRoute href={RoutePathsConstants.PROJECTS} className="c-blue" text="legacy projects" />
        </b>{' '}
        that are{' '}
        <b>
          readily available to&nbsp;users holding a&nbsp;Gem. No&nbsp;waiting for a&nbsp;project to&nbsp;complete, our hot offers
          are tunes you can start enjoying right now.
        </b>
      </p>
    ),
  },
  {
    id: 2,
    paragraph: () => (
      <p>
        Any available hot offers will be&nbsp;visible to&nbsp;all {CommonHeadConstants.SITE_NAME}
        &nbsp;members, and for as&nbsp;long as&nbsp;any copies are still available. If&nbsp;a&nbsp;record has been voted
        to&nbsp;be&nbsp;sold, that particular hot offer will also be&nbsp;closed.
      </p>
    ),
  },
];

class ProjectCard extends Component {
  constructor(props) {
    super(props);

    this.projectCardRef = createRef();

    const { tab, event, projectCard: { requestedUserInfo: { ripper: participationRipper } = {} } = {} } = props;

    const activeTab = participationRipper ? 3 : 0;

    this.state = {
      activeTab: !this.hideUpdates() && event >= 0 ? 1 : activeTab,
      canScrollToComment: tab === 'comments',
      canScrollToEvent: tab === 'events',
    };
  }

  componentDidMount() {
    this.addProjectScrollSection();

    this.removeUnreadableProjectByStore();

    this.websocketSubscribeProjectInfo();
    this.websocketSubscribeComments();

    this.analyticsViewItemPush();
  }

  componentDidUpdate(prevProps) {
    const {
      getUnreadEventsInProcess,
      projectCard: { id: projectId, commentsInfo: { enabled: commentsEnabled } = {} } = {},
      variablesList: { PROJECTS_COMMENTS_ENABLED } = {},
    } = this.props;

    const {
      getUnreadEventsInProcess: getUnreadEventsInProcessPrev,
      projectCard: { id: projectIdPrev, commentsInfo: { enabled: commentsEnabledPrev } = {} } = {},
      variablesList: { PROJECTS_COMMENTS_ENABLED: PROJECTS_COMMENTS_ENABLED_PREV } = {},
    } = prevProps;

    if (projectId && !projectIdPrev) {
      this.websocketSubscribeProjectInfo();
      this.websocketSubscribeComments();
    }

    if (PROJECTS_COMMENTS_ENABLED !== PROJECTS_COMMENTS_ENABLED_PREV || commentsEnabled !== commentsEnabledPrev) {
      if (!PROJECTS_COMMENTS_ENABLED || !commentsEnabled) {
        this.setInfoTab();
        this.clearComments();
      } else {
        this.websocketSubscribeComments();
      }
    }

    if (projectId !== projectIdPrev && projectId >= 0) {
      this.analyticsViewItemPush();
    }

    if (getUnreadEventsInProcess !== getUnreadEventsInProcessPrev && !getUnreadEventsInProcess) {
      this.removeUnreadableProjectByStore();
    }
  }

  componentWillUnmount() {
    this.websocketUnsubscribeComments(WebSocketSubscriptionIdsConstants.CHAT);
    this.clearComments();
  }

  setCanScrollToEvent = () => {
    this.setState({
      canScrollToEvent: false,
    });
  };

  setCanScrollToComment = () => {
    this.setState({
      canScrollToComment: false,
    });
  };

  clearComments = () => {
    const { clearDialogInitialState } = this.props;

    clearDialogInitialState(DialogLocationsConstants.PROJECT);
  };

  addProjectScrollSection = () => {
    const { projectCardId: id } = this.props;

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.PROJECT_CARD,
      `/project/${id}`,
      this.projectCardRef
    );
  };

  websocketSubscribeProjectInfo = () => {
    const { projectCardId, projectCard: { status } = {} } = this.props;

    if (status) {
      subscribeProjectUtil({ projectId: projectCardId, status });
    }
  };

  websocketSubscribeComments = () => {
    const {
      projectCardId,
      projectCard: { commentsInfo: { commentsCount, totalCommentsCount, commentsChatId: chatId } = {} } = {},
      updateMessagesCounter,
    } = this.props;

    if (chatId && chatId >= 0 && !this.hideComments()) {
      updateMessagesCounter(DialogLocationsConstants.PROJECT, commentsCount, totalCommentsCount);

      WebSocketService.subscribe({
        category: WebSocketSubscriptionIdsConstants.CHAT,
        subscribeName: `/chat/${chatId}`,
        webSocketSubscriptionId: chatId,
        callbackData: {
          location: DialogLocationsConstants.PROJECT,
          projectCardId,
          chatId,
          isChat: false,
          setMessagePosition: 'prev',
        },
      });
    }
  };

  websocketUnsubscribeComments = (category) => {
    const { projectCard: { commentsInfo: { commentsChatId: chatId } = {} } = {} } = this.props;

    WebSocketService.unsubscribe({
      category,
      webSocketSubscriptionIds: [chatId],
    });
  };

  setInfoTab = () => {
    this.setState({
      activeTab: 0,
    });
  };

  analyticsViewItemPush = () => {
    const { projectCard: { id: projectId, title: projectName, amount: projectPrice } = {} } = this.props;

    if (projectId >= 0) {
      analyticsStandartPush({ ecommerce: null });
      analyticsStandartPush({
        event: 'view_item',
        ecommerce: {
          items: [
            {
              item_name: projectName,
              item_id: projectId,
              price: projectPrice,
            },
          ],
        },
      });
    }
  };

  renderProjectCardVideo = (youtubeLinks) => {
    const {
      projectCard: { id: projectCardId, status: { name: statusName } = {}, requestedUserInfo: { founder } = {}, title } = {},
    } = this.props;

    return (
      <ProjectCardVideos
        youtubeLinks={youtubeLinks}
        projectCardId={projectCardId}
        title={title}
        withUpdateOrder={founder && !projectsStatusesUtil.isInModerationStatus(statusName)}
      />
    );
  };

  renderInviteUsers = () => {
    const { projectCardId, projectCard: { status: { name: statusName } = {}, requestedUserInfo } = {} } = this.props;

    const participationContributor = projectParticipationInfoUtil(requestedUserInfo);

    if (
      (projectsStatusesUtil.isOpenStatus(statusName) || projectsStatusesUtil.isLastCallStatus(statusName)) &&
      participationContributor
    ) {
      return (
        <ProjectInviteButton
          projectId={projectCardId}
          color={projectsStatusesUtil.isOpenStatus(statusName) ? 'c-open' : 'c-last-call'}
        />
      );
    }

    return null;
  };

  renderNotifications = (keyMenu) => {
    const {
      unreadEvents,
      projectCard: { events = [] } = {},
      variablesList: { UNREAD_MARKER_PROJECTS_ENABLED } = {},
    } = this.props;

    const { PROJECTS_EVENTS = {} } = unreadEvents[0] || {};

    let projectEvents = 0;

    if (UNREAD_MARKER_PROJECTS_ENABLED) {
      events.forEach(({ id: eventId }) => {
        if (PROJECTS_EVENTS[eventId]) {
          projectEvents += PROJECTS_EVENTS[eventId];
        }
      });
    }

    const personalNotificationCountsMap = {
      [PersonalNotificationsSectionsConstants.PROJECTS_EVENTS]: projectEvents,
    };

    return <NotificationCount withCount count={personalNotificationCountsMap[keyMenu]} />;
  };

  getCommentsCount = () => {
    const { commentsCounterMessages, projectCard: { commentsInfo: { totalCommentsCount } = {} } = {} } = this.props;

    return cropCounterUtil({
      counter: commentsCounterMessages >= 0 ? commentsCounterMessages : totalCommentsCount,
      limit: 1000,
    });
  };

  renderTabs = () => {
    const { activeTab } = this.state;
    const { projectCard: { status: { name: statusName } = {}, requestedUserInfo: { ripper: participationRipper } = {} } = {} } =
      this.props;

    const hideRipperCabinet =
      !participationRipper ||
      projectsStatusesUtil.isDraftStatus(statusName) ||
      projectsStatusesUtil.isInModerationStatus(statusName) ||
      projectsStatusesUtil.isRejectedStatus(statusName);

    const hideUpdates =
      projectsStatusesUtil.isLegacyStatus(statusName) ||
      projectsStatusesUtil.isDraftStatus(statusName) ||
      projectsStatusesUtil.isInModerationStatus(statusName) ||
      projectsStatusesUtil.isRejectedStatus(statusName);

    const TABS = [
      {
        id: 3,
        name: TABS_TITLES.ripper,
        hide: hideRipperCabinet,
      },
      {
        id: 0,
        name: TABS_TITLES.about,
      },
      {
        id: 1,
        name: TABS_TITLES.updates,
        keyMenu: CommonNavigationsConstants.PROJECTS_EVENTS,
        hide: hideUpdates,
      },
      {
        id: 2,
        name: TABS_TITLES.comments,
        titleCount: this.getCommentsCount(),
        hide: this.hideComments(),
      },
    ];

    return TABS.map(({ id, name, keyMenu, titleCount, hide }) => {
      const key = `tab-${name}-${id}`;

      if (hide) {
        return null;
      }

      return (
        <Button
          key={key}
          className={classNames(styles.projectTabs__tab, activeTab === id && styles.projectTabs__tab_active)}
          type="button_string"
          text={name}
          onClick={() => {
            this.setState({
              activeTab: id,
            });
          }}
        >
          {this.renderNotifications(keyMenu)}
          {!!titleCount && <span className="m-left-5 t-medium">{titleCount}</span>}
        </Button>
      );
    });
  };

  getLateEntrySlots = () => {
    const { projectCard: { lateEntryInfo: { available: lateEntryAvailable, slots: lateEntrySlots = [] } = {} } = {} } =
      this.props;

    if (!lateEntryAvailable) {
      return [];
    }

    return (
      orderBy(lateEntrySlots, ['percent'], ['desc']).map(({ type, percent, contributor }, idx) =>
        !contributor
          ? {
              id: `system-late-entry-slots-${idx}`,
              type: 'system',
              name: 'Reserved for late entry',
              shareOfParticipation: percent,
              isFounder: false,
              avatarProps: {
                isSystemGoldenCoin: type === LateEntrySlotTypesConstants.GOLDEN_COIN,
                isSystemGem: type === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR,
              },
            }
          : contributor
      ) || []
    );
  };

  getContributorsWithBonuses = () => {
    const {
      projectCard: {
        contributors = [],
        status: { name: statusName } = {},
        freeBonuses: { slots: freeBonusesSlots = [] } = {},
      } = {},
    } = this.props;

    const contributorsWithBonuses = orderBy(
      contributors.filter(({ pointsCountInfo: { GEM = 0, GOLDEN_COIN = 0 } = {} }) => GEM > 0 || GOLDEN_COIN > 0),
      ['isFounder', 'shareOfParticipation', 'contributed', 'id'],
      ['desc', 'desc', 'desc', 'asc']
    );

    const lateEntryBonusesSlotsContributors = orderBy(freeBonusesSlots, ['percent'], ['desc']).map(
      ({ type, percent, contributor }, idx) =>
        !contributor
          ? {
              id: `system-bonuses-slots-${idx}`,
              type: 'system',
              name: `Join with ${type === LateEntrySlotTypesConstants.GOLDEN_COIN ? 'Golden Koin' : 'a Gem'}`,
              shareOfParticipation: percent,
              isFounder: false,
              avatarProps: {
                isSystemGoldenCoin: type === LateEntrySlotTypesConstants.GOLDEN_COIN,
                isSystemGem: type === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR,
              },
            }
          : {}
    );

    const allContributors = cloneDeep(
      projectsStatusesUtil.isOpenStatus(statusName) || projectsStatusesUtil.isLastCallStatus(statusName)
        ? [...contributorsWithBonuses, ...lateEntryBonusesSlotsContributors]
        : contributorsWithBonuses
    );

    return allContributors || [];
  };

  getContributorsWithoutBonuses = () => {
    const {
      projectCard: { contributors = [], lateEntryInfo: { available: lateEntryAvailable, slots: lateEntrySlots = [] } = {} } = {},
    } = this.props;

    const contributorsWithoutBonuses = orderBy(
      contributors.filter(({ pointsCountInfo: { GEM = 0, GOLDEN_COIN = 0 } = {} }) => GEM === 0 && GOLDEN_COIN === 0),
      ['isFounder', 'shareOfParticipation', 'contributed', 'id'],
      ['desc', 'desc', 'desc', 'asc']
    );

    const lateEntrySlotsContributors = orderBy(lateEntrySlots, ['percent'], ['desc']).map(
      ({ type, percent, contributor }, idx) =>
        !contributor
          ? {
              id: `system-slots-${idx}`,
              type: 'system',
              name: 'Reserved for late entry',
              shareOfParticipation: percent,
              isFounder: false,
              avatarProps: {
                isSystemGoldenCoin: type === LateEntrySlotTypesConstants.GOLDEN_COIN,
                isSystemGem: type === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR,
              },
            }
          : {}
    );

    const allContributors = cloneDeep(
      !lateEntryAvailable ? [...contributorsWithoutBonuses, ...lateEntrySlotsContributors] : contributorsWithoutBonuses
    );

    return allContributors || [];
  };

  renderLateEntryAvailability = ({ title } = {}) => {
    const { isNotDesktop } = this.props;

    return (
      <ProjectCardContributors
        contributors={this.getLateEntrySlots()}
        title={title}
        showMoreText={TABS_TITLES.lateEntryAvailability}
        isNotDesktop={isNotDesktop}
      />
    );
  };

  renderBonuses = ({ title } = {}) => {
    const { isNotDesktop } = this.props;

    return (
      <ProjectCardContributors
        contributors={this.getContributorsWithBonuses()}
        title={title}
        showMoreText={TABS_TITLES.bonuses}
        isNotDesktop={isNotDesktop}
      />
    );
  };

  renderContributors = ({ title } = {}) => {
    const { isNotDesktop } = this.props;

    return (
      <ProjectCardContributors contributors={this.getContributorsWithoutBonuses()} title={title} isNotDesktop={isNotDesktop} />
    );
  };

  renderComments = () => {
    const {
      projectCardId,
      projectCard: {
        commentsInfo = {},
        title,
        requestedUserInfo: { contributor: { participation: participationContributor } = {} } = {},
      } = {},
      userInfo: { projectsCommentsDisabled, phoneConfirmed } = {},
    } = this.props;

    const { canScrollToComment } = this.state;

    return (
      <ProjectCardChat
        title={title}
        projectCardId={+projectCardId}
        commentsInfo={commentsInfo}
        disabled={projectsCommentsDisabled || (!participationContributor && !phoneConfirmed)}
        canScrollToComment={canScrollToComment}
        setCanScrollToComment={this.setCanScrollToComment}
      />
    );
  };

  renderRipperCabinet = () => {
    const {
      projectCard: {
        id,
        covers,
        albumTitle,
        title,
        artists,
        realStatus,
        mediaCondition = {},
        sleeveCondition = {},
        conditionsComment,
        realMediaCondition = {},
        realSleeveCondition = {},
        shippingInfo = {},
      } = {},
    } = this.props;

    return (
      <ProjectCardRipperCabinet
        filesProps={{
          required: false,
          fileMaxSize: 50,
          fileMinSize: 0.004,
          formats: 'XLS, XML, CSV, JPG, JPEG, PNG, PDF, DOC, DOCX, RAR, ZIP, MP3, AVI',
          accept: '.xls, .xlsx, .xml, .csv, .jpg, .jpeg, .png, .pdf, .doc, .docx, .rar, .zip, .mp3, .avi',
          pattern: [
            FilesTypesConstants.APPLICATION.XLSX,
            FilesTypesConstants.APPLICATION.XML,
            FilesTypesConstants.APPLICATION.XML_2,
            FilesTypesConstants.APPLICATION.CSV,
            FilesTypesConstants.APPLICATION.CSV_2,
            FilesTypesConstants.IMAGE.JPG,
            FilesTypesConstants.IMAGE.JPEG,
            FilesTypesConstants.IMAGE.PNG,
            FilesTypesConstants.APPLICATION.PDF,
            FilesTypesConstants.APPLICATION.DOC,
            FilesTypesConstants.APPLICATION.DOCX,
            FilesTypesConstants.APPLICATION.RAR,
            FilesTypesConstants.APPLICATION.RAR_2,
            FilesTypesConstants.APPLICATION.RAR_3,
            FilesTypesConstants.APPLICATION.ZIP,
            FilesTypesConstants.APPLICATION.ZIP_2,
            FilesTypesConstants.APPLICATION.ZIP_3,
            FilesTypesConstants.ADIO.MP3,
            FilesTypesConstants.ADIO.MP3_2,
            FilesTypesConstants.VIDEO.AVI,
            FilesTypesConstants.VIDEO.VIDEO,
          ],
        }}
        projectId={id}
        projectCovers={covers}
        projectTitle={{
          albumTitle,
          title,
          artists,
        }}
        status={realStatus}
        conditions={{
          mediaCondition,
          sleeveCondition,
        }}
        realConditions={{
          realMediaCondition,
          realSleeveCondition,
          conditionsComment,
        }}
        shippingInfo={shippingInfo}
      />
    );
  };

  renderProjectUpdates = () => {
    const {
      projectCard: {
        events = [],
        requestedUserInfo: { contributor: { participation: participationContributor } = {} } = {},
      } = {},
      isNotDesktop,
    } = this.props;

    const { canScrollToEvent } = this.state;

    if (events.length <= 0) {
      return null;
    }

    return (
      <ProjectCardChanges
        events={events}
        participationContributor={participationContributor}
        canScrollToEvent={canScrollToEvent}
        setCanScrollToEvent={this.setCanScrollToEvent}
        isNotDesktop={isNotDesktop}
      />
    );
  };

  removeUnreadableProjectByStore = () => {
    const { projectCardId, userIsAuthorized } = this.props;

    if (!userIsAuthorized) {
      return;
    }

    ProjectsNotificationLocationsConstants.forEach((location) => {
      removeUnreadableProjectByStoreUtil({
        location,
        projectId: projectCardId,
      });
    });
  };

  renderFounderDescription = ({ widthContentTitle = true } = {}) => {
    const { projectCard: { description, founder } = {} } = this.props;

    return (
      <ProjectCardAbout
        className={styles.projectCard__founder}
        layoutClassName={styles.projectCard__about}
        widthContentTitle={widthContentTitle}
        description={description}
        contributor={founder}
        sliceLength={0}
      />
    );
  };

  hideComments = () => {
    const {
      variablesList: { PROJECTS_COMMENTS_ENABLED } = {},
      projectCard: { status: { name: statusName } = {}, commentsInfo: { enabled: commentsEnabled } = {} } = {},
      userIsAuthorized,
    } = this.props;

    return (
      !PROJECTS_COMMENTS_ENABLED ||
      !commentsEnabled ||
      !userIsAuthorized ||
      projectsStatusesUtil.isDraftStatus(statusName) ||
      projectsStatusesUtil.isInModerationStatus(statusName) ||
      projectsStatusesUtil.isRejectedStatus(statusName)
    );
  };

  hideUpdates = () => {
    const { projectCard: { status: { name: statusName } = {} } = {}, userIsAuthorized } = this.props;

    return (
      projectsStatusesUtil.isLegacyStatus(statusName) ||
      !userIsAuthorized ||
      projectsStatusesUtil.isDraftStatus(statusName) ||
      projectsStatusesUtil.isInModerationStatus(statusName) ||
      projectsStatusesUtil.isRejectedStatus(statusName)
    );
  };

  getTabs = () => {
    const {
      projectCard,

      userIsAuthorized,
      projectCard: { status: { name: statusName } = {}, requestedUserInfo: { ripper: participationRipper } = {} } = {},
    } = this.props;

    return [
      {
        key: 'ripper',
        id: 1,
        title: TABS_TITLES.ripper,
        container: this.renderRipperCabinet,
        hide:
          projectsStatusesUtil.isLegacyStatus(statusName) ||
          !participationRipper ||
          !userIsAuthorized ||
          projectsStatusesUtil.isDraftStatus(statusName) ||
          projectsStatusesUtil.isInModerationStatus(statusName) ||
          projectsStatusesUtil.isRejectedStatus(statusName),
      },
      {
        key: 'events',
        id: 0,
        title: TABS_TITLES.updates,
        container: this.renderProjectUpdates,
        hide: this.hideUpdates(),
      },
      {
        key: 'comments',
        id: 2,
        title: TABS_TITLES.comments,
        titleCount: this.getCommentsCount(),
        container: this.renderComments,
        hide: this.hideComments(),
      },
      {
        key: 'info',
        id: 3,
        title: TABS_TITLES.projectInfo,
        container: ProjectCardProjectInfo,
        containerProps: {
          projectCard,
        },
      },
    ];
  };

  activeTabDefault = () => {
    const { tab } = this.props;

    const { id } = this.getTabs().find(({ key, hide }) => key === tab && !hide) || {};

    return id;
  };

  checkUnreadProjectInLocations = () => {
    const { unreadEvents, projectCardId } = this.props;

    const { MY_PROJECTS = {}, IN_MODERATION = {}, NEW_ARRIVALS = {} } = unreadEvents[0] || {};

    return [...Object.keys(MY_PROJECTS), ...Object.keys(IN_MODERATION), ...Object.keys(NEW_ARRIVALS)].includes(
      `${projectCardId}`
    );
  };

  isLateEntryStatus = () => {
    const {
      userIsAuthorized,
      projectCard,
      projectCard: { lateEntryStatus: { name: lateEntryStatusName } = {} } = {},
    } = this.props;

    return (
      projectsStatusesUtil.canBeLateEntryStatus(projectCard, {
        userIsAuthorized,
      }) && projectsStatusesUtil.isLateEntryStatus(lateEntryStatusName)
    );
  };

  render() {
    const {
      isNotDesktop,
      projectCardId,
      projectCard,
      projectCard: {
        orderId,
        youtubeLinks,
        status: { name: statusName } = {},
        requestedUserInfo: {
          founder: meFounder,
          contributor = {},
          contributor: { participation: participationContributor } = {},
        } = {},
        artistFund,
        containsInArtistFund,
        showArtistFund,
        priceBuy,
        cutsCount,
      } = {},
      userInfo: {
        avatar: myAvatar,
        name: myName,
        contributed: myContributed,
        founded: myFounded,
        country: myCountry,
        subscribersCount: mySubscribersCount,
      } = {},
    } = this.props;

    const { activeTab } = this.state;

    return (
      <EventsWrapper eventsIds={this.checkUnreadProjectInLocations() ? [projectCardId] : []}>
        <UserAuthorized>
          <MobileLayout>
            <div className={styles.projectTabs}>{this.renderTabs()}</div>
          </MobileLayout>
        </UserAuthorized>
        <TransitionLayout isShown={activeTab === 0 || !isNotDesktop}>
          <>
            <BackButton />
            <div className={styles.projectCard} ref={this.projectCardRef}>
              <div className={styles.projectCard__content}>
                <ProjectCardInfo projectCardInfo={projectCard} />
                {this.isLateEntryStatus() && (
                  <HotOffersDescription
                    paragraphs={PREVIEW_TEXT_PARAGRAPHS}
                    className={styles.hotOffersDescription}
                    previewParagraphCount={!isNotDesktop ? 2 : 1}
                    showAll={false}
                  />
                )}
                <MobileLayout>
                  <CollapseSection title="Founder" initialOpened titleTagNumber={2}>
                    <>{this.renderFounderDescription({ widthContentTitle: false })}</>
                  </CollapseSection>
                </MobileLayout>
                <DesktopLayout>
                  <>{this.renderFounderDescription()}</>
                </DesktopLayout>
                <DesktopLayout>
                  {!!statusName && <ProjectCardTabs activeTabDefault={this.activeTabDefault()} tabs={this.getTabs()} />}
                </DesktopLayout>
              </div>
              <div className={styles.projectCard__aside}>
                {this.renderProjectCardVideo(youtubeLinks)}
                <ProjectCardArtistFund
                  artistFund={artistFund}
                  containsInArtistFund={containsInArtistFund}
                  showArtistFund={showArtistFund}
                  priceBuy={priceBuy}
                  cutsCount={cutsCount}
                />
                <TransitionLayout isShown={participationContributor}>
                  <div className={styles.projectCard__invite}>
                    <Contributor
                      className={styles.contributor}
                      projectRoleInfoClassName={styles.projectRoleInfo}
                      withFollowers
                      contributor={{
                        ...contributor,
                        avatar: myAvatar,
                        name: myName,
                        founded: myFounded,
                        contributed: myContributed,
                        country: myCountry,
                        isFounder: meFounder,
                        subscribersCount: mySubscribersCount,
                      }}
                    />
                    {this.renderInviteUsers()}
                    <TransitionLayout
                      isShown={
                        !!orderId &&
                        participationContributor &&
                        (projectsStatusesUtil.isVoteForSaleStatus(statusName) ||
                          projectsStatusesUtil.isRecordKeptStatus(statusName) ||
                          projectsStatusesUtil.isListedStatus(statusName) ||
                          projectsStatusesUtil.isSoldStatus(statusName))
                      }
                    >
                      <ProjectGetRipButton isFixed={isNotDesktop} orderId={orderId} />
                    </TransitionLayout>
                  </div>
                </TransitionLayout>
                <MobileLayout>
                  <div>
                    {this.getLateEntrySlots().length > 0 && (
                      <CollapseSection title={TABS_TITLES.lateEntryAvailability}>
                        {this.renderLateEntryAvailability()}
                      </CollapseSection>
                    )}
                    {this.getContributorsWithBonuses().length > 0 && (
                      <CollapseSection title={TABS_TITLES.bonuses}>{this.renderBonuses()}</CollapseSection>
                    )}
                    {this.getContributorsWithoutBonuses().length > 0 && (
                      <CollapseSection title={TABS_TITLES.contributors}>{this.renderContributors()}</CollapseSection>
                    )}
                    <CollapseSection title={TABS_TITLES.projectInfo}>
                      <ProjectCardProjectInfo projectCard={projectCard} />
                    </CollapseSection>
                  </div>
                </MobileLayout>
                <DesktopLayout>
                  {this.renderLateEntryAvailability({
                    title: TABS_TITLES.lateEntryAvailability,
                  })}
                  {this.renderBonuses({ title: TABS_TITLES.bonuses })}
                  {this.renderContributors({ title: TABS_TITLES.contributors })}
                </DesktopLayout>
              </div>
            </div>
          </>
        </TransitionLayout>
        <UserAuthorized>
          <MobileLayout>
            <TransitionLayout isShown={activeTab === 3 && isNotDesktop}>{this.renderRipperCabinet()}</TransitionLayout>
            <TransitionLayout isShown={activeTab === 1 && isNotDesktop}>{this.renderProjectUpdates()}</TransitionLayout>
            <TransitionLayout isShown={activeTab === 2 && isNotDesktop}>{this.renderComments()}</TransitionLayout>
          </MobileLayout>
        </UserAuthorized>
      </EventsWrapper>
    );
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    userInfo: state.AuthReducer.userInfo,
    getUnreadEventsInProcess: state.PersonalNotificationCountsReducer.getUnreadEventsInProcess,
    unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
    commentsCounterMessages: state.ProjectCommentsReducer.totalCommentsCount,
  }),
  (dispatch) => ({
    clearDialogInitialState: (location) => {
      dispatch(clearInitialStateAction(location));
    },
    updateMessagesCounter: (location, counterMessages, totalCommentsCount) => {
      dispatch(updateMessagesCounterAction(location, counterMessages, totalCommentsCount));
    },
  })
)(ProjectCard);
