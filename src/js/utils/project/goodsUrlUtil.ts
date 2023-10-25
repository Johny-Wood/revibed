import { RoutePathsConstants } from '@/constants/routes/routes';
import { parseReplaceTextUtil, parseToPathNameUtil } from '@/utils/textUtils';

export const createGoodsUrlUtil = (goodsId: number | string, title = '') => {
  const name = encodeURIComponent(parseToPathNameUtil(title.replace(/ - /gi, ' ')));

  return parseReplaceTextUtil(RoutePathsConstants.MARKETPLACE_ITEM, `${goodsId}${name ? `-${name}` : ''}`);
};
