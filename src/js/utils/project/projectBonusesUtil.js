import cloneDeep from 'lodash/cloneDeep';

import LateEntrySlotTypesConstants from '@/constants/lateEntry/slot-types';

export const deleteFreeBonusUtil = ({
  freeBonuses = {},
  freeBonuses: { slots: freeBonusesSlots = [] } = {},
  type,
  removeAll,
}) => {
  let freeBonusesTmp = cloneDeep(freeBonuses);
  const freeBonusesSlotsTmp = cloneDeep(freeBonusesSlots);

  if (removeAll) {
    freeBonusesSlotsTmp.filter(({ type: foundType }) => foundType !== type);
  } else {
    const foundFreeBonusIdx = freeBonusesSlotsTmp.findIndex(({ type: foundType }) => foundType === type);

    if (foundFreeBonusIdx !== -1) {
      freeBonusesSlotsTmp.splice(foundFreeBonusIdx, 1);
    }
  }

  freeBonusesTmp = {
    ...freeBonusesTmp,
    slots: freeBonusesSlotsTmp,
  };

  return freeBonusesTmp;
};

export const deleteFreeBonusesUtil = ({ freeBonuses = {}, boughtInfo = {} }) => {
  let freeBonusesTmp = cloneDeep(freeBonuses);

  Object.keys(boughtInfo).forEach((type) => {
    freeBonusesTmp = deleteFreeBonusUtil({ freeBonuses: freeBonusesTmp, type });
  });

  return freeBonusesTmp;
};

export const getFreeBonusesGemSlotsUtil = ({ freeBonusesSlots = [] }) =>
  freeBonusesSlots.filter(({ type, contributor }) => type === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR && !contributor) || [];

export const getFreeBonusesGoldenCoinSlotsUtil = ({ freeBonusesSlots = [] }) =>
  freeBonusesSlots.filter(({ type, contributor }) => type === LateEntrySlotTypesConstants.GOLDEN_COIN && !contributor) || [];
