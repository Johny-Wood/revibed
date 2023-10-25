import { ScrollActionsConstants } from '@/constants/actions/scroll';

import createAction from '../actionCreator';

export const disableScrollAction = ({ isDisabled }) =>
  createAction(ScrollActionsConstants.DISABLE_SCROLL, {
    isDisabled,
  });
