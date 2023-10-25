import { memo } from 'react';

import CountrySelect from '@/components/common-ui/selects/CountrySelect';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';

const CountryField = memo(({ value, onChange = () => {}, validateField = () => {} }) => (
  <CountrySelect
    countryId={value}
    placeholderSearch="Start typing to search"
    onSelectItem={onChange}
    onClose={(fieldValue) =>
      validateField(
        {
          target: {
            value: fieldValue,
            id: FormFieldsPersonalInformationConstants.countryId,
          },
        },
        {
          validateEmptyField: true,
        }
      )
    }
  />
));

CountryField.displayName = 'CountryField';

export default CountryField;
