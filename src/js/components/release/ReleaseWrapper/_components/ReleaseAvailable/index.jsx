import { memo, useState } from 'react';

import { connect } from 'react-redux';

import ButtonGetItems from '@/components/release/ReleaseWrapper/_components/ButtonGetItems';
import ReleaseItemsWrapper from '@/components/release/ReleaseWrapper/_components/ReleaseItemsWrapper';
import Preloader from '@/components/ui/Preloader';
import ComponentsCommonConstants from '@/constants/components/common';
import { ReleaseTypeConstants } from '@/constants/release';
import { updateReleaseItemsAvailableAction } from '@/redux-actions/wantList/wantListReleaseItemActions';

import styles from './styles.module.scss';

const ReleaseAvailable = memo(
  ({
    releaseId,
    parseNow,

    userIsAuthorized,
    loadWantListReleaseItemsInProcess,
    updateReleaseItemsAvailable,
  }) => {
    const [listIsReceived, setListIsReceived] = useState(false);

    return (
      <div className={styles.releaseAvailable}>
        {(listIsReceived || !parseNow) && userIsAuthorized ? (
          <ReleaseItemsWrapper
            releaseId={releaseId}
            withReleaseLink={false}
            withShortPagination={false}
            withInitialLoadItems={!parseNow && userIsAuthorized}
            parseNow={parseNow || listIsReceived}
            type={ReleaseTypeConstants.AVAILABLE_NOW}
          />
        ) : (
          <div className={styles.releaseAvailable__get}>
            <Preloader
              id="release-available"
              withOffsets={false}
              isShown={loadWantListReleaseItemsInProcess}
              size={ComponentsCommonConstants.Size.SMALL}
            />
            {!loadWantListReleaseItemsInProcess && (
              <ButtonGetItems
                releaseId={releaseId}
                onClick={() => {
                  updateReleaseItemsAvailable({ releaseId, itemsAvailable: true });
                  setListIsReceived(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

ReleaseAvailable.displayName = 'ReleaseAvailable';

export default connect(
  (state) => ({
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    loadWantListReleaseItemsInProcess: state.WantListReleaseItemReducer.loadWantListReleaseItemsInProcess,
  }),
  (dispatch) => ({
    updateReleaseItemsAvailable: (params) => {
      dispatch(updateReleaseItemsAvailableAction(params));
    },
  })
)(ReleaseAvailable);
