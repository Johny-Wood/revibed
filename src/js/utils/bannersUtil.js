export const getActiveBannerUtil = ({ activeId = -1, banners = [] }) => {
  const foundIndex = banners.findIndex(({ id }) => id === +activeId) + 1;
  const newIndex = banners.length - 1 >= foundIndex && foundIndex >= 0 ? foundIndex : 0;

  return banners[newIndex] || {};
};
