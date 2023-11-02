import classNames from 'classnames';

import { textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

type ProjectContributorCountProps = {
  totalCount: number;
  cutsCount: number;
  withDescription?: boolean;

  className?: string;
  valueClassName?: string;
};

function ProjectContributorCount({
  totalCount,
  cutsCount,
  withDescription = true,

  className,
  valueClassName,
}: ProjectContributorCountProps) {
  if (!cutsCount) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles.projectContributorCount,
        withDescription && styles.projectContributorCount_withDescription,
        className
      )}
    >
      <span className={classNames(styles.projectContributorCount__value, valueClassName)}>
        {cutsCount}
        <span>&nbsp;of&nbsp;</span>
        {totalCount}
        &nbsp;
      </span>
      {withDescription && textForLotsOfUtil(cutsCount, ['contributor', 'contributors'])}
    </div>
  );
}

export default ProjectContributorCount;
