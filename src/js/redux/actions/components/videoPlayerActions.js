import orderBy from 'lodash/orderBy';

import { VideoPlayerActionsConstants } from '@/constants/actions/components/videoPlayer';
import { AllProjectsReducersConstants } from '@/constants/projects/allReducersMap';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ReleaseLocationConstants } from '@/constants/release';
import ReduxStoreService from '@/services/ReduxStoreService';
import { mapProjectToPlaylistItemUtil } from '@/utils/player/videoPlayerUtils';

import createAction from '../actionCreator';

const videoReducers = {
  ...AllProjectsReducersConstants,
  [ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS]: 'WantedReducer',
};

export const loadVideoPlayerNewDateInProcessAction = (location, loadInProcess) => (dispatch) => {
  dispatch({
    type: VideoPlayerActionsConstants.LOAD_NEW_DATA_IN_PROCESS,
    payload: {
      location,
      loadInProcess,
    },
  });
};

export const appendVideoPlayerDataToPlaylistAction =
  ({ location, data = [], page, callback }) =>
  (dispatch) => {
    dispatch({
      type: VideoPlayerActionsConstants.APPEND_DATA_TO_PLAYLIST,
      payload: {
        location,
        data,
        page,
      },
    });

    if (callback) {
      callback();
    }
  };

export const showVideoPlayerAction =
  ({ location, playingId, playingProjectId, userId, target, autoPlay }) =>
  (dispatch) => {
    const { store } = ReduxStoreService.getInstance();

    const playList = [];

    const {
      projects = [],
      events = [],
      wantedList = [],
      trendingInfo = [],
      blogItemRelatedProjects = {},
      sortSelected,
      filtersApplied,
      pageSettings: {
        currentNumber: currentNumberPage,
        size: pageSize,
        totalPages,
        page: { currentNumber: currentNumberPageIn, size: pageSizeIn, totalPages: totalPagesIn } = {},
      } = {},
    } = store.getState()[videoReducers[location]] || {};

    switch (location) {
      case ProjectsLocationsConstants.MY_FEED: {
        playList.push(
          ...projects.map(({ id, project: { id: projectId, albumTitle, artists, youtubeLink } = {} }) => ({
            id,
            projectId,
            albumTitle,
            artists,
            youtubeLink,
          }))
        );
        break;
      }
      case ProjectsLocationsConstants.FUNDING_NOW: {
        playList.push(
          ...events.map(({ id, target: { id: projectId, albumTitle, artists, youtubeLink } = {} }) => ({
            id,
            projectId,
            albumTitle,
            artists,
            youtubeLink,
          }))
        );
        break;
      }
      case ProjectsLocationsConstants.BLOG: {
        playList.push(...(blogItemRelatedProjects[userId] ?? []).map(mapProjectToPlaylistItemUtil));

        break;
      }
      case ProjectsLocationsConstants.TRENDING: {
        const sortedTrending = orderBy(trendingInfo, ['currentPosition']);
        const trending = sortedTrending.map(({ projectId }) => projects.find(({ id }) => id === projectId));

        playList.push(...trending.map(mapProjectToPlaylistItemUtil));
        break;
      }
      case ProjectsLocationsConstants.LATE_ENTRY:
      case ProjectsLocationsConstants.LATE_ENTRY_FULL:
      case ProjectsLocationsConstants.NEW_ARRIVALS:
      case ProjectsLocationsConstants.PROJECTS:
      case ProjectsLocationsConstants.MY_PROJECTS:
      case ProjectsLocationsConstants.RIPPER:
      case ProjectsLocationsConstants.PROJECTS_USER: {
        playList.push(...projects.map(mapProjectToPlaylistItemUtil));
        break;
      }
      case ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS: {
        playList.push(
          ...wantedList.map(({ id, releaseInfo: { id: projectId, album: albumTitle, artists, youtubeLink } = {} }) => ({
            id,
            projectId,
            albumTitle,
            artists,
            youtubeLink,
          }))
        );
        break;
      }
      default: {
        break;
      }
    }

    dispatch({
      type: VideoPlayerActionsConstants.SHOW_VIDEO_PLAYER,
      payload: {
        location,
        autoPlay,
        playingId,
        playingProjectId,
        playList,
        userId,
        target,
        sortSelected,
        filtersApplied,
        page: currentNumberPageIn >= 0 ? currentNumberPageIn : currentNumberPage,
        pageSize: pageSizeIn >= 0 ? pageSizeIn : pageSize,
        totalPages: totalPagesIn >= 0 ? totalPagesIn : totalPages,
      },
    });
  };

export const closeVideoPlayerAction = () => (dispatch) => {
  dispatch({
    type: VideoPlayerActionsConstants.CLOSE_VIDEO_PLAYER,
  });
};

export const togglePlayVideoPlayerAction =
  (isPlay, { externalTriggerPause, externalTriggerPlay } = {}) =>
  (dispatch) => {
    dispatch({
      type: VideoPlayerActionsConstants.TOGGLE_PLAY_VIDEO_PLAYER,
      payload: {
        isPlay,
        externalTriggerPause,
        externalTriggerPlay,
      },
    });
  };

export const removeVideoInVideoPlayerAction =
  ({ location, videoId }) =>
  (dispatch) => {
    dispatch({
      type: VideoPlayerActionsConstants.REMOVE_VIDEO_IN_VIDEO_PLAYER,
      payload: {
        location,
        videoId,
      },
    });
  };

export const updateInProcessVideoPlayerAction = (inProcess) => (dispatch) => {
  dispatch({
    type: VideoPlayerActionsConstants.UPDATE_IN_PROCESS_VIDEO_PLAYER,
    payload: {
      inProcess,
    },
  });
};

export const setListenedVideoPlayerAction =
  ({ location, id }) =>
  (dispatch) => {
    dispatch({
      type: VideoPlayerActionsConstants.LISTENED_VIDEO_VIDEO_PLAYER,
      payload: {
        location,
        id,
      },
    });
  };

export const removeListenedVideoPlayerAction =
  ({ location }) =>
  (dispatch) => {
    dispatch({
      type: VideoPlayerActionsConstants.REMOVE_LISTENED_VIDEO_VIDEO_PLAYER,
      payload: {
        location,
      },
    });
  };

export const changeVideoPlayerVideoAction = ({ videoIdx }) =>
  createAction(VideoPlayerActionsConstants.VIDEO_PLAYER_CHANGE_VIDEO, {
    videoIdx,
  });
