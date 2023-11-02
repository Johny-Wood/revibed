import CustomInputMask from '@/components/ui/inputs/CustomInputMask';
import { CommonMasksConstants } from '@/constants/common/masks';
import { pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';

function PhoneNumberInput({
  id = 'phone',
  value,
  invalid,
  invalidMessage,
  label = 'Phone Number',
  onChange,
  onBlur,
  callback = () => {},
  disabled,
  disabledValue,
  isValidCallback,
}) {
  return (
    <CustomInputMask
      type="phone"
      id={id}
      label={label}
      value={value}
      invalid={invalid}
      invalidMessage={invalidMessage}
      onChange={onChange}
      isValidCallback={isValidCallback}
      mask={CommonMasksConstants.PHONE_MASK}
      disabled={disabled}
      disabledValue={disabledValue}
      placeholder=""
      onBlur={onBlur}
      onKeyDown={(e) => pressEnterKeyInputHandler(e, callback)}
    />
  );
}

export default PhoneNumberInput;
