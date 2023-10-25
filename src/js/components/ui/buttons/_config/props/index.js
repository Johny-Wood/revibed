import ComponentsCommonConstants from '@/constants/components/common';

const ButtonProps = {
  text: undefined,
  translateKey: undefined,
  type: 'button',
  color: 'primary',
  size: ComponentsCommonConstants.Size.LARGE,
  rounded: false,
  transparent: false,
  isInProcess: false,
  progress: 0,
  className: '',
  borderColor: '',
  disabled: false,
  isActive: false,
  tooltip: undefined,
  onClick: () => {},
};

export default ButtonProps;
