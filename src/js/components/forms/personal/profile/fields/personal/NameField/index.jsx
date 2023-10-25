import { memo } from 'react';

import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';
import { ValidateMaxLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

const NameField = memo(
  ({
    id = FormFieldsPersonalInformationConstants.name,
    value = '',
    invalid = false,
    invalidMessage = '',
    withValidate = true,
    onChange = () => {},
    validateField = () => {},
    request = () => {},
  }) => (
    <Input
      id={id}
      label="Username"
      value={value}
      invalid={invalid}
      invalidMessage={invalidMessage}
      onChange={onChange}
      onBlur={(e) => {
        if (withValidate) {
          validateField(e, {
            fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.NAME_VALIDATE),
            invalidMessage: CommonErrorMessages.USER_NAME_PATTERN,
            validateEmptyField: true,
          });
          validateField(e, {
            fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.USER_NAME_MAX_LENGTH),
            invalidMessage: CommonErrorMessages.USER_NAME_MAX_LENGTH_ERROR,
            validateEmptyField: true,
          });
        }
      }}
      onKeyDown={(e) => pressEnterKeyInputHandler(e, request)}
    />
  )
);

NameField.displayName = 'NameField';

export default NameField;
