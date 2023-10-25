import ComponentsCommonConstants from '@/constants/components/common';

const InputProps = {
  label: '',
  onBlur: () => {},
  onFocus: () => {},
  invalid: false,
  invalidMessage: '',
  value: '',
  border: true,
  withAutoComplete: false,
  size: ComponentsCommonConstants.Size.LARGE,
  optionListPositionX: 'left',
  options: [],
  optionPosition: 'bottom',
  labelPosition: 'left',
  disabled: false,
  disabledValue: false,
};

export default InputProps;
