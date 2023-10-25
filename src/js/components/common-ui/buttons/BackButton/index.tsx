import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { UseHistory } from '@/contexts/history/History';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

type BackButtonProps = {
  routerType?: boolean;
  hrefDefault?: string;
  withIcon?: boolean;
  text?: string;

  onClick?: () => void;

  className?: string;
  buttonClassName?: string;
};

function BackButton({
  className,
  buttonClassName,
  routerType = true,
  hrefDefault = RoutePathsConstants.PROJECTS,
  onClick,
  text = 'Back',
  withIcon = true,
}: BackButtonProps) {
  // @ts-ignore
  const { back, setActiveScrollPosition } = UseHistory();

  return (
    <div className={classNames(styles.buttonBackRoute, className)}>
      {/* @ts-ignore  */}
      <Button
        type="button_string"
        className={classNames(styles.buttonBack, buttonClassName)}
        onClick={() => {
          if (!routerType && onClick) {
            onClick();
            return;
          }

          setActiveScrollPosition();

          back(hrefDefault);
        }}
      >
        {withIcon && <ArrowIcon size={ComponentsCommonConstants.Size.LARGE} />}
        <span className="text t-bold">{text}</span>
      </Button>
    </div>
  );
}

export default BackButton;
