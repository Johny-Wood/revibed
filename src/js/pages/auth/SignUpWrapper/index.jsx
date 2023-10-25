import { connect } from 'react-redux';

import BetaEmail from '@/components/common-ui/links/emails/BetaEmail';
import SignUpForm from '@/components/forms/auth/SignUpForm';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { CommonHeadConstants } from '@/constants/common/head';
import AuthPageLayout from '@/pages/auth/_compoenents/AuthPageLayout';

import styles from './styles.module.scss';

function SignUpWrapper({ referralCode, email, variablesList: { REGISTRATION_IS_OPENED } = {} }) {
  return (
    <AuthPageLayout title="Sign Up">
      {REGISTRATION_IS_OPENED ? (
        <SignUpForm referralCode={referralCode} email={email} />
      ) : (
        <SiteWrapperLayout className="t-center f-y-center" direction="column">
          <div className={styles.authBlock}>
            <h1>{CommonHeadConstants.SITE_NAME} is being tested and will be open to public from July 2021</h1>
            <h3 className="m-top-25">
              If&nbsp;you want to&nbsp;be&nbsp;a&nbsp;part of&nbsp;beta tests, and get
              early&nbsp;access&nbsp;please&nbsp;contact:&nbsp;
              <BetaEmail />
            </h3>
          </div>
        </SiteWrapperLayout>
      )}
    </AuthPageLayout>
  );
}
export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(SignUpWrapper);
