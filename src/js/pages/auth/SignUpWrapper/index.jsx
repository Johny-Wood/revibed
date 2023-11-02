import { connect } from 'react-redux';

import SignUpForm from '@/components/forms/auth/SignUpForm';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
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
            <h1>Coming soon</h1>
          </div>
        </SiteWrapperLayout>
      )}
    </AuthPageLayout>
  );
}
export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(SignUpWrapper);
