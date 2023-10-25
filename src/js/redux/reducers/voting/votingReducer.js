import { VotingActionsConstants } from '@/constants/actions/voting';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadVotingInProcess: false,
  voteInProcess: false,

  votingList: {},
};

const handlers = createHandlers({
  [VotingActionsConstants.LOAD_VOTING_IN_PROCESS]: (state, { loadVotingInProcess = false }) => ({
    ...state,
    loadVotingInProcess,
  }),
  [VotingActionsConstants.LOAD_VOTING_SUCCESS]: (state, { votingId = -1, voting = {} }) => ({
    ...state,
    votingList: {
      ...state.votingList,
      [votingId]: voting,
    },
    loadVotingInProcess: false,
  }),

  [VotingActionsConstants.VOTE_IN_PROCESS]: (state, { voteInProcess = false }) => ({
    ...state,
    voteInProcess,
  }),
  [VotingActionsConstants.VOTE_SUCCESS]: (state, { votingId = -1, voting = {} }) => ({
    ...state,
    votingList: {
      ...state.votingList,
      [votingId]: voting,
    },
    voteInProcess: false,
  }),
  [VotingActionsConstants.VOTE_FAILED]: (state, { votingId = -1, voting = {} }) => ({
    ...state,
    votingList: {
      ...state.votingList,
      [votingId]: voting,
    },
    voteInProcess: false,
  }),
});

const VotingReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default VotingReducer;
