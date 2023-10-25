import { useMemo } from 'react';

import classNames from 'classnames';

import PurchasesDownload from '@/components/marketplace/purchases/PurchasesDownload';
import GoodsTable from '@/components/tables/GoodsTable';
import Coin from '@/components/ui/currency/Coin';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonMessagesConstants } from '@/constants/common/message';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { getDateFormatUtil } from '@/utils/dateUtils';
import { floatWithCommaFixedUtil, parseReplaceTextUtil, textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function PurchasesOrder({
  item: { preorderPurchase, id: orderId, createdAt, amount, goods = [], itemsCount = 0 } = {},
  withRoute = true,
  downloadButton = {},
  className,
  headerClassName,
  idClassName,
}) {
  const restTotal = useMemo(() => itemsCount - goods.length, [itemsCount, goods]);
  const orderText = useMemo(() => `#${orderId}`, [orderId]);

  return (
    <div className={classNames(styles.purchasesOrder, className)}>
      <div className={classNames(styles.purchasesOrder__header, headerClassName)}>
        {!!orderId && (
          <span className={classNames(styles.purchasesOrder__detail, styles.purchasesOrder__id, idClassName)}>
            <b>{`${preorderPurchase ? CommonMessagesConstants.PREORDER : 'Order'}:`}</b>
            &nbsp;
            {withRoute ? (
              <LinkRoute
                text={orderText}
                href={parseReplaceTextUtil(RoutePathsConstants.PERSONAL_PURCHASE, orderId)}
                className="underline"
              />
            ) : (
              <span>{orderText}</span>
            )}
          </span>
        )}
        <div className="f-y-center">
          <span className={styles.purchasesOrder__detail}>
            <b>Date:</b>
            &nbsp;
            {getDateFormatUtil(createdAt, 'MMMM DD, YYYY')}
          </span>
          <span className={styles.purchasesOrder__detail}>
            <b>Total:</b>
            &nbsp;
            <Coin size={12}>{floatWithCommaFixedUtil(amount)}</Coin>
          </span>
        </div>
      </div>
      <GoodsTable
        items={goods}
        withHeader={false}
        headerColumns={[
          {
            key: 1,
            name: 'Item',
            align: 'start',
            width: '50%',
            grow: 1,
          },
          {
            key: 2,
            name: 'Tracks',
            align: 'start',
            width: 270,
            hideOnMobile: true,
          },
          {
            key: 3,
            name: 'Download',
            align: 'end',
            width: 150,
          },
        ]}
        restColumns={({ id }) => [
          {
            key: `${id}-3`,
            component: <PurchasesDownload targetType="GOODS" targetId={id} />,
          },
        ]}
      />
      <div className={styles.purchasesOrder__footer}>
        <i className="c-gray-2">{restTotal > 0 && `+${restTotal} ${textForLotsOfUtil(restTotal, ['item', 'items'])}`}</i>
        {goods.length > 1 && <PurchasesDownload isAll {...downloadButton} targetId={orderId} targetType="ORDER" />}
      </div>
    </div>
  );
}

export default PurchasesOrder;
