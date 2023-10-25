import { connect } from 'react-redux';

import SelectedItems from '@/components/common/SelectedItems';
import ButtonGroup from '@/components/ui/buttons/ButtonGroup';
import WantListAddRelease from '@/components/wantList/list/controls/WantListAddRelease';
import WantListAddWathRelease from '@/components/wantList/list/controls/WantListAddWathRelease';
import WantListRemoveRelease from '@/components/wantList/list/controls/WantListRemoveRelease';
import WantListRemoveWatchRelease from '@/components/wantList/list/controls/WantListRemoveWatchRelease';

import styles from './styles.module.scss';

function WantListReleasesControl({ selectedWantListItems }) {
  const selectedWantListItemsManaged = selectedWantListItems.filter(({ releaseWatched }) => releaseWatched);

  const selectedItemsLength = selectedWantListItems.length;
  const selectedItemIsEmpty = selectedItemsLength <= 0;

  const selectedItemsActive = selectedWantListItemsManaged.filter(({ active }) => active);
  const selectedItemsActiveIsEmpty = selectedItemsActive.length <= 0;

  const selectedItemsNotActive = selectedWantListItemsManaged.filter(({ active }) => !active);
  const selectedItemsNotActiveIsEmpty = selectedItemsNotActive.length <= 0;

  const idsNotActive = selectedItemsNotActive.map(({ id }) => id);
  const idsActive = selectedItemsActive.map(({ id }) => id);

  const selectedReleases = selectedWantListItems.map(({ releaseInfo: { discogsLink } = {} }) => discogsLink);
  const selectedReleasesIds = selectedWantListItems.map(({ releaseInfo: { id } = {} }) => id);

  return (
    <div className={styles.wantListReleasesControl}>
      <WantListAddRelease />
      <WantListRemoveRelease
        disabled={selectedItemIsEmpty}
        releaseIds={selectedReleasesIds}
        activeReleasesCount={selectedItemsActive.length}
        count={selectedItemsLength}
        releases={selectedReleases}
      />
      <ButtonGroup>
        <WantListAddWathRelease disabled={selectedItemsNotActiveIsEmpty} idsNotActive={idsNotActive} />
        <WantListRemoveWatchRelease disabled={selectedItemsActiveIsEmpty} idsActive={idsActive} />
      </ButtonGroup>
      <SelectedItems className={styles.selectedCount} count={selectedItemsLength} />
    </div>
  );
}

export default connect((state) => ({
  selectedWantListItems: state.WantListReducer.selectedWantListItems,
}))(WantListReleasesControl);
