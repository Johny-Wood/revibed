import { Component } from 'react';

import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import UserUploadAvatar from '@/components/user/UserUploadAvatar';
import getCroppedImg from '@/components/user/UserUploadAvatar/cropImage';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { changePersonalInformationRequestAction } from '@/redux-actions/personal/personalActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { appendFormUtil } from '@/utils/form/formUtils';
import { setInputError } from '@/utils/inputHandlersUtil';
import { ValidateBadRequestUtil } from '@/utils/validate/inputCheckValidate';

class ChangeAvatarPopup extends Component {
  constructor(props) {
    super(props);

    this.setInputError = setInputError.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    this.state = {
      images: [],
      croppedAreaPixels: undefined,

      avatarBlob: null,
      avatarError: false,
      avatarErrorMsg: '',
    };
  }

  setImages = (images) => {
    this.setState({
      images,
      avatarError: false,
      avatarErrorMsg: '',
    });
  };

  setCroppedAreaPixels = (croppedAreaPixels) => {
    this.setState({
      croppedAreaPixels,
    });
  };

  disabledSave = () => {
    const { changePersonalInformationInProcess } = this.props;
    const { images, avatarError } = this.state;

    return changePersonalInformationInProcess || avatarError || images.length <= 0;
  };

  formFieldAvatarBlob = () => {
    const { avatarBlob } = this.state;

    return [
      {
        name: 'avatar',
        value: avatarBlob,
        required: true,
      },
    ];
  };

  cropImage = async (file, croppedAreaPixels) => {
    const { blobImage } = await getCroppedImg(file, croppedAreaPixels, 'avatarBlob');

    this.setState(
      {
        avatarBlob: blobImage,
        avatarError: false,
        avatarErrorMsg: '',
      },
      () => {
        this.onSavePersonalInformation({
          withValidate: false,
          fieldsForm: this.formFieldAvatarBlob(),
        });
      }
    );
  };

  onSavePersonalInformation = ({ withValidate = true, fieldsForm } = {}) => {
    const { changePersonalInformationRequest, showPopup } = this.props;

    if (this.disabledSave() && withValidate) {
      return;
    }

    const formData = appendFormUtil({ fieldsForm });

    changePersonalInformationRequest(formData)
      .then(() => {
        showPopup(PopupPersonalIdsConstants.ChangePersonalInformationSuccessPopup);
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            AVATAR_WRONG_MIME_TYPE: () => {
              this.setInputError('avatar', CommonErrorMessages.AVATAR_WRONG_MIME_TYPE);
            },
            AVATAR_WRONG_RESOLUTION: () => {
              this.setInputError('avatar', CommonErrorMessages.AVATAR_WRONG_RESOLUTION);
            },
          });
        }
      });
  };

  render() {
    const { changePersonalInformationInProcess, closePopup } = this.props;

    const {
      images,
      croppedAreaPixels,

      avatarError,
      avatarErrorMsg,
    } = this.state;

    return (
      <Popup popupId={PopupPersonalIdsConstants.ChangeAvatarPopup} headerText="Edit avatar" maxWidth={490}>
        <PopupTextContent className="c-gray-2 w-360_max t-size_14">
          Choose one file in&nbsp;JPEG, JPG or&nbsp;PNG format. Allowed maximum size&nbsp;- 10Mb. Permitted resolution
          range&nbsp;- 350&times;350 to&nbsp;1100&times;1100&nbsp;px.
        </PopupTextContent>
        <UserUploadAvatar
          setImages={this.setImages}
          images={images}
          croppedAreaPixels={croppedAreaPixels}
          croppedAreaPixelsCallback={this.setCroppedAreaPixels}
          attachDescription="upload photo"
        />
        <ErrorInputMessage className="m-top-10" invalidMessage={avatarErrorMsg} invalid={avatarError} />
        <PopupDoubleButtons
          popupId={PopupPersonalIdsConstants.ChangeAvatarPopup}
          closePopup={closePopup}
          okButtonText={CommonMessagesConstants.CHANGE}
          okButtonInProcess={changePersonalInformationInProcess}
          okButtonDisables={this.disabledSave()}
          okButtonOnClick={() =>
            new Promise((resolve, reject) => {
              const { file } = images[0] || {};

              this.cropImage(file, croppedAreaPixels)
                .then(() => resolve())
                .catch(() => reject());
            })
          }
        />
      </Popup>
    );
  }
}

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,
    changePersonalInformationInProcess: state.PersonalReducer.changePersonalInformationInProcess,
  }),
  (dispatch) => ({
    changePersonalInformationRequest: (formData) => changePersonalInformationRequestAction(formData)(dispatch),
  })
)(ChangeAvatarPopup);
