import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { AllProjectsReducersConstants } from '@/constants/projects/allReducersMap';
import { ProjectsFilterDestinationsConstants } from '@/constants/projects/filters/projectFilterDestinations';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ReleaseLocationConstants } from '@/constants/release';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import { getProjectsRequestAction, projectsUpdatePageSettingsAction } from '@/redux-actions/projects/projectsActions';
import NextRouter from '@/services/NextRouter';
import ReduxStoreService from '@/services/ReduxStoreService';
import ScrollService from '@/services/scroll/ScrollService';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

import styles from './styles.module.scss';

const scrollToProjects = ({ activeLocation, secondOffset = 100, inRoute = true }) => {
  ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
    .scrollToElement({
      sectionId: `${ScrollBlockIdConstants.PROJECTS_BLOCK_ID}_${activeLocation}`,
      secondOffset,
      inRoute,
    })
    .then();
};

const getFilteredProjects = ({
  activeLocation,
  userId,
  activePlayList = {},
  getProjects,
  filters,
  getProjectsCallback = () => {},
}) => {
  const { pageSize, startPage, filtersApplied, sortSelected } = activePlayList;

  getProjects({
    location: activeLocation,
    pageSize,
    pageNumber: startPage,
    pageFilters: getFilterQueryUtil({ filters, filtersApplied }),
    pageSort: getSortQueryUtil({ sortSelected }),
    userId,
  }).then(() => getProjectsCallback());
};

const updateProjectsSettings = ({
  projectsUpdatePageSettings,
  activePlayList = {},
  activeLocation,
  userId,

  filters,
  getProjects,
  getProjectsCallback,
}) => {
  const { pageSize, startPage, filtersApplied, sortSelected } = activePlayList;

  const { store } = ReduxStoreService.getInstance();

  const {
    sortSelected: sortSelectedStore,
    filtersApplied: filtersAppliedStore,
    pageSettings: { currentNumber: currentNumberPage, size: pageSizeStore } = {},
  } = store.getState()[AllProjectsReducersConstants[activeLocation]] || {};

  if (
    isEqual(sortSelectedStore, sortSelected) &&
    isEqual(filtersAppliedStore, filtersApplied) &&
    pageSizeStore === pageSize &&
    currentNumberPage === startPage
  ) {
    getProjectsCallback();
    return;
  }

  projectsUpdatePageSettings({
    location: activeLocation,
    filters: filtersApplied,
    sort: sortSelected,
    size: pageSize,
    page: startPage,
    filterApplied: true,
  });

  getFilteredProjects({
    activeLocation,
    userId,
    activePlayList,
    getProjects,
    filters,
    getProjectsCallback,
  });
};

function PlayListLocation({
  activeLocation,
  userId,
  target,

  userInfo,
  blogItems,
  playList,
  projectsUpdatePageSettings,
  getProjects,
  sortAndFilters: { filter: { filters = [] } = {} } = {},
}) {
  let href = '';
  let title = '';
  const name = '';
  let routerChangeCallback;
  let beforeRouterChange;

  const activePlayList = playList[activeLocation] || {};
  const { filtersApplied: filtersAppliedFromList = {} } = activePlayList;

  const filtersApplied = cloneDeep(filtersAppliedFromList) || {};

  if (filtersApplied[ProjectsFilterDestinationsConstants.UNREADABLE]) {
    delete filtersApplied[ProjectsFilterDestinationsConstants.UNREADABLE];
  }

  const hasFilters = !isEmpty(filtersApplied);

  if (
    activeLocation === ProjectsLocationsConstants.PROJECTS ||
    activeLocation === ProjectsLocationsConstants.MY_PROJECTS ||
    activeLocation === ProjectsLocationsConstants.RIPPER ||
    activeLocation === ProjectsLocationsConstants.PROJECTS_USER ||
    activeLocation === ProjectsLocationsConstants.MY_FEED ||
    activeLocation === ProjectsLocationsConstants.BLOG ||
    activeLocation === ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS
  ) {
    routerChangeCallback = () => {
      updateProjectsSettings({
        activeLocation,
        projectsUpdatePageSettings,
        activePlayList,
        userId,
        filters,
        getProjects,
        getProjectsCallback: () => scrollToProjects({ activeLocation }),
      });
    };
  }

  switch (activeLocation) {
    case ProjectsLocationsConstants.FUNDING_NOW: {
      href = RoutePathsConstants.MAIN;
      title = TitlesConstants.LIVE_NOW;
      routerChangeCallback = () => {
        ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
          .scrollToElement({
            sectionId: ScrollBlockIdConstants.FUNDING_NOW,
            secondOffset: 30,
            inRoute: true,
          })
          .then();
      };
      break;
    }
    case ProjectsLocationsConstants.TRENDING: {
      href = RoutePathsConstants.MAIN;
      title = TitlesConstants.TRENDING;
      routerChangeCallback = () => scrollToProjects({ activeLocation });
      break;
    }
    case ProjectsLocationsConstants.BLOG: {
      href = RoutePathsConstants.BLOG_ITEM.replace(/%X/, target);
      title = blogItems[target]?.title || TitlesConstants.BLOG;
      break;
    }
    case ProjectsLocationsConstants.MY_FEED: {
      href = RoutePathsConstants.FEED;
      title = TitlesConstants.FEED;
      routerChangeCallback = () => scrollToProjects({ activeLocation, secondOffset: 160 });
      break;
    }
    case ProjectsLocationsConstants.LATE_ENTRY_FULL: {
      href = RoutePathsConstants.HOT_OFFERS;
      title = 'Hot offers';
      break;
    }
    case ProjectsLocationsConstants.PROJECTS: {
      href = RoutePathsConstants.PROJECTS;
      title = !hasFilters ? TitlesConstants.PRE_ORDERS : `Filtered ${TitlesConstants.PRE_ORDERS}`;
      break;
    }
    case ProjectsLocationsConstants.MY_PROJECTS: {
      href = RoutePathsConstants.MY_PROJECTS;
      title = !hasFilters ? TitlesConstants.PRE_ORDERS : `Filtered ${TitlesConstants.PRE_ORDERS}`;
      break;
    }
    case ProjectsLocationsConstants.PROJECTS_USER: {
      href = RoutePathsConstants.USER_PROJECTS.replace(/%X/, userId);
      title = userInfo[userId].name;
      break;
    }
    default: {
      break;
    }
  }

  if (!href || !title) {
    return null;
  }

  return (
    <div
      className={classNames(styles.videoPlayerLocation, globalStyles.cursorPointer, 't-ellipsis')}
      onClick={() => {
        const { router = {}, router: { router: { pathname } = {} } = {} } = NextRouter.getInstance();
        if (beforeRouterChange) {
          beforeRouterChange();
        }

        if (pathname.replace('[userId]', userId) !== href) {
          router.push(href, undefined, { shallow: true }).then(() => {
            if (routerChangeCallback) {
              routerChangeCallback();
            }
          });
        } else if (routerChangeCallback) {
          routerChangeCallback();
        }
      }}
    >
      <span className="t-uppercase">{title}</span> {!!name && `(${name})`}
    </div>
  );
}

export default connect(
  (state) => ({
    sortAndFilters: state.ProjectsSortAndFiltersReducer.sortAndFilters,
    userInfo: state.UsersReducer.userInfo,
    playList: state.VideoPlayerReducer.playList,
    blogItems: state.BlogReducer.blogItems,
  }),
  (dispatch) => ({
    getProjects: (params) => getProjectsRequestAction(params)(dispatch),
    projectsUpdatePageSettings: (params) => {
      dispatch(projectsUpdatePageSettingsAction(params));
    },
  })
)(PlayListLocation);
