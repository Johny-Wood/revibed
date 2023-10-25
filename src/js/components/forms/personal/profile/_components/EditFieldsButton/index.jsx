import classNames from 'classnames';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { PersonalEditModulesConstants } from '@/constants/personal/edit/module';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import PencilIcon from '@/icons/PencilIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function EditFieldsButton({
  moduleName,
  className,

  showPopup,
}) {
  const popupConfig = {
    [PersonalEditModulesConstants.AVATAR]: {
      name: PopupPersonalIdsConstants.ChangeAvatarPopup,
    },
    [PersonalEditModulesConstants.NAME]: {
      name: PopupPersonalIdsConstants.EditProfileFieldsPopup,
      data: {
        title: 'Edit username/country',
        fields: [FormFieldsPersonalInformationConstants.name, FormFieldsPersonalInformationConstants.countryId],
      },
    },
    [PersonalEditModulesConstants.ABOUT]: {
      name: PopupPersonalIdsConstants.EditProfileFieldsPopup,
      data: {
        title: 'Edit about',
        fields: [FormFieldsPersonalInformationConstants.about],
      },
    },
  };

  return (
    <ButtonIcon
      className={classNames(styles.editFieldsButton, className)}
      rounded
      transparent
      borderColor="gray-4"
      icon={PencilIcon}
      size={ComponentsCommonConstants.Size.SMALL}
      onClick={() => {
        showPopup(popupConfig[moduleName].name, { ...popupConfig[moduleName].data });
      }}
    />
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(EditFieldsButton);
