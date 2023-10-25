import WantListTable from '@/components/tables/WantListTable';
import WantListHeaderControl from '@/components/wantList/list/WantListReleases/_components/WantListHeaderControl';

import styles from './styles.module.scss';

function WantListReleases({
  wantList,
  sortQuery,

  onLoadWantListRequest = () => {},
  toggleSort,
}) {
  return (
    <div className={styles.wantListTabContent}>
      <WantListHeaderControl onLoadRequest={onLoadWantListRequest} />
      <WantListTable list={wantList} onSort={toggleSort} orders={sortQuery} />
    </div>
  );
}

export default WantListReleases;
