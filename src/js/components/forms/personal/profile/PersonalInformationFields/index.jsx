import AboutField from '@/components/forms/personal/profile/fields/personal/AboutField';
import CountryField from '@/components/forms/personal/profile/fields/personal/CountryField';
import CurrentPasswordField from '@/components/forms/personal/profile/fields/personal/CurrentPasswordField';
import EmailField from '@/components/forms/personal/profile/fields/personal/EmailField';
import NameField from '@/components/forms/personal/profile/fields/personal/NameField';
import NewPasswordField from '@/components/forms/personal/profile/fields/personal/NewPasswordField';
import NewPasswordRepeatField from '@/components/forms/personal/profile/fields/personal/NewPasswordRepeatField';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';

const PersonalInformationFields = ({ fields = [], ...fieldDefaultProps }) =>
  fields.map(({ type, ...fieldProps }) => {
    const key = `field-${type}`;

    switch (type) {
      case FormFieldsPersonalInformationConstants.name: {
        return <NameField key={key} {...fieldDefaultProps} {...fieldProps} />;
      }
      case FormFieldsPersonalInformationConstants.about: {
        return <AboutField key={key} {...fieldDefaultProps} {...fieldProps} />;
      }
      case FormFieldsPersonalInformationConstants.email: {
        return <EmailField key={key} {...fieldDefaultProps} {...fieldProps} />;
      }
      case FormFieldsPersonalInformationConstants.countryId: {
        return <CountryField key={key} {...fieldDefaultProps} {...fieldProps} />;
      }
      case FormFieldsPersonalInformationConstants.currentPassword: {
        return <CurrentPasswordField key={key} {...fieldDefaultProps} {...fieldProps} />;
      }
      case FormFieldsPersonalInformationConstants.newPassword: {
        return <NewPasswordField key={key} {...fieldDefaultProps} {...fieldProps} />;
      }
      case FormFieldsPersonalInformationConstants.newPasswordRepeat: {
        return <NewPasswordRepeatField key={key} {...fieldDefaultProps} {...fieldProps} />;
      }
      default: {
        return null;
      }
    }
  });

export default PersonalInformationFields;
