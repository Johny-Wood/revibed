import { PopupActionsConstants } from '@/constants/actions/components/popup';
import ReduxStoreService from '@/services/ReduxStoreService';

export const showPopupAction =
  (popupId, popupData = {}, closeOtherPopups = true) =>
  (dispatch, getState) => {
    const popupListFromStore = getState().PopupReducer.activePopupList;

    const filteredPopups = popupListFromStore.filter(({ popupId: id }) => id === popupId);

    const popupKey = filteredPopups.length > 0 ? `${popupId}-${filteredPopups.length + 1}` : popupId;

    let activePopupList = [
      {
        popupKey,
        popupId,
        popupData,
      },
    ];

    if (!closeOtherPopups) {
      activePopupList = [
        ...popupListFromStore,
        {
          popupKey,
          popupId,
          popupData,
        },
      ];
    }

    dispatch({
      type: PopupActionsConstants.SHOW_POPUP,
      payload: {
        activePopupList,
      },
    });
  };

export const closePopupAction =
  (popupId = null) =>
  (dispatch) => {
    const { store } = ReduxStoreService.getInstance();

    const { activePopupList } = store.getState().PopupReducer;

    if (popupId) {
      const indexDeletePopup = activePopupList.findIndex(({ popupId: key }) => key === popupId);

      if (indexDeletePopup > -1) {
        const { popupData: { popupCloseCallBack } = {} } = activePopupList[indexDeletePopup];

        if (popupCloseCallBack) {
          popupCloseCallBack();
        }
      }
    }

    dispatch({
      type: PopupActionsConstants.CLOSE_POPUP,
      payload: {
        popupId,
      },
    });
  };
