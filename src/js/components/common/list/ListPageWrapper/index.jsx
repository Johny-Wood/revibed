import { memo, useCallback, useEffect, useRef } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import ListWrapper, { ListWrapperDefaultProps, ListWrapperPropTypes } from '@/components/common/list/ListWrapper';
import RetractableMenu from '@/components/common/RetractableMenu';
import SideBarLayout from '@/components/layouts/SideBarLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import DiscogsTypeFilters from '@/components/projects/ProjectsFilters/DiscogsTypeFilters';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import FilterIcon from '@/icons/FilterIcon';
import ScrollService from '@/services/scroll/ScrollService';
import { setQueryPageParamsUtil } from '@/utils/routeUtils';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

import styles from './styles.module.scss';

const ListPageWrapper = memo(
  ({
    path,
    scrollId,
    listWithPadding,
    secondOffset,

    name,
    location,

    inProcess,
    loadedFromApi,

    withMarginBottomMinus,
    withFiltersAndSort,

    listWrapper: ListWrapperContainer = ListWrapper,

    filtersSelected,
    filtersApplied,
    filterApplied,
    sortSelected,
    pageSettings,
    pageSettings: { size, currentNumber = 0 } = {},
    sortAndFilters: { filter: { filters = [] } = {} } = {},
    sortAndFilters,
    querySearch,

    request,
    filterSelectAction,
    filterApplyAction,

    sideBarLayoutClassName,
    children,
    customListPageBanner,

    ...restProps
  }) => {
    const listRef = useRef(null);

    const setQueryPageParams = useCallback(() => {
      if (!withFiltersAndSort) {
        return;
      }

      const sortQuery = getSortQueryUtil({ sortSelected });

      const commonFilters = getFilterQueryUtil({
        filters,
        filtersApplied,
      });

      const filtersQuery = querySearch
        ? {
            ...commonFilters,
            query: querySearch,
          }
        : commonFilters;

      setQueryPageParamsUtil({
        filtersQuery,
        sortQuery,
        pageSize: size,
        pageNumber: currentNumber,
      });
    }, [currentNumber, filters, filtersApplied, querySearch, size, sortSelected, withFiltersAndSort]);

    useEffect(() => {
      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(scrollId, path, listRef);

      setQueryPageParams();
    }, [path, scrollId, setQueryPageParams]);

    useEffect(() => {
      if (!inProcess) {
        setQueryPageParams();
      }
    }, [inProcess, setQueryPageParams]);

    const onGetList = ({ isNowSending, withScroll = true, pageNumber, pageSize, updateSortAndFilters }) => {
      request({
        pageNumber: isNowSending && (!pageNumber || pageNumber <= 0) ? 0 : pageNumber,
        pageSize,
        updateSortAndFilters,
        location,
      }).then(() => {
        if (!withScroll) {
          return;
        }

        setTimeout(() => {
          ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
            .scrollToElement({
              sectionId: scrollId,
              inRoute: true,
              secondOffset,
            })
            .then();
        }, 60);
      });
    };

    const changeFilter = ({
      categoryId,
      items,
      isNowSending = true,
      isApplyFilter = true,
      multi = true,
      withScroll = true,
      beforeResetCategory = false,
      beforeResetCategoryNow = false,
    }) => {
      filterSelectAction({
        categoryId,
        selected: items,
        multi,
        beforeResetCategory,
        beforeResetCategoryNow,
        location,
      });

      if (isApplyFilter) {
        filterApplyAction(location);
      }

      if (!isNowSending) {
        return;
      }

      onGetList({
        isNowSending,
        withScroll,
        pageNumber: 0,
        updateSortAndFilters: true,
      });
    };

    const renderDiscogsFilters = () => {
      if (!withFiltersAndSort) {
        return null;
      }

      return (
        <SideBarLayout withMarginBottomMinus={withMarginBottomMinus} className={sideBarLayoutClassName}>
          <RetractableMenu buttonIcon={<FilterIcon />}>
            <DiscogsTypeFilters
              filtersSelected={filtersSelected}
              filtersApplied={filtersApplied}
              filterApplied={filterApplied}
              sortAndFilters={sortAndFilters}
              changeFilterCallBack={changeFilter}
              onGetProjects={onGetList}
              location={location}
            />
          </RetractableMenu>
          {!!customListPageBanner && (
            <DesktopLayout>
              <div className={styles.ListPageWrapper__banner}>{customListPageBanner}</div>
            </DesktopLayout>
          )}
        </SideBarLayout>
      );
    };

    return (
      <SiteWrapperLayout
        ref={listRef}
        name={classNames('items-wrapper', name, location && `list-wrapper_${location}`)}
        firstInPage
        withPadding={listWithPadding}
      >
        <WrapperContainerLayout>
          {renderDiscogsFilters()}
          <ListWrapperContainer
            onGetList={onGetList}
            changeFilterCallBack={changeFilter}
            location={location}
            pageSettings={pageSettings}
            sortAndFilters={sortAndFilters}
            filtersSelected={filtersSelected}
            filtersApplied={filtersApplied}
            filterApplied={filterApplied}
            sortSelected={sortSelected}
            withFiltersAndSort={withFiltersAndSort}
            inProcess={inProcess}
            {...restProps}
          >
            {children}
          </ListWrapperContainer>
        </WrapperContainerLayout>
      </SiteWrapperLayout>
    );
  }
);

ListPageWrapper.defaultProps = {
  listWithPadding: true,
  ...ListWrapperDefaultProps,
};

ListPageWrapper.propTypes = {
  location: PropTypes.any.isRequired,
  scrollId: PropTypes.any.isRequired,
  listWithPadding: PropTypes.bool,
  listWrapper: PropTypes.any,
  ...ListWrapperPropTypes,
};

ListPageWrapper.displayName = 'ListPageWrapper';

export default ListPageWrapper;
