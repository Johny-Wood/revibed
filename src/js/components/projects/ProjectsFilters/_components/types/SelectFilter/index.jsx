import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import Select from '@/components/ui/selects/Select';
import { ProjectsLocationsConstants } from '@/constants/projects/location';

import styles from './styles.module.scss';

function SelectFilter({
  location,
  categoryId,
  items,
  multi,
  disabled,
  filterApplied,
  filtersApplied,
  selectedFilterCategory,
  changeFilter,
}) {
  const filterItems = cloneDeep(items)
    .filter(({ excludeLocations = [] }) => !excludeLocations.includes(location))
    .filter(({ disabled: disabledItem }) => (categoryId === 'STATUS' ? !disabledItem : disabledItem || !disabledItem));

  if (
    filterItems.length === 0 ||
    (categoryId === 'PRIVATE' &&
      (location === ProjectsLocationsConstants.NEW_ARRIVALS ||
        location === ProjectsLocationsConstants.LATE_ENTRY ||
        location === ProjectsLocationsConstants.PROJECTS_USER))
  ) {
    return null;
  }

  const selected = selectedFilterCategory
    ? Object.keys(selectedFilterCategory)
        .map((optionId) => selectedFilterCategory[optionId])
        .map(({ id, name, queryParam, disabled: disabledOpt }) => ({
          id,
          value: id,
          label: name,
          tKey: categoryId === 'STATUS' ? queryParam : undefined,
          queryParam,
          disabled: disabledOpt,
        }))
    : [];

  return (
    <Select
      id={categoryId}
      label={categoryId}
      tKey={categoryId}
      disabled={disabled}
      toggled
      textInputAllowed={false}
      options={filterItems.map(({ id, name, queryParam, disabled: disabledOption }) => ({
        id,
        value: id,
        label: name,
        tKey: categoryId === 'STATUS' ? queryParam : undefined,
        queryParam,
        disabled: disabledOption,
      }))}
      onSelectItem={(item, key) => {
        changeFilter({
          categoryId: key,
          items: [item],
          multi,
        });
      }}
      clear={!filterApplied || isEmpty(filtersApplied[categoryId])}
      selected={selected}
      isFilter
      maxHeight={1000}
      multiSelect={multi}
      className={styles.projectFilterSelect}
    />
  );
}

export default SelectFilter;
