import classNames from 'classnames';

import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

type BuyOnMarketplaceLinkProps = {
  goodsId: number | string;
};

function BuyOnMarketplaceLink({ goodsId }: BuyOnMarketplaceLinkProps) {
  return (
    <LinkRoute
      href={parseReplaceTextUtil(RoutePathsConstants.MARKETPLACE_ITEM, String(goodsId))}
      text="Buy on Marketplace"
      type="button"
      transparent
      borderColor="gray-3"
      className={classNames('project-action-button button-buy-cut', styles.BuyOnMarketplaceLink)}
      textClassName={classNames(styles.BuyOnMarketplaceLink__text)}
    />
  );
}

export default BuyOnMarketplaceLink;
