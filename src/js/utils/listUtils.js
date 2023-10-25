import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';

import ReduxStoreService from '@/services/ReduxStoreService';

export const listPartitionUtil = (list, count = 1) => {
  let counter = 0;

  return values(groupBy(list, () => Math.floor(counter++ / count)));
};

export const updateListPageSettingsForDeleteUtil = (settings) => {
  let pageSettings = settings;
  const { size, totalElements, totalPages } = pageSettings;

  const newTotalElements = totalElements > 0 ? totalElements - 1 : 0;
  let newTotalPages = totalPages;

  if (newTotalElements % size === 0) {
    newTotalPages -= 1;
  }

  newTotalPages = newTotalElements > 0 ? newTotalPages : 0;

  pageSettings = {
    ...pageSettings,
    totalElements: newTotalElements,
    totalPages: newTotalPages,
  };

  return pageSettings;
};

const updatePageSettingsForAdd = (settings) => {
  let pageSettings = settings;
  const { size, totalElements, totalPages } = pageSettings;

  const newTotalElements = totalElements > 1 ? totalElements + 1 : 1;
  let newTotalPages = totalPages;

  if (newTotalElements / size > totalPages) {
    newTotalPages += 1;
  }

  newTotalPages = newTotalElements > 1 ? newTotalPages : 1;

  pageSettings = {
    ...pageSettings,
    totalElements: newTotalElements,
    totalPages: newTotalPages,
  };

  return pageSettings;
};

const updateListAfterAddItem = ({ pageSettings = {}, listRequest, location } = {}) => {
  const { store: { dispatch } = {} } = ReduxStoreService.getInstance();

  const { size = 25, currentNumber = 0 } = pageSettings;

  if (currentNumber > 0) {
    listRequest({
      pageSize: 1,
      pageNumber: currentNumber * size,
      withInProcess: false,
      position: 'FIRST',
      setProjectPosition: 'FIRST',
      location,
      dispatch,
    }).then();
  }
};

export const addItemToListByStoreUtil = ({
  item,
  item: { id } = {},
  list,
  requestFromApi,
  listPageSettingsFromStore,
  updateAction,
  listRequest,
  location,
}) => {
  const { store: { dispatch } = {} } = ReduxStoreService.getInstance();

  const items = cloneDeep(list);

  const foundItem = items.findIndex(({ id: foundId }) => foundId === id);

  if (!requestFromApi || !item || foundItem > -1) {
    return;
  }

  const pageSettings = updatePageSettingsForAdd(listPageSettingsFromStore);

  const { totalPages, currentNumber } = pageSettings;

  if (totalPages > 1 && currentNumber < totalPages - 1) {
    items.pop();
  }

  if (currentNumber === 0) {
    items.unshift(item);
  }

  dispatch(
    updateAction({
      location,
      items,
      pageSettings,
    })
  );

  updateListAfterAddItem({ pageSettings, listRequest, location });
};
