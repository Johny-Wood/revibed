import { DarkOverlayActionsConstants } from '@/constants/actions/components/darkOverlay';

import createAction from '../actionCreator';

export const toggleShowDarkBackgroundOverlayAction = ({ isShown }) =>
  createAction(DarkOverlayActionsConstants.TOGGLE_SHOW_DARK_BACKGROUND_OVERLAY, {
    isShown,
  });
