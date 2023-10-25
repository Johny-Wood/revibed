import api from '@/api';
import { VariablesActionsConstants } from '@/constants/actions/common/variables';

const loadVariablesListAction = (variablesList) => ({
  type: VariablesActionsConstants.LOAD_VARIABLES_LIST,
  payload: {
    variablesList,
  },
});

export const loadVarsFromApiRequestAction = ({ dispatch }) =>
  new Promise((resolve) => {
    api('variables')
      .then(({ data: { data } }) => {
        dispatch(loadVariablesListAction(data));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        resolve();
      });
  });
