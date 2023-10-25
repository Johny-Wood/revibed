import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import { ProjectsFilterDestinationsConstants } from '@/constants/projects/filters/projectFilterDestinations';
import { ProjectsLocationsConstants } from '@/constants/projects/location';

import styles from './styles.module.scss';

function SwitchButtonFilter({ location, categoryId, items, selectedFilterCategory, changeFilter }) {
  const filterItems = cloneDeep(items).filter(({ excludeLocations = [] }) => !excludeLocations.includes(location));

  if (
    categoryId === 'PRIVATE' &&
    (location === ProjectsLocationsConstants.NEW_ARRIVALS ||
      location === ProjectsLocationsConstants.LATE_ENTRY ||
      location === ProjectsLocationsConstants.PROJECTS_USER)
  ) {
    return null;
  }

  return (
    <div className={styles.filterTabs}>
      {filterItems.map(({ id, name, queryParam, disabled }) => (
        <Button
          key={`${categoryId}-${id}`}
          text={name}
          disabled={disabled}
          size={ComponentsCommonConstants.Size.SMALL35}
          transparent
          isActive={
            !isEmpty(selectedFilterCategory)
              ? !!selectedFilterCategory[id]
              : categoryId === ProjectsFilterDestinationsConstants.UNREADABLE && queryParam === 'false'
          }
          onClick={() => {
            const item = filterItems.find(({ queryParam: filterQueryParam }) => queryParam === filterQueryParam);
            changeFilter({
              categoryId,
              items: [item],
              multi: false,
              withScroll: false,
            });
          }}
        />
      ))}
    </div>
  );
}

export default SwitchButtonFilter;
