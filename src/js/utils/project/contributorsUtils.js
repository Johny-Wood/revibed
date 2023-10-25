import cloneDeep from 'lodash/cloneDeep';

const updateContributorCuts = ({
  contributors = [],
  userId,
  boughtInfo: {
    GOLDEN_COIN: { cutsCount: goldenCoinCutsCount = 0 } = {},
    GEM_CONTRIBUTOR: { cutsCount: gemContributorCutsCount = 0 } = {},
  } = {},
  cutsCountNew,
}) => {
  const contributorsTmp = cloneDeep(contributors);
  const findContributorIdx = contributorsTmp.findIndex(({ id: contributorId }) => contributorId === userId);

  if (findContributorIdx === -1) {
    return contributorsTmp;
  }

  const newGemContributorCount = gemContributorCutsCount ? 1 : 0;
  const newGoldenCoinCount = goldenCoinCutsCount ? 1 : 0;

  contributorsTmp[findContributorIdx] = {
    ...contributors[findContributorIdx],
    pointsCountInfo: {
      ...contributors[findContributorIdx].pointsCountInfo,
      GEM:
        contributors[findContributorIdx].pointsCountInfo?.GEM >= 0
          ? contributors[findContributorIdx].pointsCountInfo.GEM + newGemContributorCount
          : newGemContributorCount,
      GOLDEN_COIN:
        contributors[findContributorIdx].pointsCountInfo?.GOLDEN_COIN >= 0
          ? contributors[findContributorIdx].pointsCountInfo.GOLDEN_COIN + newGoldenCoinCount
          : newGoldenCoinCount,
    },
    shareOfParticipation: contributors[findContributorIdx].shareOfParticipation + cutsCountNew,
  };

  return contributorsTmp;
};

const updateFounderCuts = ({
  requestedUserInfo = {},
  requestedUserInfo: {
    contributor: {
      cutsCount: myCutsCount = 0,
      totalSum: myTotalSum = 0,
      coinsSum: myCoinsSum = 0,
      gemSum: myGemSum = 0,
      gemsUsed: myGemsUsed,
      coinUsed: myCoinUsed,
    } = {},
  } = {},
  boughtInfo: {
    COIN: { sum: coinSum = 0 } = {},
    GOLDEN_COIN: { sum: goldenCoinSum = 0, cutsCount: goldenCoinCutsCount = 0 } = {},
    GEM_CONTRIBUTOR: { sum: gemContributorSum = 0, cutsCount: gemContributorCutsCount = 0 } = {},
  } = {},
  cutsCountNew,
}) => {
  const newGemContributorCount = gemContributorCutsCount ? 1 : 0;
  const newGoldenCoinCount = goldenCoinCutsCount ? 1 : 0;

  return {
    ...requestedUserInfo.contributor,
    participation: true,
    cutsCount: myCutsCount + cutsCountNew,
    totalSum: myTotalSum + coinSum + gemContributorSum + goldenCoinSum,
    coinsSum: myCoinsSum + coinSum,
    gemsSum: myGemSum + gemContributorSum,
    coinsUsed: myCoinUsed || coinSum > 0,
    gemsUsed: myGemsUsed || gemContributorCutsCount > 0,
    pointsCountInfo: {
      ...requestedUserInfo.contributor.pointsCountInfo,
      GEM:
        requestedUserInfo.contributor.pointsCountInfo.GEM >= 0
          ? requestedUserInfo.contributor.pointsCountInfo.GEM + newGemContributorCount
          : newGemContributorCount,
      GOLDEN_COIN:
        requestedUserInfo.contributor.pointsCountInfo.GOLDEN_COIN >= 0
          ? requestedUserInfo.contributor.pointsCountInfo.GOLDEN_COIN + newGoldenCoinCount
          : newGoldenCoinCount,
    },
  };
};

export const updateContributorsInfoUtil = ({ project = {}, boughtInfo = {}, cutsCountNew, firstCut, userId, userIdStore }) => {
  let projectTmp = cloneDeep(project);

  const { requestedUserInfo = {}, contributors = [] } = projectTmp;

  if (contributors.length && !firstCut) {
    projectTmp = {
      ...projectTmp,
      contributors: updateContributorCuts({
        contributors,
        userId,
        boughtInfo,
        cutsCountNew,
      }),
    };
  }

  if (userId === userIdStore) {
    projectTmp = {
      ...projectTmp,
      requestedUserInfo: {
        ...requestedUserInfo,
        contributor: updateFounderCuts({
          requestedUserInfo,
          boughtInfo,
          cutsCountNew,
        }),
      },
    };
  }

  return projectTmp;
};
