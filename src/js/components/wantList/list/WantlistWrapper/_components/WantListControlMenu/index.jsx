import { connect } from 'react-redux';

import DropDownMenu from '@/components/common/DropDownMenu';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { RoutePathsConstants } from '@/constants/routes/routes';
import UpdateCircleArrowIcon from '@/icons/arrows/UpdateCircleArrowIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import TrashIcon from '@/icons/want-list/TrashIcon';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { removeAllWantListRequestAction } from '@/redux-actions/wantList/wantListActions';
import NextRouter from '@/services/NextRouter';

import styles from './styles.module.scss';

function WantListControlMenu({
  removeAllWantListInProcess,
  removeAllWantListRequest,

  showMessage,
}) {
  return (
    <div className={styles.wantListControlMenu}>
      <DropDownMenu
        list={[
          {
            id: 1,
            text: 'Upload new wantlist',
            link: {
              href: RoutePathsConstants.WANTLIST_ADD,
            },
            icon: UpdateCircleArrowIcon,
          },
          {
            id: 2,
            text: 'Wantlist settings',
            link: {
              href: RoutePathsConstants.PERSONAL_WANTLIST_SETTINGS,
            },
            icon: SettingsIcon,
          },
          {
            id: 3,
            text: 'Remove wantlist',
            icon: TrashIcon,
            onClick: () => {
              removeAllWantListRequest().then(() => {
                const { router = {} } = NextRouter.getInstance();

                router.push(RoutePathsConstants.WANTLIST_ADD);

                showMessage('SuccessMessage', {
                  messageText: MessagesSuccessConstants.WANT_LIST_DELETE,
                });
              });
            },
            inProcess: removeAllWantListInProcess,
            disabled: removeAllWantListInProcess,
          },
        ]}
        className={styles.dropDownMenu}
        dropDownMenuListClass={styles.dropDownMenu__list}
        itemClassName={styles.dropDownMenu__button}
      />
    </div>
  );
}

export default connect(
  (state) => ({
    removeAllWantListInProcess: state.WantListReducer.removeAllWantListInProcess,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    removeAllWantListRequest: () => removeAllWantListRequestAction()(dispatch),
  })
)(WantListControlMenu);
