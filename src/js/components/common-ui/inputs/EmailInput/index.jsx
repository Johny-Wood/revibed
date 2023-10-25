import PropTypes from 'prop-types';

import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';
import { ValidateMaxLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

function EmailInput({
  id,
  disabled,
  email,
  emailError,
  emailErrorMsg,
  onChange,
  validateField,
  sendRequest,
  label = 'Email',
  ...restProps
}) {
  return (
    <Input
      id={id}
      disabled={disabled}
      label={label}
      value={email}
      invalid={emailError}
      invalidMessage={emailErrorMsg}
      onChange={onChange}
      onBlur={(e) => {
        validateField(e, {
          fieldIsValid: (value) => ValidateRegularTestUtil(value, CommonRegExpConstants.EMAIL_VALIDATE),
          invalidMessage: CommonErrorMessages.EMAIL_PATTERN,
          validateEmptyField: true,
        });

        validateField(e, {
          fieldIsValid: (value) => ValidateMaxLengthUtil(value, CommonErrorMessages.EMAIL_MAX_LENGTH),
          invalidMessage: CommonErrorMessages.EMAIL_MAX_LENGTH_ERROR,
          validateEmptyField: true,
        });
      }}
      onKeyDown={(e) => {
        pressEnterKeyInputHandler(e, sendRequest);
      }}
      {...restProps}
    />
  );
}

EmailInput.defaultProps = {
  emailError: false,
  emailErrorMsg: '',
  sendRequest: () => {},
};

EmailInput.propTypes = {
  email: PropTypes.string.isRequired,
  emailError: PropTypes.bool,
  emailErrorMsg: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  sendRequest: PropTypes.func,
};

export default EmailInput;
