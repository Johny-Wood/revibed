import { memo } from 'react';

import CommentInput from '@/components/common-ui/inputs/CommentInput';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';

const AboutField = memo(
  ({ value = '', invalid = false, invalidMsg = '', onChange = () => {}, validateField = () => {}, request = () => {} }) => (
    <CommentInput
      id={FormFieldsPersonalInformationConstants.about}
      label="About me"
      comment={value}
      commentError={invalid}
      commentErrorMsg={invalidMsg}
      onChange={onChange}
      validateField={validateField}
      sendRequest={request}
    />
  )
);

export default AboutField;
