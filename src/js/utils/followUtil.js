import cloneDeep from 'lodash/cloneDeep';

export const changeFollowUtil = ({ list = [], userId, isFollowing }) => {
  const listTmp = cloneDeep(list);

  const foundUserIdx = listTmp.findIndex(({ userInfo: { id } = {} }) => id === userId);

  if (foundUserIdx > -1) {
    const { userInfo, userInfo: { subscribersCount } = {} } = listTmp[foundUserIdx] || {};

    listTmp[foundUserIdx] = {
      ...listTmp[foundUserIdx],
      userInfo: {
        ...userInfo,
        subscribersCount: subscribersCount + (isFollowing ? 1 : -1),
        subscription: isFollowing,
      },
    };
  }

  return listTmp;
};
