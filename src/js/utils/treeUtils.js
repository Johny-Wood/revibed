import cloneDeep from 'lodash/cloneDeep';

export const updateTreePropertyUtil = ({
  searchProperty = '',
  searchPropertyValue,
  data = {},
  data: { [searchProperty]: dataSearchProperty = '', children } = {},
  property,
  newValue,
}) => {
  const newData = cloneDeep(data);
  let changedData = [];

  if (dataSearchProperty === searchPropertyValue) {
    newData[property] = newValue;
    changedData.push({ id: newData.id, value: newValue });
  }

  if (children !== undefined && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const { newData: newDataOut, changedData: changedDataOut } = updateTreePropertyUtil({
        searchProperty,
        searchPropertyValue,
        data: children[i],
        property,
        newValue,
      });

      if (changedDataOut.length > 0) {
        changedData = changedDataOut;
      }

      newData.children[i] = newDataOut;
    }
  }

  return { newData, changedData };
};

export const updateTreePropertyByIdUtil = ({ id, data = {}, property, newValue }) =>
  updateTreePropertyUtil({
    searchProperty: 'id',
    searchPropertyValue: id,
    data,
    property,
    newValue,
  });
