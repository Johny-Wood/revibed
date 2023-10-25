import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { getCartInfoRequestAction, getCartRequestAction } from '@/redux-actions/marketplace/marketplaceCartActions';
import { loadPersonalTopUpBalanceRequestAction } from '@/redux-actions/personal/balanceActions';
import { getUnreadPersonalNotificationCountsEventsRequestAction } from '@/redux-actions/personal/personalNotificationCountsActions';
import { getPersonalNotificationsRequestAction } from '@/redux-actions/personal/personalNotificationsActions';
import { getShortPersonalUserNotificationsRequestAction } from '@/redux-actions/personal/personalUserNotificationsActions';
import ReduxStoreService from '@/services/ReduxStoreService';

export const logInUtil = ({ userInfo: { goldenCoinsCount = 0 } = {} }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    VariablesReducer: { variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {} } = {},
    MarketplaceCartReducer: { getCartInfoInProcessFromApi, getCartInProcessFromApi } = {},
  } = store.getState();

  if (goldenCoinsCount > 0) {
    store.dispatch(showPopupAction(PopupPersonalIdsConstants.GoldenCoinPopup, {}, false));
  }

  if (DIGITAL_MARKETPLACE_ENABLED) {
    if (!getCartInfoInProcessFromApi) {
      getCartInfoRequestAction({ dispatch: store.dispatch }).then();
    }

    if (!getCartInProcessFromApi) {
      getCartRequestAction({ dispatch: store.dispatch }).then();
    }
  }

  getPersonalNotificationsRequestAction({ dispatch: store.dispatch }).then();
  getUnreadPersonalNotificationCountsEventsRequestAction({ dispatch: store.dispatch }).then();
  getShortPersonalUserNotificationsRequestAction({ pageNumber: 0, dispatch: store.dispatch }).then();
  loadPersonalTopUpBalanceRequestAction({ dispatch: store.dispatch }).then();
};
