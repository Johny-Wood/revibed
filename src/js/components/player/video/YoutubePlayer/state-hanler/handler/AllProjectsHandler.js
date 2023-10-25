import isEqual from 'lodash/isEqual';

import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ReleaseLocationConstants } from '@/constants/release';
import {
  appendVideoPlayerDataToPlaylistAction,
  loadVideoPlayerNewDateInProcessAction,
} from '@/redux-actions/components/videoPlayerActions';
import { getFeedRequestAction } from '@/redux-actions/feedActions';
import { getProjectsRequestAction } from '@/redux-actions/projects/projectsActions';
import { loadWantedRequestAction } from '@/redux-actions/wanted/wantedActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import {
  getWithoutDuplicateLinksFromProjectsUtil,
  getWithoutEmptyLinksFromPlaylistUtil,
  mapProjectToPlaylistItemUtil,
  mapWantedToPlaylistItemUtil,
} from '@/utils/player/videoPlayerUtils';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

const appendDataToPlaylist = ({
  dispatch,
  activeLocation,
  responseData,
  requestPageNumber,
  playList = [],
  playingId,
  playingProjectId,
  callback,
}) => {
  const projects = getWithoutEmptyLinksFromPlaylistUtil([
    ...playList[activeLocation].list,
    ...(activeLocation === ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS
      ? responseData.map(mapWantedToPlaylistItemUtil)
      : responseData.map(mapProjectToPlaylistItemUtil)),
  ]);

  const list = getWithoutDuplicateLinksFromProjectsUtil({
    projects,
    playingId,
    playingProjectId,
  });

  dispatch(
    appendVideoPlayerDataToPlaylistAction({
      location: activeLocation,
      data: list,
      page: requestPageNumber,
      callback: isEqual(list, playList[activeLocation].list) ? callback : null,
    })
  );
};

export default class AllProjectsHandler {
  // eslint-disable-next-line class-methods-use-this
  handle = ({ activeLocation, status, index, callback }) => {
    if ([-1, 1].includes(status)) {
      const {
        store,
        store: { dispatch },
      } = ReduxStoreService.getInstance();

      const {
        VideoPlayerReducer: {
          userId,
          playingId,
          playingProjectId,
          playList,
          playList: {
            [activeLocation]: { list = [], loadInProcess, page, totalPages, pageSize, filtersApplied, sortSelected } = {},
          } = {},
        } = {},
        ProjectsSortAndFiltersReducer: { sortAndFilters: { filter: { filters = [] } = {} } = {} } = {},
        WantedSortAndFiltersReducer: { sortAndFilters: { filter: { filters: wantedFilters = [] } = {} } = {} } = {},
      } = store.getState();

      if (loadInProcess || page + 1 === totalPages) {
        return;
      }

      if (index + 3 >= list.length) {
        dispatch(loadVideoPlayerNewDateInProcessAction(activeLocation, true));

        const requestPageNumber = page + 1;
        const requestParams = {
          location: activeLocation,
          useCustomResponseHandler: true,
          withInProcess: false,
          pageSize,
          pageNumber: requestPageNumber,
          userId,
          pageFilters: getFilterQueryUtil({
            filters: activeLocation === ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS ? wantedFilters : filters,
            filtersApplied,
          }),
          pageSort: getSortQueryUtil({ sortSelected }),
        };

        if (activeLocation === ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS) {
          loadWantedRequestAction({ ...requestParams, dispatch })
            .then(({ responseData = [] }) => {
              appendDataToPlaylist({
                dispatch,
                activeLocation,
                responseData,
                requestPageNumber,
                playList,
                playingId,
                playingProjectId,
                callback,
              });
            })
            .catch(() => {
              dispatch(loadVideoPlayerNewDateInProcessAction(activeLocation, false));
            });
        } else if (activeLocation === ProjectsLocationsConstants.MY_FEED) {
          getFeedRequestAction({ ...requestParams, dispatch })
            .then(({ responseData = [] }) => {
              appendDataToPlaylist({
                dispatch,
                activeLocation,
                responseData: responseData.map(({ project }) => project),
                requestPageNumber,
                playList,
                playingId,
                playingProjectId,
                callback,
              });
            })
            .catch(() => {
              dispatch(loadVideoPlayerNewDateInProcessAction(activeLocation, false));
            });
        } else {
          getProjectsRequestAction(requestParams)(dispatch)
            .then(({ responseData = [] }) => {
              appendDataToPlaylist({
                dispatch,
                activeLocation,
                responseData,
                requestPageNumber,
                playList,
                playingId,
                playingProjectId,
                callback,
              });
            })
            .catch(() => {
              dispatch(loadVideoPlayerNewDateInProcessAction(activeLocation, false));
            });
        }
      }
    }
  };

  // eslint-disable-next-line class-methods-use-this
  supportedLocations = () => [
    ProjectsLocationsConstants.PROJECTS,
    ProjectsLocationsConstants.MY_PROJECTS,
    ProjectsLocationsConstants.RIPPER,
    ProjectsLocationsConstants.PROJECTS_USER,
    ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS,
    ProjectsLocationsConstants.MY_FEED,
  ];
}
