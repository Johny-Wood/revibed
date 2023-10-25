import { RoutePathsConstants } from '@/constants/routes/routes';
import { getPurchaseRequestAction, getPurchasesRequestAction } from '@/redux-actions/personal/purchasesActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import { redirectPageUtil } from '@/utils/routeUtils';

const redirectFromCard = ({ req, res, location = RoutePathsConstants.PERSONAL_PURCHASES }) => {
  redirectPageUtil({ location, req, res });
};

export const SSRGetPurchaseCardWithCookie = async ({ ctx }) => {
  const { store } = ReduxStoreService.getInstance();

  const { refreshedToken, req, res, store: { dispatch } = {}, query: { purchaseId } = {} } = ctx;

  const { PurchasesReducer: { cards = {} } = {} } = store.getState();
  const foundPurchaseCard = cards[purchaseId];

  if (req) {
    await getPurchaseRequestAction({
      id: purchaseId,
      dispatch,
      cookie: refreshedToken,
    })
      .then(({ error } = {}) => {
        if (error) {
          if (res) {
            redirectFromCard({
              req,
              res,
            });
          }
        }
      })
      .catch();
  } else if (!foundPurchaseCard) {
    getPurchaseRequestAction({
      id: purchaseId,
      dispatch,
    })
      .then(({ error } = {}) => {
        if (error) {
          redirectFromCard({
            req,
            res,
          });
        }
      })
      .catch();
  }
};

export const SSRGetPurchasesWithCookie = async ({ ctx }) => {
  const { refreshedToken, req, store, store: { dispatch } = {} } = ctx;

  const { PurchasesReducer: { getPurchasesFromApi } = {} } = store.getState();

  if (req) {
    await getPurchasesRequestAction({
      dispatch,
      cookie: refreshedToken,
    })
      .then()
      .catch();
  } else if (!getPurchasesFromApi) {
    getPurchasesRequestAction({
      dispatch,
    })
      .then()
      .catch();
  }
};
