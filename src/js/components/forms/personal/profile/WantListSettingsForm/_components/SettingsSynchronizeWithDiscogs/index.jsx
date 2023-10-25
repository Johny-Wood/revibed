import { Component } from 'react';

import { connect } from 'react-redux';

import FormLocalGroupLayout from '@/components/forms/_components/FormLocalGroupLayout';
import CheckBox from '@/components/ui/inputs/CheckBox';
import { changePersonalInformationRequestAction } from '@/redux-actions/personal/personalActions';
import { appendFormUtil } from '@/utils/form/formUtils';

class SettingsSynchronizeWithDiscogs extends Component {
  constructor(props) {
    super(props);

    const { userInfo: { wantListSettings: { addingNewItems, removingItems } = {} } = {} } = props;

    this.state = {
      addingNewItems: addingNewItems || false,
      addingNewItemsError: false,
      addingNewItemsErrorMsg: '',

      removingItems: removingItems || false,
      removingItemsError: false,
      removingItemsErrorMsg: '',
    };
  }

  disabledChangeWantListSettings = () => {
    const { changePersonalInformationInProcess } = this.props;

    return changePersonalInformationInProcess;
  };

  onChangeWantListSettings = (fieldName, field) => {
    const { changePersonalInformationRequest } = this.props;

    if (this.disabledChangeWantListSettings()) {
      return;
    }

    const formData = appendFormUtil({
      fieldsForm: [
        {
          name: fieldName,
          value: field,
        },
      ],
    });

    changePersonalInformationRequest(formData);
  };

  render() {
    const {
      addingNewItems,
      addingNewItemsError,
      addingNewItemsErrorMsg,

      removingItems,
      removingItemsError,
      removingItemsErrorMsg,
    } = this.state;

    return (
      <FormLocalGroupLayout title="Synchronize with Discogs">
        <CheckBox
          id="addingNewItems"
          label="Adding new items"
          checked={addingNewItems}
          invalid={addingNewItemsError}
          invalidMsg={addingNewItemsErrorMsg}
          onChange={() => {
            const newValue = !addingNewItems;

            this.setState(
              {
                addingNewItems: newValue,
              },
              () => {
                this.onChangeWantListSettings('addingNewItems', newValue);
              }
            );
          }}
          textClass="title_s"
        />
        <CheckBox
          id="removingItems"
          label="Removing items"
          checked={removingItems}
          invalid={removingItemsError}
          invalidMsg={removingItemsErrorMsg}
          onChange={() => {
            const newValue = !removingItems;

            this.setState(
              {
                removingItems: newValue,
              },
              () => {
                this.onChangeWantListSettings('removingItems', newValue);
              }
            );
          }}
          textClass="title_s"
        />
      </FormLocalGroupLayout>
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
)(SettingsSynchronizeWithDiscogs);
