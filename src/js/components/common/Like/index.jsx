import { useEffect, useMemo } from 'react';

import { connect } from 'react-redux';

import RedirectComponent from '@/components/common/RedirectComponent';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import HeartIcon from '@/icons/HeartIcon';
import { getReactionsRequestAction, setReactionsRequestAction } from '@/redux-actions/reactions/reactionsActions';

import styles from './styles.module.scss';

function Like({
  id,
  type,
  reactions: { [type]: reactionsData = {} } = {},
  updateInProcess: { [type]: updateInProcess = {} } = {},
  getReactionsRequest,
  setReactionsRequest,
}) {
  const inProcess = updateInProcess[id];
  const { count = 0, reacted = false } = reactionsData[id] || {};

  const requestData = useMemo(() => ({ targetType: type, targetId: id }), [type, id]);

  useEffect(() => {
    getReactionsRequest(requestData);
  }, [getReactionsRequest, requestData]);

  return (
    <RedirectComponent>
      <ButtonIcon
        className={styles.Like}
        icon={HeartIcon}
        iconColor={!reacted ? 'transparent' : undefined}
        text={String(count)}
        type="button_string"
        onClick={() => {
          if (inProcess) {
            return;
          }

          setReactionsRequest(requestData);
        }}
      />
    </RedirectComponent>
  );
}

export default connect(
  (state) => ({
    updateInProcess: state.ReactionsReducer.updateInProcess,
    reactions: state.ReactionsReducer.reactions,
  }),
  (dispatch) => ({
    getReactionsRequest: (params) => getReactionsRequestAction({ ...params, dispatch }),
    setReactionsRequest: (params) => setReactionsRequestAction({ ...params, dispatch }),
  })
)(Like);
