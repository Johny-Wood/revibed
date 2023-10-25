import { Component } from 'react';

import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import Button from '@/components/ui/buttons/Button';
import CheckBox from '@/components/ui/inputs/CheckBox';
import Input from '@/components/ui/inputs/Input';
import { CommonMessagesConstants } from '@/constants/common/message';
import ComponentsCommonConstants from '@/constants/components/common';
import { MessagesAskConstants } from '@/constants/messages/ask';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { addWantListReleaseRequestAction, loadWantListRequestAction } from '@/redux-actions/wantList/wantListActions';
import { changeInputHandlerNew, pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class AddWantListReleasePopup extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandlerNew.bind(this);

    const { wantListSettings: { addingNewItems = false } = {} } = props;

    this.state = {
      syncWithDiscogs: addingNewItems,

      releases: {
        release1: {
          value: '',
          error: '',
          message: '',
        },
      },
    };
  }

  renderInputWantListRelease = (id) => (
    <Input
      key={id}
      id={`releases.${id}`}
      placeholder="Paste link to release here"
      // eslint-disable-next-line react/destructuring-assignment
      value={this.state.releases[`${id}`].value}
      onChange={this.changeInputHandler}
      onKeyDown={(e) => {
        pressEnterKeyInputHandler(e);
      }}
    />
  );

  renderReleasesLink = () => {
    const { releases } = this.state;

    return Object.keys(releases).map((key) => this.renderInputWantListRelease(key));
  };

  hasEmptyLink = () => {
    const { releases } = this.state;

    return Object.keys(releases)
      .map((key) => !releases[key].value)
      .includes(true);
  };

  disabledAdd = () => {
    const { addWantListReleaseInProcess, loadWantListInProcess } = this.props;

    return addWantListReleaseInProcess || loadWantListInProcess;
  };

  render() {
    const { syncWithDiscogs, releases } = this.state;
    const {
      closePopup,
      addWantListReleaseInProcess,
      addWantListReleaseRequest,
      showMessage,
      loadWantListRequest,
      loadWantListInProcess,
      popupId = PopupWantListIdsConstants.AddWantListReleasePopup,
    } = this.props;

    return (
      <Popup
        classCustom={styles.AddWantListReleasePopup}
        popupId={popupId}
        headerText={MessagesAskConstants.WANT_LIST_ADD_RELEASES}
        size={ComponentsCommonConstants.Size.LARGE}
        textAlign="left"
        maxWidth={680}
      >
        <div className="m-top-30 w-100pct">
          {this.renderReleasesLink()}
          <div className="f-x-between m-top-15">
            <CheckBox
              id="synchronizeDiscogs"
              checked={syncWithDiscogs}
              label="Synchronize with Discogs"
              onChange={() => {
                this.setState({
                  syncWithDiscogs: !syncWithDiscogs,
                });
              }}
            />
            <Button
              text="+ add field"
              type="button_string"
              className={styles.AddWantListReleasePopup__buttonAddWantListRelease}
              disabled={this.hasEmptyLink()}
              onClick={() => {
                this.setState({
                  releases: {
                    ...releases,
                    [`release${Object.keys(releases).length + 1}`]: '',
                  },
                });
              }}
            />
          </div>
          <PopupDoubleButtons
            popupId={popupId}
            closePopup={closePopup}
            okButtonText={CommonMessagesConstants.ADD}
            okButtonDisables={this.disabledAdd()}
            okButtonInProcess={addWantListReleaseInProcess || loadWantListInProcess}
            okButtonOnClick={() =>
              new Promise((resolve, reject) => {
                if (this.disabledAdd()) {
                  reject();
                  return;
                }

                const releasesList = Object.keys(releases).map((key) => releases[key].value);

                addWantListReleaseRequest({
                  syncWithDiscogs,
                  releases: releasesList,
                })
                  .then(() => {
                    const { wantListPageSettings: { page: { size: wantListPageSize } = {} } = {} } = this.props;

                    loadWantListRequest({ pageSize: wantListPageSize })
                      .then(() => {
                        closePopup(popupId);
                        showMessage('SuccessMessage', {
                          messageText: MessagesSuccessConstants.WANT_LIST_ADD_RELEASES,
                        });
                      })
                      .catch(() => {
                        closePopup(popupId);
                      });

                    resolve();
                  })
                  .catch(() => {
                    closePopup(popupId);
                    reject();
                  });
              })
            }
          />
        </div>
      </Popup>
    );
  }
}

export default connect(
  (state) => ({
    wantListSettings: state.AuthReducer.userInfo.wantListSettings,
    addWantListReleaseInProcess: state.WantListReducer.addWantListReleaseInProcess,
    loadWantListInProcess: state.WantListReducer.loadWantListInProcess,
    wantListPageSettings: state.WantListReducer.wantListPageSettings,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    addWantListReleaseRequest: (params) => addWantListReleaseRequestAction(params)(dispatch),
    loadWantListRequest: (params) => loadWantListRequestAction(params)(dispatch),
  })
)(AddWantListReleasePopup);
