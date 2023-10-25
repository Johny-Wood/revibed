import { memo } from 'react';

import EmailInput from '@/components/common-ui/inputs/EmailInput';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';

const EmailField = memo(
  ({
    id = FormFieldsPersonalInformationConstants.email,
    label,
    value = '',
    disabled = false,
    disabledValue = false,
    invalid = false,
    invalidMessage = '',
    onChange = () => {},
    validateField = () => {},
    request = () => {},
    button,
    placeholder,
  }) => (
    <EmailInput
      label={label}
      placeholder={placeholder}
      id={id}
      disabledValue={disabledValue}
      disabled={disabled}
      email={value}
      emailError={invalid}
      emailErrorMsg={invalidMessage}
      onChange={onChange}
      validateField={validateField}
      sendRequest={request}
      button={button}
    />
  )
);

EmailField.displayName = 'EmailField';

export default EmailField;
