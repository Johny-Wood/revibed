import ListPageWrapper from '@/components/common/list/ListPageWrapper';
import FollowerCard from '@/pages/personal/Follow/_components/FollowersList/_components/FollowerCard';
import NoFollowers from '@/pages/personal/Follow/_components/FollowersList/_components/NoFollowers';

import styles from './styles.module.scss';

const ITEMS_OPTIONS = [
  {
    id: 50,
    value: 50,
    label: '50',
  },
  {
    id: 100,
    value: 100,
    label: '100',
  },
  {
    id: 150,
    value: 150,
    label: '150',
  },
];

function FollowersList({
  location,
  path,
  scrollId,
  userName,
  list,
  listPageSettings: { page: pageSettings } = {},
  inProcess,
  request,
  fromApi,
  noResultsText,
}) {
  return (
    <div className={styles.followers}>
      <ListPageWrapper
        className={styles.itemsList}
        listClassName={styles.itemsList__list}
        blockClassName={styles.itemsList__block}
        location={location}
        inProcess={inProcess}
        itemComponent={FollowerCard}
        items={list}
        withHeaderControl={false}
        withFiltersAndSort={false}
        pageSettings={pageSettings}
        request={request}
        path={path}
        scrollId={scrollId}
        noResults={{
          text: null,
          component: fromApi ? NoFollowers : null,
          componentProps: { name: userName, location },
          description: noResultsText,
        }}
        itemsOption={ITEMS_OPTIONS}
        listWithPadding={false}
      />
    </div>
  );
}

export default FollowersList;
