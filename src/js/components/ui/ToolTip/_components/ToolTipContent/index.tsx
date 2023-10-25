import type { MouseEventHandler, PropsWithChildren, RefObject } from 'react';
import { forwardRef } from 'react';

import parse from 'html-react-parser';

import CloseIcon from '@/icons/control/close/CloseIcon';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

export type PositionToolTip = {
  left: number | string;
  right: number | string;
  top: number | string;
  bottom: number | string;
};

export type PositionToolTipTriangle = {
  left: number | string;
  right: number | string;
  top: number | string;
  bottom: number | string;
  rotate: number | string;
};

export type ToolTipContentProps = PropsWithChildren & {
  text?: string;
  width?: number;
  hover?: boolean;
  withCloseButton?: boolean;
  positionToolTip: PositionToolTip;
  positionToolTipTriangle: PositionToolTipTriangle;
  onShowTooltip?: (shown: boolean) => void;
  onMouseEnter?: MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: MouseEventHandler<HTMLSpanElement>;
};

const ToolTipContent = forwardRef<HTMLSpanElement, ToolTipContentProps>(
  (
    {
      text,
      width,
      hover,
      withCloseButton,
      positionToolTip,
      positionToolTipTriangle,

      onShowTooltip,
      onMouseEnter,
      onMouseLeave,

      children,
    },
    innerRef
  ) => {
    const ref = innerRef as RefObject<HTMLSpanElement>;

    return (
      <span
        ref={ref}
        className="tooltip__content"
        style={{
          left: positionToolTip.left,
          right: positionToolTip.right,
          top: positionToolTip.top,
          bottom: positionToolTip.bottom,
          maxWidth: covertPx2RemUtil(width ?? 'auto'),
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span
          className="tooltip__triangle"
          style={{
            left: positionToolTipTriangle.left,
            right: positionToolTipTriangle.right,
            top: positionToolTipTriangle.top,
            bottom: positionToolTipTriangle.bottom,
            transform: positionToolTipTriangle.rotate ? `rotate(${positionToolTipTriangle.rotate}deg)` : 'none',
          }}
        >
          <span className="before" />
        </span>
        {!hover && withCloseButton && (
          <span
            className="tooltip__close"
            onClick={() => {
              if (onShowTooltip) {
                onShowTooltip(false);
              }
            }}
          >
            <CloseIcon />
          </span>
        )}
        <span className="tooltip__text">
          {!!text && parse(text)}
          {children}
        </span>
      </span>
    );
  }
);

ToolTipContent.displayName = 'ToolTipContent';

export default ToolTipContent;
