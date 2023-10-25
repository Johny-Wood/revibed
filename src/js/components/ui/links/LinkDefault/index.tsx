import type { CSSProperties, FunctionComponent, MouseEvent, MouseEventHandler, PropsWithChildren, RefObject } from 'react';
import { forwardRef, useCallback } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';

import Preloader from '@/components/ui/Preloader';
import type { TooltipProps } from '@/components/ui/ToolTip';
import ToolTip from '@/components/ui/ToolTip';
import TranslateHook from '@/hooks/translate/TranslateHook';

export type IconProps = {
  color?: string;
};

export type LinkDefaultProps = PropsWithChildren & {
  doubleText?: boolean;
  title?: string;
  rounded?: boolean;
  isInProcess?: boolean;
  transparent?: boolean;
  inheritanceActive?: boolean;
  withActive?: boolean;
  focused?: boolean;
  disabled?: boolean;
  underline?: boolean;
  text?: string;
  translateKey?: string;
  href: string;
  color?: string;
  type?: 'link' | 'button' | 'button_string';
  size?: 'large' | 'normal' | 'small' | 'small-30' | 'small-40' | 'small-45' | 'small-25';
  className?: string;
  textClassName?: string;
  tooltipText?: string;
  borderColor?: string;
  asPath?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  icon?: FunctionComponent<IconProps>;
  iconColor?: string;
  iconPosition?: 'top' | 'right' | 'bottom' | 'left';
  gtmAttribute?: string;
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onMouseOverCapture?: MouseEventHandler<HTMLAnchorElement>;
  style?: CSSProperties;
  tooltip?: TooltipProps & {
    canShow?: boolean;
  };
};

const LinkDefault = forwardRef<HTMLAnchorElement, LinkDefaultProps>(
  (
    {
      doubleText,
      text,
      title,
      href,
      className,
      textClassName,
      onClick,
      rounded,
      transparent,
      borderColor,
      type = 'link',
      size = type !== 'link' ? 'large' : undefined,
      isInProcess,

      focused,
      disabled,
      translateKey,
      style,

      color = '',
      underline,

      target = '_blank',
      children,

      icon: Icon,
      iconPosition,
      iconColor,
      gtmAttribute,

      onMouseOverCapture,
      ariaLabel,

      tooltip: {
        canShow: tooltipCanShow,
        text: tooltipText,
        color: tooltipColor = 'black',
        position: tooltipPosition = 'top-center',
        childrenEnd: TooltipChildren,
        childrenEndProps: tooltipChildrenProps,
        hover: tooltipHover = true,
        ...tooltipProps
      } = {},
    },
    innerRef
  ) => {
    const t = TranslateHook();

    const ref = innerRef as RefObject<HTMLAnchorElement>;

    const renderLink = useCallback(() => {
      const renderDisabledOrInProcess = () => {
        if (type === 'link') {
          return null;
        }

        return (
          (disabled || isInProcess) && (
            <span className="button__disabled">
              {isInProcess && (
                <Preloader
                  id="link"
                  isShown={isInProcess}
                  withOffsets={false}
                  opacity={0}
                  duration={200}
                  size="small"
                  pageHeight={undefined}
                />
              )}
            </span>
          )
        );
      };

      const generateClasses = classNames(
        underline && 'underline',
        rounded && 'rounded',
        transparent && 'transparent',
        type,
        color.indexOf('#') === -1 && !borderColor && !transparent && color,
        size,
        borderColor && `border border-${borderColor}`,
        (disabled || isInProcess) && 'disabled',
        !!Icon && 'button-with-icon',
        !!Icon && !text && 'button-only-icon',
        !!Icon && `icon-${iconPosition}`,
        tooltipText && 'button_with_tooltip',
        focused && 'focused',
        className
      );

      const renderText = (isDouble?: boolean) =>
        (!!text || !!translateKey) && (
          <span className={classNames(['text', isDouble && 'text_double', textClassName])}>
            {parse(text ?? (translateKey && t ? t(translateKey) : ''))}
          </span>
        );

      return (
        <a
          ref={ref}
          style={style}
          title={title}
          className={generateClasses}
          href={href}
          // @ts-ignore
          // eslint-disable-next-line react/no-unknown-property
          gtm_button={gtmAttribute}
          onClick={(e) => {
            if (!disabled && !isInProcess) {
              if (onClick) {
                onClick(e);
              }
            } else {
              e.preventDefault();
            }
          }}
          target={target}
          rel="noopener noreferrer"
          onMouseOverCapture={onMouseOverCapture}
          aria-label={ariaLabel}
        >
          {!!Icon && <Icon color={iconColor} />}
          {renderText()}
          {doubleText && renderText(true)}
          {children || null}
          {renderDisabledOrInProcess()}
        </a>
      );
    }, [
      Icon,
      ariaLabel,
      borderColor,
      children,
      className,
      color,
      disabled,
      doubleText,
      focused,
      gtmAttribute,
      href,
      iconColor,
      iconPosition,
      isInProcess,
      onClick,
      onMouseOverCapture,
      ref,
      rounded,
      size,
      style,
      t,
      target,
      text,
      textClassName,
      title,
      tooltipText,
      translateKey,
      transparent,
      type,
      underline,
    ]);

    if (tooltipCanShow) {
      return (
        <ToolTip
          position={tooltipPosition}
          color={tooltipColor}
          hover={tooltipHover}
          type="BUTTON_DESCRIPTION"
          button={renderLink}
          {...tooltipProps}
        >
          {!!TooltipChildren && <TooltipChildren {...tooltipChildrenProps} />}
        </ToolTip>
      );
    }

    return renderLink();
  }
);

LinkDefault.displayName = 'LinkDefault';

export default LinkDefault;
