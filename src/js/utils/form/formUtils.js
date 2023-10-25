export const appendFormUtil = ({ fieldsForm = [] }) => {
  const formData = new FormData();

  fieldsForm.forEach(({ name = '', value = '', required = false }) => {
    if (!required || (required && (value || value.length > 0))) {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const valueObj = value[i];

          if (typeof valueObj === 'object') {
            Object.keys(valueObj).forEach((key) => {
              formData.append(`${name}[${i}].${key}`, valueObj[key] || '');
            });
          } else {
            formData.append(`${name}[${i}]`, valueObj || '');
          }
        }
      } else {
        formData.append(name, value !== undefined && value != null ? value : '');
      }
    }
  });

  return formData;
};
