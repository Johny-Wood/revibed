import { loadRulesRequestAction } from '@/redux-actions/common/rulesActions';
import ReduxStoreService from '@/services/ReduxStoreService';

export const SSRLoadRules = async ({ rulesName, req, store: { dispatch } = {} }) => {
  const { store } = ReduxStoreService.getInstance();

  if (req) {
    await loadRulesRequestAction(rulesName)(dispatch).then().catch();
  } else {
    const { RulesReducer: { rulesContent = {} } = {} } = store.getState();

    if (rulesName && rulesContent && !rulesContent[rulesName]) {
      loadRulesRequestAction(rulesName)(dispatch).then().catch();
    }
  }
};
