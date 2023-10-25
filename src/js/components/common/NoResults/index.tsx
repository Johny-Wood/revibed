import classNames from 'classnames';

import { CommonMessagesConstants } from '@/constants/common/message';

import styles from './styles.module.scss';

type NoResultsProps = {
  location?: string;
  text?: string;
  minPaddings?: boolean;
  component?: () => JSX.Element;
  componentProps?: Record<string, unknown>;
  className?: string;
};

function NoResults({
  location = 'common',
  text = CommonMessagesConstants.NO_ITEMS,
  component: Component,
  componentProps = {},
  minPaddings,
  className,
  ...restProps
}: NoResultsProps) {
  return (
    <div
      className={classNames([
        styles.noResult,
        location === 'projects' && styles.noResult_projects_location,
        minPaddings && styles.noResult_min_paddings,
        className,
      ])}
    >
      {!!text && <h4 className="c-gray-2">{text}</h4>}
      {!!Component && <Component {...restProps} {...componentProps} />}
    </div>
  );
}

export default NoResults;
