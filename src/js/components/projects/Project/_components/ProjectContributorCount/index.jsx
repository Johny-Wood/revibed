import classNames from 'classnames';

import { textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ProjectContributorCount({ totalCount, cutsCount, className, valueClassName }) {
  if (!cutsCount) {
    return null;
  }

  return (
    <div className={classNames([styles.projectContributorCount, className])}>
      <b className={classNames([valueClassName])}>
        {cutsCount}
        &nbsp;of&nbsp;
        {totalCount}
        &nbsp;
      </b>
      {textForLotsOfUtil(cutsCount, ['contributor', 'contributors'])}
    </div>
  );
}

export default ProjectContributorCount;
