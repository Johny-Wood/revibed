import classNames from 'classnames';

import Navigation from '@/components/primary/Navigation';

import styles from './styles.module.scss';

function HeaderMenu({ className, transparent, fixedHeader, links }) {
  return (
    <Navigation
      location="header"
      className={classNames([
        styles.headerNav,
        transparent && styles.headerNav__DropDownMenu_transparent,
        fixedHeader && styles.headerNav__DropDownMenu_fixed,
        className,
      ])}
      dropDownMenuListClass={styles.headerNav__DropDownMenu__list}
      links={links}
    />
  );
}

export default HeaderMenu;
