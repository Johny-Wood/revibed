import { Component } from 'react';

import classNames from 'classnames';
import Image from 'next/image';
import { connect } from 'react-redux';

import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import { CommonHeadConstants } from '@/constants/common/head';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { RoutePathsConstants } from '@/constants/routes/routes';
import NextRouter from '@/services/NextRouter';
import { changeInputHandler, validateField } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class JoinBanner extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);

    this.state = {
      email: '',
    };
  }

  disabledSignUp = () => {
    const { email } = this.state;

    return !email;
  };

  goToSignUp = () => {
    const { email } = this.state;
    const { router = {} } = NextRouter.getInstance();

    if (this.disabledSignUp()) {
      return;
    }

    router.push({ pathname: RoutePathsConstants.SIGN_UP, query: { email } });
  };

  render() {
    const {
      userIsAuthorized,
      className,
      titleClassName,
      formClassName,
      backgroundClassName,
      BackgroundImage,
      size: { width, height } = {},
      backgroundIsFill,
      signUpSuccess,
      signUpSuccessEmail,
      contentClassName,
      textClassName,
      successTitleClassName,
      formSuccessClassName,
    } = this.props;

    const { email } = this.state;

    if (userIsAuthorized) {
      return null;
    }

    return (
      <div className={classNames(styles.joinBanner, className)}>
        <div className={classNames(styles.joinBanner__background, backgroundClassName)}>
          <Image
            src={BackgroundImage.src}
            blurDataURL={BackgroundImage.blurDataURL}
            placeholder="blur"
            width={width}
            height={height}
            fill={backgroundIsFill}
            alt="best place"
            quality={100}
          />
        </div>
        <div className={classNames(styles.joinBanner__form, formClassName, signUpSuccess && formSuccessClassName)}>
          <div className={classNames(styles.joinBanner__title, titleClassName)}>
            {signUpSuccess ? (
              <span className={classNames(successTitleClassName)}>Thank you!</span>
            ) : (
              <>
                <span>Join {CommonHeadConstants.SITE_NAME}</span> to find out more
              </>
            )}
          </div>
          <div className={classNames(styles.joinBanner__content, contentClassName)}>
            {signUpSuccess ? (
              <p className={classNames(styles.joinBanner__text, textClassName)}>
                We&rsquo;ve sent a&nbsp;confirmation email to&nbsp;
                <b>{signUpSuccessEmail}</b>
              </p>
            ) : (
              <PersonalInformationFields
                onChange={this.changeInputHandler}
                validateField={this.validateField}
                request={this.goToSignUp}
                fields={[
                  {
                    type: FormFieldsPersonalInformationConstants.email,
                    id: FormFieldsPersonalInformationConstants.email,
                    value: email,
                    label: '',
                    placeholder: 'Email Address',
                    button: {
                      active: true,
                      text: 'Sign Up',
                      className: styles.joinBanner__button,
                      onClick: this.goToSignUp,
                      disabled: this.disabledSignUp(),
                    },
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  signUpSuccess: state.AuthReducer.signUpSuccess,
  signUpSuccessEmail: state.AuthReducer.signUpSuccessEmail,
}))(JoinBanner);
