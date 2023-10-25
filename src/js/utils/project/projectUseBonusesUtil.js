import cloneDeep from 'lodash/cloneDeep';

import LateEntrySlotTypesConstants from '@/constants/lateEntry/slot-types';

export const isUseBuyGoldenCoinUtil = ({ goldenCoinsCount = 0, freeBonusesGoldenCoinSlotsCount = 0 }) =>
  goldenCoinsCount > 0 && freeBonusesGoldenCoinSlotsCount > 0;

export const isUseBuyGemUtil = ({
  gemsCount = 0,
  freeBonusesGemSlotsCount = 0,
  goldenCoinsCount = 0,
  freeBonusesGoldenCoinSlotsCount = 0,
  CONTRIBUTE_PROJECT_USE_GEM_ALLOWED,
}) =>
  gemsCount > 0 &&
  CONTRIBUTE_PROJECT_USE_GEM_ALLOWED &&
  !isUseBuyGoldenCoinUtil({ goldenCoinsCount, freeBonusesGoldenCoinSlotsCount }) &&
  freeBonusesGemSlotsCount > 0;

export const availableSlotsForUserUtil = ({ slots = [], gemsCount = 0, goldenCoinsCount = 0 }) =>
  slots.filter(
    ({ type, contributor }) =>
      !contributor &&
      ((type === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR && gemsCount > 0) ||
        (type === LateEntrySlotTypesConstants.GOLDEN_COIN && goldenCoinsCount > 0))
  ) || [];

export const availableSlotsUtil = ({ userIsAuthorized, slots = [], gemsCount = 0, goldenCoinsCount = 0 }) => {
  const slotsForUser = availableSlotsForUserUtil({ slots, goldenCoinsCount, gemsCount });

  const slotsForNotAuthorizedUser = cloneDeep(slots).filter(({ contributor }) => !contributor);

  return !userIsAuthorized || slotsForUser.length === 0 ? slotsForNotAuthorizedUser : slotsForUser;
};
