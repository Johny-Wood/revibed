import { useCallback, useEffect, useRef } from 'react';

import classNames from 'classnames';

import NoResults from '@/components/common/NoResults';
import PaginationFullWrapper from '@/components/pagination/PaginationFullWrapper';
import Preloader from '@/components/ui/Preloader';
import DefaultHeaderRender from '@/components/ui/Table/_component/DefaultHeaderRender';
import DefaultItemRenderer from '@/components/ui/Table/_component/DefaultItemRenderer';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

const renderPagination = ({ withPaginationControl, pagination, itemsPerPage }) => {
  const {
    size: pageSize,
    currentNumber,
    totalElements,
    totalPages,
    location,
    withPageSize,
    withPageSizeMobile,
    withPagination,
    type,
    onLoadRequest = () => {},
  } = pagination;

  if (!withPaginationControl) {
    return null;
  }

  return (
    <PaginationFullWrapper
      currentPage={currentNumber}
      currentNumber={currentNumber}
      pageSize={pageSize}
      totalPages={totalPages}
      totalElements={totalElements}
      location={location}
      changePage={(pageNumber) => {
        onLoadRequest({
          pageNumber,
          pageSize,
        });
      }}
      changeItemsPerPage={({ value }) => {
        onLoadRequest({
          pageSize: value,
          pageNumber: 0,
        });
      }}
      withPageSize={withPageSize && totalElements > 0}
      withPageSizeMobile={withPageSizeMobile}
      withPagination={withPagination}
      type={type}
      itemsOption={itemsPerPage}
    />
  );
};

const renderTableBody = ({ items, itemRender, name, headerColumns, noResultText }) => {
  if (items.length > 0) {
    return items.map((itemComponentsInfo, idx) =>
      itemRender({
        idx,
        tableName: name,
        itemComponentsInfo,
        columnsInfo: headerColumns,
      })
    );
  }

  return <NoResults text={noResultText} />;
};

function Table({
  bodyClassName,
  bodyTextClassName,
  itemClassName,
  itemElementClassName,
  headerClassName,
  headerElementClassName,
  headerTextClassName,
  withFieldName = false,
  withHeaderOnly = false,
  withFirstScroll,
  inProcess,
  name = '',
  wrapperClassName,
  controlClassName,
  headerColumns = [],
  withHeader,
  scrollId,
  route,
  headerRender = (columns) => (
    <DefaultHeaderRender
      headerColumns={headerColumns}
      withFieldName={withFieldName}
      withHeaderOnly={withHeaderOnly}
      columns={columns}
      tableName={name}
      withHeader={withHeader}
      className={classNames(styles.tableHeader, headerClassName)}
      wrapperClassName={styles.tableHeader__wrapper}
      elementClassName={classNames(styles.tableHeader__element, headerElementClassName)}
      textClassName={classNames(styles.tableHeader__text, headerTextClassName)}
      elementDESCClassName={styles.tableHeader__element_DESC}
      elementASCClassName={styles.tableHeader__element_ASC}
      elementSORTClassName={styles.tableHeader__element_SORT}
    />
  ),
  rowSettings = {},
  items = [],
  ids = [],
  itemClickCallback = () => {},
  itemRender = ({ tableName, itemComponentsInfo, columnsInfo, idx }) => (
    <DefaultItemRenderer
      key={`${tableName}-body-row-${idx}`}
      tableName={tableName}
      itemComponentsInfo={itemComponentsInfo}
      columnsInfo={columnsInfo}
      id={ids[idx]}
      idx={idx}
      headerColumns={headerColumns}
      itemClickCallback={itemClickCallback}
      rowSettings={rowSettings}
      withFieldName={withFieldName}
      className={classNames(styles.tableItem, itemClassName)}
      elementClassName={classNames(styles.tableItem__element, itemElementClassName)}
      columnClassName={styles.tableColumn__name}
      bodyTextClassName={classNames(styles.tableBody__text, bodyTextClassName)}
    />
  ),
  title = '',
  withFirstLoad,
  requestFromApi,
  withPaginationControl,
  pagination = {},
  pagination: { requestParams, onLoadRequest } = {},
  itemsPerPage = [
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
    {
      id: 100,
      value: 100,
      label: '100',
    },
    {
      id: 250,
      value: 250,
      label: '250',
    },
  ],
  noResultText,
  scrollSecondOffset = 20,
  children,
}) {
  const tableRef = useRef(null);
  const scrollLoadTimeout = useRef(null);
  const scrollFirstLoadTimeout = useRef(null);

  const onLoadRequestEnd = (params) => {
    if (inProcess || !onLoadRequest) {
      return;
    }

    onLoadRequest({ ...params, ...requestParams }).then(() => {
      if (withPaginationControl && !!scrollId && !!route) {
        clearTimeout(scrollLoadTimeout.current);

        scrollLoadTimeout.current = setTimeout(() => {
          ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
            .scrollToElement({
              sectionId: scrollId,
              secondOffset: scrollSecondOffset,
            })
            .then();
        }, 60);
      }
    });
  };

  const request = useCallback(() => {
    if (withPaginationControl && !requestFromApi && onLoadRequest) {
      onLoadRequest({ ...requestParams });
    }
  }, [onLoadRequest, requestFromApi, requestParams, withPaginationControl]);

  useEffect(() => {
    if (withFirstLoad) {
      request();
    }
  }, [request, withFirstLoad]);

  useEffect(() => {
    if (withPaginationControl && !!scrollId && !!route) {
      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(scrollId, route, tableRef);
    }
  }, [route, scrollId, withPaginationControl]);

  useEffect(() => {
    if (withFirstScroll) {
      clearTimeout(scrollFirstLoadTimeout.current);

      scrollFirstLoadTimeout.current = setTimeout(
        () => {
          ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
            .scrollToElement({
              sectionId: scrollId,
              secondOffset: 100,
            })
            .then();
        },
        withFirstLoad ? 120 : 60
      );
    }
  }, [scrollId, withFirstLoad, withFirstScroll]);

  useEffect(
    () => () => {
      clearTimeout(scrollLoadTimeout.current);
      clearTimeout(scrollFirstLoadTimeout.current);
    },
    []
  );

  return (
    <div ref={tableRef} className={classNames('w-100pct', wrapperClassName)}>
      {!!title && (
        <div className={classNames(controlClassName, 'f-y-start f-x-between p-bottom-15')}>
          {!!title && (
            <h4 className="title_s">
              <b>{title}</b>
            </h4>
          )}
        </div>
      )}
      <div className={classNames([styles.table, name, withFieldName && styles.table_with_field_table_name])}>
        {headerRender(headerColumns)}
        <div className={classNames(styles.tableBody, bodyClassName)}>
          <div>{renderTableBody({ items, itemRender, name, headerColumns, noResultText })}</div>
          <Preloader id={`table-${name}`} isShown={inProcess} type="container" duration={400} />
        </div>
      </div>
      {children}
      {renderPagination({
        withPaginationControl,
        pagination: { ...pagination, onLoadRequest: onLoadRequestEnd },
        itemsPerPage,
      })}
    </div>
  );
}

export default Table;
