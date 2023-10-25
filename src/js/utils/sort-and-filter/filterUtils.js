import cloneDeep from 'lodash/cloneDeep';
import every from 'lodash/every';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import pickBy from 'lodash/pickBy';
import size from 'lodash/size';

export const filterSelectUtil = ({
  filtersSelectedFromStore,
  filtersAppliedFromStore,
  filterAppliedFromStore,

  categoryId,
  beforeResetCategory,
  beforeResetCategoryNow,
  selectedArr,
  multi,
}) => {
  const selectedList = cloneDeep(selectedArr);
  const isResetAllFilters = categoryId === undefined && selectedList.length === 0;
  const hasFilterCategoryFromStore = has(filtersSelectedFromStore, `${categoryId}`);
  const selectedCategoryFromStore =
    (beforeResetCategory && size(filtersSelectedFromStore[categoryId]) > 1) || beforeResetCategoryNow
      ? {}
      : filtersSelectedFromStore[categoryId] || {};

  let updatedFilterItems = {};

  const hasFilterItemsInCategory =
    every(selectedList, ({ id: itemId } = {}) =>
      Object.values(selectedCategoryFromStore)
        .map(({ id }) => id)
        .includes(itemId)
    ) && selectedList.length === Object.values(selectedCategoryFromStore).length;

  selectedList.forEach((selected = {}) => {
    const { id: itemId } = selected;
    const hasFilterItemFromStore = has(filtersSelectedFromStore, `${categoryId}.${selected?.id}`);

    const updatedFilterItem =
      hasFilterItemFromStore && isEqual(selectedCategoryFromStore[itemId], selected)
        ? { [itemId]: undefined }
        : { [itemId]: { ...selected } };

    updatedFilterItems = { ...updatedFilterItems, ...updatedFilterItem };
  });

  const isResetFilterCategory =
    (hasFilterCategoryFromStore && hasFilterItemsInCategory) || categoryId === undefined || selectedList.length === 0;

  const updatedFilterCategory = isResetFilterCategory
    ? { [categoryId]: undefined }
    : {
        [categoryId]: multi
          ? pickBy({ ...selectedCategoryFromStore, ...updatedFilterItems }, isObject)
          : pickBy({ ...updatedFilterItems }, isObject),
      };

  const updatedFiltersSelected =
    isEmpty(updatedFilterCategory) || isResetAllFilters
      ? {}
      : pickBy({ ...filtersSelectedFromStore, ...updatedFilterCategory }, isObject);
  const updatedFiltersApplied = isResetAllFilters ? {} : filtersAppliedFromStore;
  const updatedFilterApplied = isResetAllFilters ? false : filterAppliedFromStore;

  return {
    filterApplied: updatedFilterApplied,
    filtersApplied: updatedFiltersApplied,
    filtersSelected: updatedFiltersSelected,
  };
};
