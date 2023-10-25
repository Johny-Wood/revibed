import { projectLabelsUtil } from './project/projectDetailsUtil';

export const createMetaTitleUtil = ({ labels = [], year = '' }) => {
  const labelsStr = projectLabelsUtil({ labels });

  let ogTitleProjectDetails = '';

  if (year && labelsStr) {
    ogTitleProjectDetails = ` (${labelsStr}, ${year})`;
  } else if (year) {
    ogTitleProjectDetails = ` (${year})`;
  } else if (labelsStr) {
    ogTitleProjectDetails = ` (${labelsStr})`;
  }

  return ogTitleProjectDetails;
};
