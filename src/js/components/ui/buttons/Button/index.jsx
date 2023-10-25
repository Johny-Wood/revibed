import { forwardRef } from 'react';

import classNames from 'classnames';

import Progress from '@/components/common/Progress';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Preloader from '@/components/ui/Preloader';
import ToolTip from '@/components/ui/ToolTip';
import ComponentsCommonConstants from '@/constants/components/common';
import TranslateHook from '@/hooks/translate/TranslateHook';

import ButtonProps from '../_config/props';
import ButtonType from '../_config/types';

const Button = ({
  tooltip,
  tooltip: {
    text: tooltipText,
    canShow: tooltipCanShow,
    color: tooltipColor = 'black',
    position: tooltipPosition = 'top-center',
    childrenEnd: TooltipChildren,
    childrenEndProps: tooltipChildrenProps = {},
    childrenIn: tooltipChildrenIn,
    ...tooltipProps
  } = {},
  rounded,
  transparent,
  isInProcess,
  progress,
  color,
  size,
  className,
  disabled,
  text,
  translateKey,
  children,
  type,
  onClick,
  borderColor,
  backgroundColor,
  focused,
  isActive,
  gtmAttribute,
  innerRef,
  doubleText,
  ...buttonProps
}) => {
  const t = TranslateHook();

  const renderButton = () => {
    const generateClasses = classNames(
      type,
      className,
      color.indexOf('#') === -1 && !borderColor && !transparent && color,
      size,
      borderColor && `border border-${borderColor}`,
      backgroundColor && !borderColor && !transparent && `background-${backgroundColor}`,
      rounded && 'rounded',
      transparent && 'transparent',
      isInProcess && 'in_process',
      disabled && 'disabled',
      tooltipText && 'button_with_tooltip',
      isActive && 'active',
      focused && 'focused'
    );

    const renderText = (isDouble) =>
      (!!text || !!translateKey) && (
        <span className={classNames('text', isDouble && 'text_double')}>{text || t(translateKey)}</span>
      );

    return (
      <button
        ref={innerRef}
        type="button"
        className={generateClasses}
        onClick={(e) => {
          onClick(e);
        }}
        disabled={disabled}
        // eslint-disable-next-line react/no-unknown-property
        gtm_button={gtmAttribute}
        {...buttonProps}
      >
        <span className="button__content">
          {renderText()}
          {doubleText && renderText(true)}
          <Preloader
            id="button"
            isShown={isInProcess}
            withOffsets={false}
            opacity={0}
            duration={200}
            size={ComponentsCommonConstants.Size.SMALL}
          />
        </span>
        {children}
        <TransitionSwitchLayout isShown={disabled}>
          <span className="button__disabled" />
        </TransitionSwitchLayout>
        <TransitionSwitchLayout isShown={progress > 0} duration={progress > 0 ? 300 : 0}>
          <span className="button__progress">
            <span className="button__progress__decoration" style={{ width: `${progress}%` }} />
            <Progress shown={progress > 0} progress={progress} />
          </span>
        </TransitionSwitchLayout>
      </button>
    );
  };

  if (tooltipCanShow) {
    return (
      <ToolTip
        text={tooltipText}
        position={tooltipPosition}
        color={tooltipColor}
        type="BUTTON_DESCRIPTION"
        button={renderButton}
        childrenEnd={tooltipChildrenIn ? TooltipChildren : undefined}
        childrenEndProps={tooltipChildrenIn ? tooltipChildrenProps : undefined}
        {...tooltipProps}
      >
        {!!TooltipChildren && !tooltipChildrenIn && <TooltipChildren {...tooltipChildrenProps} />}
      </ToolTip>
    );
  }

  return renderButton();
};

Button.defaultProps = {
  ...ButtonProps,
};

Button.propTypes = {
  ...ButtonType,
};

export default forwardRef((props, ref) => <Button innerRef={ref} {...props} />);
