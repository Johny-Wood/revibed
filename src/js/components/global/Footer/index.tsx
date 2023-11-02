import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import CategoryNavigation from '@/components/global/Footer/_components/CategoryNavigation';
import FooterSabam from '@/components/global/Footer/_components/FooterSabam';
import Logo from '@/components/primary/Logo';
import Navigation from '@/components/primary/Navigation';
import { CommonHeadConstants } from '@/constants/common/head';
import { FooterNavigationConstants } from '@/constants/navigations/footer';
import { PolicyNavigationConstants } from '@/constants/navigations/policy';
import type { RootState } from '@/js/redux/reducers';

import styles from './styles.module.scss';

export type FooterExternalProps = {
  footerProps?: {
    withCategoryNavigation?: boolean;
    blackFooter?: boolean;
  };
};

type PropsFromRedux = ConnectedProps<typeof connector>;

type FooterProps = FooterExternalProps & PropsFromRedux;

function Footer({
  footerProps: { withCategoryNavigation = true, blackFooter = false } = {},
  variablesList: { CURRENT_YEAR } = {},
}: FooterProps) {
  return (
    <>
      {withCategoryNavigation && (
        <CategoryNavigation blackFooter={blackFooter} items={FooterNavigationConstants}>
          {!blackFooter && <FooterSabam />}
        </CategoryNavigation>
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
            {/* @ts-ignore */}
            <Navigation
              className={classNames(styles.footerNav, blackFooter && styles.footerNav_black)}
              links={PolicyNavigationConstants}
              location="footer"
            />
          </div>
        </div>
      </footer>
    </>
  );
}

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
}));

export default connector(Footer);
