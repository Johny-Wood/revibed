import type { FunctionComponent, PropsWithChildren } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import ToolTipContent from '@/components/ui/ToolTip/_components/ToolTipContent';
import type {
  PositionToolTip,
  PositionToolTipTriangle,
  ToolTipContentProps,
} from '@/components/ui/ToolTip/_components/ToolTipContent';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { PreviousHook } from '@/hooks/state/PreviousHook';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import InfoIcon from '@/icons/InfoIcon';
import ScrollService from '@/services/scroll/ScrollService';

export type TooltipProps = PropsWithChildren &
  Omit<ToolTipContentProps, 'positionToolTip' | 'positionToolTipTriangle'> & {
    shown?: boolean;
    externalShownLogic?: boolean;
    color?: 'blue' | 'black' | 'white';
    size?: 'small' | 'normal' | 'large';
    borderRadius?: boolean;
    smallPadding?: boolean;
    withCloseButton?: boolean;
    withButton?: boolean;
    position?: string;
    type?: 'BUTTON_DESCRIPTION' | 'TOOLTIP';
    className?: string;
    buttonClassName?: string;
    closeCallback?: () => void;
    childrenEndProps?: any;
    childrenEnd?: FunctionComponent<{ shown: boolean }>;
    button?: FunctionComponent;
    tooltipButtonLeft?: number;
  };

const Tooltip = ({
  shown,
  externalShownLogic,
  text,
  color = 'white',
  size = 'small',
  borderRadius = true,
  position,
  smallPadding,
  width = 390,
  type = 'TOOLTIP',
  withButton = true,
  withCloseButton = true,
  hover,
  button: ButtonToolTip,
  closeCallback,
  tooltipButtonLeft: tooltipButtonLeftProps = -11,

  onMouseEnter,
  onMouseLeave,

  className,
  buttonClassName,

  children,
  childrenEnd: ChildrenEnd,
  childrenEndProps = {},
}: TooltipProps) => {
  const prevShown = PreviousHook(shown);

  const toolTipRef = useRef<HTMLDivElement>(null);
  const toolTipContentRef = useRef<HTMLSpanElement>(null);

  const { isNotDesktop, isTablet } = ViewportHook();

  const [showedToolTip, setShowedToolTip] = useState<boolean>(false);

  const [positionToolTip, setPositionToolTip] = useState<PositionToolTip>({
    left: 'auto',
    top: 'auto',
    bottom: 'auto',
    right: 'auto',
  });

  const [positionToolTipTriangle, setPositionToolTipTriangle] = useState<PositionToolTipTriangle>({
    left: 'auto',
    top: 'auto',
    bottom: 'auto',
    right: 'auto',
    rotate: 'auto',
  });

  const computedPosition = useCallback(() => {
    if (!toolTipContentRef.current) {
      return;
    }

    const { offsetHeight: toolTipContentHeight, offsetWidth: toolTipContentWidth } = toolTipContentRef.current;

    const offsetX = 10;

    const element = toolTipRef.current;

    if (!element) {
      return;
    }

    const elemRect = element.getBoundingClientRect();

    const bodyRect = document.body.getBoundingClientRect();

    const { offsetWidth: tooltipButtonWidth } = element;

    const { top: tooltipButtonTop, left: buttonLeft } = elemRect;

    const block = element.parentElement;

    if (!block) {
      return;
    }

    const blockWidth = block.offsetWidth;
    const blockRect = block.getBoundingClientRect();
    const halfWindowHeight = bodyRect.height / 2 - 70;
    const halfWindowWidth = blockWidth / 2;

    const hasButtonLeftProps = tooltipButtonLeftProps >= -10;
    const tooltipButtonLeft = hasButtonLeftProps ? tooltipButtonLeftProps : buttonLeft;
    const tooltipDiffLeft = tooltipButtonLeft - blockRect.left;

    const permittedHeightAria = tooltipButtonTop + document.body.scrollTop - 75;
    const permittedWidthAria = tooltipButtonLeft - 15;

    const elementIsTopPosition =
      position !== 'top' && (halfWindowHeight > tooltipButtonTop || toolTipContentHeight > permittedHeightAria);
    const elementIsLeftPosition = halfWindowWidth > tooltipDiffLeft || toolTipContentWidth > permittedWidthAria;

    let tooltipLeft: number | string = 'auto';
    let tooltipRight: number | string = 'auto';
    let tooltipTop: number | string = 'auto';
    let tooltipBottom: number | string = 'auto';

    let triangleLeft: number | string = -10;
    let triangleRight: number | string = 'auto';
    let triangleTop: number | string = 'auto';
    let triangleBottom: number | string = 'auto';
    let triangleRotate: number | string = 0;

    if (!position || position === 'right') {
      if (elementIsTopPosition && !isTablet) {
        tooltipTop = 35;
      } else if (elementIsTopPosition && isTablet) {
        tooltipTop = -22;
      }

      if (!elementIsTopPosition && !isTablet) {
        tooltipBottom = 35;
      } else if (!elementIsTopPosition && isTablet) {
        tooltipBottom = -25;
      }

      if (elementIsTopPosition && !isTablet) {
        triangleTop = -15;
      } else if (elementIsTopPosition && isTablet) {
        triangleTop = 22;
      }

      if (!elementIsTopPosition && !isTablet) {
        triangleBottom = -15;
      } else if (!elementIsTopPosition && isTablet) {
        triangleBottom = 22;
      }

      if (elementIsTopPosition && !isTablet) {
        triangleRotate = 90;
      } else if (!elementIsTopPosition && !isTablet) {
        triangleRotate = -90;
      }
    }

    if (!position) {
      if (!elementIsLeftPosition && !isTablet) {
        tooltipLeft = bodyRect.left - tooltipButtonLeft + offsetX;
      } else if (!elementIsLeftPosition && isTablet) {
        tooltipRight = 20 + tooltipButtonWidth;
      }

      if (elementIsLeftPosition && !isTablet) {
        tooltipLeft = bodyRect.left - tooltipButtonLeft + offsetX;
      } else if (elementIsLeftPosition && isTablet) {
        tooltipLeft = 20 + tooltipButtonWidth;
      }

      if (!elementIsLeftPosition && !isTablet) {
        triangleLeft = tooltipButtonWidth / 2 - Number(tooltipLeft) - 7;
      } else if (!elementIsLeftPosition && isTablet) {
        triangleRight = -10;
        triangleLeft = 'auto';
        triangleRotate = 180;
      }

      if (elementIsLeftPosition && !isTablet) {
        triangleLeft = tooltipButtonWidth / 2 - Number(tooltipLeft) - 7;
      }
    }

    if (position === 'Y' || position === 'top') {
      if (elementIsTopPosition) {
        tooltipTop = 40;
      } else {
        tooltipBottom = 40;
      }

      if (elementIsTopPosition) {
        triangleTop = -15;
        triangleRotate = 90;
      } else {
        triangleBottom = -15;
        triangleRotate = -90;
      }

      tooltipLeft = !hasButtonLeftProps ? blockRect.left - tooltipButtonLeft : tooltipButtonLeft - toolTipContentWidth / 2;
      triangleLeft = !hasButtonLeftProps ? tooltipDiffLeft + tooltipButtonWidth / 2 - 6 : toolTipContentWidth / 2 - 6;

      setPositionToolTip({
        ...positionToolTip,
        left: tooltipLeft,
        bottom: tooltipBottom,
        top: tooltipTop,
      });

      setPositionToolTipTriangle({
        ...positionToolTipTriangle,
        left: triangleLeft,
        bottom: triangleBottom,
        top: triangleTop,
        rotate: triangleRotate,
      });
    }

    if (!position || position === 'right') {
      setPositionToolTipTriangle({
        ...positionToolTipTriangle,
        left: triangleLeft,
        right: triangleRight,
        top: triangleTop,
        bottom: triangleBottom,
        rotate: triangleRotate,
      });

      setPositionToolTip({
        ...positionToolTip,
        right: tooltipRight,
        left: tooltipLeft,
        top: tooltipTop,
        bottom: tooltipBottom,
      });
    }

    if (toolTipContentRef.current) {
      const toolTipContentRect = toolTipContentRef.current.getBoundingClientRect();
      const { top: toolTipContentTop } = toolTipContentRect;
      const toolTipContentVisible = bodyRect.height - toolTipContentTop;

      if ((toolTipContentHeight * 80) / 100 > toolTipContentVisible && elementIsTopPosition) {
        ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTo({
          elementTop: tooltipButtonTop - 100,
        });
      }
    }
  }, [isTablet, position, positionToolTip, positionToolTipTriangle, tooltipButtonLeftProps]);

  const onShowTooltip = useCallback(
    (shownToolTip: boolean) => {
      if (shownToolTip) {
        computedPosition();
      } else if (closeCallback) {
        closeCallback();
      }

      setShowedToolTip(shownToolTip);
    },
    [closeCallback, computedPosition]
  );

  const checkClickTarget = useCallback(
    (e: MouseEvent) => {
      if (hover || !e.target) {
        return;
      }

      if (!!toolTipRef.current && !toolTipRef.current.contains(e.target as Node)) {
        if (isNotDesktop) {
          e.stopPropagation();
          e.preventDefault();
        }

        onShowTooltip(false);

        document.body.removeEventListener('click', checkClickTarget, false);
      }
    },
    [hover, isNotDesktop, onShowTooltip]
  );

  const onToggleTooltip = useCallback(() => {
    if (hover || externalShownLogic) {
      return;
    }

    onShowTooltip(!showedToolTip);

    if (!showedToolTip) {
      document.body.addEventListener('click', checkClickTarget, false);
    } else {
      document.body.removeEventListener('click', checkClickTarget, false);
    }
  }, [checkClickTarget, externalShownLogic, hover, onShowTooltip, showedToolTip]);

  useEffect(() => {
    if (prevShown !== shown) {
      onShowTooltip(!!shown);
    }
  }, [onShowTooltip, prevShown, shown]);

  return (
    <div
      ref={toolTipRef}
      className={classNames(
        'tooltip',
        `tooltip_color_${color}`,
        `tooltip_size_${size}`,
        position && `tooltip_default_position_${position}`,
        smallPadding && 'tooltip_padding_small',
        borderRadius && 'tooltip_border_radius',
        !withCloseButton && 'tooltip_without_close',
        showedToolTip && 'tooltip_showed',
        hover && 'tooltip_type_hover',
        type === 'BUTTON_DESCRIPTION' && 'tooltip_type_description',
        className
      )}
    >
      {withButton && (
        <div
          className={classNames('tooltip__button', !ButtonToolTip && 'tooltip__button_default', buttonClassName)}
          onClick={onToggleTooltip}
          onMouseLeave={() => {
            if (!hover || !closeCallback) {
              return;
            }

            closeCallback();
          }}
        >
          {ButtonToolTip ? <ButtonToolTip /> : <InfoIcon />}
        </div>
      )}
      <div className="tooltip__info">
        <ToolTipContent
          ref={toolTipContentRef}
          text={text}
          withCloseButton={withCloseButton}
          hover={hover}
          width={width}
          positionToolTip={positionToolTip}
          positionToolTipTriangle={positionToolTipTriangle}
          onShowTooltip={onShowTooltip}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {showedToolTip && (!!children || !!ChildrenEnd) && (
            <>
              {children}
              {!!ChildrenEnd && <ChildrenEnd {...childrenEndProps} shown={showedToolTip} />}
            </>
          )}
        </ToolTipContent>
      </div>
    </div>
  );
};

export default Tooltip;
