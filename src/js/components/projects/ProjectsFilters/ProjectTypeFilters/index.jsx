import { Component, Fragment } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import MultiApplyFilter from '@/components/projects/ProjectsFilters/_components/types/MultiApplyFilter';
import SelectFilter from '@/components/projects/ProjectsFilters/_components/types/SelectFilter';
import SwitchButtonFilter from '@/components/projects/ProjectsFilters/_components/types/SwitchButtonFilter';
import TagsFilter from '@/components/projects/ProjectsFilters/_components/types/TagsFilter';
import Preloader from '@/components/ui/Preloader';
import { ProjectFilterDestinationsConstants } from '@/constants/projects/filters/destination';
import { ProjectsFilterTypes } from '@/constants/projects/filters/type';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsNotificationLocationsConstants } from '@/constants/projects/notifications';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';

import styles from './styles.module.scss';

const DESTINATION = ProjectFilterDestinationsConstants.PROJECT;

class ProjectTypeFilters extends Component {
  filterTypeTags = ({ key, items = [], selectedFilterCategory = {}, multi }) => {
    const { location } = this.props;

    return (
      <TagsFilter
        key={key}
        location={location}
        items={items}
        selectedFilterCategory={selectedFilterCategory}
        multi={multi}
        changeFilter={this.changeFilter}
      />
    );
  };

  filterTypeMultiApply = ({ key, value = [], disabled, filtersApplied = {} }) => {
    const {
      location,
      sortAndFilters: { filter: { filters = {} } = {} },
    } = this.props;

    return (
      <MultiApplyFilter
        key={key}
        location={location}
        categoryId={key}
        value={value}
        disabled={disabled}
        filtersApplied={filtersApplied}
        filters={filters}
        changeFilter={this.changeFilter}
      />
    );
  };

  filterTypeSelect = ({ key, items = [], filterApplied, filtersApplied, selectedFilterCategory, multi }) => {
    const { location, disabled } = this.props;

    return (
      <SelectFilter
        key={key}
        location={location}
        categoryId={key}
        items={items}
        multi={multi}
        disabled={disabled}
        filterApplied={filterApplied}
        filtersApplied={filtersApplied}
        selectedFilterCategory={selectedFilterCategory}
        changeFilter={this.changeFilter}
      />
    );
  };

  filterTypeTab = ({ key, items = [], selectedFilterCategory = {} }) => {
    const { location } = this.props;

    return (
      <SwitchButtonFilter
        location={location}
        categoryId={key}
        items={items}
        selectedFilterCategory={selectedFilterCategory}
        changeFilter={this.changeFilter}
      />
    );
  };

  changeFilter = ({ categoryId, items, multi, withScroll, beforeResetCategory, beforeResetCategoryNow, isReset }) => {
    const { changeFilterCallBack } = this.props;

    changeFilterCallBack({
      categoryId,
      items,
      isApplyFilter: true,
      multi,
      withScroll,
      beforeResetCategory,
      beforeResetCategoryNow,
      isReset,
    });
  };

  renderProjectFilter = (destinationListProject) => {
    const {
      location,
      sortAndFilters: { filter: { filters = [] } = {} } = {},
      filtersSelected,
      filtersApplied,
      filterApplied,
    } = this.props;

    return (destinationListProject || []).map((projectFilterDestination) => {
      const { key, type } = projectFilterDestination;
      const { data: { items = [], value = [], disabled } = {}, settings: { [DESTINATION]: { multi = true } = {} } = {} } =
        filters[key];
      const selectedFilterCategory = filtersSelected[key];

      if (
        key === 'STATUS' &&
        (location === ProjectsLocationsConstants.MY_PROJECTS || location === ProjectsLocationsConstants.RIPPER)
      ) {
        return this.filterTypeTags({
          key,
          items,
          selectedFilterCategory,
          multi,
        });
      }

      switch (type) {
        case ProjectsFilterTypes.MULTI_APPLY: {
          return this.filterTypeMultiApply({
            key,
            value,
            disabled,
            filtersApplied,
          });
        }
        case ProjectsFilterTypes.SELECT: {
          return this.filterTypeSelect({
            key,
            items,
            filterApplied,
            filtersApplied,
            selectedFilterCategory,
            multi,
          });
        }
        case ProjectsFilterTypes.SWITCH_BUTTON: {
          return (
            <Fragment key={key}>
              {ProjectsNotificationLocationsConstants.includes(location) && (
                <>
                  <div className={styles.filters__separator} />
                  {this.filterTypeTab({
                    key,
                    items,
                    selectedFilterCategory,
                  })}
                </>
              )}
            </Fragment>
          );
        }
        default: {
          return null;
        }
      }
    });
  };

  renderFilters = () => {
    const { sortAndFilters: { filter: { destination: destinationList = {} } = {} } = {} } = this.props;

    return this.renderProjectFilter(destinationList[DESTINATION]);
  };

  render() {
    const { children, className, filterCategoriesClassName, inProcess, location, withoutInProcess } = this.props;

    return (
      <div
        className={classNames([
          styles.filters,
          className,
          location === ProjectsLocationsConstants.PROJECTS_USER && styles.filters_user,
          location === ProjectsLocationsConstants.PROJECTS && styles.filters_withLeftOffset,
          location === SortAndFiltersLocationsConstants.MARKETPLACE && styles.filters_marketplace,
        ])}
      >
        {!withoutInProcess && <Preloader withBgColor isShown={inProcess} opacity={1} withOffsets={false} />}
        <div className={classNames([styles.filters__filterCategories, filterCategoriesClassName])}>
          {this.renderFilters()}
          {children}
        </div>
      </div>
    );
  }
}

ProjectTypeFilters.defaultProps = {
  disabled: false,
  withoutInProcess: false,
  location: '',
  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,
};

ProjectTypeFilters.propTypes = {
  location: PropTypes.string,
  withoutInProcess: PropTypes.bool,
  filtersSelected: PropTypes.object,
  filtersApplied: PropTypes.object,
  filterApplied: PropTypes.bool,
  sortAndFilters: PropTypes.object.isRequired,
  changeFilterCallBack: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ProjectTypeFilters;
