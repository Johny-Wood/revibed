import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';
import { ValidateMinLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

function NewPasswordField({
  id = FormFieldsPersonalInformationConstants.newPassword,
  value = '',
  invalid = false,
  invalidMessage = '',
  onChange = () => {},
  validateField = () => {},
  request = () => {},
}) {
  return (
    <Input
      id={id}
      label="New password"
      type="password"
      value={value}
      invalid={invalid}
      invalidMessage={invalidMessage}
      onChange={onChange}
      onBlur={(e) => {
        validateField(e, {
          fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.PASSWORD_VALIDATE),
          invalidMessage: CommonErrorMessages.PASSWORD_PATTERN,
          validateEmptyField: true,
        });

        validateField(e, {
          fieldIsValid: (fieldValue) => ValidateMinLengthUtil(fieldValue, CommonErrorMessages.PASSWORD_MIN_LENGTH),
          invalidMessage: CommonErrorMessages.PASSWORD_MIN_LENGTH_ERROR,
          validateEmptyField: true,
        });
      }}
      onKeyDown={(e) => pressEnterKeyInputHandler(e, request)}
    />
  );
}

export default NewPasswordField;
