import { memo, useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import RedirectComponent from '@/components/common/RedirectComponent';
import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupCommonIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import {
  addMarketplaceCardToWantRequestAction,
  removeMarketplaceCardToWantRequestAction,
} from '@/redux-actions/marketplace/marketplaceCardActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function MarketplaceAddToWantButton({
  id,
  inWishlist,

  addMarketplaceCardToWantInProcess,
  removeMarketplaceCardToWantInProcess,
  addMarketplaceCardToWantRequest,
  removeMarketplaceCardToWantRequest,
  showPopup,
}) {
  const disabled = useMemo(
    () => addMarketplaceCardToWantInProcess || removeMarketplaceCardToWantInProcess,
    [addMarketplaceCardToWantInProcess, removeMarketplaceCardToWantInProcess]
  );

  const RemoveFromWantButton = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      memo(() => (
        <Button
          className={styles.marketplaceCardRemoveWantButton}
          text="Unsubscribe"
          transparent
          borderColor="none"
          onClick={() => {
            if (disabled) {
              return;
            }
            removeMarketplaceCardToWantRequest({ goodsId: id });
          }}
        />
      )),
    [disabled, id, removeMarketplaceCardToWantRequest]
  );

  return (
    <RedirectComponent routeBefore={parseReplaceTextUtil(RoutePathsConstants.MARKETPLACE_ITEM, id)}>
      <Button
        className={styles.marketplaceCardAddWantButton}
        text={!inWishlist ? 'Notify me' : 'Diggin’ it'}
        disabled={disabled}
        isInProcess={addMarketplaceCardToWantInProcess || removeMarketplaceCardToWantInProcess}
        tooltip={{
          canShow: !disabled && inWishlist,
          color: 'white',
          withCloseButton: false,
          size: ComponentsCommonConstants.Size.LARGE,
          width: 145,
          position: 'bottom-center',
          childrenEnd: RemoveFromWantButton,
          hover: false,
        }}
        onClick={() => {
          if (disabled) {
            return;
          }

          if (!inWishlist) {
            addMarketplaceCardToWantRequest({ goodsId: id })
              .then()
              .catch(({ error = {} }) => {
                if (error) {
                  handleErrorUtil(error, {
                    GOODS_ALREADY_WANTED: () => {
                      showPopup(PopupCommonIdsConstants.WarningPopup, {
                        text: MessagesErrorConstants.GOODS_ALREADY_WANTED,
                      });
                    },
                  });
                }
              });
          }
        }}
      >
        {inWishlist && !disabled && (
          <span className={classNames(styles.marketplaceCardAddWantButton__splash, 'not-hide')}>
            <ArrowIcon color="white" />
          </span>
        )}
      </Button>
    </RedirectComponent>
  );
}

export default connect(
  (state) => ({
    addMarketplaceCardToWantInProcess: state.MarketplaceCardReducer.addMarketplaceCardToWantInProcess,
    removeMarketplaceCardToWantInProcess: state.MarketplaceCardReducer.removeMarketplaceCardToWantInProcess,
  }),
  (dispatch) => ({
    addMarketplaceCardToWantRequest: ({ goodsId }) => addMarketplaceCardToWantRequestAction({ goodsId, dispatch }),
    removeMarketplaceCardToWantRequest: ({ goodsId }) => removeMarketplaceCardToWantRequestAction({ goodsId, dispatch }),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(MarketplaceAddToWantButton);
