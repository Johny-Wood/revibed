import { memo } from 'react';

import classNames from 'classnames';

import ItemsPerPage from '@/components/common/ItemsPerPage';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import Pagination from '@/components/pagination/Pagination';
import TotalItems from '@/components/primary/TotalItems';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

const ITEMS_OPTIONS = [
  {
    id: 10,
    value: 10,
    label: '10',
  },
  {
    id: 15,
    value: 15,
    label: '15',
  },
  {
    id: 25,
    value: 25,
    label: '25',
  },
  {
    id: 50,
    value: 50,
    label: '50',
  },
];

const PaginationFullWrapper = memo(
  ({
    currentPage,
    pageSizeChanged,
    pageSize = pageSizeChanged,
    totalElements = 0,
    totalPages = 0,
    currentNumber = 0,

    changeItemsPerPage,
    itemsOption = ITEMS_OPTIONS,

    changePage = () => {},

    withPageSize,
    withPageSizeMobile,
    withPagination = true,
  }) => {
    const { isNotDesktop } = ViewportHook();

    if (totalElements === 0) {
      return null;
    }

    const renderTotalItems = () => (
      <TotalItems
        className={styles.totalItems}
        total={totalElements}
        totalPages={totalPages}
        currentPage={currentNumber}
        size={pageSize}
      />
    );

    const renderPagination = (children) => {
      if (totalElements === 0 || (totalPages === 1 && !isNotDesktop)) {
        return null;
      }

      return (
        <Pagination
          className={styles.pagination}
          prevClassName={styles.paginationPrev}
          nextClassName={styles.paginationNext}
          onChangePage={changePage}
          currentPage={currentPage}
          totalPage={totalPages}
          withArrows={totalPages > 1}
        >
          {!!children && children}
        </Pagination>
      );
    };

    const renderItemsPerPage = () => {
      const { value: minSize = 15 } = itemsOption[0] || {};

      if (pageSize && totalElements > minSize) {
        return <ItemsPerPage itemsOption={itemsOption} size={pageSize} onChange={changeItemsPerPage} />;
      }

      return null;
    };

    return (
      <div
        className={classNames(
          styles.paginationContainer,
          withPageSize ? styles.pagination_fullWithSizeContainer : styles.pagination_fullWithSizeContainer
        )}
      >
        {withPagination && (
          <div className={styles.pagination__fullWrapper}>
            <div className={styles.paginationTotal}>
              <MobileLayout>{renderPagination(renderTotalItems())}</MobileLayout>
              <DesktopLayout>
                {renderTotalItems()}
                {renderPagination()}
              </DesktopLayout>
            </div>
          </div>
        )}
        {((withPageSize && !isNotDesktop) || withPageSizeMobile) && <>{renderItemsPerPage()}</>}
      </div>
    );
  }
);

export default PaginationFullWrapper;
