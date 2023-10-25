import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';

import { EventsActionsConstants } from '@/constants/actions/common/events';
import { VideoPlayerActionsConstants } from '@/constants/actions/components/videoPlayer';
import EventsLocationsConstants from '@/constants/events/location';
import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { ProjectEventsConstants } from '@/constants/projects/events';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ReleaseLocationConstants } from '@/constants/release';
import { getWithoutDuplicateLinksFromProjectsUtil, getWithoutEmptyLinksFromPlaylistUtil } from '@/utils/player/videoPlayerUtils';

import { createHandlers, createReducer } from '../handler';

const init = {
  list: [],
  listenedIds: [],
  filtersApplied: null,
  sortSelected: null,
  loadInProcess: false,
  startPage: 0,
  page: 0,
  totalPages: 0,
  pageSize: 25,
};

const initialPlayList = {
  [ProjectsLocationsConstants.FUNDING_NOW]: init,
  [ProjectsLocationsConstants.TRENDING]: init,
  [ProjectsLocationsConstants.NEW_ARRIVALS]: init,
  [ProjectsLocationsConstants.PROJECTS]: init,
  [ProjectsLocationsConstants.MY_PROJECTS]: init,
  [ProjectsLocationsConstants.RIPPER]: init,
  [ProjectsLocationsConstants.PROJECTS_USER]: init,
  [ProjectsLocationsConstants.LATE_ENTRY]: init,
  [ProjectsLocationsConstants.LATE_ENTRY_FULL]: init,
  [ProjectsLocationsConstants.MY_FEED]: init,
  [ProjectsLocationsConstants.BLOG]: init,
  [ReleaseLocationConstants.SYSTEM_WANT_LIST_ITEMS]: init,
};

const initialBase = {
  playList: initialPlayList,
  shown: false,
  playing: false,
  triggerPlayDate: 0,
  inProcess: true,
  playingId: null,
  externalTriggerPause: 0,
  externalTriggerPlay: 0,
  externalTriggerPlaying: false,
};

const initialState = {
  autoPlay: false,
  shown: false,
  playing: false,
  activeLocation: '',
  userId: '',
  target: '',
  ...initialBase,
};

const handlers = createHandlers({
  [VideoPlayerActionsConstants.SHOW_VIDEO_PLAYER]: (
    state,
    {
      location,
      autoPlay,
      playingId,
      playingProjectId,
      playList,
      userId,
      target,
      sortSelected,
      filtersApplied,
      page,
      pageSize,
      totalPages,
    }
  ) => {
    const projects = getWithoutEmptyLinksFromPlaylistUtil(playList);

    const list = getWithoutDuplicateLinksFromProjectsUtil({
      projects,
      playingId,
      playingProjectId,
    });

    return {
      ...state,
      autoPlay,
      shown: true,
      playingId,
      activeLocation: location,
      triggerPlayDate: new Date().valueOf(),
      playList: {
        ...state.playList,
        [location]: {
          ...(state.playList[location] || {}),
          list,
          listenedIds: [],
          sortSelected,
          filtersApplied,
          startPage: page,
          page,
          pageSize,
          totalPages,
        },
      },
      userId,
      target,
    };
  },

  [VideoPlayerActionsConstants.CLOSE_VIDEO_PLAYER]: (state) => ({
    ...state,
    ...initialBase,
  }),

  [VideoPlayerActionsConstants.TOGGLE_PLAY_VIDEO_PLAYER]: (
    state,
    { isPlay = !state.playing, externalTriggerPause, externalTriggerPlay }
  ) => ({
    ...state,
    playing: isPlay,
    externalTriggerPause: externalTriggerPause ? new Date().valueOf() : state.externalTriggerPause,
    externalTriggerPlay: externalTriggerPlay ? new Date().valueOf() : state.externalTriggerPlay,
  }),

  [VideoPlayerActionsConstants.REMOVE_VIDEO_IN_VIDEO_PLAYER]: (state, { location, videoId }) => {
    const updatedPlayList = cloneDeep(state.playList[location].list);
    const foundVideoIndex = updatedPlayList.findIndex(({ id }) => id === videoId);

    if (foundVideoIndex === -1) {
      return state;
    }

    updatedPlayList.splice(foundVideoIndex, 1);

    return {
      ...state,
      playList: {
        ...state.playList,
        [location]: {
          ...state.playList[location],
          list: updatedPlayList,
        },
      },
    };
  },

  [VideoPlayerActionsConstants.UPDATE_IN_PROCESS_VIDEO_PLAYER]: (state, { inProcess }) => ({
    ...state,
    inProcess,
  }),

  [VideoPlayerActionsConstants.LISTENED_VIDEO_VIDEO_PLAYER]: (state, { location, id }) => ({
    ...state,
    playList: {
      ...state.playList,
      [location]: {
        ...state.playList[location],
        listenedIds: uniq([...state.playList[location].listenedIds, id]),
      },
    },
  }),

  [VideoPlayerActionsConstants.REMOVE_LISTENED_VIDEO_VIDEO_PLAYER]: (state, { location }) => {
    const newList = cloneDeep(state.playList[location].list);

    return {
      ...state,
      playList: {
        ...state.playList,
        [location]: {
          ...state.playList[location],
          list: newList.filter(({ id }) => !state.playList[location].listenedIds.includes(id)),
        },
      },
    };
  },

  [`${EventsLocationsConstants.FUNDING_NOW}_${EventsActionsConstants.PROJECT_NEW_CUT}`]: (
    state,
    { removeId, data: { value, type } = {} } = {}
  ) => {
    if (!state.shown || state.activeLocation !== ProjectsLocationsConstants.FUNDING_NOW) {
      return state;
    }

    const newFundingNowPlayList = cloneDeep(state.playList[ProjectsLocationsConstants.FUNDING_NOW].list);
    const { target: { id: projectId, youtubeLink, albumTitle, artists } = {} } = value;
    const foundProjectIndex = newFundingNowPlayList.findIndex(({ projectId: id }) => id === projectId);

    if (
      type !== ProjectEventsConstants.PROJECT_NEW_CUT &&
      type !== ProjectBaseInfoConstants.PROJECT_PROMOTION &&
      type !== ProjectEventsConstants.PROJECT_MEDIA_SECURED
    ) {
      return state;
    }

    if (foundProjectIndex === -1 && youtubeLink) {
      const foundRemoveVideoIndex = newFundingNowPlayList.findIndex(({ id }) => removeId === id);

      if (foundRemoveVideoIndex > -1) {
        newFundingNowPlayList.splice(foundRemoveVideoIndex, 1);
      }

      const newItem = {
        id: value.id,
        projectId,
        youtubeLink,
        albumTitle,
        artists,
      };

      newFundingNowPlayList.unshift(newItem);
    }

    return {
      ...state,
      playList: {
        ...state.playList,
        [ProjectsLocationsConstants.FUNDING_NOW]: {
          ...state.playList[ProjectsLocationsConstants.FUNDING_NOW],
          list: newFundingNowPlayList,
        },
      },
    };
  },

  [`${ProjectsLocationsConstants.NEW_ARRIVALS}_${EventsActionsConstants.PROJECT_PUBLISHED}`]: (
    state,
    { newProject, removeId }
  ) => {
    if (!state.shown || state.activeLocation !== ProjectsLocationsConstants.NEW_ARRIVALS) {
      return state;
    }

    const newNewArrivalsPlayList = cloneDeep(state.playList[ProjectsLocationsConstants.NEW_ARRIVALS].list);
    const { id: projectId, youtubeLink, albumTitle, artists } = newProject;
    const foundProjectIndex = newNewArrivalsPlayList.findIndex(({ projectId: id }) => id === projectId);

    if (foundProjectIndex === -1 && youtubeLink) {
      const foundRemoveVideoIndex = newNewArrivalsPlayList.findIndex(({ id }) => removeId === id);

      if (foundRemoveVideoIndex > -1) {
        newNewArrivalsPlayList.splice(foundRemoveVideoIndex, 1);
      }

      const newItem = {
        id: projectId,
        projectId,
        youtubeLink,
        albumTitle,
        artists,
      };

      newNewArrivalsPlayList.unshift(newItem);
    }

    return {
      ...state,
      playList: {
        ...state.playList,
        [ProjectsLocationsConstants.NEW_ARRIVALS]: {
          ...state.playList[ProjectsLocationsConstants.NEW_ARRIVALS],
          list: newNewArrivalsPlayList,
        },
      },
    };
  },

  [VideoPlayerActionsConstants.LOAD_NEW_DATA_IN_PROCESS]: (state, { location, loadInProcess }) => ({
    ...state,
    playList: {
      ...state.playList,
      [location]: {
        ...state.playList[location],
        loadInProcess,
      },
    },
  }),

  [VideoPlayerActionsConstants.APPEND_DATA_TO_PLAYLIST]: (state, { location, data, page }) => ({
    ...state,
    playList: {
      ...state.playList,
      [location]: {
        ...state.playList[location],
        loadInProcess: false,
        list: data,
        page,
      },
    },
  }),

  [VideoPlayerActionsConstants.VIDEO_PLAYER_CHANGE_VIDEO]: (state, { videoIdx }) => {
    const { id: playingId } = state.playList[state.activeLocation].list[videoIdx] || {};

    if (!playingId) {
      return state;
    }

    return {
      ...state,
      playingId,
    };
  },
});

const VideoPlayerReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default VideoPlayerReducer;
