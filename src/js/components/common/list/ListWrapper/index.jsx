import { memo } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import NoResults from '@/components/common/NoResults';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import PaginationFullWrapper from '@/components/pagination/PaginationFullWrapper';
import ProjectTypeFilters from '@/components/projects/ProjectsFilters/ProjectTypeFilters';
import ProjectsSortBy from '@/components/projects/ProjectsSortBy';
import Preloader from '@/components/ui/Preloader';

import styles from './styles.module.scss';

const ITEMS_OPTIONS = [
  {
    id: 10,
    value: 10,
    label: '10',
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
];

const ListWrapper = memo(
  ({
    withHeaderControl,
    withPagination,

    itemsOption,
    pageSettings: { size, totalPages, currentNumber, totalElements } = {},

    location,
    sortAndFilters,

    inProcess,
    getFromApi = true,

    filtersSelected,
    filtersApplied,
    filterApplied,
    changeFilterCallBack,

    sortAndFilters: { sort: sorting = [] } = {},
    sortSelected,

    items,
    itemComponent: ItemComponent,
    itemInnerProps,
    itemRestProps,
    noResults,
    withFiltersAndSort,

    children,

    onGetList,

    className,
    listClassName,
    containerClassName,
    blockClassName,
  }) => {
    const onGetListAction = ({ isNowSending, withScroll, pageNumber, pageSize }) => {
      onGetList({
        isNowSending,
        withScroll,
        pageNumber,
        pageSize,
      });
    };

    const changePage = ({ size: pageSize, page: pageNumber, isNowSending = true, withScroll = true } = {}) => {
      onGetListAction({
        isNowSending,
        withScroll,
        pageNumber,
        pageSize,
      });
    };

    const renderPagination = (type) => (
      <PaginationFullWrapper
        currentPage={currentNumber}
        currentNumber={currentNumber}
        pageSize={size}
        totalPages={totalPages}
        totalElements={totalElements}
        itemsOption={itemsOption || ITEMS_OPTIONS}
        changePage={(page) => {
          changePage({
            page,
            size,
          });
        }}
        changeItemsPerPage={({ value: pageSize }) => {
          changePage({
            size: pageSize,
            page: 0,
          });
        }}
        withPageSize={type !== 'short' && totalElements > 0}
        type={type}
      />
    );

    const renderProjectFilters = () => (
      <ProjectTypeFilters
        location={location}
        filtersSelected={filtersSelected}
        filtersApplied={filtersApplied}
        filterApplied={filterApplied}
        sortAndFilters={sortAndFilters}
        changeFilterCallBack={changeFilterCallBack}
      >
        <div className={styles.itemsList__sort}>
          <ProjectsSortBy
            location={location}
            sorting={sorting}
            sortSelected={sortSelected}
            sortCallback={() => onGetListAction({ isNowSending: true })}
          />
        </div>
      </ProjectTypeFilters>
    );

    const renderHeaderList = () => {
      if (!withHeaderControl) {
        return null;
      }

      return (
        <DesktopLayout>
          <div className={styles.itemsList__header}>{renderPagination('short')}</div>
        </DesktopLayout>
      );
    };

    const renderItems = () =>
      items.map((item) => (
        <div className={classNames(styles.itemsList__block, blockClassName)} key={`items-${item.id}`}>
          {!!ItemComponent && <ItemComponent item={item} itemInnerProps={itemInnerProps} itemRestProps={itemRestProps} />}
        </div>
      ));

    return (
      <div className={classNames([styles.itemsList, className, 'wrapper__content'])}>
        {withFiltersAndSort && (
          <div className={styles.itemsList__control}>
            {children}
            {renderProjectFilters()}
          </div>
        )}
        {renderHeaderList()}
        <div className={classNames(styles.itemsList__container, containerClassName)}>
          {items.length === 0 && getFromApi && <NoResults location="projects" {...noResults} />}
          <Preloader
            id={`list-preloader-${location}`}
            isShown={inProcess}
            opacity={items.length > 0 ? 0.8 : 1}
            type="container"
          />
          <div className={classNames(styles.itemsList__list, listClassName)}>{renderItems()}</div>
        </div>
        {withPagination && <div className={styles.itemsList__footer}>{renderPagination()}</div>}
      </div>
    );
  }
);

export const ListWrapperDefaultProps = {
  withPagination: true,
  withMarginBottomMinus: false,
  withHeaderControl: false,
  withFiltersAndSort: true,
  secondOffset: 150,

  inProcess: false,
  items: [],
  pageSettings: {},

  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,

  sortSelected: {},
};

export const ListWrapperPropTypes = {
  withPagination: PropTypes.bool,
  withMarginBottomMinus: PropTypes.bool,
  withHeaderControl: PropTypes.bool,
  withFiltersAndSort: PropTypes.bool,
  secondOffset: PropTypes.number,

  inProcess: PropTypes.bool,
  items: PropTypes.array,
  pageSettings: PropTypes.object,

  filtersSelected: PropTypes.object,
  filtersApplied: PropTypes.object,
  filterApplied: PropTypes.bool,

  sortSelected: PropTypes.object,
};

ListWrapper.defaultProps = {
  ...ListWrapperDefaultProps,
};

ListWrapper.propTypes = {
  ...ListWrapperPropTypes,

  itemComponent: PropTypes.any.isRequired,
};

ListWrapper.displayName = 'ListWrapper';

export default ListWrapper;
