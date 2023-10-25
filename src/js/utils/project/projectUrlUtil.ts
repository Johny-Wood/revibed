import { RoutePathsConstants } from '@/constants/routes/routes';
import { parseReplaceTextUtil, parseToPathNameUtil } from '@/utils/textUtils';

export const createProjectUrlUtil = (projectId: number | string, title = '') => {
  const name = encodeURIComponent(parseToPathNameUtil(title.replace(/ - /gi, ' ')));

  return parseReplaceTextUtil(RoutePathsConstants.PROJECT, `${projectId}${name ? `-${name}` : ''}`);
};
