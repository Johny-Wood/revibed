import classNames from 'classnames';

import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';
import { ValidateMaxValueUtil, ValidateMinValueUtil } from '@/utils/validate/inputCheckValidate';

function CutCount({
  id,
  value,
  invalid,
  invalidMessage,
  onChange,
  min = 1,
  max = 100,
  validateField,
  onClickAction = () => {},
  className,
}) {
  const onValidate = (e) => {
    validateField(e, {
      fieldIsValid: (inputValue) => ValidateMinValueUtil(inputValue, min),
      invalidMessage: `${CommonErrorMessages.MIN_VALUE}${min}`,
      validateEmptyField: true,
    });

    validateField(e, {
      fieldIsValid: (inputValue) => ValidateMaxValueUtil(inputValue, max),
      invalidMessage: `${CommonErrorMessages.MAX_VALUE}${max}`,
      validateEmptyField: true,
    });
  };

  return (
    <Input
      id={id}
      typeValue="number"
      withControl
      value={value}
      invalid={invalid}
      invalidMessage={invalidMessage}
      onChange={onChange}
      onBlur={onValidate}
      onKeyDown={(e) => pressEnterKeyInputHandler(e, onClickAction)}
      placeholder={min}
      min={min}
      max={max}
      className={classNames(className)}
    />
  );
}

export default CutCount;
