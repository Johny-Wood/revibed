import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import Coin from '@/components/ui/currency/Coin';
import { CommonHeadConstants } from '@/constants/common/head';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupCartIdsConstants, PopupProjectIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { buyCartRequestAction } from '@/redux-actions/marketplace/marketplaceCartActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

function ConfirmPurchasePopup({
  popupId = PopupCartIdsConstants.ConfirmPurchasePopup,
  cartInfo: { totalSum = 0 } = {},
  buyCartInProcess,
  buyCartRequest,
  showPopup,
  closePopup,
}) {
  const router = useRouter();

  return (
    <Popup popupId={popupId} headerText="Purchase confirmation" maxWidth={410}>
      <PopupTextContent className="c-black m-top-15">
        <div className="f-y-center">
          <h4>
            You pay&nbsp;
            <b>
              <Coin afterText={floatWithCommaFixedUtil(totalSum)} />
            </b>
          </h4>
        </div>
      </PopupTextContent>
      <PopupTextContent className="c-black m-top-20">
        <h4>
          This amount will be&nbsp;debited from your&nbsp;
          {CommonHeadConstants.SITE_NAME}
          &nbsp;account.
        </h4>
      </PopupTextContent>
      <PopupDoubleButtons
        popupId={popupId}
        closePopup={closePopup}
        okButtonText={CommonMessagesConstants.CONFIRM}
        okButtonInProcess={buyCartInProcess}
        okButtonDisables={buyCartInProcess}
        okButtonOnClick={() =>
          new Promise((resolve, reject) => {
            if (buyCartInProcess) {
              reject();
              return;
            }

            buyCartRequest()
              .then(() => {
                router.push(RoutePathsConstants.PERSONAL_PURCHASES).then();

                resolve();
              })
              .catch(({ error = {} }) => {
                if (error) {
                  handleErrorUtil(error, {
                    INSUFFICIENT_FUNDS: () => {
                      showPopup(PopupProjectIdsConstants.InsufficientFundsPopup);
                    },
                  });
                }

                reject();
              });
          })
        }
      />
    </Popup>
  );
}

export default connect(
  (state) => ({
    cartInfo: state.MarketplaceCartReducer.cartInfo,
    buyCartInProcess: state.MarketplaceCartReducer.buyCartInProcess,
  }),
  (dispatch) => ({
    buyCartRequest: () => buyCartRequestAction({ dispatch }),
  })
)(ConfirmPurchasePopup);
