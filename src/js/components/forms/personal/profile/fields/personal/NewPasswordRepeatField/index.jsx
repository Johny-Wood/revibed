import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';
import { ValidateMinLengthUtil } from '@/utils/validate/inputCheckValidate';

function NewPasswordRepeatField({
  id = FormFieldsPersonalInformationConstants.newPasswordRepeat,
  value = '',
  invalid = false,
  invalidMessage = '',
  comparisonValue = '',
  onChange = () => {},
  validateField = () => {},
  request = () => {},
}) {
  return (
    <Input
      id={id}
      label="Repeat new password"
      type="password"
      value={value}
      invalid={invalid}
      invalidMessage={invalidMessage}
      onChange={onChange}
      onBlur={(e) => {
        validateField(e, {
          fieldIsValid: (fieldValue) => fieldValue && comparisonValue === fieldValue,
          invalidMessage: CommonErrorMessages.REPEAT_PASSWORD_ERROR,
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

export default NewPasswordRepeatField;
