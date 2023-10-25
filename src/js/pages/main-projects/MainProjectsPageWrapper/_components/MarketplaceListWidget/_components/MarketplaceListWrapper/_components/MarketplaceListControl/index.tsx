import classNames from 'classnames';

import Pagination from '@/components/pagination/Pagination';
import type { PageSettings } from '@/components/pagination/Pagination/types';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

export type MarketplaceListControlProps = {
  pageSettings: PageSettings;
  changePage: () => void;
};

const MarketplaceListControl = ({
  pageSettings: { totalPages, currentNumber: currentPage },
  changePage,
}: MarketplaceListControlProps) => (
  <div className={classNames(styles.MarketplaceListControl)}>
    <Pagination
      className={styles.MarketplaceListControl__pagination}
      prevClassName={styles.MarketplaceListControl__pagination_prev}
      nextClassName={styles.MarketplaceListControl__pagination_next}
      onChangePage={changePage}
      currentPage={currentPage}
      totalPage={totalPages}
      withArrows={totalPages > 1}
      type="short"
      borderColor="gray-4"
      isCircle
    />
    <LinkRoute
      text="View All"
      href={RoutePathsConstants.MARKETPLACE}
      type="button"
      size="small-25"
      borderColor="gray-4"
      className={styles.MarketplaceListControl__button}
    />
  </div>
);

export default MarketplaceListControl;
