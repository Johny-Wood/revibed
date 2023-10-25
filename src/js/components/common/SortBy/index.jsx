import { useCallback } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import Select from '@/components/ui/selects/Select';

import styles from './styles.module.scss';

const SortBy = ({
  defaultType = true,
  sortSelected = {},
  sorting = [],
  location,
  sortSelectedAction,
  sortCallback,
  className,
}) => {
  const changeSort = useCallback(
    (selected, idSelect) => {
      if (sortSelectedAction) {
        sortSelectedAction(location, idSelect, selected);
      }

      sortCallback();
    },
    [location, sortCallback, sortSelectedAction]
  );

  if (sorting.length === 0) {
    return null;
  }

  return (
    <div className={classNames([styles.sortBy, defaultType && styles.sortBy_default, className])}>
      <Select
        label="Sort"
        id="sort"
        isSelected={!isEmpty(sortSelected)}
        optionListPositionX="right"
        isSort
        toggled
        selected={Object.values(sortSelected).map((item, idx) => ({
          ...item,
          sectionName: Object.keys(sortSelected)[idx],
        }))}
        onSelectItem={changeSort}
        options={sorting.map(({ name, property, items }) => ({
          sectionName: name,
          property,
          items,
        }))}
        maxHeight={9000}
        clear={isEmpty(sortSelected)}
        className={styles.select}
      />
    </div>
  );
};

export default SortBy;
