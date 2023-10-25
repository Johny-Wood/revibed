import { useState } from 'react';

import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import ButtonAddToWantlist from '@/components/release/ReleaseWrapper/_components/ButtonAddToWantlist';
import ReleaseItemsWrapper from '@/components/release/ReleaseWrapper/_components/ReleaseItemsWrapper';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { ReleaseTypeConstants } from '@/constants/release';
import { closePopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function ItemsForSaleProjectsPopup({
  popupId = PopupProjectIdsConstants.ItemsForSaleProjectsPopup,
  popupData: { restartProjectId, release: { id: releaseId, discogsId } = {} } = {},

  loadWantListReleaseItemsInProcess,
  wantlistReleaseItems,
  closePopup,
}) {
  const [loadReleaseItemsFromApi, setLoadReleaseItemsFromApi] = useState(false);

  return (
    <Popup
      popupId={popupId}
      headerText="Items for sale"
      size={ComponentsCommonConstants.Size.LARGE}
      maxWidth={860}
      textAlign="left"
      classCustom={styles.ItemsForSaleProjectsPopup}
      popupHeaderClassName={styles.popupHeader}
      popupInClassName={styles.popupIn}
      popupContentClassName={styles.popupContent}
    >
      <div className={styles.itemsForSale}>
        <ReleaseItemsWrapper
          releaseId={releaseId}
          type={ReleaseTypeConstants.AVAILABLE_NOW}
          parseNow
          withInitialLoadItems
          withShortPagination={false}
          loadReleaseItemsFromApi={loadReleaseItemsFromApi}
          withTime={false}
          restartProjectId={restartProjectId}
          onClickCreateProjectLink={() => {
            closePopup(popupId);
          }}
          onClickReleaseLink={() => {
            closePopup(popupId);
          }}
          onInitCallback={() => {
            setLoadReleaseItemsFromApi(true);
          }}
          scrollLocation={CommonScrollbarLocationsConstants.POPUP_SCROLL}
          className={styles.wantListReleasesItems}
          itemClassName={styles.wantListReleasesItems__item}
          noResultClassName={styles.wantListReleasesItems__noResult}
        />
        {!loadWantListReleaseItemsInProcess && wantlistReleaseItems.length === 0 && loadReleaseItemsFromApi && (
          <div className={styles.itemsForSale__noItems}>
            <div className={styles.itemsForSale__add}>
              <div className={styles.itemsForSale__add__description}>Do you want to track the listed items of this release?</div>
              <ButtonAddToWantlist
                discogsId={discogsId}
                addToWatch
                successCallback={() => {
                  closePopup(popupId);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
}

export default connect(
  (state) => ({
    loadWantListReleaseItemsInProcess: state.WantListReleaseItemReducer.loadWantListReleaseItemsInProcess,
    wantlistReleaseItems: state.WantListReleaseItemReducer.wantlistReleaseItems,
  }),
  (dispatch) => ({
    closePopup: (popupId) => {
      dispatch(closePopupAction(popupId));
    },
  })
)(ItemsForSaleProjectsPopup);
