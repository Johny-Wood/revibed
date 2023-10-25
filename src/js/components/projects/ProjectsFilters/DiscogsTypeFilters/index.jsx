import { Component, createRef, Fragment } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import Collapse from 'react-collapse';

import TranslateText from '@/components/common/TranslateText';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import ApplyFilterButton from '@/components/projects/ProjectsFilters/_components/ApplyFilterButton';
import Filter from '@/components/projects/ProjectsFilters/_components/Filter';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import Preloader from '@/components/ui/Preloader';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { ProjectFilterDestinationsConstants } from '@/constants/projects/filters/destination';
import { ProjectsFilterTypes } from '@/constants/projects/filters/type';
import CloseIcon from '@/icons/control/close/CloseIcon';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

const DESTINATION = ProjectFilterDestinationsConstants.DISCOGS;

class DiscogsTypeFilters extends Component {
  constructor(props) {
    super(props);

    this.filtersRef = createRef();

    const { location, sortAndFilters: { filter: { destination: destinationArr = [] } = {} } = {} } = props;

    const destinations = destinationArr[DESTINATION] || [];

    destinations.forEach((destinationKey) => {
      const { key } = destinationKey;
      this[`${DESTINATION}_${key}_ref`] = createRef();

      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
        `SCROLL_BLOCK_${DESTINATION}_${key}`,
        location,
        this[`${DESTINATION}_${key}_ref`]
      );
    });

    this.state = {
      saveFilterTop: 0,
      shownFilterButton: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { filtersSelected, filtersApplied } = this.props;

    const { filtersSelected: filtersSelectedPrev, filtersApplied: filtersAppliedPrev } = prevProps;

    if (filtersApplied !== filtersAppliedPrev || !isEqual(filtersSelected, filtersSelectedPrev)) {
      this.toggleShownButton(!isEqual(filtersSelected, filtersApplied));
    }
  }

  getFiltersShownApplied = () => {
    const { filtersApplied } = this.props;

    return filtersApplied;
  };

  setSaveFilterTop = (top) => {
    this.setState({
      saveFilterTop: top,
    });
  };

  removeCategoryFilter = (categoryId) => {
    this.changeFilter({
      categoryId,
      items: [],
    });
  };

  removeCategoryAppliedFilter = (categoryId, items) => {
    this.changeFilter({
      categoryId,
      items,
    });
  };

  removeAllFilter = () => {
    this.changeFilter({
      items: [],
    });
  };

  changeFilter = ({
    categoryId,
    items,
    multi,
    withScroll,
    beforeResetCategory,
    isNowSending = true,
    isApplyFilter = true,
    beforeResetCategoryNow = false,
  }) => {
    const { changeFilterCallBack } = this.props;

    changeFilterCallBack({
      categoryId,
      items,
      isNowSending,
      isApplyFilter,
      multi,
      withScroll,
      beforeResetCategory,
      beforeResetCategoryNow,
    });
  };

  renderSelectedFilterItem = (filterKey, categoryKey, item) => {
    const { name, label, id, min, max, tKey } = item;

    const ValueWrapper = id === 'PRICE' ? Coin : Fragment;
    const wrapperProps =
      id === 'PRICE'
        ? {
            color: 'white',
            size: 14,
          }
        : {};

    return (
      <div
        key={`filter-selected-item-${name}-${filterKey}`}
        className={classNames([styles.filters__selectedReset, styles.filters__selectedReset__item, 'c-white'])}
        onClick={() =>
          ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollToElement({
            sectionId: `SCROLL_BLOCK_${DESTINATION}_${categoryKey}`,
            secondOffset: 10,
          })
        }
      >
        {!min && !max ? (
          <span>{tKey ? <TranslateText translateKey={tKey} /> : label || name}</span>
        ) : (
          <ValueWrapper {...wrapperProps}>
            {min}
            {min !== max && (
              <>
                &nbsp;-&nbsp;
                {max}
              </>
            )}
          </ValueWrapper>
        )}
        <Button
          type="button_string"
          onClick={(event) => {
            event.stopPropagation();

            this.removeCategoryAppliedFilter(categoryKey, [item]);
          }}
        >
          <CloseIcon color="#fff" />
        </Button>
      </div>
    );
  };

  renderSelectedFilter = () =>
    Object.keys(this.getFiltersShownApplied() || {}).map((categoryKey) =>
      Object.keys((this.getFiltersShownApplied() || {})[categoryKey] || {}).map((filterKey) => {
        const item = ((this.getFiltersShownApplied() || {})[categoryKey] || {})[filterKey] || {};

        return (
          <Fragment key={`${categoryKey}-${filterKey}`}>{this.renderSelectedFilterItem(filterKey, categoryKey, item)}</Fragment>
        );
      })
    );

  renderSelectedFilters = () => {
    const { filterApplied, disabled } = this.props;

    return (
      <Collapse isOpened={filterApplied && !isEmpty(this.getFiltersShownApplied())}>
        <div className={styles.filters__selected}>
          <div className={styles.filters__selectedReset}>
            <span>You selected</span>
            <Button type="button_string" onClick={() => this.removeAllFilter()} disabled={disabled}>
              <CloseIcon />
            </Button>
          </div>
          {this.renderSelectedFilter()}
        </div>
      </Collapse>
    );
  };

  changeFilterRange = ({ min, max }, categoryId) => {
    this.changeFilter({
      categoryId,
      items: [
        {
          id: categoryId,
          min,
          max,
        },
      ],
      isNowSending: false,
      isApplyFilter: false,
      beforeResetCategoryNow: true,
    });
  };

  renderFilters = () => {
    const { sortAndFilters: { filter: { destination: destinationList = {} } = {} } = {} } = this.props;

    return (destinationList[DESTINATION] || []).map((projectFilterDestination) => {
      const { type, key } = projectFilterDestination;

      return this.renderFilterDiscogs(type, key);
    });
  };

  renderFilterDiscogs = (type, key) => {
    const { sortAndFilters: { filter: { filters = [] } = {} } = {}, filtersSelected, disabled } = this.props;

    switch (type) {
      case ProjectsFilterTypes.RANGE: {
        const { data = {}, settings: { [DESTINATION]: { isOpened, withoutShowMore } } = {} } = filters[key];

        return (
          <Filter
            ref={this[`${DESTINATION}_${key}_ref`]}
            type="range"
            key={key}
            categoryId={key}
            categoryName={key}
            disabled={disabled}
            range={{
              valueInitRange: data,
              valueRange: ((filtersSelected || {})[key] || {})[key],
              onChangeRange: this.changeFilterRange,
            }}
            withoutShowMore={withoutShowMore}
            defaultOpened={isOpened}
            removeCategoryFilter={this.removeCategoryFilter}
            activeFilterId={(filtersSelected || {})[key]}
            setSaveFilterTop={this.setSaveFilterTop}
            filtersRef={this.filtersRef}
          />
        );
      }
      case ProjectsFilterTypes.COLLAPSE_LIST: {
        const {
          filterProperty,
          data: { items = [] } = {},
          settings: { [DESTINATION]: { isOpened, withoutShowMore, multi } } = {},
        } = filters[key];

        return (
          <Filter
            ref={this[`${DESTINATION}_${key}_ref`]}
            key={key}
            categoryId={key}
            disabled={disabled}
            filterProperty={filterProperty}
            categoryName={key}
            items={items}
            changeFilter={this.changeFilter}
            multi={multi}
            withoutShowMore={withoutShowMore}
            defaultOpened={isOpened}
            activeFilterId={(filtersSelected || {})[key]}
            removeCategoryFilter={this.removeCategoryFilter}
            setSaveFilterTop={this.setSaveFilterTop}
            filtersRef={this.filtersRef}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  toggleShownButton = (shownFilterButton) => {
    this.setState({
      shownFilterButton,
    });
  };

  render() {
    const { saveFilterTop, shownFilterButton } = this.state;

    const {
      location,
      onGetProjects,
      disabled,
      sortAndFilters: { filter: { destination: destinationArr = [] } = {} } = {},
      inProcess,
    } = this.props;

    return (
      <div ref={this.filtersRef} className={classNames(styles.filters)}>
        <Preloader withBgColor isShown={inProcess} opacity={1} withOffsets={false} />
        {destinationArr.length > 0 && (
          <DesktopLayout>
            <span className={styles.filters__title}>Filter by</span>
          </DesktopLayout>
        )}
        {this.renderSelectedFilters()}
        <div className={styles.filters__categories}>
          {this.renderFilters()}
          <ApplyFilterButton
            location={location}
            isShown={shownFilterButton && saveFilterTop > 0}
            positionTop={saveFilterTop}
            disabled={disabled}
            onClick={() => {
              this.toggleShownButton(false);

              onGetProjects({
                isNowSending: true,
                updateSortAndFilters: true,
              });
            }}
          />
        </div>
      </div>
    );
  }
}

DiscogsTypeFilters.defaultProps = {
  location: '',
  disabled: false,
};

DiscogsTypeFilters.propTypes = {
  location: PropTypes.string,
  filtersSelected: PropTypes.object.isRequired,
  filtersApplied: PropTypes.object.isRequired,
  filterApplied: PropTypes.bool.isRequired,
  sortAndFilters: PropTypes.object.isRequired,
  changeFilterCallBack: PropTypes.func.isRequired,
  onGetProjects: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default DiscogsTypeFilters;
