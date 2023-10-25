import base from './base.json';
import sortFriends from './friends/sort.json';
import links from './links.json';
import filters from './project/filters.json';
import projectStatus from './project/status.json';
import sortMarketplace from './sort/marketplace.json';
import sortProject from './sort/projects.json';

export const translations = {
  ...base,
  ...links,
  ...filters,
  ...projectStatus,
  ...sortProject,
  ...sortMarketplace,
  ...sortFriends,
};
