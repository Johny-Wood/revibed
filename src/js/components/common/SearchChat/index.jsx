import { Component } from 'react';

import { connect } from 'react-redux';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import { MobileLayout } from '@/components/layouts/ViewportLayouts';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import { CommonMessagesConstants } from '@/constants/common/message';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import CloseIcon from '@/icons/control/close/CloseIcon';
import SearchIcon from '@/icons/SearchIcon';
import {
  getDialogByIdMessageRequestAction,
  searchDialogCloseAction,
  searchDialogNextAction,
  searchDialogOpenAction,
  searchDialogPrevAction,
  searchInDialogRequestAction,
} from '@/redux-actions/dialog/dialogActions';
import { changeInputHandler, pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class SearchChat extends Component {
  constructor(props) {
    super(props);

    this.hovered = false;

    this.changeInputHandler = changeInputHandler.bind(this);

    this.state = {
      showedInput: false,

      searchChat: '',
      searchChatError: false,
      searchChatErrorMsg: '',
    };
  }

  disabledSearch = () => {
    const { location, chatId, searchInDialogInProcess } = this.props;
    const { searchChat } = this.state;

    return searchInDialogInProcess || !location || !chatId || !searchChat;
  };

  onSearch = () => {
    const { searchChat } = this.state;
    const { searchInDialog, location, chatId } = this.props;

    if (this.disabledSearch()) {
      return;
    }

    searchInDialog(location, chatId, searchChat).then(() => {
      // if (results.length > 0) {
      //   results.forEach((result) => {
      //     const { id } = result;
      //
      //     dialogListAddMessagesRefs(id);
      //   });
      //
      //   dialogListScrollToMessage(results[0].id);
      // }
      // if (results) {
      //   this.onGetDialogByIdMessage();
      // }
    });
  };

  disabledNext = () => {
    const { searchedIdx, searchInDialogIds } = this.props;

    return searchedIdx >= searchInDialogIds.length - 1;
  };

  disabledPrev = () => {
    const { searchedIdx } = this.props;

    return searchedIdx <= 0;
  };

  onNextSearch = () => {
    const { searchedNextAction, location } = this.props;

    if (this.disabledNext()) {
      return;
    }

    searchedNextAction(location);
  };

  onPrevSearch = () => {
    const { searchedPrevAction, location } = this.props;

    if (this.disabledPrev()) {
      return;
    }

    searchedPrevAction(location);
  };

  renderSearchResults = () => {
    const { searchInDialogIds, searchedCloseAction, location, searchedIdx } = this.props;

    return (
      <div className={styles.searchChat__results}>
        <span>
          {searchedIdx + 1} of
          {searchInDialogIds.length}
        </span>
        <div className={styles.buttons}>
          <Button
            type="button_string"
            className={styles.button_prev}
            disabled={this.disabledPrev()}
            onClick={() => this.onPrevSearch()}
          >
            <ArrowIcon />
          </Button>
          <Button type="button_string" disabled={this.disabledNext()} onClick={() => this.onNextSearch()}>
            <ArrowIcon />
          </Button>
        </div>
        <Button
          type="button_string"
          className={styles.button_close}
          onClick={() => {
            this.setState({
              searchChat: '',
              showedInput: false,
            });

            searchedCloseAction(location);
          }}
        >
          <CloseIcon />
        </Button>
      </div>
    );
  };

  renderInput = () => {
    const { searchChat, searchChatError, searchChatErrorMsg, showedInput } = this.state;

    const { searched, searchedCloseAction, location } = this.props;

    return (
      <div className={styles.searchChat__container}>
        <Input
          autoFocus
          id="searchChat"
          value={searchChat}
          invalid={searchChatError}
          invalidMessage={searchChatErrorMsg}
          onChange={this.changeInputHandler}
          placeholder="Search this chat"
          onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onSearch)}
          onBlur={() => {
            if (showedInput && !searchChat && !this.hovered) {
              this.setState({
                searchChat: '',
                showedInput: false,
              });

              searchedCloseAction(location);
            }
          }}
        />

        <TransitionLayout isShown={!searched}>
          <>{this.renderButton()}</>
        </TransitionLayout>
        <TransitionLayout isShown={searched}>
          <>{this.renderSearchResults()}</>
        </TransitionLayout>
      </div>
    );
  };

  renderButton = () => {
    const { showedInput } = this.state;
    const { searchInDialogInProcess } = this.props;

    return (
      <Button
        className={styles.searchChat__button}
        type="button_string"
        disabled={showedInput ? this.disabledSearch() : false}
        isInProcess={searchInDialogInProcess}
        onClick={() => {
          if (showedInput) {
            this.onSearch();
          }

          this.setState({
            showedInput: true,
          });
        }}
      >
        <SearchIcon />
      </Button>
    );
  };

  render() {
    const { showedInput } = this.state;

    return (
      <div
        className={styles.searchChat}
        onMouseEnter={() => {
          this.hovered = true;
        }}
        onFocus={() => {
          this.hovered = true;
        }}
        onMouseLeave={() => {
          this.hovered = false;
        }}
        onBlur={() => {
          this.hovered = false;
        }}
      >
        <TransitionLayout duration={300} isShown={!showedInput}>
          <>{this.renderButton()}</>
        </TransitionLayout>
        <TransitionLayout isShown={showedInput}>
          <div className={styles.searchChat__input}>
            {this.renderInput()}
            <MobileLayout>
              <Button
                className={styles.searchChat__cancel}
                type="button_string"
                text={CommonMessagesConstants.CANCEL}
                onClick={() => {
                  this.setState({
                    showedInput: false,
                    searchChat: '',
                  });
                }}
              />
            </MobileLayout>
          </div>
        </TransitionLayout>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    getDialogByIdMessage: (location, chatId, messageId, pack, isNew, isEdit) =>
      getDialogByIdMessageRequestAction(location, chatId, messageId, pack, isNew, isEdit)(dispatch),
    searchInDialog: (location, chatId, text) => searchInDialogRequestAction(location, chatId, text)(dispatch),
    searchedOpenAction: (location) => {
      dispatch(searchDialogOpenAction(location));
    },
    searchedCloseAction: (location) => {
      dispatch(searchDialogCloseAction(location));
    },
    searchedNextAction: (location) => {
      dispatch(searchDialogNextAction(location));
    },
    searchedPrevAction: (location) => {
      dispatch(searchDialogPrevAction(location));
    },
  })
)(SearchChat);
