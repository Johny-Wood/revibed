import { textForLotsOfUtil } from '../textUtils';

export const rewardFormatTypeUtil = {
  BONUSES_PAGE: 'BONUSES_PAGE',
  SIGN_UP: 'SIGN_UP',
  SIGN_UP_POPUP_TITLE: 'SIGN_UP_POPUP_TITLE',
};

const formats = {
  [rewardFormatTypeUtil.BONUSES_PAGE]: {
    GEM: [' GEM', ' GEMS'],
    COIN: ['K', 'K'],
  },
  [rewardFormatTypeUtil.SIGN_UP]: {
    GEM: ['gem', 'gems'],
    COIN: ['koin', 'koins'],
  },
  [rewardFormatTypeUtil.SIGN_UP_POPUP_TITLE]: {
    GEM: ['Gem', 'Gems'],
    COIN: ['Koin', 'Koins'],
  },
};

export const rewardTypeFormatterUtil = ({ amount, type, format }) => textForLotsOfUtil(amount, formats[format][type]);
