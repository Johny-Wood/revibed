import { connect } from 'react-redux';

import RedirectComponent from '@/components/common/RedirectComponent';
import Button from '@/components/ui/buttons/Button';
import { makePromoCodeRequestAction } from '@/redux-actions/promo/promoActions';

function MakeCodeButton({
  promoInfo,

  makePromoCodeInProcess,
  makePromoCodeRequest,
}) {
  return (
    <RedirectComponent>
      <Button
        className="button-get-code"
        text="Get promo code"
        disabled={makePromoCodeInProcess || !promoInfo}
        isInProcess={makePromoCodeInProcess}
        onClick={makePromoCodeRequest}
        rounded
      />
    </RedirectComponent>
  );
}

export default connect(
  (state) => ({
    makePromoCodeInProcess: state.PromoReducer.makePromoCodeInProcess,
    promoInfo: state.PromoReducer.promoActions.BLACK_CAT_CARD,
  }),
  (dispatch) => ({
    makePromoCodeRequest: () => makePromoCodeRequestAction({ promoName: 'BLACK_CAT_CARD', dispatch }),
  })
)(MakeCodeButton);
