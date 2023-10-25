import { useMemo } from 'react';

import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import { getTopUserInfoUtil } from '@/utils/topUsersUtil';

import styles from './styles.module.scss';

function RatingDescriptionTooltip({
  type,
  rating,
  withTitle,
  withTooltipTitle = true,
  buttonClassName,
  descriptionClassName,
  descriptionIconClassName,
  descriptionCountClassName,
  children,
}) {
  const { title, description, icon: Icon } = useMemo(() => getTopUserInfoUtil({ type }), [type]);

  if (!type) {
    return null;
  }

  return (
    <div className={styles.userRatingInfo}>
      <Button
        type="button_string"
        className={classNames([styles.userRatingInfo__button, buttonClassName])}
        tooltip={{
          hover: true,
          canShow: true,
          text: `${withTooltipTitle ? `<b>${title}</b>` : ''}<span>${description}</span>`,
          color: 'white',
          size: ComponentsCommonConstants.Size.NORMAL,
          animationName: 'fade-to-top',
          animationDuration: 300,
        }}
      >
        {children}
        {withTitle && (
          <span className={descriptionClassName}>
            <i>{title}</i>
          </span>
        )}
        <span className={descriptionIconClassName}>{!!Icon && <Icon />}</span>
        <b className={descriptionCountClassName}>{rating}</b>
      </Button>
    </div>
  );
}

export default RatingDescriptionTooltip;
