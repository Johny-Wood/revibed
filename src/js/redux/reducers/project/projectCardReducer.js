import cloneDeep from 'lodash/cloneDeep';
import findLastIndex from 'lodash/findLastIndex';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import uniqBy from 'lodash/uniqBy';

import { ProjectActionsConstants } from '@/constants/actions/project/project';
import { ProjectCardActionsConstants } from '@/constants/actions/projects/projectCard';
import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import { deleteFreeBonusUtil } from '@/utils/project/projectBonusesUtil';
import { updateBaseInfoHandlersUtil } from '@/utils/projects/actions/updateBaseInfoHandlersUtil';
import { updateNewContributorInfoHandlersUtil } from '@/utils/projects/actions/updateNewContributorInfoHandlersUtil';
import { updateNewEventInfoHandlersUtil } from '@/utils/projects/actions/updateNewEventInfoHandlersUtil';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  buyCutInProcess: false,

  getShortProjectCardInProcess: false,

  getProjectCardInProcess: false,
  projectCards: [{}],

  changeOrderProjectVideosInProcess: false,
};

const handlers = createHandlers({
  [ProjectsActionsConstants.PROJECT_UPDATE_BASE_INFO]: (
    state,
    { projectId: projectFindIdx, data: { type, value = {} } = {} }
  ) => {
    const projectsTmp = state.projectCards[0];

    const data = updateBaseInfoHandlersUtil({
      data: projectsTmp,
      projectFindIdx,
      type,
      value,
      location: 'PROJECT',
    });

    return {
      ...state,
      projectCards: [data],
    };
  },
  [ProjectsActionsConstants.PROJECT_NEW_EVENT]: (
    state,
    { userIdStore, projectId: projectFindIdx, data: { type, value } = {} }
  ) => {
    const projectsTmp = cloneDeep(state.projectCards[0]);
    const { from, id, to, date, eventType, payload, pinned: newEventPinned } = value || {};

    if (projectFindIdx > -1 && projectsTmp && projectsTmp[projectFindIdx]) {
      const newEvent = omitBy(
        {
          id,
          eventType,
          pinned: newEventPinned,
          payload,
          from,
          to,
          date,
        },
        isNil
      );

      const { events = [] } = projectsTmp[projectFindIdx];
      const eventsTmp = cloneDeep(events);
      let eventsUpdatedTmp = eventsTmp;

      const findFirstPinned = findLastIndex(eventsTmp, 'pinned');

      if (eventsTmp.length <= 0) {
        eventsUpdatedTmp = [newEvent];
      } else if (findFirstPinned > -1) {
        if (findFirstPinned > -1) {
          if (!newEventPinned) {
            eventsUpdatedTmp.splice(findFirstPinned + 1, 0, newEvent);
          } else {
            eventsUpdatedTmp.splice(0, 0, newEvent);
          }
        }
      } else {
        eventsUpdatedTmp = [newEvent, ...eventsTmp];
      }

      const eventsUpdated = uniqBy(eventsUpdatedTmp, 'id');

      const data = updateNewEventInfoHandlersUtil({
        data: projectsTmp,
        projectFindIdx,
        type,
        value: to,
        location: 'PROJECT',
        eventsUpdated,
        userIdStore,
      });

      return {
        ...state,
        projectCards: [data],
      };
    }

    return {
      ...state,
    };
  },
  [ProjectsActionsConstants.PROJECT_NEW_CONTRIBUTOR]: (state, { projectId: projectFindIdx, data: { type, value } = {} }) => {
    const projectsTmp = state.projectCards[0];

    const data = updateNewContributorInfoHandlersUtil({
      data: projectsTmp,
      projectFindIdx,
      type,
      value,
      location: 'PROJECT',
    });

    return {
      ...state,
      projectCards: [data],
    };
  },
  [ProjectsActionsConstants.BUY_CUT_IN_PROCESS]: (state, { buyCutInProcess }) => ({
    ...state,
    buyCutInProcess,
  }),
  [ProjectsActionsConstants.BUY_CUT_SUCCESS]: (state, { projectId, commentsInfo, updatedProject, projectInfo }) => {
    const projectsTmp = state.projectCards[0];

    if (!projectsTmp[projectId]) {
      return { ...state };
    }

    projectsTmp[projectId] = !updatedProject
      ? {
          commentsInfo,
          ...projectsTmp[projectId],
        }
      : updatedProject;

    if (projectInfo) {
      projectsTmp[projectId] = {
        ...projectsTmp[projectId],
        requestedUserInfo: projectInfo.requestedUserInfo,
      };
    }

    return {
      ...state,
      buyCutInProcess: false,
      projectCards: [projectsTmp],
    };
  },
  [ProjectCardActionsConstants.GET_PROJECT_CARD_IN_PROCESS]: (state, { getProjectCardInProcess }) => ({
    ...state,
    getProjectCardInProcess,
  }),
  [ProjectCardActionsConstants.GET_PROJECT_CARD_SUCCESS]: (state, { projectCard, projectCardId }) => ({
    ...state,
    getProjectCardInProcess: false,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: { ...projectCard },
      },
    ],
  }),
  [ProjectCardActionsConstants.CHANGE_COMMENTS_COUNTER]: (state, { projectCardId, commentsCount }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              commentsInfo: {
                ...state.projectCards[0][projectCardId].commentsInfo,
                commentsCount,
              },
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.TRANSFORM_TO_PROJECT_COMMENTS]: (state, { projectCardId, commentsInfo = {} }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              commentsInfo: {
                ...state.projectCards[0][projectCardId].commentsInfo,
                ...commentsInfo,
              },
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.TRANSFORM_PROJECT_CARD_DOCUMENT]: (state, { projectCardId, documents = [] }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              documents,
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.ADD_PROJECT_CARD_DOCUMENT]: (state, { projectCardId, document = {} }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              documents: state.projectCards[0][projectCardId].documents
                ? [document, ...state.projectCards[0][projectCardId].documents]
                : [document],
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.REMOVE_PROJECT_CARD_DOCUMENT]: (state, { projectCardId, documentId = -1 }) => {
    if (!state.projectCards[0][projectCardId]) {
      return state;
    }

    const findIndexDocument = state.projectCards[0][projectCardId].documents.findIndex(({ id }) => id === documentId);
    const { documents: documentsFromCard = [] } = state.projectCards[0][projectCardId];
    const documents = cloneDeep(documentsFromCard);

    if (findIndexDocument > -1) {
      documents.splice(findIndexDocument, 1);
    }

    return {
      ...state,
      projectCards: [
        {
          ...state.projectCards[0],
          [projectCardId]: state.projectCards[0][projectCardId]
            ? {
                ...state.projectCards[0][projectCardId],
                documents,
              }
            : {},
        },
      ],
    };
  },
  [ProjectCardActionsConstants.TRANSFORM_PROJECT_CARD_REAL_CONDITIONS]: (state, { projectCardId, realConditions = {} }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              ...realConditions,
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.TRANSFORM_PROJECT_CARD_ADDITIONAL_EXPENSE]: (state, { projectCardId, expenses = [] }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              expenses,
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.ADD_PROJECT_CARD_ADDITIONAL_EXPENSE]: (state, { projectCardId, expense = {} }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              expenses: state.projectCards[0][projectCardId].expenses
                ? [expense, ...state.projectCards[0][projectCardId].expenses]
                : [expense],
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.REMOVE_PROJECT_CARD_ADDITIONAL_EXPENSE]: (state, { projectCardId, expenseId = -1 }) => {
    if (!state.projectCards[0][projectCardId]) {
      return state;
    }

    const foundIndexAdditionalExpenses = state.projectCards[0][projectCardId].expenses.findIndex(({ id }) => id === expenseId);
    const { expenses: additionalExpensesFromCard = [] } = state.projectCards[0][projectCardId];
    const expenses = cloneDeep(additionalExpensesFromCard);

    if (foundIndexAdditionalExpenses > -1) {
      expenses.splice(foundIndexAdditionalExpenses, 1);
    }

    return {
      ...state,
      projectCards: [
        {
          ...state.projectCards[0],
          [projectCardId]: state.projectCards[0][projectCardId]
            ? {
                ...state.projectCards[0][projectCardId],
                expenses,
              }
            : {},
        },
      ],
    };
  },
  [ProjectCardActionsConstants.REPLACE_PROJECT_CARD]: (state, { projectCardId, project = {} }) => ({
    ...state,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: project,
      },
    ],
  }),
  [ProjectCardActionsConstants.PROJECT_CHAT_ENABLED_TOGGLE]: (state, { projectCardId, enabled = false }) => {
    if (state.projectCards[0][projectCardId]) {
      return {
        ...state,
        projectCards: [
          {
            ...state.projectCards[0],
            [projectCardId]: state.projectCards[0][projectCardId]
              ? {
                  ...state.projectCards[0][projectCardId],
                  commentsInfo: {
                    ...state.projectCards[0][projectCardId].commentsInfo,
                    enabled,
                  },
                }
              : {},
          },
        ],
      };
    }

    return {
      ...state,
    };
  },
  [ProjectActionsConstants.GET_SHORT_PROJECT_INFO_IN_PROCESS]: (state, { getShortProjectCardInProcess = false }) => ({
    ...state,
    getShortProjectCardInProcess,
  }),
  [ProjectActionsConstants.GET_SHORT_PROJECT_INFO_SUCCESS]: (state) => ({
    ...state,
    getShortProjectCardInProcess: false,
  }),
  [ProjectActionsConstants.CHANGE_ORDER_PROJECT_VIDEO_IN_PROCESS]: (state, { changeOrderProjectVideosInProcess }) => ({
    ...state,
    changeOrderProjectVideosInProcess,
  }),
  [ProjectActionsConstants.CHANGE_ORDER_PROJECT_VIDEO_SUCCESS]: (state, { projectCardId, youtubeLinks = [] }) => ({
    ...state,
    changeOrderProjectVideosInProcess: false,
    projectCards: [
      {
        ...state.projectCards[0],
        [projectCardId]: state.projectCards[0][projectCardId]
          ? {
              ...state.projectCards[0][projectCardId],
              youtubeLinks,
            }
          : {},
      },
    ],
  }),
  [ProjectCardActionsConstants.PROJECT_DELETE_FREE_BONUS_SLOT]: (state, { type, projectCardId, removeAll }) => {
    if (!state.projectCards[0][projectCardId]) {
      return { ...state };
    }

    return {
      ...state,
      projectCards: [
        {
          ...state.projectCards[0],
          [projectCardId]: state.projectCards[0][projectCardId]
            ? {
                ...state.projectCards[0][projectCardId],
                freeBonuses: deleteFreeBonusUtil({
                  removeAll,
                  type,
                  freeBonuses: state.projectCards[0][projectCardId].freeBonuses,
                }),
              }
            : {},
        },
      ],
    };
  },
  [ProjectCardActionsConstants.PROJECT_CHANGE_FOLLOW_USER]: (state, { userId, isFollowing }) => {
    if (!state.projectCards[0]) {
      return { ...state };
    }

    const keys = Object.keys(state.projectCards[0]);

    const projects = {};

    keys.forEach((key) => {
      const { contributors = [], lateEntryInfo = {}, lateEntryInfo: { slots = [] } = {} } = state.projectCards[0][key];

      projects[key] = {
        ...state.projectCards[0][key],
        contributors: contributors.map((contributor) => {
          const { id, subscribersCount } = contributor;

          if (id === userId) {
            return {
              ...contributor,
              subscribersCount: subscribersCount + (isFollowing ? 1 : -1),
              subscription: isFollowing,
            };
          }

          return {
            ...contributor,
          };
        }),
        lateEntryInfo: {
          ...lateEntryInfo,
          slots: slots.map((slot) => {
            const { contributor = {}, contributor: { id, subscribersCount } = {} } = slot;

            if (id === userId) {
              return {
                ...slot,
                contributor: {
                  ...contributor,
                  subscribersCount: subscribersCount + (isFollowing ? 1 : -1),
                  subscription: isFollowing,
                },
              };
            }

            return {
              ...slot,
            };
          }),
        },
      };
    });

    return {
      ...state,
      projectCards: [projects],
    };
  },
});

const ProjectCardReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ProjectCardReducer;
