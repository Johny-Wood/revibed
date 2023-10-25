import { Component, createRef } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import CheckBox from '@/components/ui/inputs/CheckBox';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { saveAccountNotificationsSettingsRequestAction } from '@/redux-actions/account/accountNotificationsSettingsActions';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import ScrollService from '@/services/scroll/ScrollService';
import { updateTreePropertyByIdUtil, updateTreePropertyUtil } from '@/utils/treeUtils';

import styles from './styles.module.scss';

const getUpdateChanges = ({
  id,
  checked,
  accountNotificationsSettingsChanged,
  accountNotificationsSettings,
  newAccountNotificationsSettings,
}) => {
  const accountNotificationsSettingsChangedNew = cloneDeep(accountNotificationsSettingsChanged);
  const findAccountNotificationsSettingsChanged = accountNotificationsSettingsChangedNew.findIndex(
    ({ id: findId }) => +findId === +id
  );

  if (findAccountNotificationsSettingsChanged > -1) {
    accountNotificationsSettingsChangedNew.splice(findAccountNotificationsSettingsChanged, 1);
  } else if (!isEqual(newAccountNotificationsSettings, accountNotificationsSettings)) {
    accountNotificationsSettingsChangedNew.push({
      id: +id,
      status: checked,
    });
  }

  return accountNotificationsSettingsChangedNew;
};

const getUpdatedTree = ({
  e: { target: { checked, id } = {} } = {},
  toggleAllowed,
  accountNotificationsSettingsChanged,
  accountNotificationsSettings,
}) => {
  if (!toggleAllowed) {
    return {
      accountNotificationsSettings,
      accountNotificationsSettingsChanged,
    };
  }

  const { newData: newAccountNotificationsSettings } = updateTreePropertyByIdUtil({
    id: +id,
    data: accountNotificationsSettings,
    property: 'active',
    newValue: checked,
  });

  const accountNotificationsSettingsChangedNew = getUpdateChanges({
    id,
    checked,
    accountNotificationsSettingsChanged,
    accountNotificationsSettings,
    newAccountNotificationsSettings,
  });

  return {
    accountNotificationsSettings: newAccountNotificationsSettings,
    accountNotificationsSettingsChanged: accountNotificationsSettingsChangedNew,
  };
};

class AccountNotificationsSettingsTable extends Component {
  constructor(props) {
    super(props);

    this.accountNotificationsSettingsRef = createRef();

    const { accountNotificationsSettings, template } = this.props;

    let accountNotificationsSettingsNew = cloneDeep(accountNotificationsSettings);
    let accountNotificationsSettingsChangedNew = [];

    if (template) {
      const { newData = {}, changedData = {} } = updateTreePropertyUtil({
        searchProperty: 'targetName',
        searchPropertyValue: template,
        data: accountNotificationsSettings[0] || {},
        property: 'active',
        newValue: false,
      });

      accountNotificationsSettingsNew = [newData];
      accountNotificationsSettingsChangedNew = changedData;
    }

    this.state = {
      accountNotificationsSettings: accountNotificationsSettingsNew || [],
      accountNotificationsSettingsChanged: accountNotificationsSettingsChangedNew || [],
    };
  }

  componentDidMount() {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.ACCOUNT_NOTIFICATIONS_SETTINGS,
      RoutePathsConstants.PERSONAL_NOTIFICATIONS_SETTINGS,
      this.accountNotificationsSettingsRef
    );
  }

  disableSaveAccountNotificationsSettings = () => {
    const { saveInProcess, accountNotificationsSettings: accountNotificationsSettingsProps } = this.props;
    const { accountNotificationsSettings, accountNotificationsSettingsChanged } = this.state;

    return (
      saveInProcess ||
      isEqual(accountNotificationsSettings, accountNotificationsSettingsProps) ||
      accountNotificationsSettingsChanged.length === 0
    );
  };

  saveAccountNotificationsSettings = () => {
    const { targetType, saveAccountNotificationsSettingsRequest, showMessage, token, template } = this.props;
    const { accountNotificationsSettingsChanged, accountNotificationsSettings } = this.state;

    if (this.disableSaveAccountNotificationsSettings()) {
      return;
    }

    saveAccountNotificationsSettingsRequest({
      token,
      targetType,
      template,
      accountNotificationsSettingsChanged,
      accountNotificationsSettings,
    }).then(() => {
      this.setState({
        accountNotificationsSettings: accountNotificationsSettings || [],
        accountNotificationsSettingsChanged: [],
      });

      if (!token) {
        ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTop({
          sectionId: ScrollBlockIdConstants.ACCOUNT_NOTIFICATIONS_SETTINGS,
          behavior: 0,
        });
      }

      const messageText = `${targetType.toLowerCase().replace('_', ' ')} notification settings changed successfully`;

      showMessage('SuccessMessage', {
        messageText: messageText[0].toUpperCase() + messageText.slice(1),
      });
    });
  };

  changeTree = ({ accountNotificationsSettings, accountNotificationsSettingsChanged }) => {
    this.setState({
      accountNotificationsSettings: [accountNotificationsSettings],
      accountNotificationsSettingsChanged,
    });
  };

  myFunc = ({ checked, children = [], newChanged: newChangedOut = [], newTree: newTreeOut = [] }) => {
    let newTree = cloneDeep(newTreeOut);
    let newChanged = cloneDeep(newChangedOut);

    children.forEach(({ id, toggleAllowed, children: childChildren = [] }) => {
      if (childChildren !== undefined && childChildren.length > 0) {
        const { accountNotificationsSettings: newTreeIn, accountNotificationsSettingsChanged: newChangedIn } = this.myFunc({
          checked,
          children: childChildren,
          newChanged,
          newTree,
        });

        newChanged = newChangedIn;
        newTree = newTreeIn;
      } else {
        const {
          accountNotificationsSettings: accountNotificationsSettingsNew,
          accountNotificationsSettingsChanged: accountNotificationsSettingsChangedNew,
        } = getUpdatedTree({
          e: {
            target: {
              checked,
              id,
            },
          },
          toggleAllowed,
          accountNotificationsSettingsChanged: [],
          accountNotificationsSettings: newTree[0] || {},
        });

        const changedNew = cloneDeep(newChanged);
        const findAccountNotificationsSettingsChanged = changedNew.findIndex(({ id: findId }) => +findId === +id);

        if (findAccountNotificationsSettingsChanged > -1) {
          newChanged.splice(findAccountNotificationsSettingsChanged, 1);
        } else {
          newChanged.push(...accountNotificationsSettingsChangedNew);
        }

        newTree = [accountNotificationsSettingsNew];
      }
    });

    return {
      accountNotificationsSettings: newTree,
      accountNotificationsSettingsChanged: newChanged,
    };
  };

  changeBranch = ({ target: { checked } = {} }, children = []) => {
    const {
      accountNotificationsSettingsChanged: accountNotificationsSettingsChangedState,
      accountNotificationsSettings: accountNotificationsSettingsState,
    } = this.state;

    const { accountNotificationsSettingsChanged, accountNotificationsSettings } = this.myFunc({
      checked,
      children,
      newChanged: accountNotificationsSettingsChangedState,
      newTree: accountNotificationsSettingsState,
    });

    this.changeTree({
      accountNotificationsSettings: accountNotificationsSettings[0] || {},
      accountNotificationsSettingsChanged,
    });
  };

  renderCheckBox = ({ id, active, toggleAllowed }) => (
    <CheckBox
      id={id}
      checked={active}
      disabled={!toggleAllowed}
      onChange={(e) => {
        const {
          accountNotificationsSettingsChanged: accountNotificationsSettingsChangedState,
          accountNotificationsSettings: accountNotificationsSettingsState,
        } = this.state;

        const { accountNotificationsSettingsChanged, accountNotificationsSettings } = getUpdatedTree({
          e,
          toggleAllowed,
          accountNotificationsSettingsChanged: accountNotificationsSettingsChangedState,
          accountNotificationsSettings: accountNotificationsSettingsState[0] || {},
        });

        this.changeTree({
          accountNotificationsSettingsChanged,
          accountNotificationsSettings,
        });
      }}
    />
  );

  renderCheckBoxHelper = ({ id, active, children, changed }) => (
    <CheckBox
      id={id}
      checked={active}
      changed={changed}
      onChange={(e) => {
        this.changeBranch(e, children);
      }}
    />
  );

  checkBranches = (branch = []) => {
    const activeArray = [];
    const notActiveArray = [];

    const newBranch = cloneDeep(branch);

    newBranch.forEach(({ id, active, children }) => {
      if (children !== undefined && children.length > 0) {
        const result = this.checkBranches(children);
        activeArray.push(...result.activeArray);
        notActiveArray.push(...result.notActiveArray);
      } else if (active) {
        activeArray.push(id);
      } else {
        notActiveArray.push(id);
      }
    });

    return {
      activeArray,
      notActiveArray,
    };
  };

  checkOutBranch = ({ children }) => {
    const { activeArray, notActiveArray } = this.checkBranches(children);

    return activeArray.length > 0 && notActiveArray.length === 0;
  };

  checkSelectedBranch = ({ children }) => {
    const { activeArray, notActiveArray } = this.checkBranches(children);

    return activeArray.length > 0 && notActiveArray.length > 0;
  };

  renderTree = (treeItem = []) => {
    const { accountNotificationsTreeBranchClassName } = this.props;

    return treeItem.map(({ id, name, active, toggleAllowed, children = [] }) => {
      const key = `accountNotificationsSettings-${id}-${name}`;

      if (children.length > 0) {
        return (
          <div className={classNames(styles.accountNotificationsTree__branch, accountNotificationsTreeBranchClassName)} key={key}>
            <div className={styles.accountNotificationsTree__title}>
              <b>{name}</b>
              {this.renderCheckBoxHelper({
                id,
                active: this.checkOutBranch({ children }),
                children,
                changed: this.checkSelectedBranch({ children }),
              })}
            </div>
            {this.renderTree(children)}
          </div>
        );
      }

      return (
        <div className={styles.accountNotificationsTree__item} key={key}>
          {name}
          {this.renderCheckBox({ id, active, toggleAllowed })}
        </div>
      );
    });
  };

  render() {
    const {
      saveInProcess,
      accountNotificationsSettingsTableClassName,
      accountNotificationsTreeClassName,
      accountNotificationsSettingsButtonSaveClassName,
    } = this.props;
    const { accountNotificationsSettings = [] } = this.state;
    const { children: mainNotifications = [] } = accountNotificationsSettings[0] || {};

    return (
      <div
        className={classNames([styles.accountNotificationsSettings, accountNotificationsSettingsTableClassName])}
        ref={this.accountNotificationsSettingsRef}
      >
        <div className={classNames(styles.accountNotificationsTree, accountNotificationsTreeClassName)}>
          {this.renderTree(mainNotifications)}
        </div>
        <Button
          text={CommonMessagesConstants.SAVE}
          className={classNames(styles.accountNotificationsSettings__buttonSave, accountNotificationsSettingsButtonSaveClassName)}
          isInProcess={saveInProcess}
          disabled={this.disableSaveAccountNotificationsSettings()}
          onClick={this.saveAccountNotificationsSettings}
        />
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    saveAccountNotificationsSettingsRequest: ({
      targetType,
      accountNotificationsSettings,
      accountNotificationsSettingsChanged,
      token,
      template,
    }) =>
      saveAccountNotificationsSettingsRequestAction({
        targetType,
        accountNotificationsSettings,
        accountNotificationsSettingsChanged,
        token,
        template,
        dispatch,
      }),
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
  })
)(AccountNotificationsSettingsTable);
