import { useState } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import SuccessIcon from '@/icons/SuccessIcon';
import RemoveWatchIcon from '@/icons/want-list/RemoveWatchIcon';
import WatchIcon from '@/icons/want-list/WatchIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { addWatchWantListReleaseRequestAction } from '@/redux-actions/wantList/wantListActions';
import {
  addWatchWantListReleaseItemAction,
  removeWatchWantListReleaseItemAction,
} from '@/redux-actions/wantList/wantListReleaseItemActions';
import { handleErrorUtil } from '@/utils/apiUtils';

import styles from './styles.module.scss';

function WantListToggleWatch({
  active,
  itemsCount,
  releaseId,
  releaseItemId,
  addWatchWantListReleaseInProcess: addWatchButtonInProcess,
  deleteWatchWantListReleaseInProcess: deleteWatchButtonInProcess,
  buttonSize = ComponentsCommonConstants.Size.SMALL25,
  withTooltip,

  addWatchWantListReleaseRequest,
  deleteWatchWantListReleaseRequest,
  addWatchWantListReleaseItem,
  removeWatchWantListReleaseItem,
  showPopup,
  buttonAddWatchClassName,
  buttonDeleteWatchClassName,
}) {
  const [watchItemInProcessId, setWatchItemInProcessId] = useState([]);
  const [isWatchInit, setIsWatchInit] = useState(active || false);
  const isWatchItemInProcessId = watchItemInProcessId.includes(releaseItemId);

  if (!active) {
    return (
      <ButtonIcon
        transparent
        borderColor="gray-8"
        size={buttonSize}
        text="Watch"
        icon={WatchIcon}
        className={classNames(styles.buttonAddWatch, buttonAddWatchClassName)}
        disabled={addWatchButtonInProcess && isWatchItemInProcessId}
        isInProcess={addWatchButtonInProcess && isWatchItemInProcessId}
        onClick={() => {
          if (addWatchButtonInProcess && isWatchItemInProcessId) {
            return;
          }

          setWatchItemInProcessId([releaseItemId]);

          addWatchWantListReleaseRequest([releaseItemId])
            .then(() => {
              setWatchItemInProcessId([]);
              addWatchWantListReleaseItem(releaseId);
              setIsWatchInit(false);
            })
            .catch(({ error = {} }) => {
              setWatchItemInProcessId([]);

              if (error) {
                handleErrorUtil(error, {
                  WANT_LIST_SUBSCRIPTION_NO_PLACES: () => {
                    showPopup(PopupWantListIdsConstants.WantListSubscriptionNoPlacesPopup);
                  },
                });
              }
            });
        }}
        tooltip={{
          hover: true,
          canShow: withTooltip,
          text: 'Add to watch',
          smallPadding: true,
        }}
      />
    );
  }

  if (active && !itemsCount && itemsCount === undefined) {
    return (
      <ButtonIcon
        transparent
        borderColor="gray-8"
        size={buttonSize}
        text="Watch"
        icon={!isWatchInit ? SuccessIcon : RemoveWatchIcon}
        className={classNames(styles.buttonDeleteWatch, buttonDeleteWatchClassName)}
        disabled={deleteWatchButtonInProcess && isWatchItemInProcessId}
        isInProcess={deleteWatchButtonInProcess && isWatchItemInProcessId}
        onClick={() => {
          if (deleteWatchButtonInProcess && isWatchItemInProcessId) {
            return;
          }

          setWatchItemInProcessId([releaseItemId]);

          deleteWatchWantListReleaseRequest([releaseItemId])
            .then(() => {
              setWatchItemInProcessId([]);
              removeWatchWantListReleaseItem(releaseId);
            })
            .catch(({ error = {} }) => {
              setWatchItemInProcessId([]);

              if (error) {
                handleErrorUtil(error, {
                  WANT_LIST_SUBSCRIPTION_NO_PLACES: () => {
                    showPopup(PopupWantListIdsConstants.WantListSubscriptionNoPlacesPopup);
                  },
                });
              }

              setWatchItemInProcessId([]);
            });
        }}
        tooltip={{
          hover: true,
          canShow: withTooltip,
          text: 'Remove from watch',
          smallPadding: true,
        }}
      />
    );
  }

  return null;
}

export default connect(
  (state) => ({
    addWatchWantListReleaseInProcess: state.WantListReducer.addWatchWantListReleaseInProcess,
    deleteWatchWantListReleaseInProcess: state.WantListReducer.deleteWatchWantListReleaseInProcess,
  }),
  (dispatch) => ({
    addWatchWantListReleaseRequest: (ids) => addWatchWantListReleaseRequestAction(ids)(dispatch),
    deleteWatchWantListReleaseRequest: (ids) => addWatchWantListReleaseRequestAction(ids)(dispatch),
    addWatchWantListReleaseItem: (releaseId) => {
      dispatch(addWatchWantListReleaseItemAction(releaseId));
    },
    removeWatchWantListReleaseItem: (releaseId) => {
      dispatch(removeWatchWantListReleaseItemAction(releaseId));
    },
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(WantListToggleWatch);
