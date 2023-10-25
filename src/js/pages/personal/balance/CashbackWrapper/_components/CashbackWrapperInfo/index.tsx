import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import Coin from '@/components/ui/currency/Coin';
import { CommonHeadConstants } from '@/constants/common/head';
import type { RootState } from '@/js/redux/reducers';
import { numberToOrdinal } from '@/utils/numberTextUtils';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

const CashbackWrapperInfo = ({
  variablesList: {
    PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT,
    PROJECT_FOUNDER_CONTRIBUTION_PRICE,
    PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT,
    PROJECT_CONTRIBUTOR_CONTRIBUTION_PRICE,
  } = {},
}: PropsFromRedux) => (
  <div className={classNames(styles.CashbackWrapperInfo)}>
    <h2>
      <b>How it works</b>
    </h2>
    <p>
      We&nbsp;believe that the best way to&nbsp;preserve forgotten records, is&nbsp;with the help of&nbsp;a&nbsp;strong community
      of&nbsp;music lovers with deep knowledge about their favourite genres.
    </p>
    <p>Which is&nbsp;why we&nbsp;want to&nbsp;reward you for your musical expertise.</p>
    <p>Help protect your favourite music and enjoy it&nbsp;for (almost) free with our cashback program!</p>
    <h2>
      <b>Founder’s cashback</b>
    </h2>
    <p>
      As&nbsp;some of&nbsp;the most dedicated diggers that bring all of&nbsp;this wonderful music to&nbsp;our ears, founders are
      at&nbsp;the core of&nbsp;{CommonHeadConstants.SITE_NAME}. And if&nbsp;you start{' '}
      {PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT}&nbsp;successful pre-order projects, we&nbsp;will refund you the total amount
      you spent on&nbsp;all {PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT}&nbsp;of&nbsp;those releases.
    </p>
    <p>
      At&nbsp;
      <Coin afterText={floatWithCommaFixedUtil(PROJECT_FOUNDER_CONTRIBUTION_PRICE)} /> per pre-order, that means you will
      receive&nbsp;
      <Coin
        afterText={floatWithCommaFixedUtil(PROJECT_FOUNDER_CONTRIBUTION_PRICE * PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT)}
      />
      &nbsp;in&nbsp;cashback as&nbsp;soon as&nbsp;the&nbsp;{numberToOrdinal(PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT)}
      &nbsp;project that you started has completed.
    </p>
    <h2>
      <b>Contributor’s cashback</b>
    </h2>
    <p>
      As&nbsp;a&nbsp;contributor, you also play an&nbsp;important role in&nbsp;the preservation of&nbsp;the world&rsquo;s musical
      heritage.
    </p>
    <p>
      To&nbsp;thank you for your continued support, you will receive a&nbsp;
      <Coin afterText={floatWithCommaFixedUtil(PROJECT_CONTRIBUTOR_CONTRIBUTION_PRICE)} />
      &nbsp;cashback for every&nbsp;{PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT}&nbsp;completed pre-order projects you
      participate&nbsp;in.
    </p>
    <p>
      That means that if&nbsp;you support {PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT}&nbsp;successful pre-orders, you will
      get 1&nbsp;of&nbsp;them completely free of charge. The cashback will be&nbsp;transferred to&nbsp;your wallet as&nbsp;soon
      as&nbsp;the {PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT}th project has completed.
    </p>
  </div>
);

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
}));

export default connector(CashbackWrapperInfo);
