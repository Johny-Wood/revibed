import { useEffect } from 'react';

import Router from 'next/router';
import { connect } from 'react-redux';

import BlackCatCardPromoWrapper from '@/pages/promo/black-cat-card/BlackCatCardPromoWrapper';
import ReduxStoreService from '@/services/ReduxStoreService';

function BlackCatPromoPage({ promoInfo = {} }) {
  useEffect(() => {
    if (!promoInfo.isActive) {
      Router.replace('/').then();
    }
  }, [promoInfo]);

  return <BlackCatCardPromoWrapper />;
}

BlackCatPromoPage.getInitialProps = async (ctx) => {
  const { PromoReducer: { promoActions: { BLACK_CAT_CARD: { isActive: promoIsActive } = {} } = {} } = {} } =
    ReduxStoreService.getInstance().store.getState();

  const { res = {}, req } = ctx;

  if (!promoIsActive) {
    if (res && req) {
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    } else {
      await Router.replace('/');
    }
  }

  return { props: {} };
};

export default connect((state) => ({
  promoInfo: state.PromoReducer.promoActions.BLACK_CAT_CARD,
}))(BlackCatPromoPage);
