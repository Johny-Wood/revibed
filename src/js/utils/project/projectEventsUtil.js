import cloneDeep from 'lodash/cloneDeep';

import { updateContributorsInfoUtil } from './contributorsUtils';
import { deleteFreeBonusesUtil } from './projectBonusesUtil';

export const projectNewCutUtil = ({
  project = {},
  eventData: {
    cutsCount: cutsCountNew,
    userId,
    firstCut,
    boughtInfo = {},
    boughtInfo: {
      COIN: { sum: coinSum = 0 } = {},
      GOLDEN_COIN: { sum: goldenCoinSum = 0 } = {},
      GEM_CONTRIBUTOR: { sum: gemContributorSum = 0 } = {},
    } = {},
  } = {},
  userIdStore,
  eventsUpdated = [],
}) => {
  let projectTmp = cloneDeep(project);

  const { totalCutsSum, cutsCount, freeBonuses: freeBonusesStore = {} } = projectTmp;

  projectTmp = {
    ...projectTmp,
    freeBonuses: deleteFreeBonusesUtil({
      freeBonuses: freeBonusesStore,
      boughtInfo,
    }),
  };

  projectTmp = {
    ...projectTmp,
    ...updateContributorsInfoUtil({
      project: projectTmp,
      cutsCountNew,
      firstCut,
      userId,
      userIdStore,
      boughtInfo,
    }),
    events: eventsUpdated,
    cutsCount: cutsCount + cutsCountNew,
    totalCutsSum: totalCutsSum + coinSum + gemContributorSum + goldenCoinSum,
  };

  return projectTmp;
};
