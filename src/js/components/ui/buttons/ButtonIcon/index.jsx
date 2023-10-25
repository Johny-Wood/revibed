import classNames from 'classnames';
import PropTypes from 'prop-types';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';

import ButtonProps from '../_config/props';
import ButtonType from '../_config/types';

function ButtonIcon({
  text,
  iconPosition,
  transparent,
  rounded,
  className,
  icon: Icon,
  iconColor,
  colorUrl,
  children,
  ...buttonProps
}) {
  return (
    <Button
      className={classNames(
        'button-with-icon',
        className,
        !text && 'button-only-icon',
        text && `icon-${iconPosition}`,
        transparent && 'transparent',
        rounded && 'rounded'
      )}
      {...buttonProps}
    >
      {children}
      {!!Icon && <Icon color={iconColor} colorUrl={colorUrl} />}
      {!!text && <span className="text">{text}</span>}
    </Button>
  );
}

ButtonIcon.defaultProps = {
  text: undefined,
  icon: '',
  iconPosition: ComponentsCommonConstants.Position.LEFT,
  iconColor: undefined,

  ...ButtonProps,
};

ButtonIcon.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  icon: PropTypes.any,
  iconPosition: PropTypes.oneOf([
    ComponentsCommonConstants.Position.TOP,
    ComponentsCommonConstants.Position.RIGHT,
    ComponentsCommonConstants.Position.BOTTOM,
    ComponentsCommonConstants.Position.LEFT,
  ]),
  iconColor: PropTypes.string,

  ...ButtonType,
};

export default ButtonIcon;
