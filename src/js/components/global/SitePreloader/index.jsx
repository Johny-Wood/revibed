import classNames from 'classnames';

import TransitionSiteLoadLayout from '@/components/layouts/TransitionLayouts/TransitionSiteLoadLayout';

import styles from './styles.module.scss';

function SitePreloader({ isShown = true }) {
  return (
    <TransitionSiteLoadLayout isShown={isShown}>
      <div className={styles.preloader}>
        <div className={styles.preloader__dots}>
          <span className={classNames([styles.preloader__dot, styles.preloader__dot_blue])} />
          <span className={classNames([styles.preloader__dot, styles.preloader__dot_green])} />
          <span className={classNames([styles.preloader__dot, styles.preloader__dot_red])} />
        </div>
      </div>
    </TransitionSiteLoadLayout>
  );
}

export default SitePreloader;
