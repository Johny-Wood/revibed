import classNames from 'classnames';
import { connect } from 'react-redux';

import RedirectComponent from '@/components/common/RedirectComponent';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { RoutePathsConstants } from '@/constants/routes/routes';
import AddIcon from '@/icons/want-list/AddIcon';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { addWantListReleaseRequestAction } from '@/redux-actions/wantList/wantListActions';
import { parseReplaceTextUtil } from '@/utils/textUtils';

function ButtonAddToWantlist({
  discogsId,
  releaseId,
  rounded,
  borderColor,
  size,
  successCallback = () => {},
  withSuccessMessage = true,
  addToWatch,

  addWantListReleaseInProcess,
  addWantListReleaseRequest,
  showMessage,
  className,
}) {
  return (
    <RedirectComponent routeBefore={parseReplaceTextUtil(RoutePathsConstants.RELEASE, releaseId)}>
      <ButtonIcon
        text="Add to wantlist"
        transparent
        className={classNames(className)}
        icon={AddIcon}
        borderColor={borderColor}
        size={size}
        rounded={rounded}
        isInProcess={addWantListReleaseInProcess}
        onClick={() => {
          if (addWantListReleaseInProcess || !discogsId) {
            return;
          }
          addWantListReleaseRequest({
            releases: [discogsId],
            releaseIds: [releaseId],
            addToWatch,
          }).then(() => {
            successCallback();

            if (withSuccessMessage) {
              showMessage('SuccessMessage', {
                messageText: MessagesSuccessConstants.WANT_LIST_ADD_RELEASE,
              });
            }
          });
        }}
      />
    </RedirectComponent>
  );
}

export default connect(
  (state) => ({
    addWantListReleaseInProcess: state.WantListReducer.addWantListReleaseInProcess,
  }),
  (dispatch) => ({
    addWantListReleaseRequest: (params) => addWantListReleaseRequestAction(params)(dispatch),
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
  })
)(ButtonAddToWantlist);
