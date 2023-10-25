import classNames from 'classnames';

import CreateProjectBonus from '@/components/forms/project/AddProjectForm/_components/CreateProjectBonus';

import styles from './styles.module.scss';

function CreateProjectBonusBanner({ type, bonusLinkClassName, bonusInfoClassName }) {
  return (
    <CreateProjectBonus
      className={styles.createProjectBonusBanner}
      bonusLinkClassName={classNames(styles.createProjectBonus__link, bonusLinkClassName)}
      bonusInfoClassName={classNames(bonusInfoClassName)}
      type={type}
      iconSize={type === 'GOLDEN_COIN' ? 46 : undefined}
    />
  );
}

export default CreateProjectBonusBanner;
