import MarketplaceGoods from '@/components/marketplace/MarketplaceGoods';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

const MarketplaceListWidgetGoods = (props: any) => {
  const { isNotDesktop } = ViewportHook();

  return (
    <MarketplaceGoods
      {...props}
      coverSize={isNotDesktop ? 162 : 188}
      className={styles.MarketplaceListWidgetGoods}
      coverClassName={styles.MarketplaceListWidgetGoods__cover}
      namesClassName={styles.MarketplaceListWidgetGoods__names}
      titleClassName={styles.MarketplaceListWidgetGoods__title}
      albumTitleClassName={styles.MarketplaceListWidgetGoods__albumTitle}
      footerClassName={styles.MarketplaceListWidgetGoods__footer}
      cutSizeClassName={styles.MarketplaceListWidgetGoods__cutSize}
    />
  );
};

export default MarketplaceListWidgetGoods;
