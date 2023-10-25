import GtmPusher from './gtmPusher';

export const analyticsStandartPush = (args) => {
  GtmPusher.getInstance().standardEvent(args);
};

export const analyticsUserIdPush = (UID) => {
  GtmPusher.getInstance().sendUserIdEvent(UID);
};

export const analyticsSignUpEventPush = () => {
  GtmPusher.getInstance().sendSignUpEvent();
};

export const analyticsPurchasePush = ({ transactionId, cutPrice, projectName, projectId, projectPrice }) => {
  GtmPusher.getInstance().standardEvent({ ecommerce: null });
  GtmPusher.getInstance().standardEvent({
    event: 'purchases',
    ecommerce: {
      transaction_id: transactionId,
      value: cutPrice,
      currency: 'EUR',
      items: [
        {
          item_name: projectName,
          item_id: projectId,
          price: projectPrice,
          quantity: 1,
        },
      ],
    },
  });
};

export const analyticsWantListImportPush = ({ wantlistType, releaseQuantity }) => {
  GtmPusher.getInstance().standardEvent({
    event: 'wantlist_add',
    wantlist_type: wantlistType,
    release_quantity: releaseQuantity,
  });
};

export const analyticsWantListChangePlanPush = ({ planType, releaseQuantity, planValue }) => {
  GtmPusher.getInstance().standardEvent({
    event: 'wantlist_plan_change',
    plan_type: planType,
    release_quantity: releaseQuantity,
    plan_value: planValue,
    currency: 'EUR',
  });
};
