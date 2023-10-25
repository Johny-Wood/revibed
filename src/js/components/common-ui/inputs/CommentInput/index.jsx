import PropTypes from 'prop-types';

import TextArea from '@/components/ui/inputs/TextArea';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { pressShiftEnterKeyInputHandler } from '@/utils/inputHandlersUtil';
import { ValidateMaxLengthUtil } from '@/utils/validate/inputCheckValidate';

function CommentInput({
  id = 'comment',
  placeholder,
  validateEmptyField,
  comment,
  commentError,
  commentErrorMsg,
  onChange,
  validateField,
  sendRequest,
  label,
}) {
  return (
    <TextArea
      id={id}
      label={label}
      placeholder={placeholder}
      value={comment}
      invalid={commentError}
      invalidMessage={commentErrorMsg}
      onChange={onChange}
      onBlur={(e) => {
        validateField(e, {
          fieldIsValid: (value) => ValidateMaxLengthUtil(value, CommonErrorMessages.COMMENT_MAX_LENGTH),
          invalidMessage: CommonErrorMessages.COMMENT_MAX_LENGTH_ERROR,
          validateEmptyField,
        });
      }}
      onKeyDown={(e) => {
        if (sendRequest) {
          pressShiftEnterKeyInputHandler(e, sendRequest);
        }
      }}
    />
  );
}

CommentInput.defaultProps = {
  placeholder: '',
  label: '',
  validateEmptyField: false,
  commentError: false,
  commentErrorMsg: '',
  sendRequest: () => {},
};

CommentInput.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  validateEmptyField: PropTypes.bool,
  comment: PropTypes.string.isRequired,
  commentError: PropTypes.bool,
  commentErrorMsg: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  sendRequest: PropTypes.func,
};

export default CommentInput;
