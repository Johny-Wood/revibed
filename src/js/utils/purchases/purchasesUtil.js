import ReduxStoreService from '@/services/ReduxStoreService';

import { addItemToListByStoreUtil } from '../listUtils';

export const addPurchaseItemToStoreUtil = ({ item, updateAction, listRequest }) => {
  const { store } = ReduxStoreService.getInstance();

  const { getPurchasesFromApi = false, list = [], pageSettings } = store.getState().PurchasesReducer || {};

  addItemToListByStoreUtil({
    item,
    list,
    listPageSettingsFromStore: pageSettings,
    requestFromApi: getPurchasesFromApi,
    updateAction,
    listRequest,
  });
};
