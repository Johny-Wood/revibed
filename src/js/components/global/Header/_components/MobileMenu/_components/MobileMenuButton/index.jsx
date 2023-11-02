import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';

import styles from './styles.module.scss';

function MobileMenuButton({ onClick }) {
  return (
    <Button aria-label="mobile-menu" className={classNames(styles.hamburger)} type="button_string" onClick={onClick}>
      <div className={styles.hamburger__iHamburger}>
        <span className={styles.hamburger__line} />
        <span className={styles.hamburger__line} />
        <span className={styles.hamburger__line} />
      </div>
    </Button>
  );
}

export default MobileMenuButton;
