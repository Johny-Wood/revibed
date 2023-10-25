import cloneDeep from 'lodash/cloneDeep';
import flattenDeep from 'lodash/flattenDeep';
import isEmpty from 'lodash/isEmpty';

export const getSortQueryUtil = ({ sortSelected }) => {
  let sortQuery = {};

  if (!isEmpty(sortSelected)) {
    Object.keys(sortSelected).forEach((categorySelectedKey) => {
      const sortSelectedItem = sortSelected[categorySelectedKey];
      const { value: queryParam } = sortSelectedItem;

      sortQuery = {
        ...sortQuery,
        sort: sortQuery.sort ? [...sortQuery.sort, queryParam] : [queryParam],
      };
    });
  }

  return sortQuery;
};

export const getFilterQueryUtil = ({ filters, filtersApplied, forUrl }) => {
  let filtersQuery = {};

  if (!isEmpty(filtersApplied)) {
    Object.keys(filtersApplied).forEach((categorySelectedKey) => {
      const { filterProperty = {} } = filters[categorySelectedKey] || {};

      Object.keys(filtersApplied[categorySelectedKey]).forEach((filterSelectedKey) => {
        const { queryParam, name, pathName, min, max } = filtersApplied[categorySelectedKey][filterSelectedKey];

        if (!pathName) {
          Object.keys(filterProperty).forEach((filterPropertyKey) => {
            if (filterPropertyKey === 'pathGreater' || filterPropertyKey === 'pathLess') {
              filtersQuery = {
                ...filtersQuery,
                [filterProperty[filterPropertyKey]]: filterPropertyKey === 'pathGreater' ? max : min,
              };
            } else {
              filtersQuery = {
                ...filtersQuery,
                [filterProperty[filterPropertyKey]]: filtersQuery[filterProperty[filterPropertyKey]]
                  ? [...filtersQuery[filterProperty[filterPropertyKey]], queryParam]
                  : [queryParam],
              };
            }
          });
        } else {
          const filterItem = !forUrl ? queryParam : name;

          filtersQuery = {
            ...filtersQuery,
            [pathName]: filtersQuery[pathName] ? [...filtersQuery[pathName], filterItem] : [filterItem],
          };
        }
      });
    });
  }

  return filtersQuery;
};

export const applySortQueryUtil = ({ sort = [], sortQuery = [], dispatchAction = () => {} }) => {
  const sortProperties = [];

  const replaceSortQueryProperty = (sortQueryProperty = '') => {
    const sortQueryArr = sortQueryProperty.split(',');

    if (sortQueryArr.length > 1) {
      const [property, direction] = sortQueryArr;

      sortProperties.push({
        property,
        direction,
      });
    }
  };

  if (typeof sortQuery === 'string') {
    replaceSortQueryProperty(sortQuery);
  } else if (sortQuery.length > 0) {
    sortQuery.forEach((sortQueryItem) => {
      replaceSortQueryProperty(sortQueryItem);
    });
  }

  const selectedSort = sort.filter(({ property }) =>
    sortProperties.map(({ property: propertySort }) => propertySort).includes(property)
  );

  selectedSort.forEach(({ name, items }) => {
    const sortPropertyItem = items.find(({ value }) =>
      sortProperties
        .map(({ property: propertySort, direction: directionSort }) => `${propertySort},${directionSort}`)
        .includes(value)
    );

    dispatchAction({ name, sortPropertyItem });
  });
};

export const getSelectedFiltersQueryUtil = ({ filters, filtersQuery = {} }) => {
  const filtersProperties = Object.keys(filtersQuery);
  const selectedFilters = [];
  const filtersKeys = Object.keys(filters);
  const filtersLength = filtersKeys.length;
  const newFiltersQuery = cloneDeep(filtersQuery);
  const { year: selectedYear } = newFiltersQuery;

  for (let i = 0; i < filtersLength; ++i) {
    const { data: { min, max, items = [] } = {}, filterProperty: { pathName, pathLess, pathGreater } = {} } =
      filters[filtersKeys[i]];
    const pathNameSearch = pathName || pathGreater || pathLess;

    const selectedItem = {
      categoryId: filtersKeys[i],
      ...filters[filtersKeys[i]],
    };

    if (filtersProperties.includes(pathNameSearch)) {
      if (pathGreater || pathLess) {
        const greaterValue = newFiltersQuery[pathGreater];
        const lessValue = newFiltersQuery[pathLess];

        const greater = Math.max(Math.min(Math.min(Math.max(+greaterValue || max, min), max), max), min);
        const endGreater = greater !== min ? greater : max;
        const less = Math.min(Math.max(+lessValue || min, min), max);
        const endLess = less < max ? less : min;

        const selectedItemPathGreaterOrLess = {
          ...selectedItem,
          data: {
            ...selectedItem.data,
            pathGreater: Math.max(endGreater, endLess) || max,
            pathLess: Math.min(endGreater, endLess) || min,
          },
        };

        const { data: { pathGreater: endPathGreater, pathLess: endPathLess } = {} } = selectedItemPathGreaterOrLess;

        newFiltersQuery[pathLess] = endPathLess;
        newFiltersQuery[pathGreater] = endPathGreater;

        selectedFilters.push(selectedItemPathGreaterOrLess);
      } else {
        if (pathNameSearch === 'year') {
          const years = items.map(({ queryParam }) => +queryParam).filter(Number.isInteger);
          const maxYear = Math.max(...years);
          const minYear = Math.min(...years);

          newFiltersQuery.year = `${Math.min(Math.max(selectedYear || maxYear, minYear), maxYear)}`;
        }

        selectedFilters.push(selectedItem);
      }
    }
  }

  return { selectedFilters, filtersQuery: newFiltersQuery };
};

export const applyFiltersQueryUtil = ({
  selectedFilters,
  filtersQuery = {},
  dispatchAction = () => {},
  dispatchCallback = () => {},
}) => {
  selectedFilters.forEach((filterItem) => {
    const {
      categoryId,
      filterProperty: { pathName, pathGreater, pathLess } = {},
      data: { items = [], pathGreater: selectedPathGreater, pathLess: selectedPathLess } = {},
      data = {},
      settings: { DISCOGS: { multi: multiForDiscogs } = {}, PROJECT: { multi: multiForProject } = {} } = {},
    } = filterItem;

    let itemsSelected = [];

    if (!isEmpty(data)) {
      if (!pathGreater && !pathLess) {
        const itemsFiltered = items.filter(({ queryParam }) =>
          typeof filtersQuery[pathName] === 'string'
            ? queryParam === filtersQuery[pathName]
            : flattenDeep(filtersQuery[pathName]).includes(queryParam)
        );

        itemsSelected = [...itemsSelected, ...itemsFiltered];
      } else if (pathGreater || pathLess) {
        itemsSelected = [
          ...itemsSelected,
          {
            ...data,
            min: selectedPathLess,
            max: selectedPathGreater,
            id: categoryId,
          },
        ];
      }
    } else {
      itemsSelected = [
        ...itemsSelected,
        {
          ...data,
          id: categoryId,
          name: categoryId,
          queryParam: filtersQuery[pathName].length > 0 ? filtersQuery[pathName][0] : filtersQuery[pathName],
        },
      ];
    }

    itemsSelected.forEach((selected) => {
      dispatchAction({
        categoryId,
        selected,
        multi: categoryId === 'STATUS' ? true : multiForDiscogs || multiForProject,
      });
    });
  });

  if (selectedFilters.length > 0) {
    dispatchCallback();
  }
};

export const applySortFromRequestUtil = ({
  sortSelected = [],
  sort = [],
  sortQuery = '',
  sortSelectedFromStore = {},
  dispatchAction = () => {},
}) => {
  const sortSelectedParams = sortSelected[0] || {};
  const { property, direction } = sortSelectedParams;
  const sortQueryFromRequest = `${property},${direction}`;

  if (
    sortQuery === sortQueryFromRequest ||
    Object.values(sortSelectedFromStore).findIndex(({ value }) => value === sortQueryFromRequest) > -1
  ) {
    return;
  }

  applySortQueryUtil({
    sort,
    sortQuery: sortQueryFromRequest,
    dispatchAction,
  });
};
