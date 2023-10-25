import PropTypes from 'prop-types';

import ComponentsCommonConstants from '@/constants/components/common';

const ButtonTypes = {
  text: PropTypes.string,
  translateKey: PropTypes.string,
  type: PropTypes.oneOf(['button', 'link', 'button_string', 'button_tooltip']),
  color: PropTypes.string,
  size: PropTypes.oneOf([
    ComponentsCommonConstants.Size.LARGE,
    ComponentsCommonConstants.Size.NORMAL,
    ComponentsCommonConstants.Size.SMALL,
    ComponentsCommonConstants.Size.SMALL25,
    ComponentsCommonConstants.Size.SMALL30,
    ComponentsCommonConstants.Size.SMALL35,
    ComponentsCommonConstants.Size.SMALL40,
    ComponentsCommonConstants.Size.SMALL45,
  ]),
  rounded: PropTypes.bool,
  transparent: PropTypes.bool,
  isInProcess: PropTypes.bool,
  progress: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  borderColor: PropTypes.string,
  tooltip: PropTypes.object,
  onClick: PropTypes.func,
};

export default ButtonTypes;
