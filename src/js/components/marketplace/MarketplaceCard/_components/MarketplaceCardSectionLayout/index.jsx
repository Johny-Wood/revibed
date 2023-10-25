import classNames from 'classnames';

import styles from './styles.module.scss';

function MarketplaceCardSectionLayout({ title, className, children }) {
  return (
    <div className={classNames([styles.marketplaceCardSection, className])}>
      <div className={styles.marketplaceCardSection__title}>
        <b>{title}</b>
      </div>
      {children}
    </div>
  );
}

export default MarketplaceCardSectionLayout;
