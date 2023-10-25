import cloneDeep from 'lodash/cloneDeep';

import { CommonVariablesConstants } from '@/constants/common/variables';

export const createMetaImageUtil = ({ covers = [] }) => {
  let coverMain = CommonVariablesConstants.NO_COVER_IMG;

  if (covers.length) {
    const coversTmp = cloneDeep(covers);
    const { path: pathMain } = coversTmp.find(({ isMain }) => isMain) || {};
    const { path: pathFirst } = coversTmp[0] || {};

    if (!!pathMain || !!pathFirst) {
      coverMain = pathMain || pathFirst;
    }
  }

  return coverMain;
};
