import { Component } from 'react';

import { connect } from 'react-redux';

import MediaConditionSelect from '@/components/common-ui/selects/MediaConditionSelect';
import SleeveConditionSelect from '@/components/common-ui/selects/SleeveConditionSelect';
import FormLocalGroupLayout from '@/components/forms/_components/FormLocalGroupLayout';
import ProfileFormShortColumnLayout from '@/components/layouts/ProfileFormShortColumnLayout';
import Button from '@/components/ui/buttons/Button';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { ProjectDefaultConditionConstants } from '@/constants/projects/conditions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { changePersonalInformationRequestAction } from '@/redux-actions/personal/personalActions';
import { appendFormUtil } from '@/utils/form/formUtils';
import { conditionOptionUtil } from '@/utils/project/conditionsUtil';

class WantListSettingsSubscriptionFilter extends Component {
  constructor(props) {
    super(props);

    const {
      wantListSettings: {
        minMediaCondition: { id: mediaConditionId, title: mediaConditionTitle, shortTitle: mediaConditionShortTitle } = {},
        minSleeveCondition: { id: sleeveConditionId, title: sleeveConditionTitle, shortTitle: sleeveConditionShortTitle } = {},
      } = {},
    } = props;

    const minMediaConditionDefault = conditionOptionUtil({
      id: mediaConditionId,
      title: mediaConditionTitle,
      shortTitle: mediaConditionShortTitle,
    });

    const minSleeveConditionDefault = conditionOptionUtil({
      id: sleeveConditionId,
      title: sleeveConditionTitle,
      shortTitle: sleeveConditionShortTitle,
    });

    this.state = {
      changeCurrentForm: false,

      minMediaCondition: mediaConditionId ? minMediaConditionDefault : ProjectDefaultConditionConstants,
      minMediaConditionError: false,
      minMediaConditionErrorMsg: '',

      minSleeveCondition: sleeveConditionId ? minSleeveConditionDefault : ProjectDefaultConditionConstants,
      minSleeveConditionError: false,
      minSleeveConditionErrorMsg: '',
    };
  }

  isChangedFields = () => {
    const { minMediaCondition: { id: mediaConditionId } = {}, minSleeveCondition: { id: sleeveConditionId } = {} } = this.state;

    const {
      wantListSettings: {
        minMediaCondition: { id: mediaConditionIdProp } = {},
        minSleeveCondition: { id: sleeveConditionIdProp } = {},
      } = {},
    } = this.props;

    return mediaConditionId !== mediaConditionIdProp || sleeveConditionId !== sleeveConditionIdProp;
  };

  changeMediaCondition = ([minMediaCondition]) => {
    this.setState({
      minMediaCondition,
    });
  };

  changeSleeveCondition = ([minSleeveCondition]) => {
    this.setState({
      minSleeveCondition,
    });
  };

  disabledChangePersonalInformation = () => !this.isChangedFields();

  onChangePersonalInformationRequest = () => {
    const { changePersonalInformationInProcess, changePersonalInformationRequest, showPopup } = this.props;
    const { minMediaCondition = {}, minSleeveCondition = {} } = this.state;

    const { value: minMediaConditionValue } = minMediaCondition;
    const { value: minSleeveConditionValue } = minSleeveCondition;

    if (this.disabledChangePersonalInformation() || changePersonalInformationInProcess) {
      return;
    }

    this.setState({
      changeCurrentForm: true,
    });

    const formData = appendFormUtil({
      fieldsForm: [
        {
          name: 'minMediaCondition',
          value: minMediaConditionValue,
        },
        {
          name: 'minSleeveConditionValue',
          value: minSleeveConditionValue,
        },
      ],
    });

    changePersonalInformationRequest(formData).then(() => {
      showPopup(PopupPersonalIdsConstants.ChangeWantListSettingsSubscriptionSuccessPopup);

      this.setState({
        changeCurrentForm: false,
      });
    });
  };

  render() {
    const { changePersonalInformationInProcess } = this.props;
    const {
      changeCurrentForm,

      minMediaCondition: { id: selectedMediaConditionId } = {},
      minMediaCondition,
      minMediaConditionError,
      minMediaConditionErrorMsg,

      minSleeveCondition: { id: selectedSleeveConditionId } = {},
      minSleeveCondition,
      minSleeveConditionError,
      minSleeveConditionErrorMsg,
    } = this.state;

    return (
      <FormLocalGroupLayout title="Subscriptions filter" isDisabled>
        <ProfileFormShortColumnLayout>
          <MediaConditionSelect
            label="Minimum Item Condition"
            selected={[minMediaCondition]}
            error={minMediaConditionError}
            errorMsg={minMediaConditionErrorMsg}
            changeItems={this.changeMediaCondition}
            conditionId={selectedMediaConditionId}
            disabled
          />
          <SleeveConditionSelect
            label="Minimum Sleeve Condition"
            selected={[minSleeveCondition]}
            error={minSleeveConditionError}
            errorMsg={minSleeveConditionErrorMsg}
            changeItems={this.changeSleeveCondition}
            conditionId={selectedSleeveConditionId}
            disabled
          />
          <Button
            className="m-top-10 w-100pct"
            text={CommonMessagesConstants.SAVE}
            disabled={this.disabledChangePersonalInformation()}
            isInProcess={changePersonalInformationInProcess && this.isChangedFields() && changeCurrentForm}
            onClick={() => {
              this.onChangePersonalInformationRequest();
            }}
          />
        </ProfileFormShortColumnLayout>
      </FormLocalGroupLayout>
    );
  }
}

export default connect(
  (state) => ({
    wantListSettings: state.AuthReducer.userInfo.wantListSettings,
    changePersonalInformationInProcess: state.PersonalReducer.changePersonalInformationInProcess,
  }),
  (dispatch) => ({
    changePersonalInformationRequest: (formData) => changePersonalInformationRequestAction(formData)(dispatch),

    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(WantListSettingsSubscriptionFilter);
