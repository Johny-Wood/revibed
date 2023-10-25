import api from '@/api';
import { VotingActionsConstants } from '@/constants/actions/voting';
import { WebSocketSubscriptionIdsConstants } from '@/constants/websocket/webSocketSubscriptionIds';
import WebSocketService from '@/services/WebSocketService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const loadVotingInProcessAction = (loadVotingInProcess) =>
  createAction(VotingActionsConstants.LOAD_VOTING_IN_PROCESS, {
    loadVotingInProcess,
  });

const loadVotingSuccessAction = ({ votingId, voting }) =>
  createAction(VotingActionsConstants.LOAD_VOTING_SUCCESS, {
    votingId,
    voting,
  });

export const loadVotingRequestAction = ({ votingId, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(loadVotingInProcessAction(true));

    api
      .get(`voting/${votingId}`)
      .then(({ data: { data: voting = {} } = {} }) => {
        dispatch(loadVotingSuccessAction({ votingId, voting }));

        WebSocketService.subscribe({
          category: WebSocketSubscriptionIdsConstants.VOTING,
          subscribeName: `/voting/${votingId}`,
          webSocketSubscriptionId: votingId,
          callbackData: {
            votingId,
            loadVotingRequestAction,
          },
        });

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadVotingInProcessAction(false));

        reject(errorData);
      });
  });

const voteInProcessAction = (voteInProcess) =>
  createAction(VotingActionsConstants.VOTE_IN_PROCESS, {
    voteInProcess,
  });

const voteSuccessAction = ({ votingId, voting }) =>
  createAction(VotingActionsConstants.VOTE_SUCCESS, {
    votingId,
    voting,
  });

const voteFailedAction = ({ votingId, voting }) =>
  createAction(VotingActionsConstants.VOTE_FAILED, {
    votingId,
    voting,
  });

export const voteRequestAction =
  ({ votingId, voteId }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(voteInProcessAction(true));

      api
        .put(`voting/${votingId}`, {
          voteId,
        })
        .then(({ data: { data: voting = {} } = {} }) => {
          dispatch(voteSuccessAction({ votingId, voting }));

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
          const { payload: errorPayload } = errorData;

          dispatch(voteFailedAction({ votingId, voting: errorPayload }));

          reject(errorData);
        });
    });
