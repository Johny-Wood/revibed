import { connect } from 'react-redux';

import classNames from 'classnames';

import CategoryNavigation from '@/components/global/Landing/Footer/_components/CategoryNavigation';
import Logo from '@/components/primary/Logo';
import Navigation from '@/components/primary/Navigation';
import { CommonHeadConstants } from '@/constants/common/head';
import { FooterBlackCatCardCategoryNavigationConstants, FooterNavigationConstants } from '@/constants/navigations/footer';
import { PolicyNavigationConstants } from '@/constants/navigations/policy';

import styles from './styles.module.scss';

function LFooter({
  footerProps: { withCategoryNavigation = true, blackFooter = false } = {},
  variablesList,
  variablesList: { CURRENT_YEAR } = {},
  promoBlackCatCardInfo: { isActive: promoBlackCatCardIsActive, lastInCode } = {},
}) {
  return (
    <>
      {withCategoryNavigation && (
        <CategoryNavigation
          blackFooter
          items={
            !promoBlackCatCardIsActive || lastInCode
              ? FooterNavigationConstants({ variablesList })
              : [...FooterNavigationConstants({ variablesList }), FooterBlackCatCardCategoryNavigationConstants]
          }
        />
      )}
      <footer className={classNames(styles.footer, blackFooter && styles.footer_black)}>
        <div className={styles.footer__wrapper}>
          <div className={styles.footer__copyright}>
            <Logo type="secondary" />
            <div className={styles.footer__copyright__text}>
              © {CommonHeadConstants.DATE_SITE_START !== CURRENT_YEAR ? `${CommonHeadConstants.DATE_SITE_START} - ` : ''}
              {CURRENT_YEAR} {CommonHeadConstants.SITE_NAME}®
            </div>
          </div>
          <div className={styles.footer__navigation}>
            <Navigation className={classNames(styles.footerNav, blackFooter && styles.footerNav_black)} links={PolicyNavigationConstants} location="footer" />
          </div>
        </div>
      </footer>
    </>
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
  promoBlackCatCardInfo: state.PromoReducer.promoActions.BLACK_CAT_CARD,
}))(LFooter);
