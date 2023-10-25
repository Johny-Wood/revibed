import cloneDeep from 'lodash/cloneDeep';

export const addContributorToLateEntrySlotUtil = ({
  lateEntryInfo = {},
  lateEntryInfo: { slots: lateEntryInfoSlots = [] } = {},
  contributor,
  pointsCountInfo,
}) => {
  let lateEntryInfoTmp = cloneDeep(lateEntryInfo);
  const lateEntryInfoSlotsTmp = cloneDeep(lateEntryInfoSlots);

  if (!contributor || !pointsCountInfo) {
    return lateEntryInfoTmp;
  }

  Object.keys(pointsCountInfo).forEach((type) => {
    const foundLateEntryInfoSlotIdx = lateEntryInfoSlotsTmp.findIndex(
      ({ userBonusType: foundType, contributor: foundContributor }) => foundType === type && !foundContributor
    );

    if (foundLateEntryInfoSlotIdx !== -1) {
      lateEntryInfoSlotsTmp[foundLateEntryInfoSlotIdx].contributor = contributor;
    }
  });

  lateEntryInfoTmp = {
    ...lateEntryInfoTmp,
    slots: lateEntryInfoSlotsTmp,
  };

  return lateEntryInfoTmp;
};
