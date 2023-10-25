import PropTypes from 'prop-types';

import ComponentsCommonConstants from '@/constants/components/common';

const InputTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.any,
  optionListPositionX: PropTypes.string,
  optionPosition: PropTypes.string,
  options: PropTypes.array,
  border: PropTypes.bool,
  value: PropTypes.any,
  withAutoComplete: PropTypes.bool,
  size: PropTypes.oneOf([
    ComponentsCommonConstants.Size.LARGE,
    ComponentsCommonConstants.Size.NORMAL,
    ComponentsCommonConstants.Size.SMALL,
    ComponentsCommonConstants.Size.SMALL35,
  ]),
  labelPosition: PropTypes.oneOf(['center', 'left']),
  disabled: PropTypes.bool,
  disabledValue: PropTypes.bool,
};

export default InputTypes;
