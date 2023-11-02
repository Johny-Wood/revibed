import { memo, useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import RedirectComponent from '@/components/common/RedirectComponent';
import Button from '@/components/ui/buttons/Button';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupCommonIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { addToCartRequestAction } from '@/redux-actions/marketplace/marketplaceCartActions';
import NextRouter from '@/services/NextRouter';
import { handleErrorUtil } from '@/utils/apiUtils';
import { parseReplaceTextUtil } from '@/utils/textUtils';

const MarketplaceBuyButton = memo(
  ({
    marketplaceCardId,
    goodsId,
    inCart,
    targetType = 'TRACK',
    buyText = targetType === 'TRACK' ? 'Buy track' : 'Buy album',
    styleProps: { transparent, size, borderColor, className, type } = {},
    disabled,

    children,

    addToCartInProcessId,
    addToCartRequest,
    showPopup,
  }) => {
    const buttonDisabled = useMemo(() => addToCartInProcessId > 0 || disabled, [addToCartInProcessId, disabled]);

    const { router } = NextRouter.getInstance();

    return (
      <RedirectComponent routeBefore={parseReplaceTextUtil(RoutePathsConstants.MARKETPLACE_ITEM, marketplaceCardId)}>
        <Button
          className={classNames(className)}
          text={!inCart ? buyText : 'In cart'}
          type={type}
          transparent={transparent}
          size={size}
          borderColor={borderColor}
          disabled={addToCartInProcessId === goodsId || disabled}
          isInProcess={addToCartInProcessId === goodsId}
          onClick={() => {
            if (inCart) {
              router.push(RoutePathsConstants.CART).then();
              return;
            }

            if (buttonDisabled) {
              return;
            }

            addToCartRequest({ goodsId, targetType, marketplaceCardId })
              .then()
              .catch(({ error }) => {
                if (error) {
                  handleErrorUtil(error, {
                    NOT_FOUND: () => {
                      showPopup(PopupCommonIdsConstants.WarningPopup, {
                        text: MessagesErrorConstants.GOODS_NOT_FOUND,
                      });
                    },
                    GOODS_ALREADY_IN_CART: () => {
                      showPopup(PopupCommonIdsConstants.WarningPopup, {
                        text: MessagesErrorConstants.GOODS_ALREADY_IN_CART,
                      });
                    },
                    GOODS_ALREADY_PURCHASED: () => {
                      showPopup(PopupCommonIdsConstants.WarningPopup, {
                        text: MessagesErrorConstants.GOODS_ALREADY_PURCHASED,
                      });
                    },
                    GOODS_PURCHASE_NO_LONGER_AVAILABLE: () => {
                      showPopup(PopupCommonIdsConstants.WarningPopup, {
                        text: MessagesErrorConstants.GOODS_PURCHASE_NO_LONGER_AVAILABLE,
                      });
                    },
                  });
                }
              });
          }}
        >
          {children}
        </Button>
      </RedirectComponent>
    );
  }
);

export default connect(
  (state) => ({
    addToCartInProcessId: state.MarketplaceCartReducer.addToCartInProcessId,
  }),
  (dispatch) => ({
    addToCartRequest: ({ goodsId, marketplaceCardId, targetType }) =>
      addToCartRequestAction({ goodsId, marketplaceCardId, targetType, dispatch }),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(MarketplaceBuyButton);
