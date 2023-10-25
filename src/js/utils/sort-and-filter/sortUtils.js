import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import pickBy from 'lodash/pickBy';

export const sortSelectUtil = ({
  sortSelectedFromStore,

  categoryId,
  selected,
}) => {
  const isResetAll = categoryId === undefined && selected === undefined;
  const hasSortItemKey = sortSelectedFromStore[categoryId] && sortSelectedFromStore[categoryId].value === selected?.value;

  const selectedById = hasSortItemKey
    ? {
        [categoryId]: undefined,
      }
    : {
        [categoryId]: {
          ...selected,
        },
      };

  return {
    sortSelected:
      isEmpty(selectedById) || isResetAll
        ? {}
        : pickBy(
            {
              ...selectedById,
            },
            isObject
          ),
  };
};
