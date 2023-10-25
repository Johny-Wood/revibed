import cloneDeep from 'lodash/cloneDeep';

import { ProjectEventsConstants } from '@/constants/projects/events';
import { projectNewCutUtil } from '@/utils/project/projectEventsUtil';

export const updateNewEventInfoHandlersUtil = ({
  data,
  type,
  projectFindIdx,
  value,
  location,

  eventsUpdated,
  userIdStore,
}) => {
  const projectsTmp = cloneDeep(data);

  if (projectFindIdx > -1 && projectsTmp && projectsTmp[projectFindIdx]) {
    switch (type) {
      case ProjectEventsConstants.PROJECT_PUBLISHED: {
        const { closeDate } = value;

        if (closeDate) {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            closeDate,
          };
        }
        break;
      }
      default:
        break;
    }

    if (location === 'PROJECTS') {
      switch (type) {
        case ProjectEventsConstants.PROJECT_NEW_CUT: {
          projectsTmp[projectFindIdx] = projectNewCutUtil({
            project: projectsTmp[projectFindIdx],
            eventData: value,
            userIdStore,
          });
          break;
        }
        default:
          break;
      }
    }

    if (location === 'PROJECT') {
      switch (type) {
        case ProjectEventsConstants.PROJECT_NEW_CUT: {
          projectsTmp[projectFindIdx] = projectNewCutUtil({
            project: projectsTmp[projectFindIdx],
            eventData: value,

            userIdStore,
            eventsUpdated,
          });
          break;
        }
        default: {
          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],

            events: eventsUpdated,
          };
          break;
        }
      }
    }
  }

  return projectsTmp;
};
