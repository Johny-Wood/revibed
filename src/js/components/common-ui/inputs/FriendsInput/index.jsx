import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Contributor from '@/components/project/_components/Contributor';
import Input from '@/components/ui/inputs/Input';
import { onlySearchPersonalSubscriptionsRequestAction } from '@/redux-actions/personal/friendsActions';

import styles from './styles.module.scss';

class FriendsInput extends Component {
  constructor(props) {
    super(props);

    const { changeInputHandler } = this.props;

    this.changeInputHandler = changeInputHandler;
  }

  onLoadRequest = (name) => {
    const { onlySearchPersonalSubscriptionsRequest } = this.props;

    onlySearchPersonalSubscriptionsRequest(name);
  };

  clickItemCallback = ({ option: { id, label } = {} } = {}) => {
    const { changeItems, selected } = this.props;
    let selectedTmp = cloneDeep(selected);

    const selectedIdx = selectedTmp.findIndex((selectedItem) => selectedItem.id === id);

    if (selectedIdx > -1) {
      selectedTmp.splice(selectedIdx, 1);
    } else {
      selectedTmp = [
        ...selected,
        {
          id,
          name: label,
        },
      ];
    }

    changeItems(selectedTmp);
  };

  render() {
    const { friendsSearched, selected, searchText, error, errorMsg, onlySearchLoadPersonalSubscriptionsInProcess } = this.props;

    const friendsSearchedNew = friendsSearched.map((friendSearched) => {
      const {
        userInfo,
        userInfo: { id, name = '' },
      } = friendSearched;

      const UserCardOption = (
        <Contributor
          contributor={userInfo}
          avatar={{
            size: 40,
          }}
          className={styles.inputAutocompleteFriend}
          nickClassName={styles.inputAutocompleteFriend__nick}
        />
      );

      return {
        id,
        value: id,
        name,
        optionComponent: UserCardOption,
      };
    });

    return (
      <Input
        autoComplete="off"
        classNameBlock="input-autocomplete"
        className="input-w-100pct"
        listHeight={339}
        id="friends"
        label="Select your friends by typing their names"
        value={searchText}
        searchValueIpt={searchText}
        invalid={error}
        invalidMessage={errorMsg}
        onChange={(e) => this.changeInputHandler(e, { onChangeCallback: this.onLoadRequest })}
        withAutoComplete
        options={friendsSearchedNew}
        optionListPositionX="right"
        clickItemCallback={this.clickItemCallback}
        selectedList={selected}
        inProcess={onlySearchLoadPersonalSubscriptionsInProcess}
        tags
      />
    );
  }
}

export default connect(
  (state) => ({
    friendsSearched: state.FriendsReducer.friendsSearched,
    onlySearchLoadPersonalSubscriptionsInProcess: state.FriendsReducer.onlySearchLoadPersonalSubscriptionsInProcess,
  }),
  (dispatch) => ({
    onlySearchPersonalSubscriptionsRequest: (nickname) => onlySearchPersonalSubscriptionsRequestAction(nickname)(dispatch),
  })
)(FriendsInput);
