import { useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import TrashIcon from '@/icons/want-list/TrashIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { deleteToCartRequestAction } from '@/redux-actions/marketplace/marketplaceCartActions';

function MarketplaceRemoveButton({
  goodsId,
  marketplaceCardId,
  targetType,
  disabled,
  className,

  deleteFromCartInProcessId,
  deleteToCartRequest,
}) {
  const buttonDisabled = useMemo(() => deleteFromCartInProcessId > 0 || disabled, [deleteFromCartInProcessId, disabled]);

  return (
    <ButtonIcon
      type="button_string"
      className={classNames('marketplace-goods__remove', className)}
      icon={TrashIcon}
      disabled={deleteFromCartInProcessId === goodsId || disabled}
      isInProcess={deleteFromCartInProcessId === goodsId}
      onClick={() => {
        if (buttonDisabled) {
          return;
        }

        deleteToCartRequest({ goodsId, marketplaceCardId, targetType });
      }}
    />
  );
}

export default connect(
  (state) => ({
    deleteFromCartInProcessId: state.MarketplaceCartReducer.deleteFromCartInProcessId,
  }),
  (dispatch) => ({
    deleteToCartRequest: ({ goodsId, marketplaceCardId, targetType }) =>
      deleteToCartRequestAction({
        goodsId,
        marketplaceCardId,
        targetType,
        dispatch,
      }),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(MarketplaceRemoveButton);
