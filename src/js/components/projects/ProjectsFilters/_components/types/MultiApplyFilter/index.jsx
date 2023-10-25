import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import LightningIcon from '@/icons/project/state/LightningIcon';

import styles from './styles.module.scss';

const MULTI_APPLY_KEYS = {
  RIPPED_PROJECTS: 'RIPPED_PROJECTS',
};

const MULTI_APPLY_MAP = {
  [MULTI_APPLY_KEYS.RIPPED_PROJECTS]: 'STATUS',
};

function MultiApplyFilter({ location, categoryId, value, disabled, filtersApplied, filters, changeFilter }) {
  if (location !== ProjectsLocationsConstants.MY_PROJECTS) {
    return null;
  }

  const filterAliasKey = MULTI_APPLY_MAP[categoryId];
  const { data: { items = [] } = {} } = filters[filterAliasKey] || {};

  const appliedStatuses = Object.values(filtersApplied[filterAliasKey] || {}).map(({ queryParam }) => queryParam);

  const isActive = isEqual(cloneDeep(appliedStatuses).sort(), cloneDeep(value).sort());

  return (
    <ButtonIcon
      className={classNames(styles.filterMultiApply, isActive && styles.filterMultiApply_active)}
      text=""
      transparent
      borderColor="gray-3"
      icon={LightningIcon}
      iconColor={!isActive ? 'black' : 'white'}
      size={ComponentsCommonConstants.Size.SMALL35}
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }

        changeFilter({
          categoryId: 'STATUS',
          items: value.map((itemKey) => items.find(({ queryParam }) => queryParam === itemKey)),
          multi: false,
        });
      }}
    />
  );
}

export default MultiApplyFilter;
