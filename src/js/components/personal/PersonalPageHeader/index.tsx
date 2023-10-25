import type { PropsWithChildren } from 'react';

import classNames from 'classnames';

import type { TooltipProps } from '@/components/ui/ToolTip';
import ToolTip from '@/components/ui/ToolTip';

import styles from './styles.module.scss';

type PersonalPageHeaderProps = PropsWithChildren & {
  text?: string;
  className?: string;
  tooltip?: TooltipProps;
};

function PersonalPageHeader({
  text,
  tooltip: {
    text: tooltipText,
    color: tooltipColor = 'blue',
    size: tooltipSize,
    position: tooltipPosition,
    width: tooltipWidth,
  } = {},
  className,
  children,
}: PersonalPageHeaderProps) {
  if (!text && !children) {
    return null;
  }

  return (
    <div className={classNames(styles.personalPageHeader, className)}>
      {(!!text || !!tooltipText) && (
        <h3>
          {!!text && <b className="m-right-10">{text}</b>}
          {!!tooltipText && (
            <ToolTip color={tooltipColor} text={tooltipText} size={tooltipSize} position={tooltipPosition} width={tooltipWidth} />
          )}
        </h3>
      )}
      {children}
    </div>
  );
}

export default PersonalPageHeader;
