import classNames from 'classnames';
import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import CartNoItems from '@/components/marketplace/cart/CartNoItems';
import CartTable from '@/components/marketplace/cart/CartTable';
import CartTotal from '@/components/marketplace/cart/CartTotal';
import Button from '@/components/ui/buttons/Button';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupCartIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

const TITLE = 'Cart';

function CartWrapper({
  cartInfo: { goodsCount = 0 } = {},
  showPopup,
  getCartInProcess,
  variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {},
}) {
  return (
    <PageDisabledLayout disabled={!DIGITAL_MARKETPLACE_ENABLED}>
      <BaseWebsiteLayout
        headSettings={{
          title: TITLE,
        }}
        shownBanners
      >
        <PersonalPageLayout
          headerText={TITLE}
          name={styles.cartPage}
          preloadInProcess={getCartInProcess}
          withPersonalTabsNavigation={false}
        >
          <div className={styles.cartWrapper}>
            {goodsCount > 0 ? (
              <div className={styles.cartWrapper__list}>
                <CartTable />
                <CartTotal />
                <div className={classNames(styles.cartWrapper__control, 'f-y-center f-x-end')}>
                  <LinkRoute
                    text="Continue shopping"
                    type="button"
                    transparent
                    borderColor="gray-3"
                    href={RoutePathsConstants.MARKETPLACE}
                  />
                  <Button
                    text={CommonMessagesConstants.PAY_NOW}
                    onClick={() => {
                      showPopup(PopupCartIdsConstants.ConfirmPurchasePopup);
                    }}
                  />
                </div>
              </div>
            ) : (
              <CartNoItems withIcon className={styles.cartWrapper__noItems} titleClassName={styles.cartWrapper__noItems__title} />
            )}
          </div>
        </PersonalPageLayout>
      </BaseWebsiteLayout>
    </PageDisabledLayout>
  );
}

export default connect(
  (state) => ({
    cartInfo: state.MarketplaceCartReducer.cartInfo,
    variablesList: state.VariablesReducer.variablesList,
    getCartInProcess: state.MarketplaceCartReducer.getCartInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(CartWrapper);
