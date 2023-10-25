import cloneDeep from 'lodash/cloneDeep';

import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { ProjectEventsConstants } from '@/constants/projects/events';
import { addContributorToLateEntrySlotUtil } from '@/utils/project/projectLateEntryUtil';

export const updateNewContributorInfoHandlersUtil = ({ data, type, projectFindIdx, value, location }) => {
  const projectsTmp = cloneDeep(data);

  if (projectFindIdx > -1 && projectsTmp && projectsTmp[projectFindIdx]) {
    switch (type) {
      case ProjectBaseInfoConstants.PROJECT_JOINED_USER: {
        const { contributorsCount = 0 } = projectsTmp[projectFindIdx];

        projectsTmp[projectFindIdx] = {
          ...projectsTmp[projectFindIdx],
          contributorsCount: contributorsCount + 1,
        };

        break;
      }
      default:
        break;
    }

    if (location === 'PROJECTS' || location === 'PROJECT') {
      switch (type) {
        case ProjectEventsConstants.PROJECT_JOINED_USER_LATE_ENTRY: {
          const { lateEntryInfo } = projectsTmp[projectFindIdx];
          const { isMe, pointsCountInfo } = value;

          if (isMe) {
            break;
          }

          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            contributorsCount: projectsTmp[projectFindIdx].contributorsCount + 1,
          };

          projectsTmp[projectFindIdx] = {
            ...projectsTmp[projectFindIdx],
            lateEntryInfo: addContributorToLateEntrySlotUtil({
              lateEntryInfo,
              contributor: value,
              pointsCountInfo,
            }),
          };

          break;
        }
        default:
          break;
      }
    }
  }

  return projectsTmp;
};
