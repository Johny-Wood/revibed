import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import CartTracksCount from '@/components/marketplace/cart/CartTracksCount';
import Table from '@/components/ui/Table';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const itemMapper = ({
  isNotDesktop,
  rootGoodsId,
  id,
  price,
  type,
  purchaseAvailable,
  name,
  targetType,
  release: { covers: releaseCovers = [], artists = [] } = {},
  covers = releaseCovers,
  target: { tracksGoods = [], trackId } = {},
  restColumns = () => {},
}) => {
  const count = tracksGoods.length || 1;
  const href = {
    pathname: parseReplaceTextUtil(RoutePathsConstants.MARKETPLACE_ITEM, rootGoodsId || id),
    query: targetType === 'TRACK' ? { track: trackId } : {},
  };

  return [
    {
      key: `${id}-1`,
      component: (
        <span className="f-y-center w-100pct">
          <Cover
            className={styles.projectCover}
            containerClassName={styles.projectCoverContainer}
            covers={covers}
            projectId={id}
            href={href}
            size={50}
          />
          <div className="f_direction_column w-100pct">
            <Names
              className={styles.projectNames}
              titleClassName={styles.projectNames__title}
              albumClassName={styles.projectNames__album__title}
              artists={artists}
              albumTitle={name}
              href={href}
            />
            {isNotDesktop && (
              <CartTracksCount countClassName={styles.tracksCount} count={count} type={type} className="text_size_12" />
            )}
          </div>
        </span>
      ),
    },
    {
      key: `${id}-2`,
      component: <CartTracksCount countClassName={styles.tracksCount} count={count} type={type} />,
    },
    ...restColumns({ id, rootGoodsId, targetType, purchaseAvailable, price }),
  ];
};

function GoodsTable({
  items,
  location,
  withHeader,
  withHeaderOnly,
  restColumns,
  headerColumns = [
    {
      key: 1,
      name: 'Item',
      align: 'start',
      width: '50%',
      grow: 1,
    },
    {
      key: 2,
      name: 'Tracks',
      align: 'start',
      width: 250,
      hideOnMobile: true,
    },
    {
      key: 3,
      name: '',
      align: 'end',
      width: 40,
    },
    {
      key: 4,
      name: 'Price',
      align: 'end',
      width: 90,
    },
  ],
  scrollId,
  route,
  inProcess,
  pageSettings: { page } = {},
  request,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <Table
      name={styles.goodsTable}
      withHeader={withHeader}
      withHeaderOnly={withHeaderOnly}
      inProcess={inProcess}
      items={items.map((item) => itemMapper({ ...item, isNotDesktop, restColumns }))}
      headerColumns={headerColumns}
      withPaginationControl
      scrollId={scrollId}
      route={route}
      pagination={{
        ...page,
        location,
        withPageSizeMobile: !isNotDesktop,
        withPagination: true,
        onLoadRequest: request,
      }}
      bodyClassName={styles.tableBody}
      bodyTextClassName={styles.tableBody__text}
      itemClassName={styles.tableItem}
    />
  );
}

export default GoodsTable;
