import LinkDefault from '@/components/ui/links/LinkDefault';
import { RoutePathsConstants } from '@/constants/routes/routes';
import DiscogsIcon from '@/icons/DiscogsIcon';

import styles from './styles.module.scss';

type ItemsForSaleLinkProps = {
  href?: string;
  text?: string;
};

function ItemsForSaleLink({ href = RoutePathsConstants.DRAFTS_ADD, text = 'Items for sale' }: ItemsForSaleLinkProps) {
  if (!href) {
    return null;
  }

  return <LinkDefault href={href} text={text} icon={DiscogsIcon} className={styles.buttonItemsForSale} />;
}

export default ItemsForSaleLink;
